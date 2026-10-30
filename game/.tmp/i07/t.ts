/// <reference types="node" />
import { readFileSync } from "fs";
import { buildPuzzle, logicSolve, isKnown } from "../../src/game/nonogram";
const parts = readFileSync(process.argv[2], "utf8").split(/\n\s*\n/).filter((s) => s.trim());
for (const part of parts) {
  const lines = part.trim().split("\n");
  const [k, sm] = lines[0].trim().split(/\s+/);
  const art = lines.slice(1).join("\n");
  const smudge = sm ? sm.split(",") : [];
  for (const s of [[], smudge]) {
    const p = buildPuzzle({ id: "t", title: "t", palette: Array(Number(k)).fill("#000"), art, smudge: s } as any);
    const r = logicSolve(p);
    console.log(`${s.join(",") || "-"} ${p.w}x${p.h} ${r.unique ? "OK" : `STUCK ${r.unknown}`} steps ${r.steps} passes ${r.passes} search ${r.search.toFixed(1)} open0 ${r.firstOpen}`);
    if (!r.unique) { const rows = art.split("\n").map((l) => l.trim()).filter(Boolean); console.log(rows.map((row, y) => [...row].map((ch, x) => (isKnown(r.masks[y * p.w + x]) ? ch : "?")).join("")).join("\n")); }
  }
}
