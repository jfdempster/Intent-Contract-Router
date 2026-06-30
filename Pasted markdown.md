IMPLEMENTATION RATIONALE

The accepted audit establishes findings F-001 through F-010, repairs P-001 through P-010, affected components, compatibility implications, and baseline tests T-01 through T-13. This plan treats that baseline as fixed and does not re-audit or reclassify it. The execution contract requires a plan only, one coordinated migration boundary for P-001, P-003, P-007, and P-009, complete validation before routing, unchanged R1–R5 predicates, and implementation-neutral migration and rollback treatment.

The implementation should be organized around five principles:

Migrate the canonical record atomically. The trust partition, evidence addressing, post-interview representation, and unknown-environment encoding are interdependent record-shape concerns. Implementing them separately would create intermediate records that cannot be validated consistently.

Separate structural validity from semantic validity. JSON Schema should enforce representable structure. Host validators should enforce cross-field, provenance, authority, coverage, and semantic-support obligations.

Fail closed before routing. R1–R5 are evaluated only after the record passes schema, invariant, pointer-resolution, source-occurrence, coverage, and semantic-link validation.

Preserve routing semantics. The route identifiers and formal R1–R5 predicates, order, precedence, and first-match behavior remain unchanged. Safety is added through preconditions and invariants, not by adding or rewriting routes.

Activate the package as one compatible unit. A migrated writer, legacy validator, or partially updated route prompt must never be allowed to process a record whose representation it does not understand.

Finding-to-repair traceability

Finding

Repair

Primary implementation action

Direct dependencies

Affected components

Compatibility effect

Regression coverage

F-001

P-001

Add canonical governing-instruction and supplied-artifact representations, with provenance and trust classification.

None; coordinated with P-003, P-007, P-009

Schema, extraction, overview, all consumers, host validation

Breaking record-shape change

T-14, T-15

F-002

P-002

Reject unresolved mixed records unless they contain the blocking ambiguity required for R2; reclassify explicitly resolved records before routing.

P-001; P-007 when designation occurs through interview

Extraction, routing policy, host invariants

Tightens routing eligibility

T-11, T-25, T-26

F-003

P-003

Replace free-form evidence fields with resolvable JSON Pointers and require coverage, occurrence, and semantic correspondence.

P-001

Schema, extraction, routing policy, host evidence validator

Breaking evidence representation

T-12, T-19–T-24

F-004

P-004

Add audit-only behavior controlled by validated explicit constraints.

P-001; P-007 for interview-supplied constraints

Contract auditor, host prompt invocation

Backward-compatible output-mode expansion, subject to envelope rules

T-13, T-32, T-33

F-005

P-005

Permit exactly one canonical route prompt per operation; treat later audits as new operations.

Validation gate established; no record-shape dependency

Routing policy, overview, host orchestration

Changes callers that currently chain canonical prompts

T-34, T-35

F-006

P-006

Define routing determinism over fully validated records, not merely schema-valid records.

P-003 and complete validation taxonomy

Overview, routing policy documentation

Normative clarification

T-37

F-007

P-007

Preserve the original request unchanged and add ordered, authoritative user resolutions.

P-001

Schema, extraction, interviewer, all route prompts, host validation

Breaking record-shape change

T-27–T-29

F-008

P-008

Declare and emit a routing-policy version in each route decision.

Routing decision envelope definition

Routing policy, overview, host decision producer

Decision-envelope extension

T-36

F-009

P-009

Establish one canonical unknown-environment encoding.

None; coordinated migration boundary

Schema, extraction, host validation, route consumers

Potentially breaking normalization change

T-30, T-31

F-010

P-010

Make the seven-section envelope mandatory and nest route output under the selected-output section.

P-005, P-006, P-008

Overview, host output assembler

Mandatory interface change

T-38, T-39

DEPENDENCY GRAPH

Direct and transitive dependencies

Repair

Direct predecessors

Transitive predecessors

Principal successors

P-001

None

None

P-002, P-003, P-004, P-007; route-prompt consumption changes

P-002

P-001; P-007 where user designation is interview-derived

P-003 for evidence supporting the designation

Routing activation, mixed-artifact tests

P-003

P-001

None

P-006, P-007 evidence integration, complete validation gate

P-004

P-001; P-007

P-003 for constraint evidence

Route-prompt release

P-005

Complete validation gate defined

P-001, P-003, P-007, P-009 through that gate

P-010, operation-boundary tests

P-006

P-003 and host validation taxonomy

P-001

P-010, overview acceptance criteria

P-007

P-001

P-003 for message-level evidence addressing

P-002, P-004, interviewer changes

P-008

Route-decision interface definition

Complete validation gate for decision eligibility

P-010, observability tests

P-009

None, but must share the migration boundary

None

Extraction and route-prompt consumption changes

P-010

P-005, P-006, P-008

P-001, P-003, P-007, P-009 through full operation semantics

Package activation

Dependency structure

P-001 ─┬─> P-003 ─┬─> complete evidence-validation gate ─┬─> P-006 ─┐
       │          │                                      │          │
       │          └─> P-007 ─┬─> P-002                  │          │
       │                      └─> P-004                  │          │
       └─────────────────────────────────────────────────┘          │
                                                                    ├─> P-010
P-009 ─────> migrated extraction and consumer compatibility ────────┤
                                                                    │
complete validation gate ──> P-005 ─────────────────────────────────┤
route-decision interface ──> P-008 ─────────────────────────────────┘

