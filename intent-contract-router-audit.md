# AUDIT VERDICT

**does_not_conform**

All eight canonical files are present, readable, nonempty, and mutually recognizable as one package. The Draft 2020-12 schema is structurally valid, the four route identifiers are consistent, the normative R1–R5 predicates and reference implementation agree, and the required ten core behavioral vectors route or fail closed as intended.

The package nevertheless has established material defects:

1. the canonical record cannot represent the required governing-instruction and supplied-artifact partition;
2. `artifact_state: mixed` is schema-valid but has no routing rule or invariant that prevents silent R5 fallthrough;
3. evidence-span coverage and field addressing are not sufficiently specified to validate provenance completeness;
4. the auditor forces a repaired or reproduced contract even when an explicit audit-only instruction prohibits modification;
5. the optional second meta-prompt stage conflicts with the declared “execute only the selected meta-prompt” architecture unless it is expressly made a separate routing operation; and
6. the overview’s principal determinism claim applies to merely schema-valid records, while the normative policy forbids routing until schema, cross-field, and evidence-span validation all pass.

Because at least one material defect is established, the required verdict is `does_not_conform`. This verdict is confined to the declared finite scope and does not establish universal incorrectness, insecurity, or deterministic model behavior.

# DECLARED AUDIT SCOPE

## Included

- Presence, readability, nonemptiness, and package-relative self-containment of the eight canonical files.
- Static conformance to the explicit Project architecture and invariants.
- Authority, trust-boundary, and prompt-injection treatment.
- Draft 2020-12 schema structure and schema/application-validation boundary.
- Extraction-to-schema compatibility.
- Exact route identifiers, R1–R5 predicates, order, first-match behavior, and fail-closed requirements.
- Route-meta-prompt trigger compatibility, runtime inputs, assumptions policy, output obligations, and abstention behavior.
- Cross-file terminology and invariant consistency.
- Conceptual execution of the ten required behavioral vectors and three defect-revealing supplementary vectors.
- Minimal repairs tied only to established findings.

## Excluded

- Execution of any underlying task governed by a route meta-prompt.
- Modification or replacement of any canonical source file.
- Empirical evaluation of a particular language model’s extraction accuracy.
- Host-language, parser, deployment, storage, concurrency, authorization, or tool behavior not specified by the sources.
- Security penetration testing or proof of prompt-injection resistance.
- Proof of universal correctness, robustness, completeness, or deterministic interpretation/generation.

“Self-contained” is evaluated as **independent of the current conversation and undocumented host context**, while permitting explicit dependencies among files in the declared integrated package. The audit is finite and does not prove the absence of every possible defect.

# SOURCE COMPLETENESS

| Canonical file | Availability | Nonempty | Package-relative self-containment | Evidence |
|---|---:|---:|---:|---|
| [`router-overview.md`](sandbox:/mnt/data/router-overview.md) | present/readable | yes | yes | 179 lines; 7,865 bytes; enumerates all canonical files and the processing sequence. |
| [`extraction.md`](sandbox:/mnt/data/extraction.md) | present/readable | yes | yes | 112 lines; 5,018 bytes; defines its role, classifications, runtime envelope, and output contract. |
| [`one-shot-distiller.md`](sandbox:/mnt/data/one-shot-distiller.md) | present/readable | yes | yes | 86 lines; 3,800 bytes; declares route identifier, inputs, method, output, and validation rules. |
| [`minimum-question-interviewer.md`](sandbox:/mnt/data/minimum-question-interviewer.md) | present/readable | yes | yes | 97 lines; 3,458 bytes; declares route identifier, questioning limits, answer integration, and invalid-output conditions. |
| [`existing-prompt-normalizer.md`](sandbox:/mnt/data/existing-prompt-normalizer.md) | present/readable | yes | yes | 99 lines; 3,683 bytes; declares route identifier, normalization method, output, and validation rules. |
| [`contract-auditor.md`](sandbox:/mnt/data/contract-auditor.md) | present/readable | yes | yes, subject to Finding F-004 | 111 lines; 4,074 bytes; declares route identifier, audit tests, verdicts, output, and invalid-output conditions. |
| [`intent-record.schema.json`](sandbox:/mnt/data/intent-record.schema.json) | present/readable | yes | yes as a schema resource | 319 lines; 7,691 bytes; parses as JSON and validates as a Draft 2020-12 schema. |
| [`routing-policy.md`](sandbox:/mnt/data/routing-policy.md) | present/readable | yes | yes, subject to Finding F-005 | 275 lines; 7,745 bytes; defines preconditions, invariants, R1–R5, reference code, failure behavior, and acceptance tests. |

No file was missing, duplicated by canonical name, inaccessible, empty, or materially truncated in the audited package.

# REQUIREMENTS TRACEABILITY

