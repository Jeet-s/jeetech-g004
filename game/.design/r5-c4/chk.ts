import * as path from "path";
import { buildPuzzle, logicSolve, lineCount, clueOf, startMasks, applyLine } from "../../src/game/nonogram";
const nm = (l: number, h: number) => (l < h ? `r${l + 1}` : `c${l - h + 1}`);
const key = (l: number, h: number) => (l < h ? `r${l}` : `c${l - h}`);
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const want = process.argv[3]; const scan = process.argv.includes("scan");
  const specs = (Object.values(mod).flat() as any[]).filter((s) => !want || want === "all" || s.id === want);
  for (const s of specs) {
    const p = buildPuzzle(s); const r = logicSolve(p);
    const m0 = startMasks(p); const first: string[] = [];
    for (let l = 0; l < lineCount(p); l++) { if (clueOf(p, l).smudged) continue; const nx = applyLine(p, m0, l); if (nx && nx !== m0) first.push(nm(l, p.h)); }
    console.log(`${s.id} ${p.w}x${p.h} ${r.unique ? "OK" : "BAD(" + r.unknown + ")"} looks ${r.steps} passes ${r.passes} open ${r.firstOpen} first[${first.join(",")}]`);
    if (!r.unique) { for (let y = 0; y < p.h; y++) { let t = ""; for (let x = 0; x < p.w; x++) { const m = r.masks[y * p.w + x]; t += (m & (m - 1)) ? "?" : "x" + "abcdef"[p.solution[y*p.w+x]-1]; } } }
    const T: string[] = s.tally ?? [];
    for (const t of T) {
      const a = logicSolve(buildPuzzle({ ...s, tally: T.filter((x) => x !== t) }));
      const b = logicSolve(buildPuzzle({ ...s, tally: T.filter((x) => x !== t), smudge: [...(s.smudge ?? []), t] }));
      const L = t[0] === "r" ? +t.slice(1) : p.h + +t.slice(1);
      const c = clueOf(p, L).blocks; const tl: Record<string, number> = {}; for (const bl of c) tl["abcdef"[bl.color - 1]] = (tl["abcdef"[bl.color - 1]] ?? 0) + bl.len;
      console.log(`  tally ${nm(L, p.h)} ${JSON.stringify(tl)} runs=${c.map((bl: any) => bl.len + "abcdef"[bl.color - 1]).join(" ")} | plain: passes ${a.passes} looks ${a.steps} | smudged: ${b.unique ? "STILL UNIQUE (count unused)" : "NEEDED " + b.unknown}`);
    }
    if (scan) {
      for (let l = 0; l < lineCount(p); l++) {
        const k = key(l, p.h); if (T.includes(k) || (s.smudge ?? []).includes(k)) continue;
        const q = { ...s, tally: [...T, k] }; const a = logicSolve(buildPuzzle(q)); if (!a.unique) { if (process.argv.includes("v")) console.log(`   x ${nm(l,p.h)} bad ${a.unknown}`); continue; }
        const b = logicSolve(buildPuzzle({ ...s, smudge: [...(s.smudge ?? []), k] }));
        if (b.unique) { if (process.argv.includes("v")) console.log(`   - ${nm(l,p.h)} decorative`); continue; }
        const pp = buildPuzzle(q); const c = clueOf(pp, l).blocks;
        console.log(`   +tally ${nm(l, p.h)} runs=${c.map((bl: any) => bl.len + "abcdef"[bl.color - 1]).join(" ")} -> passes ${a.passes} looks ${a.steps} open ${a.firstOpen}`);
      }
    }
  }
})();
