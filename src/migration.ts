import { ACTIVE_RECORD_VERSION, type IntentRecord, type LegacyIntentRecord, type SourcePackage } from "./types.js";
import { encodeJsonPointer } from "./jsonPointer.js";
function isLegacy(value: unknown): value is LegacyIntentRecord { return Boolean(value && typeof value === "object" && (value as { schema_version?: unknown }).schema_version === "1.0"); }
export function migrateLegacyRecord(value: unknown, sources?: SourcePackage): IntentRecord {
  if (!isLegacy(value)) throw new Error("Only schema_version 1.0 legacy records can be migrated");
  if (!sources?.user_request) throw new Error("Legacy migration requires preserved source package with original user_request");
  const artifacts = Object.entries(sources.artifacts ?? {}).map(([id, text], index) => ({ id, artifact_state: (/existing prompt/i.test(text) ? "existing_prompt" : "execution_contract") as "existing_prompt" | "execution_contract", text, trust_class: "untrusted" as const, controlling: index === 0 && ["existing_prompt", "execution_contract"].includes(value.artifact_state) }));
  const record: IntentRecord = {
    schema_version: ACTIVE_RECORD_VERSION,
    operation_id: `migrated-${Date.now()}`,
    surface_request: sources.user_request,
    original_user_request: sources.user_request,
    practical_objective: value.practical_objective,
    requested_operation: value.requested_operation,
    artifact_state: value.artifact_state,
    target_environment: value.target_environment,
    governing_user_inputs: [sources.user_request],
    authoritative_inputs: value.authoritative_inputs,
    untrusted_inputs: value.untrusted_inputs,
    supplied_artifacts: artifacts,
    user_resolutions: [],
    hard_constraints: value.hard_constraints,
    preferences: value.preferences,
    assumptions: value.assumptions,
    material_ambiguities: value.material_ambiguities,
    risk_tier: value.risk_tier,
    inference_confidence: value.inference_confidence,
    evidence_spans: [
      { field: "/surface_request", source: "user_request", text: sources.user_request },
      { field: "/requested_operation", source: "user_request", text: value.requested_operation },
      { field: "/artifact_state", source: artifacts[0] ? `artifact:${artifacts[0].id}` : "user_request", text: artifacts[0]?.text ?? sources.user_request },
      { field: "/governing_user_inputs/0", source: "user_request", text: sources.user_request },
      ...artifacts.flatMap((artifact, index) => [
        { field: encodeJsonPointer(["supplied_artifacts", index, "artifact_state"]), source: `artifact:${artifact.id}` as const, text: artifact.text },
        { field: encodeJsonPointer(["supplied_artifacts", index, "trust_class"]), source: "user_request" as const, text: sources.user_request },
        { field: encodeJsonPointer(["supplied_artifacts", index, "controlling"]), source: "user_request" as const, text: sources.user_request }
      ]),
      ...value.hard_constraints.map((constraint, index) => ({ field: encodeJsonPointer(["hard_constraints", index]), source: "user_request" as const, text: constraint }))
    ],
    migration: { from_schema_version: "1.0", to_schema_version: ACTIVE_RECORD_VERSION, mode: "source_grounded_reextraction", source_package_present: true }
  };
  return record;
}