| Requirement ID | Normative requirement | Source | Implementing file or section | Status | Supporting evidence |
|---|---|---|---|---|---|
| REQ-001 | Preserve the raw request verbatim. | Explicit Project instruction; overview | `router-overview.md` §§Canonical intent record, Processing sequence; `extraction.md` §§Governing principles; `routing-policy.md` §Preconditions | satisfied | Overview lines 69 and 125; extraction line 11; policy line 26. |
| REQ-002 | Partition governing instructions, supplied artifacts, authoritative inputs, untrusted content, constraints, preferences, and assumptions. | Explicit Project instruction; overview §Trust partition | Schema and extraction output | **violated** | Overview lines 54–63 requires the partition, but schema required/properties lists contain no `governing_instructions` or supplied-artifact inventory. See F-001. |
| REQ-003 | Produce and validate the canonical intent record before routing. | Explicit Project instruction; overview §Processing sequence | `router-overview.md`; `routing-policy.md` §Preconditions | satisfied | Overview lines 127–133 and policy lines 22–31 require parsing, schema validation, invariants, and evidence checks before routing. |
| REQ-004 | Keep intent extraction model-mediated. | Explicit Project instruction | `router-overview.md` §Purpose; `routing-policy.md` §Purpose | satisfied | Overview lines 7–10 and policy lines 5–7 distinguish model-mediated interpretation from later deterministic routing. |
| REQ-005 | Prevent the extraction model from selecting, recommending, ranking, naming, or implying a route. | Explicit Project instruction | `extraction.md` §Role; schema; policy preconditions | satisfied | Extraction line 7; schema top-level `additionalProperties: false` and no route field; policy lines 29–31. |
| REQ-006 | Select routes deterministically only after schema and invariant validation. | Explicit Project instruction | `routing-policy.md` §§Purpose, Preconditions | partially_satisfied | Policy is correct, but overview line 14 narrows the precondition to “schema-valid,” contradicting the full validity domain. See F-006. |
| REQ-007 | The same fully valid record and routing-policy version yields the same route. | Overview; policy | Ordered predicates and reference implementation | satisfied, with auditability limitation | Policy lines 95–204 are ordered, side-effect-free predicates; policy version is not surfaced in outputs. See F-008. |
| REQ-008 | Apply R1–R5 exactly in order and stop at the first match. | Explicit Project instruction; policy | `routing-policy.md` §§Ordered routing rules, Rule precedence | satisfied | Policy lines 93–163 and 207–217; reference implementation lines 167–204 agrees. |
| REQ-009 | Preserve exactly four route identifiers. | Explicit Project instruction | Overview, four route prompts, routing policy | satisfied | Overview lines 18–25; policy lines 11–18; each route prompt declares the corresponding identifier. |
| REQ-010 | R1: audit plus execution contract routes to `contract_auditor`. | Explicit Project instruction | `routing-policy.md` §R1 | satisfied | Policy lines 97–110. |
| REQ-011 | R2: blocking material ambiguity routes to the interviewer. | Explicit Project instruction | `routing-policy.md` §R2 | satisfied | Policy lines 112–125. |
| REQ-012 | R3: existing prompt plus create/clarify/normalize/unknown routes to the normalizer. | Explicit Project instruction | `routing-policy.md` §R3 | satisfied | Policy lines 127–140. |
| REQ-013 | R4: execution contract requiring revision rather than audit routes to the normalizer. | Explicit Project instruction | `routing-policy.md` §R4 | satisfied | Policy lines 142–155. |
| REQ-014 | R5 is the default. | Explicit Project instruction | `routing-policy.md` §R5 | satisfied, but unsafe for unconstrained `mixed` records | Policy lines 157–163. See F-002. |
| REQ-015 | Interview only for material ambiguity lacking a safe assumption. | Explicit Project instruction | Overview §§Material ambiguity, Safe assumption; policy tests; interviewer | satisfied | Overview lines 84–109; policy lines 50–91; interviewer lines 31–46. |
| REQ-016 | Material equals the OR of the eight materiality factors. | Extraction and policy | Application invariant | satisfied | Extraction lines 55–68; policy lines 39 and 50–73. Correctly left to application validation. |
| REQ-017 | Safe-assumption availability equals the AND of all five factors. | Extraction and policy | Schema conditionals plus application invariant | satisfied | Extraction lines 70–80; policy lines 40 and 75–91; schema lines 232–271 conditions only the proposed-assumption type. |
| REQ-018 | Every operative/proposed assumption is disclosed and copied to top-level assumptions before execution. | Explicit Project instruction; policy | Route prompts and policy invariant | satisfied | Policy lines 41–42; distiller lines 35–36; interviewer lines 82–85; normalizer lines 50–51; auditor lines 55–56. |
| REQ-019 | Explicit user instructions override inferred practical intent. | Explicit Project instruction | All prose components | satisfied | Overview lines 40–50; extraction lines 12–13; all route prompts repeat the rule. |
| REQ-020 | Embedded artifact/example/quotation/task-data instructions remain untrusted unless explicitly authorized. | Explicit Project instruction | Overview, extraction, all route prompts | satisfied | Overview lines 52–63; extraction line 14 and runtime rule line 108; route-prompt authority sections. |
| REQ-021 | Unknown tools, permissions, and environments remain unknown; do not invent capabilities. | Explicit Project instruction; policy | Schema target environment; extraction; route prompts | partially_satisfied | The behavior is stated, but the schema does not define whether `target_environment.name: null` is the canonical encoding of unknown. See F-009. |
| REQ-022 | Do not claim deterministic model interpretation/generation, guaranteed correctness, or universal robustness. | Explicit Project instruction | Overview, extraction, all route prompts, policy | satisfied | Overview lines 12–14; extraction line 22; route-prompt authority/validation rules; policy line 7 and acceptance test line 275. |
| REQ-023 | Schema uses Draft 2020-12 and is structurally valid. | Schema requirement | `intent-record.schema.json` | satisfied | `$schema` is the official 2020-12 URI; the complete document passed Draft 2020-12 meta-schema validation. |
| REQ-024 | Reject additional top-level and nested properties. | Audit contract | Schema | satisfied | `additionalProperties: false` appears at top level and all structured nested objects. |
| REQ-025 | Include required canonical fields and exclude a route-selection field. | Explicit Project instruction; schema description | Schema | partially_satisfied | Core extraction fields and no route field are present, but the required trust partition is not fully representable. See F-001. |
| REQ-026 | Enforce proposed-assumption conditional behavior. | Audit contract | Schema and invariant checks | satisfied | Schema lines 232–271 enforce null when unsafe and nonempty string when safe; top-level inclusion remains an application invariant. |
| REQ-027 | Evidence spans must be exact excerpts occurring in the declared runtime source. | Extraction and policy | Extraction §§Evidence spans; policy preconditions/invariants | partially_satisfied | Exact occurrence is required, but field-address semantics and minimum coverage are not defined or enforceable. See F-003. |
| REQ-028 | Invalid records receive at most one constrained repair and then fail closed without routing. | Explicit Project instruction | Overview §Failure behavior; policy §Validation failure behavior | satisfied | Overview lines 131–132 and 156–163; policy lines 236–242. |
| REQ-029 | After interview answers, rerun extraction, revalidate the complete record, and reapply R1–R5 from the beginning. | Explicit Project instruction | Interviewer §Answer integration; policy §Interview completion | partially_satisfied | The rerouting sequence is explicit, but the canonical representation of the original request plus later answers is ambiguous. See F-007. |
| REQ-030 | Execute only the selected meta-prompt. | Explicit Project instruction; overview | Overview §Processing sequence; policy optional subsequent audit | **violated/contradicted** | Overview line 136 says execute only the selected prompt; policy lines 230–234 permit another canonical meta-prompt as a subsequent stage. See F-005. |
| REQ-031 | Each route prompt must not perform the underlying task. | Route architecture | All four route prompts | satisfied | Distiller line 9; interviewer line 7; normalizer line 7; auditor line 9. |
| REQ-032 | Route prompts must declare trigger-compatible purpose, runtime inputs, output contract, assumptions/trust handling, and failure/invalid behavior. | Audit contract | All four route prompts | partially_satisfied | Generally complete; auditor lacks a compatible audit-only result mode. See F-004. |
| REQ-033 | No hidden dependence on the current conversation. | Explicit Project instruction | Runtime-input sections and standalone-output rules | satisfied | Each route prompt declares caller-supplied inputs; distiller and normalizer explicitly require standalone outputs. |
| REQ-034 | Canonical completed-operation envelope contains the seven router sections. | Project instructions; overview | `router-overview.md` §Canonical output envelope | partially_satisfied | The correct sections are listed, but overview says “should,” not “must.” This is a nonblocking clarity issue, F-010. |
| REQ-035 | Schema conformance must not be treated as truth or complete semantic validity. | Explicit Project instruction | Auditor and policy | satisfied | Auditor line 18 and test line 45; policy separately requires cross-field and source-occurrence checks. |
| REQ-036 | Routing reference code is subordinate to normative prose and invariants. | Audit contract | Policy | satisfied | Reference implementation matches R1–R5; preconditions and invariants precede it and explicitly prohibit routing invalid records. |

