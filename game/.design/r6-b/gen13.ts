import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
import { INK } from "../../src/game/types";
const sp = (art: string, extra: any) => ({ id: "x", title: "x", palette: [INK], role: "teach", mechanics: [], aha: "", art: "\n" + art, ...extra } as any);
const W = +process.argv[2] || 8, H = +process.argv[3] || 8;
const out: string[] = [];
const spotsList: [number, number][][] = [[], [[1, 1]], [[1, 2]], [[1, 1], [2, 3]], [[1, 2], [2, 4]], [[1, 3]], [[2, 2]], [[1, 1], [1, 4]], [[2, 1], [1, 3]]];
const seen = new Set<string>();
for (const capL of [0, 1]) for (const capR of [4, 5, 6]) for (const spots of spotsList) for (const s of [1, 2, 3]) for (const sw of [1, 2])
for (const x0 of [4, 5]) for (const cw of [3, 4]) for (const y0 of [3, 4, 5]) for (const dome of [0, 1]) for (const ground of [0, 1, 2, 3]) {
  if (x0 + cw > W) continue; if (s + sw > capR) continue;
  const g = Array.from({ length: H }, () => Array(W).fill("."));
  const bot = ground ? H - 2 : H - 1;
  for (let x = capL + 1; x < capR; x++) g[0][x] = "#";
  for (let y = 1; y < 3; y++) for (let x = capL; x <= capR; x++) g[y][x] = "#";
  for (const [y, x] of spots) if (x + capL <= capR) g[y][x + capL] = ".";
  for (let y = 3; y <= bot; y++) for (let x = s; x < s + sw; x++) g[y][x] = "#";
  for (let x = x0; x < x0 + cw; x++) g[y0][x] = "#";
  const sx = x0 + Math.floor((cw - 1) / 2);
  if (dome) for (let x = x0 + 1; x < x0 + cw - 1; x++) g[y0 - 1][x] = "#";
  for (let y = y0 + 1; y <= bot; y++) g[y][sx] = "#";
  if (ground === 1) for (let x = 0; x < W; x++) g[H - 1][x] = "#";
  if (ground === 2) for (let x = 0; x < W; x++) g[H - 1][x] = x >= s - 1 && x <= sx + 1 ? "#" : ".";
  if (ground === 3) { g[H - 1][s] = "#"; g[H - 1][s + sw - 1] = "#"; g[H - 1][sx] = "#"; g[H-1][0]="#"; g[H-2][0]="#"; }
  const art = g.map((r) => r.join("")).join("\n");
  if (seen.has(art)) continue; seen.add(art);
  if (g.some((r) => !r.includes("#"))) continue;
  if (Array.from({ length: W }, (_, x) => g.some((r) => r[x] === "#")).includes(false)) continue;
  for (let r = 0; r < H; r++) {
    const t = ["r" + r];
    const res = logicSolve(buildPuzzle(sp(art, { tally: t })));
    if (!res.unique || res.passes > 5 || res.firstOpen < 5) continue;
    if (logicSolve(buildPuzzle(sp(art, { smudge: t }))).unique) continue;
    console.log(`T r${r + 1} looks ${res.steps} passes ${res.passes} open ${res.firstOpen}\n${art}\n`);
  }
}
