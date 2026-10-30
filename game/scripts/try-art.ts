/// <reference types="node" />
/** Quick check of one picture from stdin: npx tsx scripts/try-art.ts K [smudge,..] < art.txt */
import { readFileSync } from "fs";
import { buildPuzzle, logicSolve, isKnown } from "../src/game/nonogram";
const parts = readFileSync(0, "utf8").split(/\n\s*\n/).filter((s) => s.trim());
const K = Number(process.argv[2] ?? 1);
for (const art of parts) {
  const p = buildPuzzle({ id: "t", title: "t", palette: Array(K).fill("#000"), art });
  const r = logicSolve(p);
  const rows = art.split("\n").map((l) => l.trim()).filter(Boolean);
  console.log(`${p.w}x${p.h} ${r.unique ? "OK" : `STUCK ${r.unknown}`} steps ${r.steps} passes ${r.passes} search ${r.search.toFixed(1)} open0 ${r.firstOpen}`);
  if (!r.unique) console.log(rows.map((row, y) => [...row].map((ch, x) => (isKnown(r.masks[y * p.w + x]) ? ch : "?")).join("")).join("\n"));
}
