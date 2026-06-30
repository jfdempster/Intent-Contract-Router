export function parseJsonPointer(pointer: string): string[] {
  if (pointer === "") return [];
  if (!pointer.startsWith("/")) throw new Error("JSON Pointer must be empty or start with /");
  const raw = pointer.slice(1).split("/");
  for (const part of raw) if (/~(?![01])/.test(part)) throw new Error("JSON Pointer contains invalid escape");
  return raw.map((part) => part.replace(/~1/g, "/").replace(/~0/g, "~"));
}
export function resolveJsonPointer(document: unknown, pointer: string): unknown {
  let current: unknown = document;
  for (const part of parseJsonPointer(pointer)) {
    if (Array.isArray(current)) {
      if (!/^(0|[1-9]\d*)$/.test(part)) throw new Error(`Invalid array index ${part}`);
      const index = Number(part);
      if (index >= current.length) throw new Error(`Array index ${part} out of range`);
      current = current[index];
    } else if (current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, part)) {
      current = (current as Record<string, unknown>)[part];
    } else throw new Error(`Pointer target does not exist: ${pointer}`);
  }
  return current;
}
export function encodeJsonPointer(parts: Array<string | number>): string {
  return `/${parts.map((part) => String(part).replace(/~/g, "~0").replace(/\//g, "~1")).join("/")}`;
}