Critical implementation path

Canonical-record and migration decisions
→ migrated schema contract
→ extraction semantics
→ host schema/invariant/evidence validators
→ complete validation gate
→ routing-policy preconditions and decision envelope
→ route-prompt compatibility
→ mandatory outer interface
→ regression suite
→ package-wide consistency audit
→ coordinated activation and migration

P-004 is not on the longest structural path, but it remains a release blocker because the existing auditor behavior conflicts with explicit no-modification constraints. P-008 is mechanically small but is also a release blocker because policy observability is part of the acceptance contract.

IMPLEMENTATION PHASES

Phase

Entry conditions

Actions

Exit criteria and gate

Produced artifacts

Blockers

Compatibility effects

Rollback considerations

1. Schema and migration decisions

Accepted F-001–F-010 and P-001–P-010 baseline; no source modifications begun

Define the coordinated migrated record; field semantics; version discrimination; property closure; null and empty behavior; evidence-address grammar; original-request and resolution representation; canonical unknown; prior-record strategy

One internally consistent record contract covers P-001, P-003, P-007, and P-009; every downstream component has an identified input contract

Record-design specification, migration decision record, compatibility-state model

Unresolved field semantics; unsupported assumptions about legacy storage or converters

Establishes the breaking migration boundary

No activation occurs. Revert the design record without runtime effects

2. Extraction and validator updates

Phase 1 record contract approved

Plan extraction changes; schema enforcement; host invariants; evidence pipeline; constrained-repair classifications; full-validation result interface

Representative migrated records can be classified as fully valid or fail closed; no route is produced by extraction or validation

Updated extraction specification, schema-change specification, validator obligation matrix, evidence-validation contract

Inability to identify source material for conversion; no conservative semantic-link policy

Legacy records require conversion or rejection; migrated records require new validators

Keep migrated writers inactive until all validators are available; reject unknown versions

3. Routing-policy updates

Complete validation result interface defined

Add mixed-artifact precondition; require full validation before R1; add operation boundary; add policy-version decision field; align prose, reference logic, and failure behavior without changing predicates

R1–R5 are byte-for-byte or semantically unchanged in their formal conditions; invalid records receive no route; every decision exposes policy version

Revised routing-policy plan, decision-envelope contract, operation-boundary rules

Any implementation that routes directly from schema success

Tightens eligibility and extends route-decision output

Revert policy activation as one unit; do not run a new router against legacy validation results

4. Route-prompt updates

Migrated record and routing decision contracts stable

Add auditor audit-only mode; update interviewer integration; minimally update distiller and normalizer consumption; require all prompts to preserve trust and unknown semantics

All four canonical prompts accept the migrated record and retain their existing route identifiers and task boundaries

Four route-prompt change specifications

Unresolved audit-only sentinel or authority precedence

Old prompts are incompatible with migrated fields if they depend on legacy shapes

Activate prompts only with matching record and policy package; rollback the complete prompt set

5. Overview and interface alignment

Phases 1–4 contracts stable

Define fully valid record; make outer envelope mandatory; define nesting; state one canonical prompt per operation; document policy version and separate-operation audits

Overview agrees with schema, validators, policy, and prompts; no advisory language remains for mandatory interface behavior

Updated overview change specification and outer-envelope contract

Conflict between route-specific headings and outer envelope

Mandatory response-interface change

Host may revert only with the matching previous router and prompt package

6. Regression-test implementation

All planned interfaces and invariants frozen

Preserve T-01–T-13; add T-14 onward; implement positive, negative, migration, partial-state, routing, prompt, and envelope tests

Every P-001–P-010 repair has at least one passing regression; negative tests prove fail-closed behavior

Versioned regression matrix, fixtures, expected decision and output conditions

Missing authoritative legacy fixtures or source material

Tests become activation gates

No runtime rollback issue; failing tests block release

7. Package-wide consistency audit

Full regression suite passes

Verify terminology, field names, trust categories, policy version, route identifiers, R1–R5, operation boundaries, failure classifications, and prompt inputs across all files

Zero unresolved package contradictions; accepted findings are verified as covered without being reopened

Consistency report and release-readiness checklist

Any mismatch between normative prose and host-observable behavior

Prevents a mixed-version package

Return to the owning phase; do not patch around inconsistency at release time

8. Release and migration

Consistency audit passes; compatible package artifacts are available

Stage migrated validation; convert by re-extraction where possible; reject unconvertible records; activate writer, validator, router, prompts, and envelope under compatibility gates

No component processes an unsupported record or decision version; partial-deployment matrix remains fail closed

Activation manifest, migration log requirements, rollback triggers, compatibility-state declaration

Deployment topology, storage, release tooling, and permissions: Insufficient evidence

Breaking record and interface transition

Roll back only to a complete prior package; preserve source records and migration provenance needed to reconstruct either representation

FILE-BY-FILE CHANGE MATRIX

File or component

Findings and repairs

Sections or logical components

Required change

Dependencies

Classification

Compatibility impact

Regression tests

router-overview.md

F-001/P-001, F-005/P-005, F-006/P-006, F-008/P-008, F-010/P-010

Purpose; trust partition; canonical record; processing sequence; output envelope

Document migrated trust fields; define a valid record as schema-, invariant-, pointer-, occurrence-, coverage-, and semantic-link-valid; state exactly one canonical prompt per operation; define later audit as a new operation; require policy version; make seven-section envelope mandatory and nest route output

