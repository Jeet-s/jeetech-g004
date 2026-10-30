import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
const NIGHT = "#2B3A67", GOLD = "#E3A83B";
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
for (let it = 0; it < 3000 && found < 10; it++) {
  const g = body.map((r) => r.split(""));
  const n = 3 + Math.floor(Math.random() * 3);
  for (let k = 0; k < n; k++) { for (let t = 0; t < 50; t++) { const y = Math.floor(Math.random() * 7), x = Math.floor(Math.random() * W); if (g[y][x] === "." && !near(g, y, x)) { g[y][x] = "b"; break; } } }
  const art = g.map((r) => r.join("")).join("\n"); if (seen.has(art)) continue; seen.add(art);
  const s: any = { id: "x", palette: [NIGHT, GOLD], art: "\n" + art };
  for (let y = 0; y < 7; y++) for (let x = 0; x < W; x++) {
    if (g[y][x] !== "b") continue;
    const T = [`r${y}`, `c${x}`];
    const r = logicSolve(buildPuzzle({ ...s, tally: T })); if (!r.unique || r.passes > 4) continue;
    const q1 = logicSolve(buildPuzzle({ ...s, tally: [T[1]], smudge: [T[0]] })); if (q1.unique) continue;
    const q2 = logicSolve(buildPuzzle({ ...s, tally: [T[0]], smudge: [T[1]] })); if (q2.unique) continue;
    console.log(`tallies row ${y + 1} col ${x + 1} looks ${r.steps} passes ${r.passes} open ${r.firstOpen} need ${q1.unknown}/${q2.unknown}\n${art}\n`); found++;
  }
}
