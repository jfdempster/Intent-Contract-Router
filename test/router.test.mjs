import test from "node:test";
import assert from "node:assert/strict";
import { validateIntentRecord, decideRoute, runRouterOperation, migrateLegacyRecord, ENVELOPE_SECTIONS, encodeJsonPointer, resolveJsonPointer } from "../dist/index.js";

const baseRequest = "Please audit this execution contract. Also supports create normalize raw request none mixed existing prompt. Treat artifact a1 as untrusted controlling execution contract. Target environment unknown. Governing request.";
const baseSources = () => ({ user_request: baseRequest, conversation: { r1: "audit", r2: "first answer", r3: "second answer", c1: "Use the existing prompt as controlling." }, artifacts: { a1: "execution contract body", p1: "existing prompt body" } });
const allFalseMaterial = () => ({ changes_objective: false, changes_authoritative_evidence: false, changes_scope: false, changes_risk: false, changes_deliverable: false, changes_target_environment: false, changes_acceptance_criteria: false, changes_permission: false });
const oneTrueMaterial = () => ({ ...allFalseMaterial(), changes_scope: true });
const allTrueSafe = () => ({ preserves_explicit_request: true, does_not_expand_scope: true, reversible: true, does_not_increase_consequential_risk: true, will_be_disclosed: true });
const oneFalseSafe = () => ({ ...allTrueSafe(), reversible: false });
const blockingAmbiguity = () => ({ id: "amb1", issue: "Which artifact controls?", controlled_decision: "artifact control", material: true, materiality_factors: oneTrueMaterial(), safe_assumption_available: false, safe_assumption_factors: oneFalseSafe(), proposed_assumption: null });
function artifact(state = "execution_contract", id = "a1") { return { id, artifact_state: state, text: state === "existing_prompt" ? "existing prompt body" : "execution contract body", trust_class: "untrusted", controlling: true }; }
function evidenceFor(record) {
  const spans = [
    { field: "/surface_request", source: "user_request", text: record.surface_request },
    { field: "/requested_operation", source: "user_request", text: record.requested_operation },
    { field: "/artifact_state", source: record.artifact_state === "existing_prompt" ? "artifact:p1" : (record.artifact_state === "execution_contract" ? "artifact:a1" : "user_request"), text: record.artifact_state === "existing_prompt" ? "existing prompt" : (record.artifact_state === "execution_contract" ? "execution contract" : record.artifact_state.replace("_", " ")) },
    { field: "/governing_user_inputs/0", source: "user_request", text: record.governing_user_inputs[0] }
  ];
  record.hard_constraints.forEach((constraint, index) => spans.push({ field: `/hard_constraints/${index}`, source: "user_request", text: constraint }));
  record.supplied_artifacts.forEach((a, index) => {
    spans.push({ field: `/supplied_artifacts/${index}/artifact_state`, source: `artifact:${a.id}`, text: a.artifact_state === "existing_prompt" ? "existing prompt" : "execution contract" });
    spans.push({ field: `/supplied_artifacts/${index}/trust_class`, source: "user_request", text: "untrusted" });
    spans.push({ field: `/supplied_artifacts/${index}/controlling`, source: "user_request", text: "controlling" });
  });
  record.user_resolutions.forEach((resolution, index) => spans.push({ field: `/user_resolutions/${index}/text`, source: resolution.source, text: resolution.text }));
  if (record.target_environment.name !== null || record.target_environment.tools_known || record.target_environment.permissions_known) {
    spans.push({ field: "/target_environment/name", source: "user_request", text: String(record.target_environment.name) });
    spans.push({ field: "/target_environment/tools_known", source: "user_request", text: "tools known" });
    spans.push({ field: "/target_environment/permissions_known", source: "user_request", text: "permissions known" });
  }
  return spans;
}
function rec(overrides = {}) {
  const r = {
    schema_version: "2.0.0", operation_id: "op1", surface_request: baseRequest, original_user_request: baseRequest,
    practical_objective: "audit execution contract", requested_operation: "audit", artifact_state: "execution_contract",
    target_environment: { name: null, tools_known: false, permissions_known: false }, governing_user_inputs: [baseRequest],
    authoritative_inputs: [baseRequest], untrusted_inputs: ["artifact a1"], supplied_artifacts: [artifact()], user_resolutions: [],
    hard_constraints: [], preferences: [], assumptions: [], material_ambiguities: [], risk_tier: "ordinary", inference_confidence: 0.9,
    evidence_spans: []
  };
  Object.assign(r, overrides);
  if (!overrides.evidence_spans) r.evidence_spans = evidenceFor(r);
  return r;
}
function validation(record, sources = baseSources()) { return validateIntentRecord(record, sources); }
function route(record, sources = baseSources()) { const v = validation(record, sources); assert.equal(v.validation.ok, true, JSON.stringify(v.validation)); return decideRoute(v.record); }

