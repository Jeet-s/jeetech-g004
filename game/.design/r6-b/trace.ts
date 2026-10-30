import * as path from "path";
import * as N from "../../src/game/nonogram";
const { buildPuzzle, startMasks, applyLine, lineIndices, lineCount } = N as any;
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const ids = process.argv.slice(3);
  const specs = (Object.values(mod).flat() as any[]).filter((s) => !ids.length || ids.includes(s.id) || ids.includes(s.title));
  for (const s of specs) {
    const p = buildPuzzle(s); const L = lineCount(p);
    let masks = startMasks(p); const when = new Array(p.w * p.h).fill(0);
    const known = (m: number) => (m & (m - 1)) === 0;
    const ln = (l: number) => (l < p.h ? `r${l + 1}` : `c${l - p.h + 1}`);
    console.log(`== ${s.id} ${s.title}`);
    for (let pass = 1; pass < 60; pass++) {
      const base = masks; const next = masks.slice(); const prod: string[] = [];
      for (let l = 0; l < L; l++) { const nx = applyLine(p, base, l); if (!nx || nx === base) continue; let g = 0; for (const i of lineIndices(p.w, p.h, l)) if (nx[i] !== base[i]) { next[i] &= nx[i]; g++; } prod.push(ln(l) + ":" + g); }
      if (!prod.length) break;
      for (let i = 0; i < next.length; i++) if (!known(masks[i]) && known(next[i])) when[i] = pass;
      console.log(` pass ${pass}: ${prod.join(" ")}`); masks = next;
    }
    for (let y = 0; y < p.h; y++) { let t = ""; for (let x = 0; x < p.w; x++) { const i = y * p.w + x; t += (p.solution[i] ? "" : "") + (when[i] ? (p.solution[i] ? String.fromCharCode(64 + when[i]) : String.fromCharCode(96 + when[i])) : "?"); } console.log("   " + t + `   r${y + 1}`); }
    console.log("   (A=ink resolved pass1, a=paper pass1, B/b pass2...)");
  }
})();
