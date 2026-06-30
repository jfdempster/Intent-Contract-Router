# Intent Contract Router

TypeScript implementation of the Intent Contract Router migration. The router validates a migrated intent record, checks evidence and invariants, applies the preserved R1-R5 policy in order, loads exactly one canonical route prompt, and assembles the mandatory seven-section envelope.

## Commands

```bash
npm install
npm run check
npm run build
npm test
node ./bin/icr.mjs route --record record.json --sources sources.json
node ./bin/icr-codex.mjs --record record.json --sources sources.json -- exec --sandbox workspace-write
```

`icr-codex` is the supported Codex launcher. Direct Codex prompts are advisory-only unless project hooks are trusted and enabled, so enforcement is owned by this executable path.
