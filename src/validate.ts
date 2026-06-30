import { resolveJsonPointer } from "./jsonPointer.js";
import { validateSchemaShape } from "./schema.js";
import type { IntentRecord, SourcePackage, ValidationIssue, ValidationResult } from "./types.js";
function issue(code: string, message: string, pointer?: string): ValidationIssue { return { code, message, pointer }; }
function norm(value: unknown): string { return String(value).toLowerCase().replace(/[_\s\-]+/g, " ").trim(); }
function containsSupport(text: string, value: unknown): boolean {
  if (typeof value === "boolean" || value === null || typeof value === "number") return true;
  if (Array.isArray(value)) return value.some((item) => containsSupport(text, item));
  if (typeof value === "object") return true;
  const t = norm(text); const v = norm(value);
  return v.length === 0 || t.includes(v) || v.includes(t) || v.split(" ").every((word) => word.length < 4 || t.includes(word));
}
function sourceText(sources: SourcePackage, source: string): string | undefined {
  if (source === "user_request") return sources.user_request;
  if (source.startsWith("conversation:")) return sources.conversation?.[source.slice("conversation:".length)];
  if (source.startsWith("artifact:")) return sources.artifacts?.[source.slice("artifact:".length)];
  return undefined;
}
function hasCoverage(record: IntentRecord, pointer: string): boolean { return record.evidence_spans.some((span) => span.field === pointer); }
function blockingAmbiguities(record: IntentRecord) { return record.material_ambiguities.filter((a) => a.material && !a.safe_assumption_available); }
function explicitNoModification(record: IntentRecord): boolean { return record.hard_constraints.some((c) => /\b(no|do not|don't|without)\b.*\b(modif|repair|rewrite|replace|regenerat)/i.test(c)); }
export function validateIntentRecord(value: unknown, sources: SourcePackage): { record?: IntentRecord; validation: ValidationResult } {
  const shaped = validateSchemaShape(value);
  const schema = shaped.issues;
  const invariants: ValidationIssue[] = [];
  const evidence: ValidationIssue[] = [];
  if (!shaped.record) return { validation: { ok: false, schema_version: typeof (value as { schema_version?: unknown })?.schema_version === "string" ? String((value as { schema_version?: unknown }).schema_version) : undefined, schema, invariants, evidence } };
  const record = shaped.record;
  if (record.surface_request !== record.original_user_request) invariants.push(issue("invariant.original_request_immutable", "surface_request must preserve original_user_request exactly", "/surface_request"));
  if (record.governing_user_inputs.length === 0) invariants.push(issue("invariant.governing_required", "governing_user_inputs must preserve the operative user request", "/governing_user_inputs"));
  if (record.target_environment.name === null && (record.target_environment.tools_known || record.target_environment.permissions_known)) invariants.push(issue("invariant.unknown_environment", "Unknown environment must be { name:null, tools_known:false, permissions_known:false }", "/target_environment"));
  if (record.target_environment.name !== null && /^(unknown|n\/a|none|tbd)$/i.test(record.target_environment.name)) invariants.push(issue("invariant.unknown_environment_token", "Unknown environment must use null, not a placeholder string", "/target_environment/name"));
  if (["existing_prompt", "execution_contract"].includes(record.artifact_state)) {
    const controlling = record.supplied_artifacts.filter((a) => a.controlling && a.artifact_state === record.artifact_state);
    if (controlling.length !== 1) invariants.push(issue("invariant.artifact_inventory", "Single controlling artifact matching artifact_state required", "/supplied_artifacts"));
  }
  if (record.artifact_state === "mixed" && blockingAmbiguities(record).length === 0) invariants.push(issue("invariant.unresolved_mixed", "mixed artifact state is valid only with blocking material ambiguity", "/artifact_state"));
  if (record.artifact_state === "mixed" && record.supplied_artifacts.some((a) => a.controlling)) invariants.push(issue("invariant.mixed_controlling_designation", "Explicit controlling designation requires re-extraction to a non-mixed artifact_state", "/artifact_state"));
  record.material_ambiguities.forEach((a, index) => {
    const materialOr = Object.values(a.materiality_factors).some(Boolean);
    const safeAnd = Object.values(a.safe_assumption_factors).every(Boolean);
    if (a.material !== materialOr) invariants.push(issue("invariant.materiality_aggregate", "material must equal OR of all materiality factors", `/material_ambiguities/${index}/material`));
    if (a.safe_assumption_available !== safeAnd) invariants.push(issue("invariant.safe_assumption_aggregate", "safe_assumption_available must equal AND of all safe-assumption factors", `/material_ambiguities/${index}/safe_assumption_available`));
  });
  const orders = record.user_resolutions.map((r) => r.order);
  if (orders.some((order, index) => index > 0 && order <= orders[index - 1])) invariants.push(issue("invariant.resolution_order", "user_resolutions must be stored in increasing order", "/user_resolutions"));
  for (const resolution of record.user_resolutions) {
    if (/\baudit\b/i.test(resolution.text) && record.requested_operation !== "audit") invariants.push(issue("invariant.authority_precedence", "Later authoritative user resolution conflicts with requested_operation", "/requested_operation"));
  }
  if (explicitNoModification(record) && record.requested_operation === "audit" && !record.hard_constraints.some((c) => /audit[- ]?only|no modif|do not modif|don't modif|without modif/i.test(c))) invariants.push(issue("invariant.audit_only_encoding", "No-modification audit constraints must be represented explicitly", "/hard_constraints"));
  for (const [index, span] of record.evidence_spans.entries()) {
    let target: unknown;
    try { target = resolveJsonPointer(record, span.field); } catch (error) { evidence.push(issue("evidence.pointer_resolution", error instanceof Error ? error.message : "Pointer failed", `/evidence_spans/${index}/field`)); continue; }
    if (span.field.startsWith("/evidence_spans")) evidence.push(issue("evidence.self_support", "Evidence cannot support mandatory claims by pointing into evidence_spans", `/evidence_spans/${index}/field`));
    const src = sourceText(sources, span.source);
    if (src === undefined) { evidence.push(issue("evidence.source_missing", `Missing evidence source ${span.source}`, `/evidence_spans/${index}/source`)); continue; }
    if (!src.includes(span.text)) { evidence.push(issue("evidence.source_occurrence", "Evidence excerpt does not occur exactly in source", `/evidence_spans/${index}/text`)); continue; }
    if (!containsSupport(span.text, target)) evidence.push(issue("evidence.semantic_link", "Evidence excerpt does not semantically support addressed value", `/evidence_spans/${index}`));
  }
  const mandatory = ["/surface_request", "/requested_operation", "/artifact_state"];
  for (const pointer of mandatory) if (!hasCoverage(record, pointer)) evidence.push(issue("evidence.coverage", `Mandatory evidence missing for ${pointer}`, pointer));
  record.hard_constraints.forEach((_, index) => { const pointer = `/hard_constraints/${index}`; if (!hasCoverage(record, pointer)) evidence.push(issue("evidence.coverage", `Hard constraint evidence missing for ${pointer}`, pointer)); });
  record.governing_user_inputs.forEach((_, index) => { const pointer = `/governing_user_inputs/${index}`; if (!hasCoverage(record, pointer)) evidence.push(issue("evidence.coverage", `Governing instruction evidence missing for ${pointer}`, pointer)); });
  record.supplied_artifacts.forEach((_, index) => { for (const key of ["artifact_state", "trust_class", "controlling"] as const) { const pointer = `/supplied_artifacts/${index}/${key}`; if (!hasCoverage(record, pointer)) evidence.push(issue("evidence.coverage", `Artifact classification evidence missing for ${pointer}`, pointer)); } });
  record.user_resolutions.forEach((_, index) => { const pointer = `/user_resolutions/${index}/text`; if (!hasCoverage(record, pointer)) evidence.push(issue("evidence.coverage", `User resolution evidence missing for ${pointer}`, pointer)); });
  if (record.target_environment.name !== null || record.target_environment.tools_known || record.target_environment.permissions_known) {
    for (const pointer of ["/target_environment/name", "/target_environment/tools_known", "/target_environment/permissions_known"]) if (!hasCoverage(record, pointer)) evidence.push(issue("evidence.coverage", `Target environment evidence missing for ${pointer}`, pointer));
  }
  return { record, validation: { ok: schema.length + invariants.length + evidence.length === 0, schema_version: record.schema_version, schema, invariants, evidence } };
}
export { blockingAmbiguities, explicitNoModification };
