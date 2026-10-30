import * as path from "path";
import { buildPuzzle, startMasks, applyLine, lineCount, lineIndices, isKnown, clueOf, maskValue } from "../src/game/nonogram";
const [f, id, nStr] = process.argv.slice(2);
(async () => {
  const mod = await import(path.resolve(f));
  const specs = Object.values(mod).find((v) => Array.isArray(v)) as any[];
  const spec = specs.find((s) => s.id === id);
  const p = buildPuzzle(spec);
  const enc = (l: number) => { const c = clueOf(p, l); return c.smudged ? "~" : c.blocks.map((b) => `${b.hidden ? "?" : b.len}${"_abcdef"[b.color]}`).join(" "); };
  for (let r = 0; r < p.h; r++) console.log(`row${r + 1}: ${enc(r)}`);
  for (let c = 0; c < p.w; c++) console.log(`col${c + 1}: ${enc(p.h + c)}`);
  let m = startMasks(p);
  const N = Number(nStr ?? 8);
  for (let s = 0; s < N; s++) {
    let best = -1, bg = 0, bm: number[] | null = null; const prods: string[] = [];
    for (let l = 0; l < lineCount(p); l++) {
      if (clueOf(p, l).smudged) continue;
      const nx = applyLine(p, m, l); if (!nx || nx === m) continue;
      let g = 0; for (const i of lineIndices(p.w, p.h, l)) if (nx[i] !== m[i] && isKnown(nx[i])) g++;
      if (g > 0) prods.push(`${l < p.h ? "r" + (l + 1) : "c" + (l - p.h + 1)}:${g}`);
      if (g > bg) { bg = g; best = l; bm = nx; }
    }
    if (!bm) break;
    const nm = best < p.h ? "row " + (best + 1) : "col " + (best - p.h + 1);
    const cells = lineIndices(p.w, p.h, best).filter((i) => bm![i] !== m[i] && isKnown(bm![i])).map((i) => `${best < p.h ? "c" + ((i % p.w) + 1) : "r" + (Math.floor(i / p.w) + 1)}=${"._abcdef"[maskValue(bm![i]) + 1]}`);
    console.log(`step ${s + 1}: ${nm} (+${bg}) ${cells.join(" ")}   | settling lines: ${prods.join(" ")}`);
    m = bm;
  }
})();
