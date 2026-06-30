import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { runRouterOperation } from "./operation.js";
import { migrateLegacyRecord } from "./migration.js";
const mandatory = ["Pasted markdown.md", "intent-contract-router-audit.md", "router-overview.md", "extraction.md", "one-shot-distiller.md", "minimum-question-interviewer.md", "existing-prompt-normalizer.md", "contract-auditor.md", "intent-record.schema.json", "routing-policy.md"];
async function json(path: string) { return JSON.parse(await readFile(path, "utf8")); }
export async function main(argv = process.argv.slice(2)) {
  const command = argv[0];
  if (command === "validate-baseline") {
    const missing: string[] = [];
    for (const file of mandatory) try { await readFile(file, "utf8"); } catch { missing.push(file); }
    if (missing.length) throw new Error(`Missing mandatory baseline files: ${missing.join(", ")}`);
    console.log(JSON.stringify({ ok: true, files: mandatory }, null, 2));
    return;
  }
  const recordPath = argv[argv.indexOf("--record") + 1];
  const sourcesPath = argv[argv.indexOf("--sources") + 1];
  if (!command || !recordPath || !sourcesPath) throw new Error("Usage: icr <route|codex|migrate> --record record.json --sources sources.json [-- <codex args>]");
  const record = await json(recordPath); const sources = await json(sourcesPath);
  if (command === "migrate") { console.log(JSON.stringify(migrateLegacyRecord(record, sources), null, 2)); return; }
  const result = await runRouterOperation(record, sources);
  if (command === "route") { console.log(JSON.stringify(result, null, 2)); return; }
  if (command === "codex") {
    const pass = argv.indexOf("--");
    const codexArgs = pass >= 0 ? argv.slice(pass + 1) : ["exec", "--sandbox", "workspace-write"];
    const prompt = `${result.envelope}\n\nExecute the selected meta-prompt output only. Do not run any other canonical route prompt.`;
    const child = spawnSync("codex", [...codexArgs, prompt], { stdio: "inherit", env: { ...process.env, ICR_ROUTED_OPERATION: "1", ICR_OPERATION_ID: result.record.operation_id } });
    process.exit(child.status ?? 1);
  }
  throw new Error(`Unknown command ${command}`);
}
if (import.meta.url === `file://${process.argv[1]}`) main().catch((error) => { console.error(error.message); if (error.validation) console.error(JSON.stringify(error.validation, null, 2)); process.exit(1); });
