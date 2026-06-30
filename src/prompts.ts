import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { RouteDecision } from "./types.js";
export async function loadCanonicalPrompt(decision: RouteDecision, root = process.cwd()): Promise<string> {
  return readFile(join(root, decision.canonical_prompt_path), "utf8");
}
