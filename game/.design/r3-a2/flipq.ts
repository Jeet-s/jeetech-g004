import { evalArt } from "./evalart";
// flipq art [nflips=1|2] : flips producing hits; env K, JOINT, MAXP, MINO, ZONE="r1-r7,c1-c8"
const art0 = process.argv[2].trim().split(/[\n\/ ]+/);
const nf = Number(process.argv[3] ?? 1);
const K = Number(process.env.K ?? 1), joint = !!process.env.JOINT;
const h = art0.length, w = art0[0].length;
const cells: [number, number][] = [];
const [ry, cx] = (process.env.ZONE ?? `1-${h},1-${w}`).split(",").map((s) => s.split("-").map(Number));
for (let y = ry[0] - 1; y < ry[1]; y++) for (let x = cx[0] - 1; x < cx[1]; x++) if (!process.env.SYM || x <= (w - 1) / 2) cells.push([y, x]);
const seen = new Set<string>();
const out: [number, string][] = [];
const tryArt = (g: string[][], lab: string) => {
  const art = g.map((r) => r.join("")).join("\n");
  if (seen.has(art)) return; seen.add(art);
  let hits; try { hits = evalArt(art, K, { joint, maxp: Number(process.env.MAXP ?? 99), mino: Number(process.env.MINO ?? 0) }); } catch { return; }
  hits = hits.filter((x) => !/=1\(/.test(x.desc) || process.env.ONE);
  if (hits.length) { hits.sort((a, b) => a.passes - b.passes); out.push([hits[0].passes, `${lab}: ${hits.slice(0, 3).map((x) => `${x.desc} L${x.looks} P${x.passes} O${x.open}`).join(" | ")}\n   ${art.split("\n").join("/")}`]); }
};
const flip1 = (g: string[][], y: number, x: number) => (g[y][x] = g[y][x] === "#" ? "." : "#");
const flip = (g: string[][], [y, x]: [number, number]) => { flip1(g, y, x); if (process.env.SYM && w - 1 - x !== x) flip1(g, y, w - 1 - x); };
tryArt(art0.map((r) => r.split("")), "none");
for (let i = 0; i < cells.length; i++) {
  const g = art0.map((r) => r.split("")); flip(g, cells[i]);
  tryArt(g, `r${cells[i][0] + 1}c${cells[i][1] + 1}`);
  if (nf >= 2) for (let j = i + 1; j < cells.length; j++) { const g2 = g.map((r) => r.slice()); flip(g2, cells[j]); tryArt(g2, `r${cells[i][0] + 1}c${cells[i][1] + 1}+r${cells[j][0] + 1}c${cells[j][1] + 1}`); }
}
out.sort((a, b) => a[0] - b[0]);
console.log(`tried ${seen.size} hits ${out.length}`);
out.slice(0, Number(process.env.SHOW ?? 15)).forEach((o) => console.log(o[1]));
