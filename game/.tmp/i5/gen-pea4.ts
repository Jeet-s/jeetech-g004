const W = 15, H = 14; const g: string[][] = Array.from({ length: H }, () => Array(W).fill("."));
const fx = 9.5, fy = 9.5;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const dx = x - fx, dy = y - fy; const d = Math.hypot(dx, dy); const a = Math.atan2(-dy, dx) * 180 / Math.PI;
  if (d <= 7.6 && dy <= 1 && a >= -10 && a <= 170) {
    // feather spokes every 20 deg: paper between
    const k = ((a + 200) % 20); 
    g[y][x] = "a";
    if (d > 2.5 && d < 5.3 && (k > 8 && k < 12)) g[y][x] = ".";
    for (let t = 0; t <= 8; t++) { const ang = (t * 20 - 0) * Math.PI / 180; const ex = fx + 6.3 * Math.cos(ang), ey = fy - 6.3 * Math.sin(ang);
      if (Math.hypot(x - ex, y - ey) < 0.75) g[y][x] = "b"; }
  }
}
// body (teal a) with paper outline: neck & head
const body: [number, number][] = [];
const ell = (x: number, y: number) => ((x - 5) / 2.6) ** 2 + ((y - 9.5) / 2.2) ** 2 <= 1;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (ell(x, y)) body.push([x, y]);
body.push([3, 7], [3, 6], [3, 5], [3, 4], [2, 4], [2, 3], [3, 3], [2, 2], [3, 2]);
const bs = new Set(body.map(([x, y]) => x + "," + y));
for (const [x, y] of body) for (let ox = -1; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) { const X = x + ox, Y = y + oy; if (X >= 0 && X < W && Y >= 0 && Y < H && !bs.has(X + "," + Y)) g[Y][X] = "."; }
for (const [x, y] of body) g[y][x] = "a";
g[3][1] = "b"; g[0][2] = "b"; g[0][4] = "b"; g[1][3] = "b"; g[12][4] = "b"; g[13][4] = "b"; g[12][6] = "b"; g[13][6] = "b"; g[13][3]="b"; g[13][7]="b";
console.log(g.map((r) => r.join("")).join("\n"));
