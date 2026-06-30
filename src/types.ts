export const ACTIVE_RECORD_VERSION = "2.0.0" as const;
export const ACTIVE_ROUTING_POLICY_VERSION = "2026-06-30.r1-r5" as const;
export const ROUTE_IDS = ["one_shot_distiller", "minimum_question_interviewer", "existing_prompt_normalizer", "contract_auditor"] as const;
export type RouteId = (typeof ROUTE_IDS)[number];
export type RuleId = "R1" | "R2" | "R3" | "R4" | "R5";
export type RequestedOperation = "create" | "clarify" | "normalize" | "audit" | "execute" | "unknown";
export type ArtifactState = "raw_request" | "existing_prompt" | "execution_contract" | "mixed" | "none";
export type RiskTier = "ordinary" | "consequential" | "high_stakes";
export type TrustClass = "governing" | "authoritative" | "untrusted";
export interface TargetEnvironment { name: string | null; tools_known: boolean; permissions_known: boolean; }
export interface SourcePackage { user_request: string; conversation?: Record<string, string>; artifacts?: Record<string, string>; }
export interface SuppliedArtifact { id: string; artifact_state: "existing_prompt" | "execution_contract"; text: string; trust_class: TrustClass; controlling: boolean; }
export interface UserResolution { id: string; order: number; text: string; source: string; authoritative: boolean; }
export interface MaterialityFactors { changes_objective: boolean; changes_authoritative_evidence: boolean; changes_scope: boolean; changes_risk: boolean; changes_deliverable: boolean; changes_target_environment: boolean; changes_acceptance_criteria: boolean; changes_permission: boolean; }
export interface SafeAssumptionFactors { preserves_explicit_request: boolean; does_not_expand_scope: boolean; reversible: boolean; does_not_increase_consequential_risk: boolean; will_be_disclosed: boolean; }
export interface MaterialAmbiguity { id: string; issue: string; controlled_decision: string; material: boolean; materiality_factors: MaterialityFactors; safe_assumption_available: boolean; safe_assumption_factors: SafeAssumptionFactors; proposed_assumption: string | null; }
export interface EvidenceSpan { field: string; source: "user_request" | `conversation:${string}` | `artifact:${string}`; text: string; }
export interface MigrationProvenance { from_schema_version: string; to_schema_version: typeof ACTIVE_RECORD_VERSION; mode: "source_grounded_reextraction"; source_package_present: boolean; }
export interface IntentRecord { schema_version: typeof ACTIVE_RECORD_VERSION; operation_id: string; surface_request: string; original_user_request: string; practical_objective: string; requested_operation: RequestedOperation; artifact_state: ArtifactState; target_environment: TargetEnvironment; governing_user_inputs: string[]; authoritative_inputs: string[]; untrusted_inputs: string[]; supplied_artifacts: SuppliedArtifact[]; user_resolutions: UserResolution[]; hard_constraints: string[]; preferences: string[]; assumptions: string[]; material_ambiguities: MaterialAmbiguity[]; risk_tier: RiskTier; inference_confidence: number; evidence_spans: EvidenceSpan[]; migration?: MigrationProvenance; }
export interface LegacyIntentRecord { schema_version: "1.0"; surface_request: string; practical_objective: string; requested_operation: RequestedOperation; artifact_state: ArtifactState; target_environment: TargetEnvironment; authoritative_inputs: string[]; untrusted_inputs: string[]; hard_constraints: string[]; preferences: string[]; assumptions: string[]; material_ambiguities: MaterialAmbiguity[]; risk_tier: RiskTier; inference_confidence: number; evidence_spans: Array<{ field: string; source: "user_request" | "conversation" | "artifact"; text: string }>; }
export interface ValidationIssue { code: string; message: string; pointer?: string; }
export interface ValidationResult { ok: boolean; schema_version?: string; schema: ValidationIssue[]; invariants: ValidationIssue[]; evidence: ValidationIssue[]; }
export interface RouteDecision { operation_id: string; routing_policy_version: typeof ACTIVE_ROUTING_POLICY_VERSION; selected_route: RouteId; triggering_rule: RuleId; canonical_prompt_path: string; }
export interface RouterOperationResult { record: IntentRecord; validation: ValidationResult; decision: RouteDecision; executed_prompt_count: 1; selected_prompt: string; route_output: string; envelope: string; }
