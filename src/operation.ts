import { assembleEnvelope, renderRouteOutput, validateEnvelope } from "./envelope.js";
import { loadCanonicalPrompt } from "./prompts.js";
import { decideRoute } from "./router.js";
import { validateIntentRecord } from "./validate.js";
import type { IntentRecord, RouterOperationResult, SourcePackage } from "./types.js";
export async function runRouterOperation(recordInput: unknown, sources: SourcePackage, root = process.cwd()): Promise<RouterOperationResult> {
  const { record, validation } = validateIntentRecord(recordInput, sources);
  if (!record || !validation.ok) throw Object.assign(new Error("Intent record failed validation; no route selected"), { validation });
  const decision = decideRoute(record);
  if (!decision.routing_policy_version) throw new Error("Route decision lacks active policy version");
  const selected_prompt = await loadCanonicalPrompt(decision, root);
  if (!selected_prompt.trim()) throw new Error("Selected canonical prompt cannot be loaded");
  const route_output = renderRouteOutput(record, decision);
  const envelope = assembleEnvelope(record, validation, decision, route_output);
  if (!validateEnvelope(envelope)) throw new Error("Mandatory seven-section envelope cannot be assembled");
  return { record: record as IntentRecord, validation, decision, executed_prompt_count: 1, selected_prompt, route_output, envelope };
}
