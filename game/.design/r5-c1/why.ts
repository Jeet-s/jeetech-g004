import * as path from "path";
import { buildPuzzle, clueOf, startMasks, lineCount, lineOpen, applyLine, lineIndices } from "../../src/game/nonogram";
// why.ts file idx [maxpass] : per pass per line the cells it settles (rRcC=v)
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[])[Number(process.argv[3] ?? 0)];
  const MP = Number(process.argv[4] ?? 99);
  const p = buildPuzzle(s); const known = (m: number) => (m & (m - 1)) === 0;
  const v = (m: number) => (m === 1 ? "." : "#abcdef"[Math.log2(m)] ?? "?");
  let masks = startMasks(p);
  for (let pass = 1; pass <= MP; pass++) {
    const start = masks; let cur = masks; const out: string[] = [];
    for (let l = 0; l < lineCount(p); l++) {
      if (!lineOpen(p, start, l)) continue;
      const nx = applyLine(p, start, l); if (!nx || nx === start) continue;
      const nxt = cur.slice(); const set: string[] = [];
      for (const i of lineIndices(p.w, p.h, l)) if (nx[i] !== start[i]) { nxt[i] &= nx[i]; if (known(nx[i])) set.push(`r${Math.floor(i / p.w) + 1}c${(i % p.w) + 1}${v(nx[i])}`); }
      cur = nxt; if (set.length) out.push(`${l < p.h ? "r" + (l + 1) : "c" + (l - p.h + 1)}${clueOf(p, l).tally ? "T" : ""}: ${set.join(" ")}`);
    }
    if (cur === start) break; masks = cur;
    console.log(`pass ${pass}\n  ` + out.join("\n  "));
  }
})();
