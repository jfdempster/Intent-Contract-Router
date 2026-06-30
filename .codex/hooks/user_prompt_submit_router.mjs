#!/usr/bin/env node
if (process.env.ICR_ROUTED_OPERATION === "1" && process.env.ICR_OPERATION_ID) {
  process.exit(0);
}
console.error("Intent Contract Router enforcement: direct Codex prompt rejected. Use node ./bin/icr-codex.mjs --record record.json --sources sources.json -- exec --sandbox workspace-write");
process.exit(2);