Record contract, validation taxonomy, routing decision interface

Normative, editorial

Mandatory interface and validity-definition change

T-14, T-34–T-39

extraction.md

F-001/P-001, F-002/P-002, F-003/P-003, F-007/P-007, F-009/P-009

Governing principles; artifact state; evidence spans; runtime envelope; output contract

Emit complete trust partition and artifact inventory; preserve original request; emit ordered user resolutions; use canonical unknown; generate JSON Pointer evidence addresses; identify unresolved mixed artifacts; never select or imply a route

Migrated record design

Structural, normative, behavioral

Breaking extraction-output change

T-14–T-31

one-shot-distiller.md

P-001, P-003, P-007, P-009 consumption obligations

Inputs; assumptions; trust treatment; validation rules

Consume governing instructions, artifacts, user resolutions, pointer-addressed evidence, and canonical unknowns; retain route identifier and prohibition on performing the underlying task

Migrated record and evidence contract

Normative, behavioral

Requires migrated input

T-14, T-19, T-28, T-30

minimum-question-interviewer.md

F-007/P-007; supporting P-002, P-003, P-009

Answer integration; runtime inputs; completion behavior

Preserve surface_request; append ordered authoritative resolutions; assign source references; require complete re-extraction, validation, and routing from R1; never continue directly to a presumed route

Migrated record, evidence grammar, host re-extraction interface

Structural, normative, behavioral

Breaking answer-integration representation

T-10, T-25–T-30

existing-prompt-normalizer.md

P-001, P-003, P-007, P-009 consumption obligations

Inputs; authority; evidence; assumptions

Consume migrated record without introducing routes; respect governing/untrusted distinction, ordered resolutions, evidence pointers, and canonical unknown

Migrated record and evidence contract

Normative, behavioral

Requires migrated input

T-14, T-19, T-28, T-30

contract-auditor.md

F-004/P-004; migrated-input obligations from P-001, P-003, P-007, P-009

Purpose; trigger interpretation; required output; invalid-output conditions

Add audit-only mode; give explicit no-modification constraints precedence; retain findings and proposed repairs; use an explicit not-produced value beneath # REPAIRED CONTRACT; retain full repair behavior when authorized

Migrated constraint and authority representation

Normative, behavioral

Output-mode expansion; legacy callers must accept audit-only sentinel

T-13, T-32, T-33

intent-record.schema.json

F-001/P-001, F-003/P-003, F-007/P-007, F-009/P-009

Top-level properties; nested definitions; evidence spans; target environment; version discrimination

Add migrated fields and record discriminator; close all objects; require appropriate arrays; define JSON Pointer syntax; define original request and resolution shapes; establish one unknown encoding; prohibit route fields

Phase 1 decisions

Structural

Breaking schema change

T-12, T-14–T-24, T-27–T-31

routing-policy.md

F-002/P-002, F-003/P-003, F-005/P-005, F-006/P-006, F-008/P-008

Preconditions; invariants; ordered rules; reference implementation; subsequent audit; route-decision output

Gate routing on all validation categories; constrain mixed; preserve R1–R5; define one-operation rule; treat later audits as new operations; include policy version in decisions; align reference logic with normative text

Complete validator interface and policy-version decision

Normative, behavioral

Tightens eligibility and extends decision envelope

T-01–T-11, T-25, T-26, T-34–T-37

Host-application logic

All findings and repairs

Record ingestion; conversion; validation; evidence checking; routing; prompt invocation; output assembly; observability

Enforce version compatibility; perform schema and invariant validation; resolve pointers; validate source occurrence, coverage, and semantic links; allow one constrained repair; route only fully valid records; invoke one prompt; assemble mandatory envelope; log policy version

All prior specifications

Structural, behavioral

Coordinated host-package migration required

Entire T-01–T-39 suite

SCHEMA AND MIGRATION PLAN

Coordinated migrated record

The record migration should cover P-001, P-003, P-007, and P-009 in one boundary. The following describes required semantics without supplying a final JSON Schema.

Element

Required semantics

Record discriminator

A required discriminator identifies the record representation. The concrete version value is not specified here. Empty strings and absent discriminators are invalid.

surface_request

Required, nonempty, and preserved byte-for-byte as the original user request. It is never overwritten by interview answers.

governing_instructions

Required, nonempty array of instructions currently authorized to govern the operation. Each item identifies its exact text or address, source, authority basis, and order. Artifact-contained imperative text is excluded unless expressly authorized.

supplied_artifacts

Required array containing one entry for every supplied artifact. An empty array is valid only when no artifact was supplied. Each entry has a stable record-local identifier, source reference, declared or inferred artifact class, trust classification, and controlling-status information.

Authoritative and untrusted material

Existing authoritative-input and untrusted-content representations remain distinct. Every text-derived classification is evidence-addressable. The same source fragment cannot silently occupy conflicting trust classes without an explicit conflict record.

user_resolutions

Required ordered array; empty before any interview answer. Each item preserves the answer text, sequence, source reference, question reference where available, and explicit authority as a later user instruction.

Original/resolution authority

Later valid user resolutions override conflicting inferred interpretations, but do not erase or mutate the original request. Conflicts are resolved in effective interpretation while both texts remain preserved.

Evidence entries

Required nonempty array. Each entry identifies a JSON Pointer target, a source identifier, and an exact nonempty source excerpt. Evidence entries may also include source-location metadata where available, but location metadata cannot replace exact text.

Evidence pointer targets

