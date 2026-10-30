// light local search: single/double cell flips of one spec; prints candidates meeting criteria
// npx tsx .design/r7-a/flip.ts file idx maxLooks maxPasses minOpen [depth=1] [lockRows e.g. "0,1"]
import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
import { LEVELS } from "../../src/game/levels";
const sig = (p: any) => JSON.stringify([p.rows, p.cols, p.w, p.h]);
(async () => {
  const [file, idxS, mlS, mpS, moS, depS] = process.argv.slice(2);
  const mod = await import(path.resolve(file));
  const s = (Object.values(mod).flat() as any[])[+idxS];
  const known = new Set(LEVELS.map((l) => sig(l.puzzle)));
  const rows: string[] = s.art.trim().split("\n").map((l: string) => l.trim());
  const H = rows.length, W = rows[0].length;
  const colours = s.palette.length > 1 ? [".", ..."abcdef".slice(0, s.palette.length)] : [".", "#"];
  const stamped = /[,@A-F]/.test(s.art);
  const lines = [...Array(H).keys()].map((k) => "r" + k).concat([...Array(W).keys()].map((k) => "c" + k));
  const evalArt = (g: string[][]) => {
    if (!process.env.TALLYALL) return evalArt1(g, s);
    let best: any = null;
    for (const t of lines) { const e = evalArt1(g, { ...s, tally: [t] }); if (e && (!best || e.r.steps < best.r.steps)) best = { ...e, t }; }
    return best;
  };
  const evalArt1 = (g: string[][], s: any) => {
    const art = g.map((r) => r.join("")).join("\n");
    let p; try { p = buildPuzzle({ ...s, art }); } catch { return null; }
    if (known.has(sig(p))) return null;
    const r = logicSolve(p);
    if (!r.unique) return null;
    if (r.steps > +mlS || r.passes > +mpS || r.firstOpen < +moS) return null;
    if (s.tally?.length) { const q = logicSolve(buildPuzzle({ ...s, art, tally: [], smudge: [...(s.smudge ?? []), ...s.tally] })); if (q.unique) return null; }
    if (stamped) { const q = logicSolve(buildPuzzle({ ...s, art: art.replace(/,/g, ".").replace(/@/g, "#").replace(/[A-F]/g, (c) => c.toLowerCase()) })); if (q.unique) return null; }
    return { art, r };
  };
  const g = rows.map((r) => r.split(""));
  const cells: [number, number][] = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (!/[~,@A-F]/.test(g[y][x]) && (!process.env.REG || process.env.REG.split(";").some((q) => { const [a, b, c, d] = q.split(",").map(Number); return y + 1 >= a && y + 1 <= b && x + 1 >= c && x + 1 <= d; }))) cells.push([y, x]);
  const out: { d: string; art: string; r: any }[] = [];
  const base = evalArt(g); if (base) out.push({ d: "base", ...base });
  const alts = (c: string) => colours.filter((k) => k !== c);
  for (let i = 0; i < cells.length; i++) {
    const [y, x] = cells[i]; const o = g[y][x];
    for (const a of alts(o)) {
      g[y][x] = a; const e = evalArt(g); if (e) out.push({ d: `r${y + 1}c${x + 1}=${a}`, ...e });
      if ((+(depS ?? 1)) >= 2) for (let j = i + 1; j < cells.length; j++) {
        const [y2, x2] = cells[j]; const o2 = g[y2][x2];
        for (const b of alts(o2)) { g[y2][x2] = b; const e2 = evalArt(g); if (e2) out.push({ d: `r${y + 1}c${x + 1}=${a} r${y2 + 1}c${x2 + 1}=${b}`, ...e2 }); }
        g[y2][x2] = o2;
      }
      g[y][x] = o;
    }
  }
  out.sort((a, b) => a.r.steps - b.r.steps || a.r.passes - b.r.passes);
  for (const o of out.slice(0, 25)) console.log(`${o.d} ${(o as any).t ?? ""} looks ${o.r.steps} passes ${o.r.passes} open ${o.r.firstOpen}`);
  console.log(out.length, "candidates");
})();
