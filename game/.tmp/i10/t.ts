import { readFileSync } from "fs";
import { buildPuzzle, logicSolve, isKnown } from "../../src/game/nonogram";
const parts = readFileSync(process.argv[2], "utf8").split(/\n\s*\n/).filter((s) => s.trim());
for (const part of parts) {
  const lines = part.split("\n").map((l) => l.trim()).filter(Boolean);
  let smudge: string[] = [], crack: string[] = [], name = "";
  const art: string[] = [];
  for (const l of lines) {
    if (l.startsWith("S:")) smudge = l.slice(2).trim().split(/[ ,]+/).filter(Boolean);
    else if (l.startsWith("C:")) crack = l.slice(2).trim().split(/[ ,]+/).filter(Boolean);
    else if (l.startsWith("N:")) name = l.slice(2).trim();
    else art.push(l);
  }
  try {
    const p = buildPuzzle({ id: "t", title: "t", palette: Array(6).fill("#000"), art: art.join("\n"), smudge, crack });
    const r = logicSolve(p);
    let ink = 0; for (const v of p.solution) if (v) ink++;
    console.log(`${name} ${p.w}x${p.h} K${p.palette.length} ${r.unique ? "OK" : `STUCK ${r.unknown}`} steps ${r.steps} passes ${r.passes} search ${r.search.toFixed(1)} open0 ${r.firstOpen}`);
    if (!r.unique) console.log(art.map((row, y) => [...row].map((ch, x) => (isKnown(r.masks[y * p.w + x]) ? ch : "?")).join("")).join("\n"));
  } catch (e) { console.log(name, "ERR", (e as Error).message); }
}