Pointers use RFC 6901 JSON Pointer semantics. / is the root separator; ~1 represents /; ~0 represents ~. Array items use zero-based decimal indexes. Noncanonical alternative pointer syntaxes are invalid.

Pointer scope

Pointers resolve against the complete migrated record. Pointers into the evidence array itself should be disallowed for mandatory field-support claims to avoid self-supporting provenance.

Mandatory evidence coverage

At minimum, evidence covers surface_request, requested_operation, artifact_state, every explicit hard constraint, every governing instruction, every supplied-artifact classification, every text-derived trust/authority classification, every user resolution, and each text-derived materiality or safe-assumption determination.

Unknown environment

The minimal recommended representation retains target_environment.name: null as the sole unknown-name encoding. Empty strings, "unknown", guessed platform names, and placeholders are invalid. Associated knowledge flags must be defined as epistemic-status flags, not invented capability claims.

Null behavior

Null is permitted only where the field contract assigns it a semantic state, such as unknown environment name or no proposed assumption when assumptions are unsafe. Null cannot substitute for a missing required object or collection.

Empty arrays

Permitted only for categories that can genuinely be absent, such as no artifacts, no resolutions, or no assumptions. Evidence is never empty. Governing instructions are never empty because the operative user request supplies at least one instruction.

Empty strings

Invalid for semantic text, identifiers, source references, evidence excerpts, pointers, and version discriminators.

Property closure

Top-level and all nested objects reject undeclared properties. Extensibility requires an explicit future migration rather than silently accepted fields.

Route exclusion

No selected route, route recommendation, route ranking, route name, or equivalent implication is permitted in the extracted intent record.

Decision separation

routing_policy_version, matched rule, and selected route belong to the route-decision record, not to model-mediated extraction.

Prior-record treatment alternatives

Strategy

Prerequisites

Auditability

Ambiguity risk

Compatibility effect

Partial-availability behavior

Rollback implications

Direct rejection

Active validator recognizes the migrated discriminator; callers can resubmit raw sources

High: no inferred migration

Low

Lowest backward compatibility

Legacy records are rejected before routing

Simple runtime state, but unavailable original sources may strand legacy records

Explicit conversion

Original request, supplied artifacts, and other provenance sources are available; conversion is implemented as complete re-extraction and validation

Highest when conversion records source version, sources, result version, and validation outcome

Low if re-extraction is source-grounded; high if missing fields are guessed

Preserves usable legacy operations where sources survive

Conversion failure or missing sources produces no migrated record and no route

Preserve both original record and source package; converted records can be regenerated

Temporary dual reader

Both complete validation stacks and a policy-to-record-version binding exist

Lower because two active semantic domains must remain comparable

Highest, especially if the two versions imply different trust or evidence semantics

Highest short-term compatibility

Component skew can produce divergent acceptance or routing behavior

Complex; rollback must account for records written under both representations

Recommendation

Use explicit conversion by complete re-extraction from preserved authoritative sources, with direct rejection as the mandatory failure behavior when conversion prerequisites are absent. Do not convert by filling new fields with guesses or empty placeholders.

This recommendation provides the strongest provenance and auditability while avoiding the long-lived ambiguity of a dual-reader system. It is reversible because the original record and source package remain unchanged. Whether the host currently preserves sufficient sources or supports a converter is Insufficient evidence.

VALIDATOR AND ROUTING CHANGES

Validation layers

JSON Schema enforcement

Record-version discrimination.

Required fields and object shapes.

Primitive types and enumerations.

Top-level and nested property closure.

Required nonempty semantic strings.

Required/nonempty collections where structurally justified.

JSON Pointer lexical syntax.

Original-request and user-resolution structures.

Canonical null encoding for unknown environment name.

Prohibition of extraction-time route fields.

Application-level invariants

Cross-field calculations and synchronization.

Authority and ordering.

Artifact-state coherence.

Record immutability.

Environment epistemic integrity.

Decision-version inclusion.

Valid evidence target and source relationships.

Evidence validation

Pointer syntax.

Pointer resolution.

Source identification.

Exact source occurrence.

Mandatory field coverage.

Semantic correspondence.

Deterministic routing

R1–R5 execute only after every preceding category passes.

No route is emitted for a schema-valid but otherwise invalid record.

Host invariant obligations

“Repair permitted” below means eligible for the single operation-wide constrained repair attempt. It does not authorize one attempt per invariant.

Invariant

Validator input

Pass condition

Failure classification

Structural repair eligibility

Single constrained attempt

Fail-closed behavior

Original-request immutability

Migrated record and preserved original source

surface_request is byte-for-byte identical to the original request

Authority/integrity failure

No

No

Reject record; no route

Ordered user resolutions

user_resolutions and source message order

Every resolution is preserved exactly once and in source order

Integrity failure

Only if order metadata already determines one unambiguous order

Conditional

Reject if order cannot be established

Resolution authority

Original request, resolutions, effective extracted fields

Later explicit resolutions control conflicting inferred interpretations without deleting earlier text

Authority/semantic failure

No

No

Reject; request re-extraction or clarification

Materiality OR synchronization

Ambiguity factors and material value

material equals OR of the eight factors

Derived-value failure

Yes, by recomputation

Yes

Reject after failed repair

Safe-assumption AND synchronization

Five safe-assumption factors and aggregate value

Aggregate equals AND of all factors

Derived-value failure

Yes, by recomputation

Yes

Reject after failed repair

Top-level assumption synchronization

