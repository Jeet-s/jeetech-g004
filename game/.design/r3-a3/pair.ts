import * as path from "path";
import { buildPuzzle, logicSolve, clueOf } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const want = process.argv[3]; const minC = +(process.argv[4] ?? 2);
  const specs = (Object.values(mod).flat() as any[]).filter((s) => !want || want === "all" || s.id === want);
  for (const s of specs) {
    const p = buildPuzzle(s); const r0 = logicSolve(p);
    console.log(`${s.id} ${p.w}x${p.h} plain ${r0.unique ? "OK" : "BAD"} passes ${r0.passes} looks ${r0.steps}`);
    const base: string[] = s.tally ?? [];
    const L: string[] = []; const nm = (k: string) => k[0] + (+k.slice(1) + 1);
    for (let l = 0; l < p.w + p.h; l++) { const k = l < p.h ? "r" + l : "c" + (l - p.h); if (base.includes(k) || (s.smudge ?? []).includes(k)) continue; const nc = new Set(clueOf(p, l).blocks.map((b: any) => b.color)).size; if (nc >= minC) L.push(k); }
    const out: string[] = [];
    for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) {
      const T = [...base, L[i], L[j]];
      const a = logicSolve(buildPuzzle({ ...s, tally: T })); if (!a.unique) continue;
      const both = logicSolve(buildPuzzle({ ...s, tally: base, smudge: [...(s.smudge ?? []), L[i], L[j]] })); if (both.unique) continue;
      const n1 = !logicSolve(buildPuzzle({ ...s, tally: [...base, L[j]], smudge: [...(s.smudge ?? []), L[i]] })).unique;
      const n2 = !logicSolve(buildPuzzle({ ...s, tally: [...base, L[i]], smudge: [...(s.smudge ?? []), L[j]] })).unique;
      out.push(`${n1 && n2 ? "**" : n1 || n2 ? "* " : "  "} ${nm(L[i])}+${nm(L[j])} passes ${a.passes} looks ${a.steps}`);
    }
    out.sort().reverse(); console.log(out.slice(0, +(process.argv[5] ?? 30)).join("\n"));
  }
})();