# FINDINGS

## F-001 — Missing canonical representation of the complete trust partition

- **Classification:** material
- **Affected file and section:** `router-overview.md` §Trust partition and §Canonical intent record; `extraction.md` §Governing principles and §Output contract; `intent-record.schema.json` top-level required/properties.
- **Applicable requirement:** REQ-002, REQ-025.
- **Defect:** The package requires every request to be partitioned into governing instructions, supplied artifacts, authoritative inputs, untrusted content, hard constraints, preferences, and assumptions, but the canonical schema has no `governing_instructions` field and no supplied-artifact inventory. Because extraction must return only a schema-conforming object, those required partitions cannot be preserved in the canonical record.
- **Evidence:** Overview lines 54–63 require the partition. Overview lines 67–80 describe the record without governing instructions or artifact inventory. Schema lines 8–23 and 25–317 enumerate all permitted top-level fields and omit both categories. Extraction line 15 says to separate categories but line 112 prohibits any additional properties.
- **Reasoning:** A mandatory semantic partition that cannot be represented in the only allowed extraction output is not auditable or reliably available to downstream route prompts.
- **Consequence:** Trust-boundary decisions can be lost between extraction and execution; downstream components cannot verify which instructions were treated as governing or which artifacts were supplied and classified.
- **Confidence:** high.
- **Proposed repair:** Add structured `governing_instructions` and `supplied_artifacts` fields to a new schema version and update extraction/evidence requirements, or explicitly define and validate a separate canonical pre-routing envelope containing those fields. Do not leave the partition as transient model reasoning.

