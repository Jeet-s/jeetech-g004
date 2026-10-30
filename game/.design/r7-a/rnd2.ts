// random k-flips inside REG (rows a-b, cols c-d; 1-based) with the spec's own tally/stamps; criteria; prints best
// args: file idx N K maxLooks maxPasses minOpen ; env REG="a,b,c,d;..." SEED
import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
import { LEVELS } from "../../src/game/levels";
const sig = (p: any) => JSON.stringify([p.rows, p.cols, p.w, p.h]);
(async () => {
  const [file, idxS, NS, KS, mlS, mpS, moS] = process.argv.slice(2);
  const mod = await import(path.resolve(file));
  const s = (Object.values(mod).flat() as any[])[+idxS];
  const known = new Set(LEVELS.filter((l) => l.spec.id !== s.id).map((l) => sig(l.puzzle)));
  let seed = +(process.env.SEED ?? 7); const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const rows: string[] = s.art.trim().split("\n").map((l: string) => l.trim());
  const H = rows.length, W = rows[0].length;
  const colours = s.palette.length > 1 ? [".", ..."abcdef".slice(0, s.palette.length)] : [".", "#"];
  const reg = (y: number, x: number) => !process.env.REG || process.env.REG.split(";").some((q) => { const [a, b, c, d] = q.split(",").map(Number); return y + 1 >= a && y + 1 <= b && x + 1 >= c && x + 1 <= d; });
  const cells: [number, number][] = []; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (!/[~,@A-F]/.test(rows[y][x]) && reg(y, x)) cells.push([y, x]);
  const stamped = /[,@A-F]/.test(s.art);
  const seen = new Set<string>(); const res: { k: number; t: string }[] = [];
  for (let n = 0; n < +NS; n++) {
    const g = rows.map((r) => r.split(""));
    const k = 1 + Math.floor(rnd() * +KS); const d: string[] = [];
    for (let j = 0; j < k; j++) { const [y, x] = cells[Math.floor(rnd() * cells.length)]; const opts = colours.filter((c) => c !== g[y][x]); g[y][x] = opts[Math.floor(rnd() * opts.length)]; d.push(`r${y + 1}c${x + 1}=${g[y][x]}`); }
    const art = g.map((r) => r.join("")).join("\n"); if (seen.has(art)) continue; seen.add(art);
    let p; try { p = buildPuzzle({ ...s, art }); } catch { continue; }
    if (known.has(sig(p))) continue;
    const r = logicSolve(p);
    if (!r.unique || r.steps > +mlS || r.passes > +mpS || r.firstOpen < +moS) continue;
    if (s.tally?.length && logicSolve(buildPuzzle({ ...s, art, tally: [], smudge: [...(s.smudge ?? []), ...s.tally] })).unique) continue;
    if (stamped && logicSolve(buildPuzzle({ ...s, art: art.replace(/,/g, ".").replace(/@/g, "#").replace(/[A-F]/g, (c) => c.toLowerCase()) })).unique) continue;
    res.push({ k: d.length * 100 + r.steps, t: `${d.join(" ")} looks ${r.steps} passes ${r.passes} open ${r.firstOpen}\n${art}` });
  }
  res.sort((a, b) => a.k - b.k);
  console.log(res.slice(0, +(process.env.SHOW ?? 5)).map((x) => x.t).join("\n--\n")); console.log(res.length, "found");
})();
