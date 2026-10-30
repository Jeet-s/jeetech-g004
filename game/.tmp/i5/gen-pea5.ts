const W = 15, H = 14, cx = 7, cy = 10, RR = Number(process.argv[2] ?? 7.3), RE = Number(process.argv[3] ?? 5.6);
const g: string[][] = Array.from({ length: H }, () => Array(W).fill("."));
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const d = Math.hypot(x - cx, (y - cy) * 1.15); if (y <= cy && d <= RR) g[y][x] = "a"; }
for (let t = 0; t <= 6; t++) { const an = t * 30 * Math.PI / 180; const ex = Math.round(cx + RE * Math.cos(an)), ey = Math.round(cy - RE / 1.15 * Math.sin(an));
  for (const [ox, oy] of [[0,0],[1,0],[-1,0],[0,1],[0,-1]]) { const X = ex + ox, Y = ey + oy; if (g[Y]?.[X] === "a") g[Y][X] = "b"; } }
const body: [number, number][] = [];
for (let y = 7; y <= 11; y++) for (let x = 5; x <= 9; x++) if (((x - 7) / 2.4) ** 2 + ((y - 9.2) / 2.3) ** 2 <= 1) body.push([x, y]);
for (let y = 3; y <= 7; y++) body.push([7, y]);
body.push([6, 2], [7, 2], [7, 1]);
const bs = new Set(body.map(([x, y]) => x + "," + y));
for (const [x, y] of body) for (let ox = -1; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) { const X = x + ox, Y = y + oy; if (X >= 0 && X < W && Y >= 0 && Y < H && !bs.has(X + "," + Y)) g[Y][X] = "."; }
for (const [x, y] of body) g[y][x] = "a";
g[0][7] = "b"; g[0][6] = "."; g[2][5] = "b"; g[12][6] = "b"; g[12][8] = "b"; g[13][5] = "b"; g[13][6] = "b"; g[13][8] = "b"; g[13][9] = "b";
console.log(g.map((r) => r.join("")).join("\n"));