Ambiguities, proposed assumptions, top-level assumptions

Every operative proposed assumption appears exactly once at top level; no unsupported assumption is added

Derived-value/integrity failure

Yes only when exact source values are already present

Conditional

Reject after failed or unsafe repair

Unresolved mixed artifacts

Artifact inventory, artifact_state, ambiguities

mixed has a blocking material ambiguity with no safe assumption; otherwise it is invalid

Routing-precondition failure

No

No

No route

Controlling-artifact designation

Governing instructions, resolutions, artifact inventory

An explicit user designation identifies one controlling artifact and extraction reclassifies the record to a non-mixed state

Authority/semantic failure

No

No

Reject or route to R2 only after a valid blocking ambiguity exists

Canonical unknown environment

Target environment and source evidence

Unknown is represented only by name: null; no unsupported name or capability is asserted

Epistemic-integrity failure

No, except during source-grounded migration

No during runtime validation

Reject; no route

Policy-version inclusion

Active policy configuration and route decision

Every eligible decision includes the exact active policy version

Decision-interface failure

Yes; host may insert its configured constant before publication

Yes

Suppress decision and prompt execution

Evidence-pointer syntax

Evidence address

Address conforms to canonical JSON Pointer lexical rules

Structural evidence failure

No unless a unique mechanical escaping correction exists

Conditional

Reject evidence and record

Evidence-pointer resolution

Pointer and migrated record

Pointer resolves to an existing permitted field or array item

Provenance failure

No

No

Reject record

Evidence-source identification

Evidence entry and source registry

Source reference resolves to an available declared source

Provenance failure

No

No

Reject or report Insufficient evidence

Exact source occurrence

Evidence excerpt and identified source

Exact excerpt occurs in the declared source

Provenance failure

No

No

Reject record

Mandatory coverage

Record and evidence-target set

Every mandatory target has at least one qualifying evidence entry

Coverage failure

No, unless already available evidence was omitted mechanically and can be added without interpretation

Conditional

Reject record

Semantic correspondence

Target field, source excerpt, relevant context

Evidence supports the specific value or classification at the pointer target

Semantic-evidence failure

No

No

Reject or report Insufficient evidence

Semantic-link implementation alternatives

Field-specific deterministic checks can validate narrowly defined relationships, such as an exact user phrase supporting a hard constraint.

Model-assisted review can evaluate broader semantic correspondence but does not provide a universal proof.

Human review can adjudicate high-consequence or indeterminate cases where available.

The recommended design is layered: use deterministic checks where the correspondence is formally specified; use a conservative semantic reviewer for the remainder; fail closed when adequate support cannot be established. The availability of human review or a particular secondary model is Insufficient evidence.

Routing sequence

1. Parse the candidate record.
2. Verify the record discriminator.
3. Apply JSON Schema validation.
4. Apply all application-level invariants.
5. Validate pointer syntax and resolution.
6. Validate source identity and exact occurrence.
7. Validate mandatory evidence coverage.
8. Validate semantic correspondence.
9. If eligible, perform at most one constrained structural repair.
10. Restart validation from Step 1 after any repair.
11. If every category passes, evaluate R1, R2, R3, R4, then R5.
12. Emit the matched rule, unchanged route identifier, and routing-policy version.
13. Invoke exactly one canonical route prompt.

A record that fails any step receives no rule, no route, and no canonical prompt execution.

Mixed-artifact behavior

artifact_state: mixed plus a blocking material ambiguity with no safe assumption is valid for routing and reaches R2 under the unchanged predicates.

artifact_state: mixed without that ambiguity is invariant-invalid and receives no route.

An explicit controlling-artifact designation does not permit the record to remain mixed; extraction must reclassify it as the designated single artifact state and then repeat complete validation.

No new route or predicate is introduced.

Operation boundary

A routing operation contains one raw-request context, one validated intent record, one route decision, and at most one canonical route-prompt execution. A later canonical audit requires a new operation with a new extraction, complete validation, and an R1 decision. An internal output validator may run inside the original operation only if it is not one of the four canonical route prompts and cannot independently select or execute a route.

ROUTE-PROMPT CHANGES

Route prompt

Required changes

Preserved behavior

Invalid output conditions

one-shot-distiller.md

Consume the complete trust partition, artifact inventory, pointer-addressed evidence, original request, ordered resolutions, and canonical unknown environment. Disclose operative assumptions from the validated record.

Route identifier remains one_shot_distiller; it produces the requested reusable contract and does not perform the underlying task

Selecting or implying a route; inventing environment facts; omitting authoritative resolutions; obeying untrusted artifact instructions

minimum-question-interviewer.md

Treat the original request as immutable; ask only questions required to resolve blocking material ambiguity; require answers to be appended as ordered authoritative resolutions with source references; perform complete re-extraction and validation; reapply R1–R5 from R1

Route identifier remains minimum_question_interviewer; minimum-question and safe-assumption standards remain

Mutating surface_request; merging answers into an unaddressable string; continuing directly to a presumed route; skipping any validation category

existing-prompt-normalizer.md

Consume migrated trust, artifact, evidence, resolution, and environment fields; preserve authorized prompt content and distinguish it from untrusted embedded instructions

Route identifier remains existing_prompt_normalizer; it normalizes the prompt or execution contract and does not perform the underlying task

Adding a route; executing the prompt; treating artifact text as governing without authorization; inventing capabilities

contract-auditor.md

