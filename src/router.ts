import { ACTIVE_ROUTING_POLICY_VERSION, type IntentRecord, type RouteDecision } from "./types.js";
import { blockingAmbiguities } from "./validate.js";
export function decideRoute(record: IntentRecord): RouteDecision {
  if (record.requested_operation === "audit" && record.artifact_state === "execution_contract") return decision(record, "contract_auditor", "R1", "contract-auditor.md");
  if (blockingAmbiguities(record).length > 0) return decision(record, "minimum_question_interviewer", "R2", "minimum-question-interviewer.md");
  if (record.artifact_state === "existing_prompt" && ["create", "clarify", "normalize", "unknown"].includes(record.requested_operation)) return decision(record, "existing_prompt_normalizer", "R3", "existing-prompt-normalizer.md");
  if (record.artifact_state === "execution_contract" && ["create", "clarify", "normalize", "unknown"].includes(record.requested_operation)) return decision(record, "existing_prompt_normalizer", "R4", "existing-prompt-normalizer.md");
  return decision(record, "one_shot_distiller", "R5", "one-shot-distiller.md");
}
function decision(record: IntentRecord, selected_route: RouteDecision["selected_route"], triggering_rule: RouteDecision["triggering_rule"], canonical_prompt_path: string): RouteDecision {
  return { operation_id: record.operation_id, routing_policy_version: ACTIVE_ROUTING_POLICY_VERSION, selected_route, triggering_rule, canonical_prompt_path };
}
