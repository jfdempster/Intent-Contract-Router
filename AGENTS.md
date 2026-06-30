# AGENTS.md

## Mandatory Intent Contract Router entrypoint

This repository implements the Intent Contract Router. Ordinary Codex task execution for this repo must enter through the executable router boundary, not through model-selected skills or advisory prose alone.

Use:

```bash
node ./bin/icr-codex.mjs --record record.json --sources sources.json -- exec --sandbox workspace-write
```

Do not run an implementation task directly through `codex`, `codex exec`, a skill, or a route prompt file unless the operation has already produced a valid router envelope with `ICR_ROUTED_OPERATION=1` in the environment.

## Gates

Fail closed before task execution when:

- extraction is invalid;
- record version is unsupported;
- invariant validation fails;
- evidence validation fails;
- blocking ambiguity remains unresolved except when routing to `minimum_question_interviewer`;
- route decision lacks active `routing_policy_version`;
- selected prompt cannot be loaded;
- more than one canonical route prompt would execute;
- mandatory seven-section envelope cannot be assembled.

## Commands

- `npm run check` — baseline inventory, typecheck, build, and T-01 through T-39.
- `npm test` — visible regression tests T-01 through T-39.
- `npm run build` — TypeScript compile.

## Route invariants

Preserve route identifiers exactly:

- `one_shot_distiller`
- `minimum_question_interviewer`
- `existing_prompt_normalizer`
- `contract_auditor`

Preserve R1-R5 order, precedence, and first-match behavior. Extraction must not select, recommend, rank, name, or imply a route.
