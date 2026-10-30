// usage: tsx t2.ts file [name]  — blocks: N:name, S:, C:, art rows
import { readFileSync } from "fs";
import { buildPuzzle, logicSolve, isKnown } from "../../src/game/nonogram";
const only = process.argv[3];
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
  if (only && name !== only) continue;
  const ws = new Set(art.map((a) => a.length));
  if (ws.size > 1) { console.log(name, "WIDTHS", art.map((a, i) => `${i}:${a.length}`).join(" ")); continue; }
  try {
    const p = buildPuzzle({ id: "t", title: "t", palette: Array(6).fill("#000"), art: art.join("\n"), smudge, crack });
    const r = logicSolve(p);
    const empty: string[] = [];
    for (let y = 0; y < p.h; y++) { let ink = 0, vd = 0; for (let x = 0; x < p.w; x++) { if (p.solution[y * p.w + x]) ink++; if (p.void[y * p.w + x]) vd++; } if (!ink && vd < p.w) empty.push("r" + y); }
    for (let x = 0; x < p.w; x++) { let ink = 0, vd = 0; for (let y = 0; y < p.h; y++) { if (p.solution[y * p.w + x]) ink++; if (p.void[y * p.w + x]) vd++; } if (!ink && vd < p.h) empty.push("c" + x); }
    console.log(`${name} ${p.w}x${p.h} K${p.palette.length} ${r.unique ? "OK" : `STUCK ${r.unknown}`} steps ${r.steps} passes ${r.passes} search ${r.search.toFixed(1)} open0 ${r.firstOpen}${empty.length ? " EMPTY " + empty.join(",") : ""}`);
    if (!r.unique) console.log(art.map((row, y) => [...row].map((ch, x) => (isKnown(r.masks[y * p.w + x]) ? ch : "?")).join("")).join("\n"));
  } catch (e) { console.log(name, "ERR", (e as Error).message); }
}
