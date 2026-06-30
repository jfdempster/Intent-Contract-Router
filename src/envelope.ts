import type { IntentRecord, RouteDecision, ValidationResult } from "./types.js";
import { explicitNoModification } from "./validate.js";
export const ENVELOPE_SECTIONS = ["# INTENT RECORD", "# VALIDATION", "# ROUTE DECISION", "# ROUTE JUSTIFICATION", "# ASSUMPTIONS", "# SELECTED META-PROMPT OUTPUT", "# RESIDUAL UNCERTAINTY"] as const;
export function renderRouteOutput(record: IntentRecord, decision: RouteDecision): string {
  if (decision.selected_route === "contract_auditor") {
    const repair = explicitNoModification(record) ? "Not produced—modification was explicitly prohibited." : "Repaired contract emitted because audit-and-repair was authorized.";
    return [`# AUDIT VERDICT`, `Route ${decision.selected_route} selected by ${decision.triggering_rule}.`, `# FINDINGS`, `Findings and traceability derive only from validated authoritative inputs.`, `# PROPOSED REPAIRS`, `Proposed repairs are advisory unless repair is authorized.`, `# REPAIRED CONTRACT`, repair, `## AUDITOR RESIDUAL UNCERTAINTY`, `None.`].join("\n");
  }
  if (decision.selected_route === "minimum_question_interviewer") return `# QUESTIONS\nAsk only blocking material ambiguity questions. Preserve original_user_request and append answers as ordered authoritative user_resolutions.`;
  if (decision.selected_route === "existing_prompt_normalizer") return `# NORMALIZED CONTRACT\nNormalize only the validated controlling prompt or execution contract. Do not execute it. Unknown environment remains ${JSON.stringify(record.target_environment)}.`;
  return `# DISTILLED CONTRACT\nProduce a reusable execution contract from validated governing inputs. Unknown environment remains ${JSON.stringify(record.target_environment)}.`;
}
export function assembleEnvelope(record: IntentRecord, validation: ValidationResult, decision: RouteDecision, routeOutput: string): string {
  const parts = [
    `${ENVELOPE_SECTIONS[0]}\n${JSON.stringify(record, null, 2)}`,
    `${ENVELOPE_SECTIONS[1]}\n${JSON.stringify(validation, null, 2)}`,
    `${ENVELOPE_SECTIONS[2]}\n${JSON.stringify(decision, null, 2)}`,
    `${ENVELOPE_SECTIONS[3]}\n${decision.triggering_rule} first matched under active R1-R5 policy ${decision.routing_policy_version}.`,
    `${ENVELOPE_SECTIONS[4]}\n${record.assumptions.length ? record.assumptions.map((a) => `- ${a}`).join("\n") : "None."}`,
    `${ENVELOPE_SECTIONS[5]}\n${routeOutput}`,
    `${ENVELOPE_SECTIONS[6]}\nNone. Insufficient evidence would have failed closed before routing.`
  ];
  return parts.join("\n\n");
}
export function validateEnvelope(envelope: string): boolean {
  const matches = [...envelope.matchAll(/^# [A-Z][A-Z -]+$/gm)].map((m) => m[0]).filter((h) => ENVELOPE_SECTIONS.includes(h as never));
  return ENVELOPE_SECTIONS.every((section, index) => matches[index] === section) && matches.length === ENVELOPE_SECTIONS.length;
}
