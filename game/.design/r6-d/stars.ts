import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
const NIGHT = "#2B3A67", GOLD = "#E3A83B";
// hat body with gold band; random gold stars on paper cells not touching the hat; test single tallies
const body = `
..........
......a...
.....aa...
....aaa...
...aaaba..
...aaaaa..
..abaaaa..
.aaaaaaaa.
bbbbbbbbbb`.trim().split("\n");
const H = body.length, W = body[0].length;
const near = (g: string[][], y: number, x: number) => { for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const c = g[y + dy]?.[x + dx]; if (c && c !== ".") return true; } return false; };
let found = 0; const seen = new Set<string>();
for (let it = 0; it < 4000 && found < 12; it++) {
  const g = body.map((r) => r.split(""));
  const n = 3 + Math.floor(Math.random() * 3);
  for (let k = 0; k < n; k++) { for (let t = 0; t < 50; t++) { const y = Math.floor(Math.random() * 7), x = Math.floor(Math.random() * W); if (g[y][x] === "." && !near(g, y, x)) { g[y][x] = "b"; break; } } }
  // a 2-star: sometimes extend
  const art = g.map((r) => r.join("")).join("\n"); if (seen.has(art)) continue; seen.add(art);
  const s: any = { id: "x", palette: [NIGHT, GOLD], art: "\n" + art };
  for (let l = 0; l < W + H; l++) {
    const t = l < H ? `r${l}` : `c${l - H}`;
    const r = logicSolve(buildPuzzle({ ...s, tally: [t] })); if (!r.unique || r.passes > 4 || r.passes < 3) continue;
    const q = logicSolve(buildPuzzle({ ...s, smudge: [t] })); if (q.unique || q.unknown < 4) continue;
    const pl = logicSolve(buildPuzzle(s)); if (!pl.unique) continue;
    console.log(`tally ${l < H ? "row " + (l + 1) : "col " + (l - H + 1)} looks ${r.steps} passes ${r.passes} open ${r.firstOpen} need${q.unknown} plain ${pl.steps}/${pl.passes}\n${art}\n`); found++;
  }
}
