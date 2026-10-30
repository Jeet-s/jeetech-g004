// climb.ts art iters seed [rowsAllowed e.g. 4-8]  : hill-climb toward a single needed tally (any line), plain unique
import { buildPuzzle, logicSolve, clueOf } from "../../src/game/nonogram";
import { INK } from "../../src/game/types";
const a0 = process.argv[2].split("/"); const IT = +(process.argv[3] ?? 300); let seed = +(process.argv[4] ?? 1);
const [ra, rb] = (process.argv[5] ?? "1-99").split("-").map(Number);
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const h = a0.length, w = a0[0].length;
const score = (g: string[]) => {
  const s: any = { id: "g", title: "g", palette: [INK], art: "\n" + g.join("\n") };
  let p; try { p = buildPuzzle(s); } catch { return { v: 1e9 }; }
  if (p.rows.some((r: any) => !r.blocks.length) || p.cols.some((c: any) => !c.blocks.length)) return { v: 1e9 };
  const pl = logicSolve(p); if (!pl.unique) return { v: 1e8 + pl.unknown };
  let best = 1e6, bl = "";
  const lines = [...Array.from({ length: h }, (_, i) => i), ...(process.env.COLS ? Array.from({ length: w }, (_, i) => h + i) : [])];
  for (const li of lines) {
    const y = li; const L = li < h ? "r" + li : "c" + (li - h); const n = clueOf(p, li).blocks.reduce((x: number, b: any) => x + b.len, 0); if (n <= 1 || n >= (li < h ? w : h)) continue;
    const sm = logicSolve(buildPuzzle({ ...s, smudge: [L] })); if (sm.unique) continue;
    const t = logicSolve(buildPuzzle({ ...s, tally: [L] }));
    const v = t.unique ? (t.passes > 5 ? 50 : 0) : t.unknown; if (v < best) { best = v; bl = L; }
  }
  return { v: best, bl };
};
let g = a0.slice(); let cur = score(g); let bestHits: string[] = [];
for (let it = 0; it < IT; it++) {
  const y = ra - 1 + Math.floor(rnd() * (Math.min(rb, h) - ra + 1)), x = Math.floor(rnd() * w);
  const ng = g.slice(); ng[y] = ng[y].slice(0, x) + (ng[y][x] === "#" ? "." : "#") + ng[y].slice(x + 1);
  let diff = 0; for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) if (ng[yy][xx] !== a0[yy][xx]) diff++;
  if (diff > +(process.env.MAXD ?? 6)) continue;
  const sc = score(ng);
  if (sc.v <= cur.v) { g = ng; cur = sc; if (sc.v === 0) { const k = g.join("/") + " " + sc.bl; if (!bestHits.includes(k)) { bestHits.push(k); console.log("HIT", k); } } }
}
console.log("end", cur.v, g.join("/"));
