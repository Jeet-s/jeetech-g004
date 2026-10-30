import { C } from "./draw";
const W = 18, H = 16;
const c = new C(W, H);
// left half only, then mirror
c.ell(4.2, 4.5, 4.6, 4.3, "a");
c.ell(5, 11, 3.6, 3.6, "a");
// outline: wing cell with a paper neighbour (or edge) -> b
const g0 = c.g.map((r) => r.slice());
for (let y = 0; y < H; y++) for (let x = 0; x < 9; x++) if (g0[y][x] === "a") {
  const nb = [[1,0],[-1,0],[0,1],[0,-1]].some(([dx, dy]) => { const v = g0[y + dy]?.[x + dx]; return v === undefined || v === "."; });
  if (nb) c.g[y][x] = "b";
}
// veins
for (const [x, y] of [[3,3],[4,4],[5,5],[6,6],[2,6],[3,7],[4,8],[4,10],[5,11],[6,12],[3,12]]) if (c.g[y][x] === "a") c.g[y][x] = "b";
// dots on border
for (const [x, y] of [[1,2],[0,4],[0,6],[2,1],[2,13],[1,11]]) if (c.g[y][x] === "b") c.g[y][x] = "c";
// body col 8
for (let y = 2; y < 15; y++) c.g[y][8] = "b";
c.g[0][6] = "b"; c.g[1][7] = "b";
for (let y = 0; y < H; y++) for (let x = 0; x < 9; x++) c.g[y][W - 1 - x] = c.g[y][x];
console.log("N:butterfly\n" + c.str());
