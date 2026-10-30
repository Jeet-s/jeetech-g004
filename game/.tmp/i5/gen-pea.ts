const W = 14, H = 14, cx = 6.5, cy = 10.5; const g: string[][] = [];
for (let y = 0; y < H; y++) { g.push([]); for (let x = 0; x < W; x++) {
  const dx = x - cx, dy = cy - y; const d = Math.hypot(dx, dy); const a = Math.atan2(dy, dx) * 180 / Math.PI;
  let ch = ".";
  if (dy > -0.6) {
    if (d > 6.0 && d <= 7.0) ch = "#";
    for (let k = 0; k <= 6; k++) { const ang = k * 30 * Math.PI / 180; const ex = cx + 4.6 * Math.cos(ang), ey = cy - 4.6 * Math.sin(ang);
      const e = Math.hypot(x - ex, y - ey); if (e <= 1.2 && e > 0.5) ch = "#"; if (e <= 0.5) ch = "."; }
  }
  g[y].push(ch); } }
console.log(g.map((r) => r.join("")).join("\n"));