## F-002 — `mixed` artifact records can silently fall through to the default route

- **Classification:** material
- **Affected file and section:** `extraction.md` §Artifact state; `intent-record.schema.json` `artifact_state`; `routing-policy.md` §§Cross-field invariants, Ordered routing rules.
- **Applicable requirement:** REQ-006, REQ-014, REQ-032.
- **Defect:** `mixed` is a valid artifact state for materially different artifact types or a state that “cannot be reduced to one state without loss,” but no R1–R4 predicate handles it and no invariant requires a material ambiguity. A schema- and invariant-valid `mixed` record therefore reaches R5.
- **Evidence:** Extraction lines 41–45 define `mixed`; schema lines 49–57 admit it. Policy lines 97–155 predicate only on `execution_contract` and `existing_prompt`; lines 157–163 default every remainder to `one_shot_distiller`.
- **Reasoning:** A record expressly indicating irreducible artifact heterogeneity is not necessarily trigger-compatible with the one-shot distiller. The current policy permits default routing without requiring the extractor to identify which artifact controls the operation.
- **Consequence:** Requests containing both a prompt and an execution contract can be distilled instead of clarified, normalized, or audited, changing deliverable and compliance behavior.
- **Confidence:** high.
- **Proposed repair:** Add an application invariant: `artifact_state == mixed` must include a blocking material ambiguity identifying the controlling artifact unless an explicit user designation permits reclassification to a single state. This preserves the exact R1–R5 order and makes R2 handle unresolved mixed inputs.

## F-003 — Evidence-span completeness and field addressing are underspecified

- **Classification:** material
- **Affected file and section:** `extraction.md` §Evidence spans; `intent-record.schema.json` `evidence_spans`; `routing-policy.md` §§Preconditions, Cross-field invariants.
- **Applicable requirement:** REQ-027 and the project’s auditability/trust requirements.
- **Defect:** The schema permits an empty `evidence_spans` array, and each span’s `field` is any nonempty string. The application invariant checks only that the quoted text occurs in the named source. No normative rule defines a canonical field path, required field coverage, index addressing for array items, or whether multiple claims can share one span.
- **Evidence:** Extraction lines 84–90 require at least one span for each “material extracted field” when text-grounded but do not define material fields. Schema lines 288–317 contain no `minItems`, no field-path grammar, and no cross-reference. Policy lines 28 and 46 require presence/source occurrence but not coverage or field correspondence.
- **Reasoning:** Source occurrence alone does not establish that a span supports the field it names. An empty array or a span with `field: "anything"` can pass the current schema; an implementation following only the stated invariant can accept it.
- **Consequence:** Unsupported operation, artifact-state, constraint, or authority classifications can appear provenance-valid, reducing auditability and enabling materially different route outcomes.
- **Confidence:** high.
- **Proposed repair:** Define `field` as a JSON Pointer into the record; require at least one span for `surface_request`, `requested_operation`, `artifact_state`, every explicit hard constraint, and every text-derived authority/trust classification; add application-level coverage and semantic-link checks. Add `minItems: 1` because every record necessarily has a nonempty raw request.

## F-004 — The auditor cannot honor an explicit audit-only/no-modification request

- **Classification:** material
- **Affected file and section:** `contract-auditor.md` §§Purpose, Required output; `routing-policy.md` §R1.
- **Applicable requirement:** REQ-019, REQ-032.
- **Defect:** R1 covers any audit request accompanied by an execution contract. The selected prompt then requires a complete repaired contract for `passes_with_repairs` and a complete reproduced contract for `passes_declared_audit`. It provides no audit-only mode, even when the user explicitly prohibits modification or replacement.
- **Evidence:** Auditor lines 7–9 define auditing and repair; lines 81–99 require `REPAIRED CONTRACT` and a complete contract in both successful verdict states. Policy lines 97–110 route all audit-plus-contract records to this prompt. Overview lines 40–50 says explicit user instructions have higher authority.
- **Reasoning:** The authority rule resolves the conflict in favor of the user, but the selected prompt’s validation/output rules then make the compliant audit-only output invalid.
- **Consequence:** A conforming implementation must either violate the user’s no-modification instruction or violate the selected meta-prompt’s exact output contract.
- **Confidence:** high.
- **Proposed repair:** Add an `audit_only` runtime mode derived from explicit constraints. Retain the `# REPAIRED CONTRACT` heading if interface stability is required, but permit the value `Not produced—modification was explicitly prohibited`; provide minimal proposed repairs only.