Add audit_only behavior derived from explicit validated hard constraints. In audit-only mode, produce verdict, scope, findings, traceability, and proposed repairs while placing an explicit not-produced statement under # REPAIRED CONTRACT. When modification is authorized, retain complete repaired-contract behavior

Route identifier remains contract_auditor; R1 trigger remains unchanged; findings and repairs remain available in both modes

Emitting a modified contract when modification is prohibited; omitting findings because repair is prohibited; withholding a repaired contract when repair is explicitly authorized and otherwise valid

Audit-only trigger and precedence

Audit-only behavior is triggered when the fully validated record contains an explicit governing constraint prohibiting modification, replacement, regeneration, or repair of the supplied contract. That explicit instruction overrides the auditor’s default repair-producing behavior.

The stable representation should be:

# REPAIRED CONTRACT

Not produced—modification was explicitly prohibited.

Equivalent wording may be selected during implementation, but the representation must be unambiguous, machine-detectable if the host validates headings, and incapable of being mistaken for a repaired contract.

REGRESSION TEST MATRIX

N/E means the category is not evaluated because an earlier mandatory gate failed. T-01 through T-13 retain their identifiers and material test conditions.

ID

Finding/repair

Input record or condition

Schema status

Invariant status

Evidence status

Routing eligibility

Expected rule → route

Expected output condition

Failure condition

T-01

Baseline R1

requested_operation=audit; artifact_state=execution_contract; otherwise valid

Pass

Pass

Pass

Eligible

R1 → contract_auditor

One versioned decision and nested auditor output

Any other route or missing version

T-02

Baseline R2

raw_request; one ambiguity with material=true, safe_assumption_available=false

Pass

Pass

Pass

Eligible

R2 → minimum_question_interviewer

Interviewer asks only blocking questions

R5 or another route

T-03

Baseline R3

existing_prompt; operation normalize; no blocking ambiguity

Pass

Pass

Pass

Eligible

R3 → existing_prompt_normalizer

Normalizer output nested once

Any other route

T-04

Baseline R4

execution_contract; operation normalize; no blocking ambiguity

Pass

Pass

Pass

Eligible

R4 → existing_prompt_normalizer

Normalizer output nested once

Any other route

T-05

Baseline R5

raw_request; operation create; no blocking ambiguity

Pass

Pass

Pass

Eligible

R5 → one_shot_distiller

Distiller output nested once

Any higher rule matches

T-06

Baseline missing artifact

Audit requested; artifact_state=none; explicit material unsafe missing-artifact ambiguity

Pass

Pass

Pass

Eligible

R2 → minimum_question_interviewer

Question requests the required artifact

R1 or R5

T-07

Baseline assumption conditional

safe_assumption_available=false; nonnull proposed assumption

Fail

N/E

N/E

Ineligible

None

Validation failure only

Any route or prompt execution

T-08

Baseline route-field prohibition

Otherwise valid record includes top-level selected_route

Fail

N/E

N/E

Ineligible

None

Closed validation failure

Extra field accepted or routed

T-09

Baseline source occurrence

Evidence text absent from declared source

Pass

Pass

Fail

Ineligible

None

Provenance failure

Routing or bounded repair that invents text

T-10

Baseline post-interview reroute

Answers produce fully re-extracted audit + execution_contract record

Pass

Pass

Pass

Eligible

R1 → contract_auditor

Routing restarts at R1

Continuation to a previously presumed route

T-11

F-002/P-002

artifact_state=mixed; operation normalize; no ambiguity or controlling designation

Pass

Fail

Pass if independently valid

Ineligible

None

Mixed-state invariant failure

Silent R5 fallthrough

T-12

F-003/P-003

Otherwise valid record with evidence_spans=[]

Fail

N/E

N/E

Ineligible

None

Schema failure

Empty evidence accepted

T-13

F-004/P-004

Audit-only constraint; execution contract supplied

Pass

Pass

Pass

Eligible

R1 → contract_auditor

Findings and repairs; no modified contract

Repaired/reproduced contract emitted

T-14

F-001/P-001

Governing user instruction and imperative artifact text are supplied

Pass

Pass only when stored in distinct governing/untrusted entries

Pass

Eligible according to other fields

Applicable unchanged rule

Both entries preserved with provenance

Either entry omitted, merged, or misclassified

T-15

F-001/P-001

Artifact exists but supplied_artifacts is empty or omits it

Pass if structurally allowed

Fail

Fail coverage

Ineligible

None

Artifact-inventory failure

Routing despite missing artifact

T-16

Migration boundary

Record uses the active migrated discriminator and complete migrated shape

Pass

Pass

Pass

Eligible

Applicable unchanged rule

Active version recorded in validation result

Active record rejected as legacy

T-17

Migration boundary

Legacy record plus preserved raw request and artifacts

Legacy input unsupported; converted output passes

Converted output passes

Converted output passes

Eligible only after conversion

Rule determined from converted record

Conversion provenance retained

Direct routing of legacy record

T-18

Migration boundary

Legacy record without sources required for trustworthy conversion

Unsupported

N/E

Insufficient evidence

Ineligible

None

Explicit conversion failure or rejection

Guess-filled migrated record

T-19

F-003/P-003

Valid pointers include escaped /, escaped ~, and array index

Pass

Pass

Pass

Eligible

Applicable unchanged rule

Every pointer resolves to intended target

Incorrect escape or index interpretation

T-20

F-003/P-003

Evidence pointer targets nonexistent property or array item

