const W = 14, H = 14, cx = 6.5, cy = 8.5; const g: string[][] = Array.from({ length: H }, () => Array(W).fill("."));
const set = (x: number, y: number, ch: string) => { x = Math.round(x); y = Math.round(y); if (x >= 0 && x < W && y >= 0 && y < H) g[y][x] = ch; };
const angs = [8, 30, 52, 74, 106, 128, 150, 172];
for (const a of angs) { const r_ = a * Math.PI / 180; const ex = Math.cos(r_), ey = -Math.sin(r_);
  for (let r = 2.5; r <= 5.0; r += 0.25) set(cx + ex * r, cy + ey * r * 1.1, "a");
  const px = cx + ex * 6.4, py = cy + ey * 6.4 * 1.1; set(px, py, "b");
  for (const [ox, oy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const X = Math.round(px)+ox, Y = Math.round(py)+oy; if (g[Y]?.[X] === ".") set(X, Y, "a"); }
}
// body
for (const y of [2,3,4,5,6,7,8,9,10]) { set(6, y, "."); set(7, y, "."); }
for (const y of [3,4,5,6]) { set(6, y, "a"); set(7, y, "a"); }
for (let y = 7; y <= 11; y++) for (let x = 5; x <= 8; x++) set(x, y, "a");
set(6, 2, "b"); set(7, 2, "b"); set(5, 12, "b"); set(8, 12, "b"); set(5,13,"b"); set(8,13,"b");
console.log(g.map((r) => r.join("")).join("\n"));