## F-005 — Optional second meta-prompt execution conflicts with the single-selected-prompt invariant

- **Classification:** material
- **Affected file and section:** `router-overview.md` §§Purpose, Processing sequence; `routing-policy.md` §Optional subsequent audit.
- **Applicable requirement:** REQ-030.
- **Defect:** The overview says the system selects exactly one canonical meta-prompt and executes only the selected meta-prompt. The policy later permits the caller to run `contract_auditor` after `one_shot_distiller` or `existing_prompt_normalizer`, including based on high stakes or tool control, without requiring a new extraction/routing operation.
- **Evidence:** Overview lines 5 and 133–136. Policy lines 230–234.
- **Reasoning:** Calling a second canonical route prompt in the same operation is operationally different from selecting and executing exactly one. Labeling it a “subsequent validation stage” does not define a separate operation or preserve the route invariant.
- **Consequence:** Implementations can diverge on whether one or two meta-prompts execute, and the second stage can alter deliverables without a new validated intent record or route decision.
- **Confidence:** high.
- **Proposed repair:** Either remove the optional stage from the primary routing policy or state that it begins a new routing operation requiring a new raw request/explicit instruction, extraction, validation, and R1 decision. A non-route output validator may remain inside the original operation if it is not a canonical meta-prompt.

## F-006 — The overview’s determinism claim uses the wrong validity domain

- **Classification:** material
- **Affected file and section:** `router-overview.md` §Purpose; `routing-policy.md` §§Purpose, Preconditions.
- **Applicable requirement:** REQ-006.
- **Defect:** The overview’s emphasized claim says the same **schema-valid** record and policy version yields the same selected route. The policy forbids route selection until cross-field invariants and evidence-span checks also pass.
- **Evidence:** Overview line 14; policy lines 5–7 and 20–48.
- **Reasoning:** A schema-valid but invariant-invalid record has no permitted selected route. The overview therefore states a broader routing guarantee than the normative policy allows.
- **Consequence:** An implementation treating the emphasized overview claim as sufficient can route records that the policy requires it to reject.
- **Confidence:** high.
- **Proposed repair:** Replace “schema-valid intent record” with “schema-valid, invariant-valid, evidence-validated intent record” or define the term “valid record” once and use it consistently.

## F-007 — Post-interview verbatim-request semantics are not canonical

- **Classification:** minor
- **Affected file and section:** `minimum-question-interviewer.md` §Answer integration; `extraction.md` §Governing principles and runtime envelope.
- **Applicable requirement:** REQ-001, REQ-029.
- **Defect or observation:** The interviewer says to preserve answers as explicit instructions and “merge them into the raw request context,” while extraction requires a singular `surface_request` preserving “the raw user request” verbatim and separately accepts conversation context. The package does not state whether `surface_request` remains the original request, becomes a deterministic concatenation, or represents the latest resolved request.
- **Evidence:** Interviewer lines 68–76; extraction lines 11 and 92–108.
- **Consequence:** Implementations may produce different but superficially plausible records, affecting verbatim validation and evidence-source addressing.
- **Confidence:** medium-high.
- **Proposed repair:** Define `surface_request` as the original request unchanged and add a structured `user_resolutions`/conversation field, or define a canonical verbatim envelope with ordered messages and separators.

## F-008 — Routing-policy version is part of the guarantee but absent from the decision record

- **Classification:** minor
- **Affected file and section:** `router-overview.md` §Purpose; `routing-policy.md` §§Purpose, Required route-decision output.
- **Applicable requirement:** REQ-007.
- **Defect or observation:** Determinism is explicitly parameterized by routing-policy version, but no canonical version identifier is declared or emitted in the route decision.
- **Evidence:** Overview line 14; policy line 7; policy lines 244–254 show the required decision object without a version.
- **Consequence:** Audit logs cannot establish which policy version grounded a decision after policy changes.
- **Confidence:** high.
- **Proposed repair:** Declare a policy version and emit `routing_policy_version` in the decision output. This need not be a model-produced intent-record field.

## F-009 — Unknown target-environment encoding is implicit

