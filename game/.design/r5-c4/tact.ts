// tact.ts file [id] : per pass, what each tally line's own application changes (X / INK? / RECOLOR / FILL)
import * as path from "path";
import { buildPuzzle, lineCount, lineIndices, startMasks, applyLine, isKnown } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const specs = (Object.values(mod).flat() as any[]).filter((s) => !process.argv[3] || s.id === process.argv[3]);
  for (const s of specs) {
    const p = buildPuzzle(s); let masks = startMasks(p); const L = lineCount(p);
    const T = new Set((s.tally ?? []).map((k: string) => (k[0] === "r" ? +k.slice(1) : p.h + +k.slice(1))));
    const nm = (l: number) => (l < p.h ? `r${l + 1}` : `c${l - p.h + 1}`);
    const cn = (i: number) => `(${Math.floor(i / p.w) + 1},${(i % p.w) + 1})`;
    console.log(s.id);
    for (let pass = 1; pass < 40; pass++) {
      const base = masks; const next = masks.slice(); let ch = false;
      for (let l = 0; l < L; l++) { const nx = applyLine(p, base, l); if (!nx || nx === base) continue;
        const ev: string[] = [];
        for (const i of lineIndices(p.w, p.h, l)) if (nx[i] !== base[i]) { next[i] &= nx[i]; ch = true;
          if (T.has(l)) { const o = base[i], n = nx[i]; const kind = n === 1 ? "X" : !(o & 1) ? "RECOLOR" : (n & 1) ? "narrow" : isKnown(n) ? "FILL" : "INK?"; ev.push(`${cn(i)}${kind}${isKnown(n) && n !== 1 ? "abcdef"[31 - Math.clz32(n) - 1] : ""}`); } }
        if (ev.length) console.log(`  pass ${pass} ${nm(l)}: ${ev.join(" ")}`);
      }
      if (!ch) break; masks = next;
    }
  }
})();
