// npx tsx .design/r7-b/rnd.ts <file> <idx> <tally|smudge> <iters> <maxLooks> <maxPasses> [edits] [lines]
import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[])[+process.argv[3]];
  const kind = process.argv[4], iters = +process.argv[5], maxL = +process.argv[6], maxP = +process.argv[7], ne = +(process.argv[8] ?? 2);
  const only = process.argv[9] ? process.argv[9].split(",") : null;
  const rows0: string[] = s.art.trim().split("\n");
  const h = rows0.length, w = rows0[0].length;
  const syms = [".", ..."abcdef".slice(0, s.palette.length)];
  let seed = 12345; const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const seen = new Set<string>();
  for (let it = 0; it < iters; it++) {
    const g = rows0.map((r) => r.split(""));
    const k = 1 + Math.floor(rnd() * ne);
    const tag: string[] = [];
    for (let e = 0; e < k; e++) {
      const y = Math.floor(rnd() * h), x = Math.floor(rnd() * w);
      if (g[y][x] === "~") continue;
      const nb = [[0,1],[1,0],[0,-1],[-1,0]].map(([dy,dx]) => g[y+dy]?.[x+dx]).filter((v) => v && v !== g[y][x]);
      if (!nb.length) continue;
      const c = nb[Math.floor(rnd() * nb.length)] === "~" ? "." : nb[Math.floor(rnd() * nb.length)];
      g[y][x] = c; tag.push(`(${y+1},${x+1})=${c}`);
    }
    const art = g.map((r) => r.join("")).join("\n");
    if (seen.has(art)) continue; seen.add(art);
    for (let l = 0; l < w + h; l++) {
      const nm = l < h ? "r" + l : "c" + (l - h);
      const nmh = l < h ? "r" + (l + 1) : "c" + (l - h + 1);
      if (only && !only.includes(nmh)) continue;
      const sp = kind === "tally" ? { ...s, art, tally: [nm] } : { ...s, art, smudge: [nm] };
      let r; try { r = logicSolve(buildPuzzle(sp)); } catch { continue; }
      if (!r.unique || r.steps > maxL || r.passes > maxP) continue;
      if (kind === "tally") { const q = logicSolve(buildPuzzle({ ...s, art, tally: [], smudge: [nm] })); if (q.unique) continue; }
      console.log(`${tag.join(" ")} ${nmh} looks ${r.steps} passes ${r.passes} open ${r.firstOpen}\n${art}\n`);
    }
  }
})();
