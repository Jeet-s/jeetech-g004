import { readFileSync } from "fs";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
const parts = readFileSync(0, "utf8").split(/\n\s*\n/).filter((s) => s.trim());
const K = Number(process.argv[2] ?? 1), T = Number(process.argv[3] ?? 50);
const CH = ".#abcdef", UP = ",@ABCDEF";
function run(rows: string[]) { const p = buildPuzzle({ id: "t", title: "t", palette: Array(K).fill("#000"), art: rows.join("\n") }); return { p, r: logicSolve(p) }; }
for (const art0 of parts) {
  let rows = art0.split("\n").map((l) => l.trim()).filter(Boolean);
  for (let k = 0; k < 4; k++) {
    const x = run(rows); console.log(`search ${x.r.search.toFixed(1)} ${x.r.unique ? "OK" : "STUCK"}`); if (x.r.unique && x.r.search <= T) break;
    const cands: [number, string[]][] = [];
    for (let y = 0; y < rows.length; y++) for (let c = 0; c < rows[0].length; c++) {
      const ch = rows[y][c]; const i = CH.indexOf(ch); if (i < 0) continue;
      const nr = rows.slice(); nr[y] = nr[y].slice(0, c) + UP[i] + nr[y].slice(c + 1);
      const z = run(nr); if (!z.r.unique) continue; cands.push([z.r.search, nr]);
    }
    cands.sort((a, b) => a[0] - b[0]);
    // print top 6 options
    for (const [s, nr] of cands.slice(0, 6)) { const d: string[] = []; nr.forEach((r, y) => { for (let c = 0; c < r.length; c++) if (r[c] !== rows[y][c]) d.push(`(${y},${c})${r[c]}`); }); console.log("  opt", s.toFixed(1), d.join(" ")); }
    if (!cands.length) break; rows = cands[0][1];
  }
  console.log(rows.join("\n")); console.log();
}
