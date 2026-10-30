const N = 15, c = 7; const g: string[][] = Array.from({ length: N }, () => Array(N).fill("."));
const R = Number(process.argv[2] ?? 5.0), DL = Number(process.argv[3] ?? 4);
// north point in local coords: along = 1..7 (up), across = -w..w
function pt(along: number, across: number, len: number, wbase: number) { // return 0 none,1 filled,2 outline
  if (along < 0 || along > len) return 0; const w = Math.floor(wbase * (len - along) / len + 0.5);
  if (Math.abs(across) > w) return 0; if (across <= 0) return 1; if (across === w || along === 0) return 2; return 0; }
const rot = [(x: number, y: number) => [x, y], (x: number, y: number) => [-y, x], (x: number, y: number) => [-x, -y], (x: number, y: number) => [y, -x]];
for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
  const dx = x - c, dy = y - c; const d = Math.hypot(dx, dy);
  if (Math.abs(d - R) < 0.5) g[y][x] = "#";
  for (const f of rot) { const [u, v] = f(dx, dy); // u across, v along (north = -v)
    const r = pt(-v, u, 7, 2.2); if (r) g[y][x] = "#"; }
  // diagonal points
  const u = (dx - dy) / Math.SQRT2, v = (dx + dy) / Math.SQRT2;
  for (const [a, b] of [[u, v], [v, -u], [-u, -v], [-v, u]]) { if (b < -0.1 && Math.abs(a) <= Math.max(0, (DL + b) * 0.35) + 0.01 && -b <= DL) g[y][x] = "#"; }
}
console.log(g.map((r) => r.join("")).join("\n"));
