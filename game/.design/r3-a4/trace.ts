import * as path from "path";
import { buildPuzzle, lineCount, lineIndices, startMasks, applyLine, isKnown, maskValue } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const want = process.argv[3];
  const maxPass = +(process.argv[4] ?? 3);
  const specs = (Object.values(mod).flat() as any[]).filter((s) => !want || s.id === want);
  for (const s of specs) {
    const p = buildPuzzle(s);
    let masks = startMasks(p);
    const L = lineCount(p);
    const ch = (m: number) => (isKnown(m) ? (maskValue(m) === 0 ? "x" : p.palette.length > 1 ? "abcdef"[maskValue(m) - 1] : "#") : "?");
    console.log("==", s.id);
    for (let pass = 0; pass < maxPass; pass++) {
      const base = masks; const next = masks.slice(); let any = false;
      const notes: string[] = [];
      for (let l = 0; l < L; l++) {
        const nx = applyLine(p, base, l);
        if (!nx || nx === base) continue;
        const idx = lineIndices(p.w, p.h, l);
        const gained: string[] = [];
        idx.forEach((i, k) => { if (!isKnown(base[i]) && isKnown(nx[i])) gained.push(`${k + 1}${ch(nx[i])}`); next[i] &= nx[i]; if (nx[i] !== base[i]) any = true; });
        if (gained.length) notes.push(`${l < p.h ? "r" + (l + 1) : "c" + (l - p.h + 1)}[${gained.join(" ")}]`);
      }
      if (!any) break;
      masks = next;
      console.log(`pass ${pass + 1}: ${notes.join(" ")}`);
      for (let y = 0; y < p.h; y++) { let t = ""; for (let x = 0; x < p.w; x++) t += ch(masks[y * p.w + x]); console.log("   " + t); }
    }
  }
})();
