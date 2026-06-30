import { ACTIVE_RECORD_VERSION, ROUTE_IDS, type IntentRecord, type ValidationIssue } from "./types.js";
const topLevelKeys = new Set(["schema_version", "operation_id", "surface_request", "original_user_request", "practical_objective", "requested_operation", "artifact_state", "target_environment", "governing_user_inputs", "authoritative_inputs", "untrusted_inputs", "supplied_artifacts", "user_resolutions", "hard_constraints", "preferences", "assumptions", "material_ambiguities", "risk_tier", "inference_confidence", "evidence_spans", "migration"]);
const routeLeakKeys = new Set(["selected_route", "route", "route_id", "recommended_route", "route_ranking", "triggering_rule"]);
const ops = new Set(["create", "clarify", "normalize", "audit", "execute", "unknown"]);
const states = new Set(["raw_request", "existing_prompt", "execution_contract", "mixed", "none"]);
const risks = new Set(["ordinary", "consequential", "high_stakes"]);
function issue(code: string, message: string, pointer?: string): ValidationIssue { return { code, message, pointer }; }
function isObject(value: unknown): value is Record<string, unknown> { return value !== null && typeof value === "object" && !Array.isArray(value); }
function nonEmptyString(value: unknown): value is string { return typeof value === "string" && value.length > 0; }
function stringArray(value: unknown): value is string[] { return Array.isArray(value) && value.every(nonEmptyString) && new Set(value).size === value.length; }
function boolObject(value: unknown, keys: string[]): boolean { return isObject(value) && Object.keys(value).every((key) => keys.includes(key)) && keys.every((key) => typeof value[key] === "boolean"); }
export function validateSchemaShape(value: unknown): { record?: IntentRecord; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];
  if (!isObject(value)) return { issues: [issue("schema.type", "Record must be an object", "")] };
  for (const key of Object.keys(value)) {
    if (routeLeakKeys.has(key) || ROUTE_IDS.includes(value[key] as never)) issues.push(issue("schema.route_field_prohibited", "Extraction record must not select, recommend, rank, name, or imply a route", `/${key}`));
    if (!topLevelKeys.has(key)) issues.push(issue("schema.additional_property", `Unexpected top-level property ${key}`, `/${key}`));
  }
  for (const key of topLevelKeys) if (key !== "migration" && !(key in value)) issues.push(issue("schema.required", `Missing required property ${key}`, `/${key}`));
  if (value.schema_version !== ACTIVE_RECORD_VERSION) issues.push(issue("schema.version", `Unsupported active record version ${String(value.schema_version)}`, "/schema_version"));
  for (const key of ["operation_id", "surface_request", "original_user_request", "practical_objective"] as const) if (!nonEmptyString(value[key])) issues.push(issue("schema.string", `${key} must be a non-empty string`, `/${key}`));
  if (!ops.has(String(value.requested_operation))) issues.push(issue("schema.enum", "Invalid requested_operation", "/requested_operation"));
  if (!states.has(String(value.artifact_state))) issues.push(issue("schema.enum", "Invalid artifact_state", "/artifact_state"));
  if (!risks.has(String(value.risk_tier))) issues.push(issue("schema.enum", "Invalid risk_tier", "/risk_tier"));
  if (typeof value.inference_confidence !== "number" || value.inference_confidence < 0 || value.inference_confidence > 1) issues.push(issue("schema.number", "inference_confidence must be 0..1", "/inference_confidence"));
  for (const key of ["governing_user_inputs", "authoritative_inputs", "untrusted_inputs", "hard_constraints", "preferences", "assumptions"] as const) if (!stringArray(value[key])) issues.push(issue("schema.string_array", `${key} must be a unique non-empty string array`, `/${key}`));
  if (!isObject(value.target_environment)) issues.push(issue("schema.target_environment", "target_environment must be object", "/target_environment")); else {
    for (const key of Object.keys(value.target_environment)) if (!["name", "tools_known", "permissions_known"].includes(key)) issues.push(issue("schema.additional_property", `Unexpected target_environment property ${key}`, `/target_environment/${key}`));
    if (!(typeof value.target_environment.name === "string" && value.target_environment.name.length > 0) && value.target_environment.name !== null) issues.push(issue("schema.target_name", "target_environment.name must be non-empty string or null", "/target_environment/name"));
    if (typeof value.target_environment.tools_known !== "boolean") issues.push(issue("schema.boolean", "tools_known must be boolean", "/target_environment/tools_known"));
    if (typeof value.target_environment.permissions_known !== "boolean") issues.push(issue("schema.boolean", "permissions_known must be boolean", "/target_environment/permissions_known"));
  }
  if (!Array.isArray(value.evidence_spans) || value.evidence_spans.length === 0) issues.push(issue("schema.evidence_nonempty", "evidence_spans must be non-empty", "/evidence_spans"));
  if (Array.isArray(value.evidence_spans)) value.evidence_spans.forEach((span, index) => {
    if (!isObject(span)) issues.push(issue("schema.evidence_object", "Evidence span must be object", `/evidence_spans/${index}`)); else {
      for (const key of Object.keys(span)) if (!["field", "source", "text"].includes(key)) issues.push(issue("schema.additional_property", `Unexpected evidence property ${key}`, `/evidence_spans/${index}/${key}`));
      if (!nonEmptyString(span.field) || (!span.field.startsWith("/") && span.field !== "")) issues.push(issue("schema.pointer", "Evidence field must be JSON Pointer", `/evidence_spans/${index}/field`));
      if (!nonEmptyString(span.source) || !/^(user_request|conversation:[^:]+|artifact:[^:]+)$/.test(span.source)) issues.push(issue("schema.evidence_source", "Invalid evidence source", `/evidence_spans/${index}/source`));
      if (!nonEmptyString(span.text)) issues.push(issue("schema.evidence_text", "Evidence text must be non-empty", `/evidence_spans/${index}/text`));
    }
  });
  if (!Array.isArray(value.supplied_artifacts)) issues.push(issue("schema.artifacts", "supplied_artifacts must be array", "/supplied_artifacts")); else value.supplied_artifacts.forEach((artifact, index) => {
    if (!isObject(artifact)) issues.push(issue("schema.artifact_object", "Artifact must be object", `/supplied_artifacts/${index}`)); else {
      for (const key of Object.keys(artifact)) if (!["id", "artifact_state", "text", "trust_class", "controlling"].includes(key)) issues.push(issue("schema.additional_property", `Unexpected artifact property ${key}`, `/supplied_artifacts/${index}/${key}`));
      if (!nonEmptyString(artifact.id)) issues.push(issue("schema.artifact_id", "Artifact id must be non-empty", `/supplied_artifacts/${index}/id`));
      if (!["existing_prompt", "execution_contract"].includes(String(artifact.artifact_state))) issues.push(issue("schema.artifact_state", "Artifact state must be existing_prompt or execution_contract", `/supplied_artifacts/${index}/artifact_state`));
      if (!nonEmptyString(artifact.text)) issues.push(issue("schema.artifact_text", "Artifact text must be non-empty", `/supplied_artifacts/${index}/text`));
      if (!["governing", "authoritative", "untrusted"].includes(String(artifact.trust_class))) issues.push(issue("schema.trust_class", "Invalid trust class", `/supplied_artifacts/${index}/trust_class`));
      if (typeof artifact.controlling !== "boolean") issues.push(issue("schema.controlling", "controlling must be boolean", `/supplied_artifacts/${index}/controlling`));
    }
  });
  if (!Array.isArray(value.user_resolutions)) issues.push(issue("schema.resolutions", "user_resolutions must be array", "/user_resolutions")); else value.user_resolutions.forEach((resolution, index) => {
    if (!isObject(resolution)) issues.push(issue("schema.resolution_object", "Resolution must be object", `/user_resolutions/${index}`)); else {
      for (const key of Object.keys(resolution)) if (!["id", "order", "text", "source", "authoritative"].includes(key)) issues.push(issue("schema.additional_property", `Unexpected resolution property ${key}`, `/user_resolutions/${index}/${key}`));
      if (!nonEmptyString(resolution.id)) issues.push(issue("schema.resolution_id", "Resolution id required", `/user_resolutions/${index}/id`));
      if (!Number.isInteger(resolution.order) || Number(resolution.order) < 0) issues.push(issue("schema.resolution_order", "Resolution order invalid", `/user_resolutions/${index}/order`));
      if (!nonEmptyString(resolution.text)) issues.push(issue("schema.resolution_text", "Resolution text required", `/user_resolutions/${index}/text`));
      if (!nonEmptyString(resolution.source)) issues.push(issue("schema.resolution_source", "Resolution source required", `/user_resolutions/${index}/source`));
      if (typeof resolution.authoritative !== "boolean") issues.push(issue("schema.resolution_authoritative", "authoritative must be boolean", `/user_resolutions/${index}/authoritative`));
    }
  });
  if (!Array.isArray(value.material_ambiguities)) issues.push(issue("schema.ambiguities", "material_ambiguities must be array", "/material_ambiguities")); else value.material_ambiguities.forEach((ambiguity, index) => {
    if (!isObject(ambiguity)) issues.push(issue("schema.ambiguity_object", "Ambiguity must be object", `/material_ambiguities/${index}`)); else {
      for (const key of Object.keys(ambiguity)) if (!["id", "issue", "controlled_decision", "material", "materiality_factors", "safe_assumption_available", "safe_assumption_factors", "proposed_assumption"].includes(key)) issues.push(issue("schema.additional_property", `Unexpected ambiguity property ${key}`, `/material_ambiguities/${index}/${key}`));
      if (!nonEmptyString(ambiguity.id) || !nonEmptyString(ambiguity.issue) || !nonEmptyString(ambiguity.controlled_decision)) issues.push(issue("schema.ambiguity_strings", "Ambiguity strings required", `/material_ambiguities/${index}`));
      if (typeof ambiguity.material !== "boolean") issues.push(issue("schema.ambiguity_material", "material must be boolean", `/material_ambiguities/${index}/material`));
      if (typeof ambiguity.safe_assumption_available !== "boolean") issues.push(issue("schema.safe_assumption", "safe_assumption_available must be boolean", `/material_ambiguities/${index}/safe_assumption_available`));
      if (!boolObject(ambiguity.materiality_factors, ["changes_objective", "changes_authoritative_evidence", "changes_scope", "changes_risk", "changes_deliverable", "changes_target_environment", "changes_acceptance_criteria", "changes_permission"])) issues.push(issue("schema.materiality_factors", "Invalid materiality_factors", `/material_ambiguities/${index}/materiality_factors`));
      if (!boolObject(ambiguity.safe_assumption_factors, ["preserves_explicit_request", "does_not_expand_scope", "reversible", "does_not_increase_consequential_risk", "will_be_disclosed"])) issues.push(issue("schema.safe_assumption_factors", "Invalid safe_assumption_factors", `/material_ambiguities/${index}/safe_assumption_factors`));
      if (ambiguity.safe_assumption_available === false && ambiguity.proposed_assumption !== null) issues.push(issue("schema.proposed_assumption_null", "Unsafe assumptions require null proposed_assumption", `/material_ambiguities/${index}/proposed_assumption`));
      if (ambiguity.safe_assumption_available === true && !nonEmptyString(ambiguity.proposed_assumption)) issues.push(issue("schema.proposed_assumption_string", "Safe assumption requires proposed_assumption", `/material_ambiguities/${index}/proposed_assumption`));
    }
  });
  return { record: issues.length === 0 ? value as unknown as IntentRecord : undefined, issues };
}