- **Classification:** minor
- **Affected file and section:** `extraction.md` §§Governing principles, Runtime input envelope; schema `target_environment`.
- **Applicable requirement:** REQ-021.
- **Defect or observation:** Prose uses the literal concept `unknown`, while the schema allows `name` to be string or null and represents tool/permission knowledge as booleans. It never explicitly states that null is the canonical unknown name.
- **Evidence:** Extraction lines 16–17 and 108; schema lines 59–80.
- **Consequence:** Implementations may encode unknown as null, the string `"unknown"`, or an arbitrary placeholder, reducing interoperability.
- **Confidence:** high.
- **Proposed repair:** State that `name: null` is the only unknown encoding, or use an explicit tagged representation.

## F-010 — The canonical router envelope is described as optional

- **Classification:** minor
- **Affected file and section:** `router-overview.md` §Canonical output envelope.
- **Applicable requirement:** REQ-034.
- **Defect or observation:** The document says a completed operation “should” return the canonical sections, while Project instructions require them for every completed operation.
- **Evidence:** Overview lines 140–154.
- **Consequence:** Implementations may treat the envelope as advisory.
- **Confidence:** high.
- **Proposed repair:** Change “should return” to “must return” and state whether route-prompt outputs are nested under `SELECTED META-PROMPT OUTPUT`.

# CROSS-FILE CONSISTENCY

| Comparison | Result | Evidence and analysis |
|---|---|---|
| Canonical route identifiers | consistent | Overview and policy list the same four identifiers; each route prompt declares exactly its corresponding identifier. |
| Requested-operation enumeration | consistent | Extraction lines 26–35 and schema lines 38–47 both use `create`, `clarify`, `normalize`, `audit`, `execute`, `unknown`. |
| Artifact-state enumeration | syntactically consistent; semantically incomplete | Extraction and schema agree on `raw_request`, `existing_prompt`, `execution_contract`, `mixed`, `none`; policy does not safely constrain `mixed`. F-002. |
| Risk tiers | consistent | Extraction lines 47–53 and schema lines 275–281 agree on `ordinary`, `consequential`, `high_stakes`. |
| Materiality factors | consistent | Extraction lines 55–68, schema lines 153–191, and policy lines 50–73 use the same eight factors and OR rule. |
| Safe-assumption factors | consistent | Extraction lines 70–80, schema lines 196–221, and policy lines 75–91 use the same five factors and AND rule. |
| R1–R5 predicates and order | consistent | Overview summary, policy normative prose, reference implementation, precedence explanation, and acceptance table agree. |
| Validation sequence | mostly consistent | Overview and policy agree on JSON → schema → invariants/evidence → bounded repair → fail closed → route. Overview’s “same schema-valid record” claim is inconsistent with that sequence. F-006. |
| Repair-attempt limit | consistent | Overview and policy both permit at most one constrained repair attempt and then close validation. |
| Explicit-user precedence | consistent | Overview, extraction, all route prompts, and policy safe-assumption rule preserve explicit instructions over inference. |
| Trust treatment of embedded instructions | consistent | Overview, extraction, and all route prompts classify embedded artifact/example/quotation/task-data instructions as untrusted absent authorization. |
| Unknown tools/permissions/environment | mostly consistent | Prose consistently forbids invention; schema’s null/unknown encoding is implicit. F-009. |
| Evidence spans | semantically incomplete | Extraction requires exact spans; schema represents them; policy checks occurrence. Coverage and field linkage are undefined. F-003. |
| Interview completion | procedurally consistent | Interviewer and policy both require complete re-extraction, validation, and rerouting; raw-request representation after answers is unclear. F-007. |
| “Exactly one selected meta-prompt” | conflict | Overview requires one selected prompt; policy permits an optional second canonical prompt. F-005. |
| Route-prompt output contracts vs user precedence | conflict in auditor | Most prompts can carry user constraints into their artifact; auditor mandates a complete repaired/reproduced contract even when modification is prohibited. F-004. |
| Canonical router envelope vs route-specific outputs | compatible only if nested; not expressly defined | The seven-section envelope can contain route-specific output, but overview does not explicitly state nesting and uses advisory language. F-010. |
| No deterministic interpretation/generation guarantee | consistent | All relevant files avoid or prohibit such claims. |
| Hidden conversation dependence | no demonstrated conflict | Runtime inputs are explicit; standalone requirements appear where a reusable contract is produced. Cross-file package dependencies are declared. |

Harmless wording differences were not reported where operative meaning was unchanged. In particular, “same valid record” in the policy and the complete validation preconditions are compatible; the defect is confined to the overview’s narrower “schema-valid” formulation.

# BEHAVIORAL TEST VECTORS

