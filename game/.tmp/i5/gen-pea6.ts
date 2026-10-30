const W = 15, H = 14, cx = 7, cy = 10.4, SY = 0.74;
const g: string[][] = Array.from({ length: H }, () => Array(W).fill("."));
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const d = Math.hypot(x - cx, (y - cy) * SY); if (y <= 10 && d <= 7.45) g[y][x] = "a"; }
const spots: [number, number][] = [];
for (const [R, angs] of [[5.9, [8, 38, 66, 90, 114, 142, 172]], [3.3, [30, 75, 105, 150]]] as const) for (const t of angs) { const an = t * Math.PI / 180; spots.push([Math.round(cx + R * Math.cos(an)), Math.round(cy - R / SY * Math.sin(an))]); }
for (const [ex, ey] of spots) for (const [ox, oy] of [[0,0],[1,0],[-1,0],[0,1],[0,-1]]) { const X = ex + ox, Y = ey + oy; if (g[Y]?.[X] === "a") g[Y][X] = (ox||oy) ? "b" : "."; }
const body: [number, number][] = [];
for (let y = 7; y <= 11; y++) for (let x = 5; x <= 9; x++) if (((x - 7) / 2.4) ** 2 + ((y - 9.4) / 2.3) ** 2 <= 1) body.push([x, y]);
for (let y = 4; y <= 7; y++) body.push([7, y]);
body.push([6, 3], [7, 3]);
const bs = new Set(body.map(([x, y]) => x + "," + y));
for (const [x, y] of body) for (let ox = -1; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) { const X = x + ox, Y = y + oy; if (X >= 0 && X < W && Y >= 0 && Y < H && !bs.has(X + "," + Y)) g[Y][X] = "."; }
for (const [x, y] of body) g[y][x] = "a";
console.log(g.map((r) => r.join("")).join("\n"));
