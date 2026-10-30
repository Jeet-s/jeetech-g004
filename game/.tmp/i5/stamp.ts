import { readFileSync } from "fs";
import { buildPuzzle, logicSolve, isKnown } from "../../src/game/nonogram";
const parts = readFileSync(0, "utf8").split(/\n\s*\n/).filter((s) => s.trim());
const K = Number(process.argv[2] ?? 1);
const CH = ".#abcdef", UP = ",@ABCDEF";
function run(art: string) { try { const p = buildPuzzle({ id: "t", title: "t", palette: Array(K).fill("#000"), art }); return { p, r: logicSolve(p) }; } catch (e) { return null; } }
for (const art0 of parts) {
  let rows = art0.split("\n").map((l) => l.trim()).filter(Boolean);
  for (let round = 0; round < 8; round++) {
    const x = run(rows.join("\n"))!; if (x.r.unique) break;
    const w = x.p.w; let best: string[] | null = null, bu = x.r.unknown, bs = 1e9;
    x.r.masks.forEach((m, i) => {
      if (isKnown(m)) return; const y = Math.floor(i / w), c = i % w; const ch = rows[y][c];
      const o = UP[CH.indexOf(ch)]; const nr = rows.slice(); nr[y] = nr[y].slice(0, c) + o + nr[y].slice(c + 1);
      const z = run(nr.join("\n")); if (!z) return; const u = z.r.unique ? 0 : z.r.unknown;
      if (u < bu || (u === bu && z.r.search > bs)) { bu = u; bs = z.r.search; best = nr; }
    });
    if (!best) break; rows = best;
  }
  const x = run(rows.join("\n"))!;
  console.log(`${x.p.w}x${x.p.h} ${x.r.unique ? "OK" : "STUCK " + x.r.unknown} steps ${x.r.steps} passes ${x.r.passes} search ${x.r.search.toFixed(1)} open0 ${x.r.firstOpen}`);
  console.log(rows.join("\n")); console.log();
}
