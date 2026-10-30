// build isl10.ts from levels.txt
import { readFileSync, writeFileSync } from "fs";
const parts = readFileSync(__dirname + "/levels.txt", "utf8").split(/\n\s*\n/).filter((s) => s.trim());
const out: string[] = [];
for (const part of parts) {
  const lines = part.split("\n").map((l) => l.trim()).filter(Boolean);
  const h: Record<string, string> = {}; const art: string[] = [];
  for (const l of lines) { const m = /^([A-Z]+):\s?(.*)$/.exec(l); if (m) h[m[1]] = m[2]; else art.push(l); }
  const list = (s?: string) => (s ?? "").split(/[ ,]+/).filter(Boolean);
  const q = (a: string[]) => "[" + a.map((x) => JSON.stringify(x)).join(", ") + "]";
  let o = `  {\n    id: ${JSON.stringify(h.ID)}, title: ${JSON.stringify(h.T)}, palette: [${list(h.P).join(", ")}], role: ${JSON.stringify(h.R)}, mechanics: ${q(list(h.M))},\n`;
  o += `    aha: ${JSON.stringify(h.A ?? "x")},\n`;
  if (h.S) o += `    smudge: ${q(list(h.S))},\n`;
  if (h.C) o += `    crack: ${q(list(h.C))},\n`;
  o += "    art: `\n" + art.join("\n") + "`,\n  },";
  out.push(o);
}
const head = `import type { LevelSpec } from "../types";

const TEAL = "#2E8C8A", GOLD = "#E3A83B", CORAL = "#D9694F", SAGE = "#8DB48E", PLUM = "#8C6BB1", SKY = "#6FA8DC";
const PEACH = "#F2B35E", ROSE = "#E98F7A", UMBER = "#8A5A3C", CREAM = "#C9B8A0", NIGHT = "#2B3A67";

/** Island 10 — Grand Exhibit. Combines: every level mixes two or three earlier twists, up to six colours. */
export const ISL10: LevelSpec[] = [
`;
writeFileSync(__dirname + "/../../src/game/islands/isl10.ts", head + out.join("\n") + "\n];\n");
console.log("wrote", out.length);
