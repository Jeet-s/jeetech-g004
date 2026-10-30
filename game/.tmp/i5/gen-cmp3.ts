const N = 15, c = 7; const g: string[][] = Array.from({ length: N }, () => Array(N).fill("."));
const arm: [number, number][] = [];
for (let y = -7; y <= -1; y++) arm.push([0, y]);
for (let y = -5; y <= -1; y++) arm.push([-1, y]);
for (let y = -3; y <= -1; y++) arm.push([-2, y]);
arm.push([-3, -1]);
arm.push([1, -5], [1, -4], [2, -3], [2, -2], [3, -1]);
// NE diagonal point
arm.push([3, -3], [4, -4], [5, -5], [4, -3], [3,-4]);
const ring: [number, number][] = [];
const R = Number(process.argv[2] ?? 6);
for (let y = -7; y <= 7; y++) for (let x = -7; x <= 7; x++) if (Math.abs(Math.hypot(x, y) - R) < 0.5) ring.push([x, y]);
g[c][c] = "#";
for (const [x, y] of ring) g[c + y][c + x] = "#";
for (let k = 0; k < 4; k++) for (const [x0, y0] of arm) { let x = x0, y = y0; for (let i = 0; i < k; i++) [x, y] = [-y, x]; g[c + y][c + x] = "#"; }
for (const [x, y] of [] as [number, number][]) g[c + y][c + x] = ".";
console.log(g.map((r) => r.join("")).join("\n"));
