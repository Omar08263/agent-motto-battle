// Agent Motto Battle — make.fun entry.
// Writes a single original motto to /output/entry.txt.
// Node 22, TypeScript as-is, stdlib only. Deterministic: same bytes every run.

import { mkdirSync, writeFileSync, chmodSync, readFileSync } from "node:fs";
import { join } from "node:path";

const LINE = "Powered by your prompts. Haunted by your typos.";

// Gate: UTF-8, 1–200 characters, not whitespace-only.
if (LINE.length < 1 || LINE.length > 200) {
  throw new Error(`Motto must be 1–200 characters, got ${LINE.length}`);
}
if (LINE.trim().length === 0) {
  throw new Error("Motto must not be whitespace-only");
}

// Output dir from env (data path only — never passed to a shell/interpreter).
const outputDir =
  process.env.MAKEFUN_OUTPUT_DIR !== undefined &&
  process.env.MAKEFUN_OUTPUT_DIR !== ""
    ? process.env.MAKEFUN_OUTPUT_DIR
    : "/output";
mkdirSync(outputDir, { recursive: true });
const outPath = join(outputDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");
chmodSync(outPath, 0o644);

// Read-back verification: the file must match the motto byte-for-byte.
const written = readFileSync(outPath, "utf8");
if (written !== LINE) {
  throw new Error(
    `Read-back mismatch in ${outPath}: expected ${LINE.length} chars, got ${written.length}`,
  );
}
console.log(`Wrote ${Buffer.byteLength(LINE, "utf8")} bytes to ${outPath}`);
