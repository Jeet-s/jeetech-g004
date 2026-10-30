// flips (depth 1/2, optional REG) that make the base logic-stuck, then a single stamp fixes it. args: file idx maxLooks maxPasses minOpen depth
import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
import { LEVELS } from "../../src/game/levels";
const sig = (p: any) => JSON.stringify([p.rows, p.cols, p.w, p.h]);
(async () => {
  const [file, idxS, mlS, mpS, moS, depS] = process.argv.slice(2);
  const mod = await import(path.resolve(file));
  const s = (Object.values(mod).flat() as any[])[+idxS];
  const known = new Set(LEVELS.map((l) => sig(l.puzzle)));
  const rows0: string[] = s.art.trim().split("\n").map((l: string) => l.trim());
  const H = rows0.length, W = rows0[0].length;
  const colours = s.palette.length > 1 ? [".", ..."abcdef".slice(0, s.palette.length)] : [".", "#"];
  const reg = (y: number, x: number) => !process.env.REG || process.env.REG.split(";").some((q) => { const [a, b, c, d] = q.split(",").map(Number); return y + 1 >= a && y + 1 <= b && x + 1 >= c && x + 1 <= d; });
  const cells: [number, number][] = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (!/[~,@A-F]/.test(rows0[y][x]) && reg(y, x)) cells.push([y, x]);
  const out: string[] = [];
  const tryArt = (g: string[][], d: string) => {
    const art = g.map((r) => r.join("")).join("\n");
    let p; try { p = buildPuzzle({ ...s, art }); } catch { return; }
    if (known.has(sig(p))) return;
    const base = logicSolve(p);
    if (base.unique) return;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const m = base.masks[y * W + x]; if (!(m & (m - 1))) continue;
      const ch = g[y][x]; const st = ch === "." ? "," : ch === "#" ? "@" : "abcdef".includes(ch) ? ch.toUpperCase() : null; if (!st) continue;
      const g2 = g.map((r) => r.slice()); g2[y][x] = st;
      const r = logicSolve(buildPuzzle({ ...s, art: g2.map((r) => r.join("")).join("\n") }));
      if (r.unique && r.steps <= +mlS && r.passes <= +mpS && r.firstOpen >= +moS) out.push(`${r.steps} ${d} stamp r${y + 1}c${x + 1}${st} looks ${r.steps} passes ${r.passes} open ${r.firstOpen}`);
    }
  };
  const g = rows0.map((r) => r.split(""));
  tryArt(g, "base");
  for (let i = 0; i < cells.length; i++) {
    const [y, x] = cells[i]; const o = g[y][x];
    for (const a of colours.filter((k) => k !== o)) {
      g[y][x] = a; tryArt(g, `r${y + 1}c${x + 1}=${a}`);
      if (+(depS ?? 1) >= 2) for (let j = i + 1; j < cells.length; j++) { const [y2, x2] = cells[j]; const o2 = g[y2][x2]; for (const b of colours.filter((k) => k !== o2)) { g[y2][x2] = b; tryArt(g, `r${y + 1}c${x + 1}=${a} r${y2 + 1}c${x2 + 1}=${b}`); } g[y2][x2] = o2; }
      g[y][x] = o;
    }
  }
  out.sort((a, b) => parseInt(a) - parseInt(b));
  console.log(out.slice(0, 30).join("\n")); console.log(out.length, "found");
})();
