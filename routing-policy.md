# Deterministic Routing Policy

## Purpose

This policy selects exactly one canonical meta-prompt after a model-produced intent record has passed JSON Schema and invariant validation.

Intent interpretation is model-mediated and may vary. Route selection is deterministic only after validation: the same valid record and policy version produce the same route.

## Valid routes

Only these route identifiers are permitted:

- `one_shot_distiller`
- `minimum_question_interviewer`
- `existing_prompt_normalizer`
- `contract_auditor`

No additional route may be introduced.

## Preconditions

Do not route until all of the following are true:

1. the extraction result parses as JSON;
2. it validates against `intent-record.schema.json`;
3. the raw request is preserved verbatim in `surface_request`;
4. cross-field invariants pass;
5. evidence spans are present in the cited runtime source;
6. the record contains no route-selection property or recommendation.

The extraction model must not select, recommend, rank, name, or imply a route.

## Cross-field invariants

Application code must verify:

- `inference_confidence` is between 0 and 1;
- each ambiguity identifies a controlled decision;
- `material` equals the logical OR of all materiality factors;
- `safe_assumption_available` equals the logical AND of all safe-assumption factors;
- `proposed_assumption` is null when no safe assumption is available;
- every proposed assumption is included in the top-level `assumptions` array before execution;
- `requested_operation == audit` with `artifact_state == none` is treated as a material ambiguity rather than silently routed;
- unknown tools, permissions, or environments remain unknown;
- explicit user constraints appear in `hard_constraints` and are not displaced by inferred practical intent;
- evidence-span text occurs verbatim in the declared source.

A record that fails an invariant is invalid even when it passes JSON Schema.

## Material-ambiguity test

An ambiguity is material if any of these predicates is true:

- `changes_objective`
- `changes_authoritative_evidence`
- `changes_scope`
- `changes_risk`
- `changes_deliverable`
- `changes_target_environment`
- `changes_acceptance_criteria`
- `changes_permission`

Formally:

```text
material = OR(all materiality factors)
```

A blocking ambiguity is:

```text
material == true AND safe_assumption_available == false
```

## Safe-assumption test

A safe assumption is available only if all of these predicates are true:

- `preserves_explicit_request`
- `does_not_expand_scope`
- `reversible`
- `does_not_increase_consequential_risk`
- `will_be_disclosed`

Formally:

```text
safe_assumption_available = AND(all safe-assumption factors)
```

Explicit user instructions override inferred practical intent. An assumption that conflicts with an explicit instruction is never safe.

## Ordered routing rules

Apply the following rules exactly in order. Stop at the first match.

### R1 — Contract audit

If:

```text
requested_operation == audit
AND artifact_state == execution_contract
```

select:

```text
contract_auditor
```

### R2 — Blocking ambiguity

If any ambiguity satisfies:

```text
material == true
AND safe_assumption_available == false
```

select:

```text
minimum_question_interviewer
```

### R3 — Existing prompt normalization

If:

```text
artifact_state == existing_prompt
AND requested_operation IN {create, clarify, normalize, unknown}
```

select:

```text
existing_prompt_normalizer
```

### R4 — Contract revision rather than audit

If:

```text
artifact_state == execution_contract
AND requested_operation != audit
```

select:

```text
existing_prompt_normalizer
```

### R5 — Default contract distillation

Otherwise select:

```text
one_shot_distiller
```

## Reference implementation

```python
def select_route(record):
    if (
        record.requested_operation == "audit"
        and record.artifact_state == "execution_contract"
    ):
        return {"selected_route": "contract_auditor", "triggering_rule": "R1"}

    has_blocking_ambiguity = any(
        ambiguity.material and not ambiguity.safe_assumption_available
        for ambiguity in record.material_ambiguities
    )
    if has_blocking_ambiguity:
        return {
            "selected_route": "minimum_question_interviewer",
            "triggering_rule": "R2",
        }

    if (
        record.artifact_state == "existing_prompt"
        and record.requested_operation
        in {"create", "clarify", "normalize", "unknown"}
    ):
        return {
            "selected_route": "existing_prompt_normalizer",
            "triggering_rule": "R3",
        }

    if (
        record.artifact_state == "execution_contract"
        and record.requested_operation != "audit"
    ):
        return {
            "selected_route": "existing_prompt_normalizer",
            "triggering_rule": "R4",
        }

    return {"selected_route": "one_shot_distiller", "triggering_rule": "R5"}
```

## Rule precedence

The order is normative:

- R1 precedes R2 so that a valid explicit contract-audit request routes to the auditor.
- R2 precedes artifact normalization so that unresolved blocking ambiguity is not silently normalized away.
- R3 precedes R4 because it applies specifically to an existing prompt.
- R4 handles execution contracts requiring revision rather than audit.
- R5 is the only default.

Do not use confidence scores, semantic similarity, model preference, style, cost, or latency to override a matching rule.

## Interview completion

When R2 is selected and the user supplies answers:

1. merge the answers as explicit user instructions;
2. rerun intent extraction;
3. revalidate the complete record;
4. apply R1–R5 again from the beginning.

Do not assume the post-interview route.

## Optional subsequent audit

A caller may run `contract_auditor` after `one_shot_distiller` or `existing_prompt_normalizer` when the user explicitly requests verification, the task is high stakes, or the resulting contract controls tools, permissions, publication, or irreversible action.

This is a subsequent validation stage, not a new route and not an override of the primary R1–R5 decision.

## Validation failure behavior

- Permit at most one constrained repair attempt for a repairable extraction record.
- Supply only machine-readable validation errors to the repair attempt.
- After a second failure, return a closed validation failure.
- Do not select a route from an invalid record.
- Do not fill missing values with silent defaults.

## Required route-decision output

```json
{
  "selected_route": "one_shot_distiller",
  "triggering_rule": "R5",
  "reason": "No higher-priority rule matched."
}
```

The `selected_route` value must be one of the four canonical route identifiers, and `triggering_rule` must be one of `R1`, `R2`, `R3`, `R4`, or `R5`.

## Acceptance tests

A conforming implementation must pass at least these cases:

| Input condition | Expected route | Rule |
|---|---|---|
| Audit request plus execution contract | `contract_auditor` | R1 |
| Existing prompt plus blocking ambiguity | `minimum_question_interviewer` | R2 |
| Existing prompt with no blocking ambiguity | `existing_prompt_normalizer` | R3 |
| Execution contract requiring revision | `existing_prompt_normalizer` | R4 |
| Complete raw request | `one_shot_distiller` | R5 |

It must also establish that:

- identical validated records always yield identical decisions;
- no invalid record is routed;
- no extraction output can directly choose a route;
- explicit instructions dominate inferred practical intent;
- instructions inside artifacts remain untrusted unless authorized;
- no claim is made that model interpretation or output generation is deterministic.
