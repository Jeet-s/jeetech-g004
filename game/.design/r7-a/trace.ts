// trace the greedy logic solve: each step's line, cells gained; args: file idx
import * as path from "path";
import * as N from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[])[+(process.argv[3] ?? 0)];
  const p = N.buildPuzzle(s); let masks = N.startMasks(p); const L = N.lineCount(p);
  const known = (m: number) => !(m & (m - 1));
  for (let step = 1; ; step++) {
    let best = -1, bg = 0, bm: number[] | null = null; const prod: string[] = [];
    for (let l = 0; l < L; l++) {
      if (!(N as any).lineOpen(p, masks, l) || N.clueOf(p, l).smudged) continue;
      const nx = N.applyLine(p, masks, l); if (!nx || nx === masks) continue;
      let gain = 0; for (const i of N.lineIndices(p.w, p.h, l)) if (nx[i] !== masks[i] && known(nx[i])) gain++;
      prod.push((l < p.h ? "r" + (l + 1) : "c" + (l - p.h + 1)));
      if (gain > bg || best < 0) { best = l; bg = gain; bm = nx; }
    }
    if (!bm) break;
    const cells: string[] = []; for (const i of N.lineIndices(p.w, p.h, best)) if (bm[i] !== masks[i] && known(bm[i])) cells.push(`${Math.floor(i / p.w) + 1},${(i % p.w) + 1}${bm[i] === 1 ? "." : "#"}`);
    console.log(`${step}: ${best < p.h ? "r" + (best + 1) : "c" + (best - p.h + 1)} +${bg} [${cells.join(" ")}]  productive: ${prod.join(",")}`);
    masks = bm;
  }
})();
