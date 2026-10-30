import { evalArt } from "./evalart";
const W = Number(process.argv[2] ?? 8), H = 7;
const arts = new Set<string>();
function toad(g: string[][], x0: number, y0: number, cw: number, ch: number, sw: number, spots: number[], stemTo: number) {
  // cap: top row narrower by 1 each side, then ch-1 full rows; spots = x offsets of paper holes in row y0+1
  for (let r = 0; r < ch; r++) for (let x = 0; x < cw; x++) {
    if (r === 0 && ch > 1 && (x === 0 || x === cw - 1)) continue;
    const X = x0 + x, Y = y0 + r; if (X < 0 || X >= W || Y >= H) return false;
    g[Y][X] = "#";
  }
  for (const sx of spots) if (ch >= 3) g[y0 + 1][x0 + sx] = ".";
  const sx0 = x0 + Math.floor((cw - sw) / 2);
  for (let Y = y0 + ch; Y <= stemTo; Y++) for (let x = 0; x < sw; x++) g[Y][sx0 + x] = "#";
  return true;
}
const res: any[] = [];
for (let ax = 0; ax <= 1; ax++) for (const acw of [4, 5, 6]) for (const ach of [2, 3]) for (const asw of [1, 2]) for (const aspots of [[], [1], [acw - 2], [1, acw - 2]])
for (const bcw of [3, 4, 5]) for (const by of [2, 3, 4]) for (const bch of [1, 2]) for (const bsw of [1, 2]) for (const ground of ["none", "full", "base"]) for (const c of [null, ...Array.from({ length: 12 }, (_, i) => [i % 4, 3 + Math.floor(i / 4)])]) {
  const g = Array.from({ length: H }, () => Array(W).fill("."));
  const bx = W - bcw;
  if (bx < ax + acw - 1) continue;
  const bottom = ground === "full" ? H - 2 : H - 1;
  if (!toad(g, ax, 0, acw, ach, asw, ach >= 3 ? aspots : [], bottom)) continue;
  if (aspots.length && ach < 3) continue;
  if (!toad(g, bx, by, bcw, bch, bsw, [], bottom)) continue;
  if (c) { const cx = ax + acw - 1 + c[0]; if (cx + 3 > bx + 1) continue; if (!toad(g, cx, c[1], 3, 1, 1, [], bottom)) continue; }
  if (ground === "full") g[H - 1].fill("#");
  if (ground === "base") { // widen stem bases (a little mound) on the last row
    for (let x = 1; x < W - 1; x++) if (g[H - 2][x] === "#") { g[H - 1][x - 1] = "#"; g[H - 1][x + 1] = "#"; }
  }
  const art = g.map((r) => r.join("")).join("\n");
  if (arts.has(art)) continue; arts.add(art);
  try { for (const o of evalArt(art, 1, { maxp: 5, mino: 3 })) if (!/=1\(/.test(o.desc)) res.push({ ...o, art }); } catch {}
}
console.log("arts", arts.size, "hits", res.length);
res.sort((a, b) => a.passes - b.passes || a.looks - b.looks);
for (const r of res.slice(0, 15)) console.log(`${r.desc} looks ${r.looks} passes ${r.passes} open ${r.open}\n${r.art}\n`);