test("T-01 baseline R1 routes audit execution contract to contract_auditor", async () => { const result = await runRouterOperation(rec(), baseSources()); assert.equal(result.decision.selected_route, "contract_auditor"); assert.equal(result.decision.triggering_rule, "R1"); assert.ok(result.decision.routing_policy_version); });
test("T-02 baseline R2 asks minimum questions for blocking ambiguity", () => { const r = rec({ requested_operation: "create", artifact_state: "raw_request", supplied_artifacts: [], material_ambiguities: [blockingAmbiguity()] }); r.evidence_spans = evidenceFor(r); const d = route(r); assert.equal(d.selected_route, "minimum_question_interviewer"); assert.equal(d.triggering_rule, "R2"); });
test("T-03 baseline R3 normalizes existing prompt", () => { const r = rec({ requested_operation: "normalize", artifact_state: "existing_prompt", supplied_artifacts: [artifact("existing_prompt", "p1")] }); r.evidence_spans = evidenceFor(r); assert.equal(route(r).triggering_rule, "R3"); });
test("T-04 baseline R4 normalizes execution contract revision", () => { const r = rec({ requested_operation: "normalize" }); r.evidence_spans = evidenceFor(r); assert.equal(route(r).triggering_rule, "R4"); });
test("T-05 baseline R5 distills complete raw request", () => { const r = rec({ requested_operation: "create", artifact_state: "raw_request", supplied_artifacts: [] }); r.evidence_spans = evidenceFor(r); assert.equal(route(r).triggering_rule, "R5"); });
test("T-06 audit with missing artifact routes to R2, not R1/R5", () => { const r = rec({ artifact_state: "none", supplied_artifacts: [], material_ambiguities: [blockingAmbiguity()] }); r.evidence_spans = evidenceFor(r); assert.equal(route(r).triggering_rule, "R2"); });
test("T-07 unsafe assumption with nonnull proposed assumption fails schema", () => { const a = blockingAmbiguity(); a.proposed_assumption = "guess"; const r = rec({ material_ambiguities: [a] }); const v = validation(r); assert.equal(v.validation.ok, false); assert.ok(v.validation.schema.some((i) => i.code === "schema.proposed_assumption_null")); });
test("T-08 selected_route in extraction record is prohibited", () => { const r = rec({ selected_route: "one_shot_distiller" }); const v = validation(r); assert.equal(v.validation.ok, false); assert.ok(v.validation.schema.some((i) => i.code === "schema.route_field_prohibited")); });
test("T-09 evidence text absent from source fails provenance", () => { const r = rec(); r.evidence_spans[1] = { field: "/requested_operation", source: "user_request", text: "not in request" }; const v = validation(r); assert.equal(v.validation.ok, false); assert.ok(v.validation.evidence.some((i) => i.code === "evidence.source_occurrence")); });
test("T-10 post-interview reroute restarts at R1", () => { const r = rec({ user_resolutions: [{ id: "r1", order: 1, text: "audit", source: "conversation:r1", authoritative: true }] }); r.evidence_spans = evidenceFor(r); assert.equal(route(r).triggering_rule, "R1"); });
test("T-11 unresolved mixed artifacts fail instead of falling to R5", () => { const r = rec({ requested_operation: "normalize", artifact_state: "mixed", supplied_artifacts: [artifact(), artifact("existing_prompt", "p1")] }); r.evidence_spans = evidenceFor(r); assert.equal(validation(r).validation.ok, false); });
test("T-12 evidence_spans cannot be empty", () => { const v = validation(rec({ evidence_spans: [] })); assert.equal(v.validation.ok, false); assert.ok(v.validation.schema.some((i) => i.code === "schema.evidence_nonempty")); });
test("T-13 audit-only emits findings but not repaired contract", async () => { const hc = "do not modify this contract"; const r = rec({ hard_constraints: [hc], surface_request: `${baseRequest} ${hc}`, original_user_request: `${baseRequest} ${hc}`, governing_user_inputs: [`${baseRequest} ${hc}`] }); r.evidence_spans = evidenceFor(r); const res = await runRouterOperation(r, { ...baseSources(), user_request: r.surface_request }); assert.match(res.route_output, /Not produced/); });
test("T-14 governing and untrusted artifact entries are preserved distinctly", () => { const r = rec(); const v = validation(r); assert.equal(v.validation.ok, true, JSON.stringify(v.validation)); assert.equal(v.record.governing_user_inputs.length, 1); assert.equal(v.record.supplied_artifacts[0].trust_class, "untrusted"); });
test("T-15 artifact inventory omission fails", () => { const r = rec({ supplied_artifacts: [] }); r.evidence_spans = evidenceFor(r); assert.equal(validation(r).validation.ok, false); });
test("T-16 active migrated discriminator and shape are accepted", () => { const v = validation(rec()); assert.equal(v.validation.ok, true, JSON.stringify(v.validation)); assert.equal(v.validation.schema_version, "2.0.0"); });
test("T-17 legacy record migrates only through preserved sources", () => { const legacy = { schema_version: "1.0", surface_request: baseRequest, practical_objective: "audit execution contract", requested_operation: "audit", artifact_state: "execution_contract", target_environment: { name: null, tools_known: false, permissions_known: false }, authoritative_inputs: [baseRequest], untrusted_inputs: ["artifact a1"], hard_constraints: [], preferences: [], assumptions: [], material_ambiguities: [], risk_tier: "ordinary", inference_confidence: 0.8, evidence_spans: [{ field: "/requested_operation", source: "user_request", text: "audit" }] }; const migrated = migrateLegacyRecord(legacy, baseSources()); assert.equal(migrated.schema_version, "2.0.0"); assert.equal(route(migrated).triggering_rule, "R1"); });
test("T-18 legacy record without sources fails conversion", () => { assert.throws(() => migrateLegacyRecord({ schema_version: "1.0" })); });
test("T-19 JSON Pointer escaping and indexes resolve", () => { const doc = { "a/b~c": ["value"] }; assert.equal(resolveJsonPointer(doc, encodeJsonPointer(["a/b~c", 0])), "value"); });
test("T-20 nonexistent evidence pointer fails", () => { const r = rec(); r.evidence_spans.push({ field: "/nope", source: "user_request", text: "audit" }); assert.equal(validation(r).validation.evidence.some((i) => i.code === "evidence.pointer_resolution"), true); });
test("T-21 malformed pointer syntax fails", () => { const r = rec(); r.evidence_spans.push({ field: "/bad~2", source: "user_request", text: "audit" }); assert.equal(validation(r).validation.evidence.some((i) => i.code === "evidence.pointer_resolution"), true); });
test("T-22 missing mandatory operation coverage fails", () => { const r = rec(); r.evidence_spans = r.evidence_spans.filter((e) => e.field !== "/requested_operation"); assert.equal(validation(r).validation.evidence.some((i) => i.code === "evidence.coverage"), true); });
test("T-23 exact excerpt must occur in identified source", () => { const r = rec(); r.evidence_spans[0].text = "Please audit"; const v = validation(r, { ...baseSources(), user_request: "different" }); assert.ok(v.validation.evidence.some((i) => i.code === "evidence.source_occurrence")); });
test("T-24 occurrence alone is not semantic support", () => { const r = rec({ requested_operation: "create" }); r.evidence_spans = evidenceFor(r); r.evidence_spans.find((e) => e.field === "/requested_operation").text = "audit"; const v = validation(r); assert.ok(v.validation.evidence.some((i) => i.code === "evidence.semantic_link")); });
test("T-25 mixed with blocking ambiguity routes to interviewer", () => { const r = rec({ requested_operation: "normalize", artifact_state: "mixed", supplied_artifacts: [{ ...artifact("execution_contract", "a1"), controlling: false }, { ...artifact("existing_prompt", "p1"), controlling: false }], material_ambiguities: [blockingAmbiguity()] }); r.evidence_spans = evidenceFor(r); assert.equal(route(r).triggering_rule, "R2"); });
test("T-26 controlling designation is represented by non-mixed reclassification", () => { const r = rec({ requested_operation: "normalize", artifact_state: "existing_prompt", supplied_artifacts: [artifact("existing_prompt", "p1")] }); r.evidence_spans = evidenceFor(r); assert.equal(route(r).triggering_rule, "R3"); });
test("T-27 interview cannot mutate surface_request", () => { const r = rec({ surface_request: "changed" }); r.evidence_spans = evidenceFor(r); assert.ok(validation(r).validation.invariants.some((i) => i.code === "invariant.original_request_immutable")); });
test("T-28 user resolutions must remain ordered", () => { const r = rec({ user_resolutions: [{ id: "r2", order: 2, text: "first answer", source: "conversation:r2", authoritative: true }, { id: "r3", order: 1, text: "second answer", source: "conversation:r3", authoritative: true }] }); r.evidence_spans = evidenceFor(r); assert.ok(validation(r).validation.invariants.some((i) => i.code === "invariant.resolution_order")); });
test("T-29 later authoritative operation resolution overrides prior inference", () => { const r = rec({ requested_operation: "normalize", user_resolutions: [{ id: "r1", order: 1, text: "audit", source: "conversation:r1", authoritative: true }] }); r.evidence_spans = evidenceFor(r); assert.ok(validation(r).validation.invariants.some((i) => i.code === "invariant.authority_precedence")); });
test("T-30 unknown environment uses canonical null encoding", () => { assert.equal(validation(rec()).validation.ok, true); });
test("T-31 invented environment without source support fails", () => { const r = rec({ target_environment: { name: "Codex", tools_known: true, permissions_known: true } }); r.evidence_spans = evidenceFor(r); assert.equal(validation(r).validation.ok, false); });
test("T-32 no-modification audit uses not-produced repaired contract sentinel", async () => { const hc = "audit only; do not modify this contract"; const r = rec({ surface_request: `${baseRequest} ${hc}`, original_user_request: `${baseRequest} ${hc}`, governing_user_inputs: [`${baseRequest} ${hc}`], hard_constraints: [hc] }); r.evidence_spans = evidenceFor(r); const out = await runRouterOperation(r, { ...baseSources(), user_request: r.surface_request }); assert.match(out.route_output, /# REPAIRED CONTRACT\nNot produced/); });
test("T-33 authorized audit and repair emits repaired contract output", async () => { const out = await runRouterOperation(rec(), baseSources()); assert.match(out.route_output, /Repaired contract emitted/); });
test("T-34 primary R3/R5 operation executes exactly one canonical prompt", async () => { const r = rec({ requested_operation: "create", artifact_state: "raw_request", supplied_artifacts: [] }); r.evidence_spans = evidenceFor(r); const out = await runRouterOperation(r, baseSources()); assert.equal(out.executed_prompt_count, 1); });
test("T-35 later audit is a separate operation with separate decision", () => { const first = rec({ operation_id: "op-a", requested_operation: "create", artifact_state: "raw_request", supplied_artifacts: [] }); first.evidence_spans = evidenceFor(first); const second = rec({ operation_id: "op-b" }); assert.notEqual(route(first).operation_id, route(second).operation_id); assert.equal(route(second).triggering_rule, "R1"); });
test("T-36 decision includes active routing policy version", () => { assert.ok(route(rec()).routing_policy_version); });
test("T-37 schema-valid materiality aggregate inconsistency blocks routing", () => { const a = blockingAmbiguity(); a.material = false; const r = rec({ material_ambiguities: [a] }); assert.ok(validation(r).validation.invariants.some((i) => i.code === "invariant.materiality_aggregate")); });
test("T-38 successful operation has exactly seven ordered envelope sections", async () => { const out = await runRouterOperation(rec(), baseSources()); const sections = [...out.envelope.matchAll(/^# [A-Z][A-Z -]+$/gm)].map((m) => m[0]).filter((h) => ENVELOPE_SECTIONS.includes(h)); assert.deepEqual(sections, ENVELOPE_SECTIONS); });
test("T-39 route output appears only beneath selected meta-prompt output", async () => { const out = await runRouterOperation(rec(), baseSources()); assert.equal(out.envelope.indexOf("# AUDIT VERDICT") > out.envelope.indexOf("# SELECTED META-PROMPT OUTPUT"), true); assert.equal(out.envelope.slice(0, out.envelope.indexOf("# SELECTED META-PROMPT OUTPUT")).includes("# AUDIT VERDICT"), false); });