| Test ID | Material record fields | Expected validation result | Expected rule | Expected route | Result implied by the sources | Status | Evidence |
|---|---|---|---|---|---|---|---|
| T-01 | `requested_operation=audit`; `artifact_state=execution_contract`; no invalid fields | valid | R1 | `contract_auditor` | First predicate matches; later ambiguity checks are not reached. | pass | Policy lines 95–110 and 211–212. |
| T-02 | `artifact_state=raw_request`; one ambiguity with `material=true`, `safe_assumption_available=false` | valid if OR/AND invariants and evidence pass | R2 | `minimum_question_interviewer` | Blocking ambiguity matches R2. | pass | Policy lines 69–73 and 112–125. |
| T-03 | `artifact_state=existing_prompt`; `requested_operation=normalize`; no blocking ambiguity | valid | R3 | `existing_prompt_normalizer` | R1/R2 do not match; R3 matches. | pass | Policy lines 127–140. |
| T-04 | `artifact_state=execution_contract`; `requested_operation=normalize`; no blocking ambiguity | valid | R4 | `existing_prompt_normalizer` | R1 false because operation is not audit; R4 matches. | pass | Policy lines 142–155. |
| T-05 | `artifact_state=raw_request`; `requested_operation=create`; no blocking ambiguity | valid | R5 | `one_shot_distiller` | No higher rule matches. | pass | Policy lines 157–163. |
| T-06 | `requested_operation=audit`; `artifact_state=none`; explicit missing-artifact ambiguity, material and unsafe | valid | R2 | `minimum_question_interviewer` | Policy invariant requires the missing artifact to be represented as material; then R2 matches. | pass | Policy lines 43 and 112–125. |
| T-07 | ambiguity says `safe_assumption_available=false` but `proposed_assumption="Assume X"` | schema-invalid | none | none | Draft 2020-12 conditional requires `proposed_assumption` to be null. | pass | Schema lines 232–250. |
| T-08 | otherwise valid record plus top-level `selected_route` | schema-invalid | none | none | Top-level `additionalProperties:false` rejects the property; policy forbids routing. | pass | Schema line 7; policy lines 29–31 and 241. |
| T-09 | evidence span text is absent from its declared source | schema-valid but invariant-invalid | none | none | Policy source-occurrence invariant fails; bounded repair or closed failure follows. | pass | Policy lines 28, 46, and 236–242. |
| T-10 | after interview: answers incorporated as explicit instructions; fully re-extracted record becomes `audit + execution_contract` | valid after full revalidation | R1 | `contract_auditor` | Interviewer and policy require re-extraction and rules applied from R1; R1 then matches. | pass | Interviewer lines 68–76; policy lines 219–228 and 97–110. |
| T-11 (supplementary) | `artifact_state=mixed`; `requested_operation=normalize`; no ambiguity | schema- and currently invariant-valid | expected clarification or explicit target-artifact handling | not safely determined | Current policy falls through to R5 and selects `one_shot_distiller`. | fail | Extraction lines 41–45; policy lines 127–163. F-002. |
| T-12 (supplementary) | ordinary valid record with `evidence_spans=[]` | expected invalid for provenance completeness | none | none | Schema permits the empty array; stated invariants do not reject it; R5 can execute. | fail | Schema lines 288–317; policy lines 35–46. F-003. |
| T-13 (supplementary) | explicit audit-only request; execution contract supplied; `hard_constraints` prohibits modification | valid | R1 | `contract_auditor` | Route is correct, but selected prompt requires a complete repaired/reproduced contract. | fail | Auditor lines 81–99; overview lines 40–50. F-004. |

The schema conclusions above distinguish schema validity from semantic or source-truth validity. The conceptual validator used the normative OR/AND, top-level-assumption, audit-without-artifact, unknown-preservation, explicit-constraint, and evidence-occurrence invariants in addition to Draft 2020-12 schema validation.

# PROPOSED REPAIRS

## P-001 — Represent the complete trust partition

- **Linked finding ID:** F-001
- **Minimal change:** Add canonical structured fields for governing instructions and supplied artifacts, with source/provenance references; alternatively define a separately validated pre-routing envelope that contains them.
- **Affected file:** `intent-record.schema.json`, `extraction.md`, `router-overview.md`, and any validator consuming the record.
- **Scope effect:** Schema-version change; no change to route identifiers or R1–R5 predicates.
- **Regression tests required:** A request with artifact-contained imperative text must retain both the governing user instruction and untrusted artifact instruction as distinct, machine-addressable entries; removal of either must fail validation.

## P-002 — Fail safe on unresolved `mixed` artifacts

- **Linked finding ID:** F-002
- **Minimal change:** Add a cross-field invariant requiring a blocking material ambiguity for `artifact_state=mixed` unless the user explicitly designates the controlling artifact and extraction reclassifies the record.
- **Affected file:** `routing-policy.md`, `extraction.md`; optionally schema documentation.
- **Scope effect:** Preserves R1–R5 exactly; causes unresolved mixed records to reach R2.
- **Regression tests required:** Mixed prompt+contract with no target designation is invalid or R2-eligible; explicit target designation yields `existing_prompt` or `execution_contract` and the corresponding normal route.

## P-003 — Make evidence coverage machine-checkable

