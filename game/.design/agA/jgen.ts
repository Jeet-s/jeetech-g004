import { buildPuzzle, logicSolve, lineCount, clueOf } from "../../src/game/nonogram";
const tops = [
`..###..
.#####.
.##.##.
.#####.`,
`..###..
.#####.
.#.#.#.
.#####.`,
`..###..
.#####.
##.####
.#####.`,
`..###..
.#####.
.####.#
.#####.`,
`.#####.
##.####
#######
.#.#.#.`,
];
const out: any[] = [];
for (const top of tops) for (const tail of [3]) {
  const W = 7;
  const shifts = [-1, 0, 1];
  const n = 3 * (tail - 1);
  for (let m = 0; m < 3 ** n; m++) {
    let k = m; const rows: string[][] = Array.from({ length: tail }, () => Array(W).fill("."));
    let ok = true;
    for (const start of [1, 3, 5]) { let c = start; rows[0][c] = "#"; for (let r = 1; r < tail; r++) { c += shifts[k % 3]; k = Math.floor(k / 3); if (c < 0 || c >= W || rows[r][c] === "#") { ok = false; break; } rows[r][c] = "#"; } if (!ok) break; }
    if (!ok) continue;
    const art = "\n" + top + "\n" + rows.map((r) => r.join("")).join("\n");
    const p = buildPuzzle({ id: "x", title: "x", palette: ["#000"], art } as any);
    let bad = false;
    for (let l = 0; l < lineCount(p); l++) { const b = clueOf(p, l).blocks; if (!b.length) { bad = true; break; } const len = l < p.h ? p.w : p.h; const s = b.reduce((a, x) => a + x.len, 0) + b.length - 1; if (s === len) { bad = true; break; } }
    if (bad) continue;
    const r = logicSolve(p); if (!r.unique || r.passes > 5 || r.firstOpen < 3) continue;
    out.push({ art, r });
  }
}
out.sort((a, b) => b.r.passes - a.r.passes || b.r.steps - a.r.steps);
console.log(out.length);
for (const o of out.slice(0, 80)) console.log(`looks ${o.r.steps} passes ${o.r.passes} open ${o.r.firstOpen}${o.art}\n`);
