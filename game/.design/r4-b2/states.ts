import * as path from "path";
import { buildPuzzle, clueOf, startMasks, lineCount, lineOpen, applyLine, lineIndices } from "../../src/game/nonogram";
// states.ts file : grid after each pass + which lines changed
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[])[Number(process.argv[3] ?? 0)];
  const p = buildPuzzle(s); const known = (m: number) => (m & (m - 1)) === 0;
  let masks = startMasks(p);
  for (let pass = 1; pass < 40; pass++) {
    const start = masks; let cur = masks; const ch: string[] = [];
    for (let l = 0; l < lineCount(p); l++) {
      if (!lineOpen(p, start, l)) continue;
      const nx = applyLine(p, start, l); if (!nx || nx === start) continue;
      const nxt = cur.slice(); let n = 0;
      for (const i of lineIndices(p.w, p.h, l)) if (nx[i] !== start[i]) { nxt[i] &= nx[i]; n++; }
      if (n) ch.push((l < p.h ? "r" + (l + 1) : "c" + (l - p.h + 1)) + (clueOf(p, l).tally ? "T" : ""));
      cur = nxt;
    }
    if (!ch.length) break; masks = cur;
    console.log(`pass ${pass}: ${ch.join(",")}`);
    for (let y = 0; y < p.h; y++) { let t = "   "; for (let x = 0; x < p.w; x++) { const m = masks[y * p.w + x]; t += known(m) ? (m === 1 ? "." : "#") : "?"; } console.log(t + "  " + (y + 1)); }
  }
})();