- **Linked finding ID:** F-003
- **Minimal change:** Define evidence `field` as JSON Pointer; add `minItems:1`; specify mandatory coverage and application-level semantic-link checks.
- **Affected file:** `intent-record.schema.json`, `extraction.md`, `routing-policy.md`.
- **Scope effect:** Tightens validation; no route-policy change.
- **Regression tests required:** Empty evidence array fails; nonexistent JSON Pointer fails; span absent from source fails; operation/artifact-state fields without evidence fail; exact valid spans pass.

## P-004 — Add an audit-only mode

- **Linked finding ID:** F-004
- **Minimal change:** Permit `contract_auditor` to return findings and proposed repairs without emitting a modified contract when an explicit hard constraint prohibits modification. Keep a stable heading with an explicit not-produced value if needed.
- **Affected file:** `contract-auditor.md`.
- **Scope effect:** Expands output behavior without adding a route.
- **Regression tests required:** Audit-only request produces no repaired contract; audit-and-repair request still produces a complete repaired contract; explicit no-modification constraint always wins.

## P-005 — Preserve the single-route execution invariant

- **Linked finding ID:** F-005
- **Minimal change:** Remove the optional subsequent canonical prompt from the same operation, or require it to begin a separate extraction/validation/R1 routing operation. Distinguish a non-route output validator from a canonical meta-prompt.
- **Affected file:** `routing-policy.md`, with a confirming sentence in `router-overview.md`.
- **Scope effect:** Clarifies operation boundaries; no change to route identifiers.
- **Regression tests required:** A primary R5 or R3 operation executes one canonical prompt only; any later audit has a distinct intent record and R1 decision.

## P-006 — Correct the determinism claim

- **Linked finding ID:** F-006
- **Minimal change:** Replace “schema-valid” with “schema-valid, invariant-valid, and evidence-validated,” or define “valid intent record” accordingly.
- **Affected file:** `router-overview.md`.
- **Scope effect:** Clarification aligning the overview with existing normative preconditions.
- **Regression tests required:** A schema-valid but invariant-invalid record yields no route; a fully valid record yields the same route under the same policy version.

## P-007 — Canonicalize post-interview request representation

- **Linked finding ID:** F-007
- **Minimal change:** Keep the original request unchanged in `surface_request` and add ordered user-resolution messages, or define an exact deterministic message envelope.
- **Affected file:** `minimum-question-interviewer.md`, `extraction.md`, and likely the schema if a new field is added.
- **Scope effect:** May require schema-version change depending on chosen representation.
- **Regression tests required:** Original request remains byte-for-byte preserved; interview answers are independently preserved and authoritative; evidence spans resolve to the correct message source.

## P-008 — Emit policy version

- **Linked finding ID:** F-008
- **Minimal change:** Declare a routing-policy version constant and include it in the route-decision output.
- **Affected file:** `routing-policy.md`; optionally `router-overview.md`.
- **Scope effect:** Decision-envelope extension only.
- **Regression tests required:** Route logs include version; identical record+version yields identical rule/route; changing version is observable.

## P-009 — Define unknown target-environment encoding

- **Linked finding ID:** F-009
- **Minimal change:** State that `target_environment.name=null` denotes unknown, or replace it with an explicit tagged value.
- **Affected file:** `intent-record.schema.json`, `extraction.md`.
- **Scope effect:** Documentation-only if null is retained; schema-version change if tagged representation is adopted.
- **Regression tests required:** Unknown environment has one accepted encoding; invented names fail extraction/invariant review.

## P-010 — Make the canonical outer envelope mandatory

- **Linked finding ID:** F-010
- **Minimal change:** Replace “should return” with “must return” and state that the selected route prompt’s result is nested under `# SELECTED META-PROMPT OUTPUT`.
- **Affected file:** `router-overview.md`.
- **Scope effect:** Interface clarification.
- **Regression tests required:** Every successful routing operation contains exactly the seven outer sections and one nested route-specific output.

# RESIDUAL UNCERTAINTY

- No implementation code was supplied. Findings about how validators or callers may behave are limited to behavior permitted or required by the written specification.
- Draft 2020-12 structural validity was checked against the declared meta-schema. This does not prove that every host validator implements the dialect correctly.
- Evidence-span “semantic support” cannot be mechanically established from the current specification; the audit establishes the representational gap, not a universal solution.
- The intended operational boundary around “optional subsequent audit” is not defined. The finding concerns the text as written; a host may already treat it as a separate operation, but that behavior is not specified.
- “Individually self-contained” was interpreted package-relatively. A stricter requirement that each file execute without any other canonical file would make the modular schema/policy references nonconforming, but that interpretation conflicts with the declared integrated-package architecture.
- The audit did not empirically test model-mediated extraction, model compliance with output-only JSON, or adversarial prompt injection.
- Finite behavioral vectors cannot establish exhaustive routing correctness or universal robustness.
- No conclusion here treats schema validity, citation presence, repeated agreement, self-approval, or model output as proof that extracted content is true.