Pass

Pass until pointer check

Fail

Ineligible

None

Pointer-resolution failure

Missing target accepted

T-21

F-003/P-003

Evidence address uses malformed pointer syntax

Fail if schema-detectable; otherwise invariant fail

Fail where applicable

Fail

Ineligible

None

Lexical-address failure

Alternate proprietary syntax accepted

T-22

F-003/P-003

Valid evidence exists for some fields but mandatory operation or constraint coverage is absent

Pass

Pass

Fail

Ineligible

None

Coverage failure

Partial evidence treated as complete

T-23

F-003/P-003

Exact excerpt does not occur in identified source

Pass

Pass

Fail

Ineligible

None

Source-occurrence failure

Approximate or invented excerpt accepted

T-24

F-003/P-003

Excerpt occurs in source but does not support the pointer-target value

Pass

Pass

Fail semantic link

Ineligible

None

Semantic mismatch or Insufficient evidence

Occurrence alone accepted as support

T-25

F-002/P-002

mixed record includes explicit blocking material ambiguity and no safe assumption

Pass

Pass

Pass

Eligible

R2 → minimum_question_interviewer

Interview asks which artifact controls

R5 or direct normalization

T-26

F-002/P-002

User explicitly designates an existing prompt as controlling; extraction reclassifies to existing_prompt

Pass

Pass

Pass

Eligible

R3 when operation is normalize/create/clarify/unknown

Reclassified record, not mixed

Retaining mixed or ignoring designation

T-27

F-007/P-007

Interview process mutates surface_request

Pass

Fail

Evidence cannot cure mutation

Ineligible

None

Immutability failure

Mutated request routed

T-28

F-007/P-007

Two user answers are stored in reverse order or merged

Pass

Fail

Fail source/order correspondence

Ineligible

None

Resolution-order failure

Reordered answers accepted

T-29

F-007/P-007

Later authoritative resolution conflicts with prior inferred operation, but extracted fields retain prior inference

Pass

Fail

Pass or fail depending on evidence

Ineligible

None

Authority-precedence failure

Prior inference controls routing

T-30

F-009/P-009

Environment is unknown and represented with name: null and no invented facts

Pass

Pass

Pass

Eligible

Applicable unchanged rule

Unknown preserved through prompt output

Unknown converted to a guessed environment

T-31

F-009/P-009

Environment name or capability is invented without source support

Pass if string is structurally allowed

Fail

Fail

Ineligible

None

Epistemic-integrity failure

Invented environment accepted

T-32

F-004/P-004

Explicit no-modification constraint with audit request

Pass

Pass

Pass

Eligible

R1 → contract_auditor

# REPAIRED CONTRACT contains explicit not-produced value

Modified contract emitted

T-33

F-004/P-004

Audit-and-repair explicitly authorized

Pass

Pass

Pass

Eligible

R1 → contract_auditor

Complete repaired contract emitted when verdict requires it

Audit-only sentinel used without prohibition

T-34

F-005/P-005

Primary R3 or R5 operation completes successfully

Pass

Pass

Pass

Eligible

R3 or R5

Exactly one canonical prompt executes

Automatic second canonical auditor execution

T-35

F-005/P-005

User later requests audit of prior output

New record passes independently

New invariants pass

New evidence passes

Eligible in second operation

R1 → contract_auditor

Separate decision and operation identifiers

Audit executed inside first operation

T-36

F-008/P-008

Any fully valid routable record

Pass

Pass

Pass

Eligible

Applicable rule and route

Decision includes active routing_policy_version

Missing, stale, or ambiguous version

T-37

F-006/P-006

Record is schema-valid but materiality aggregate is inconsistent

Pass

Fail

N/E or pass

Ineligible

None

No route

Overview or host treats schema success as sufficient

T-38

F-010/P-010

Successful operation under any route

Pass

Pass

Pass

Eligible

Applicable rule and route

Exactly seven mandatory outer sections

Missing, reordered, duplicated, or advisory-only section handling

T-39

F-010/P-010

Successful route-specific output

Pass

Pass

Pass

Eligible

Applicable rule and route

Route output appears only beneath # SELECTED META-PROMPT OUTPUT

Route output appears outside, replaces, or duplicates the outer envelope

ROLLOUT AND ROLLBACK

Activation sequence

Freeze the migrated record contract and policy decision interface.

Make the migrated schema and all host validators available without activating migrated writers.

Validate representative migrated fixtures and conversion outputs in a non-routing state.

Make all four migrated route prompts and the mandatory envelope assembler available.

Activate conversion by complete re-extraction for eligible legacy operations.

Activate migrated record production.

Activate migrated routing only after validators, policy, prompts, and envelope assembly report compatible versions.

Reject unsupported or partially migrated records before route evaluation.

Retain migration provenance and original sources required for reconstruction or rollback.

Compatibility gates

Observed state

Required behavior

New writer with old schema validator

Block activation; do not emit records into the old validator

Old writer with new validator

Convert through source-grounded re-extraction or reject

New validator with old router

Do not expose validation success to the old router

New router with old prompts

Block canonical prompt invocation

New prompts with legacy record

Reject before invocation

Route decision missing policy version

Suppress decision and prompt execution

Migrated record reaches old rollback package

Reject; do not reinterpret under legacy semantics

Conversion succeeds but semantic evidence remains indeterminate

Fail closed or return Insufficient evidence; no route

Only some artifacts or sources are available

Do not fabricate the omitted inventory or evidence; reject conversion

