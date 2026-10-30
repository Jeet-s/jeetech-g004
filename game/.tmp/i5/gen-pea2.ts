const W = 14, H = 14, cx = 6.5, cy = 7.4;
const body = new Set<string>(); const add = (x: number, y: number) => body.add(x + "," + y);
// head rows 2-3, neck rows 4-6, body rows 7-11 (cols 5-8), legs 12-13
for (const y of [2, 3, 4, 5, 6]) { add(6, y); add(7, y); }
for (let y = 7; y <= 11; y++) for (let x = 5; x <= 8; x++) add(x, y);
const g: string[] = [];
for (let y = 0; y < H; y++) { let s = "";
  for (let x = 0; x < W; x++) {
    let ch = ".";
    const dx = x - cx, dy = (y - cy) * 1.05; const d = Math.hypot(dx, dy);
    if (y <= 11 && d <= 7.4) ch = "a";
    // eyespots
    const r = d, ang = Math.atan2(-dy, dx) * 180 / Math.PI;
    if (ch === "a") { for (const [R, step, off] of [[6.0, 30, 15], [3.6, 45, 0]] as const) { if (Math.abs(r - R) < 0.6) { const k = ((ang - off) % step + step) % step; if (k < 9 || k > step - 9) ch = "b"; } } }
    // body outline (paper) around body
    let near = false; for (let ox = -1; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) if (body.has((x + ox) + "," + (y + oy))) near = true;
    if (near) ch = ".";
    if (body.has(x + "," + y)) ch = "a";
    if (y >= 12 && (x === 5 || x === 8)) ch = "b";
    s += ch; }
  g.push(s); }
g[2] = g[2].slice(0, 5) + "b" + g[2].slice(6); // beak
console.log(g.join("\n"));