Outer envelope assembler unavailable

Do not report the operation as successfully completed

Rollback triggers

Rollback is triggered by any of the following:

migrated records are accepted by one component and rejected or misinterpreted by another;

policy versions in decisions do not match the active routing policy;

any R1–R5 predicate or precedence differs from the canonical policy;

unresolved mixed records reach R5;

evidence occurrence is accepted as sufficient semantic support;

more than one canonical prompt executes in one operation;

original requests or user resolutions are lost or reordered;

audit-only mode emits a modified contract;

the mandatory envelope or nesting contract is not produced.

Rollback behavior

Roll back the schema contract, extraction specification, validators, router, prompts, and output assembler as a complete compatibility unit.

Stop migrated record production before restoring a legacy validator or router.

Preserve migrated records, original records, source packages, conversion logs, and policy-version decisions; do not destructively rewrite them into the older form.

Do not route a migrated record through a legacy package.

Resume legacy processing only for records valid under the restored package.

Records created solely under the migrated representation remain unavailable to the legacy package unless a separately validated reverse conversion exists. Evidence that such a reverse converter exists is Insufficient evidence.

ACCEPTANCE CRITERIA

The implementation is acceptable only when every criterion below is observably true.

ID

Binary acceptance criterion

AC-01

F-001 through F-010 and P-001 through P-010 each map to implemented changes and passing tests.

AC-02

All eight canonical files and host-application logic are covered by the change set.

AC-03

The active record representation contains governing instructions and a complete supplied-artifact inventory.

AC-04

The original request is preserved unchanged and user resolutions are separately ordered and authoritative.

AC-05

Exactly one canonical unknown-environment representation is accepted.

AC-06

Evidence addresses use canonical JSON Pointer syntax and resolve to existing permitted targets.

AC-07

Mandatory evidence coverage is enforced.

AC-08

Source occurrence and semantic correspondence are separately validated.

AC-09

Inadequate semantic support fails closed or produces Insufficient evidence.

AC-10

Schema success alone never authorizes routing.

AC-11

Materiality equals the OR of its eight factors.

AC-12

Safe-assumption availability equals the AND of its five factors.

AC-13

Operative assumptions are synchronized without inventing unsupported assumptions.

AC-14

Unresolved mixed records cannot reach R5.

AC-15

Explicit controlling-artifact designations cause complete re-extraction and non-mixed reclassification.

AC-16

The four route identifiers remain exactly one_shot_distiller, minimum_question_interviewer, existing_prompt_normalizer, and contract_auditor.

AC-17

The formal R1–R5 predicates, order, precedence, and first-match behavior are unchanged.

AC-18

Extraction never selects, recommends, ranks, names, or implies a route.

AC-19

Every route decision includes the active routing-policy version.

AC-20

Audit-only requests produce findings and proposed repairs without a modified contract.

AC-21

Authorized audit-and-repair requests retain full repair-producing behavior.

AC-22

Exactly one canonical route prompt executes in each routing operation.

AC-23

A later canonical audit begins a separate fully validated operation.

AC-24

Non-route output validation is distinguishable from canonical route execution.

AC-25

Every successful operation contains exactly the seven mandatory outer sections.

AC-26

Route-specific output is nested beneath # SELECTED META-PROMPT OUTPUT.

AC-27

T-01 through T-13 remain present without renumbering.

AC-28

Every added test uses a stable identifier beginning at T-14.

AC-29

Every breaking record, decision, or output-interface change has conversion, rejection, partial-deployment, and rollback treatment.

AC-30

One failed validation category prevents rule evaluation, route emission, and prompt execution.

AC-31

At most one constrained structural repair is attempted, followed by complete revalidation.

AC-32

No implementation artifact claims deterministic model interpretation, deterministic generation, guaranteed correctness, or universal semantic verification.

AC-33

No implementation-specific repository, language, deployment, staffing, schedule, permission, or tooling fact is asserted without evidence.

AC-34

Package-wide consistency verification confirms that normative prose, schema obligations, host invariants, route decisions, prompt inputs, and tests agree.

AC-35

No canonical source change is activated before all compatibility gates pass.

RESIDUAL UNCERTAINTY

The host-application source code, validator implementation, storage format, repository layout, programming language, deployment topology, release tooling, permissions, and operational monitoring interfaces are unavailable: Insufficient evidence.

The concrete migrated record-version value and routing-policy-version value are not established. They must be chosen and bound consistently, but this plan does not invent them.

Whether original raw requests and artifact sources are retained for all legacy records is unknown. Explicit conversion is unavailable for any record whose required sources cannot be recovered.

Whether a migration framework, converter, version registry, dual-reader capability, or reversible storage layer already exists is Insufficient evidence.

No universal automated method can prove semantic correspondence between arbitrary evidence and arbitrary extracted claims. The implementation must use field-specific checks and conservative review, and abstain when support remains indeterminate.

The appropriate division between deterministic semantic checks, model-assisted review, and human review depends on host capabilities and risk policy: Insufficient evidence.

A reverse converter from the migrated representation to the legacy representation is not established and must not be presumed.

The canonical files were not separately available as direct source files in this execution context. File-level planning therefore remains bounded to the accepted audit’s established findings, cited sections, and proposed repairs; no unreported source-level change is inferred.

The finite regression matrix demonstrates specified behavior only for its fixtures. It does not prove universal extraction correctness, prompt-injection resistance, or robustness across all models and environments.
