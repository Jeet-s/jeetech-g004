import * as path from "path";
import { buildPuzzle, logicSolve, lineCount, lineIndices, clueOf, startMasks, applyLine, lineOpen } from "../../src/game/nonogram";
const nm = (p: any, l: number) => (l < p.h ? `r${l + 1}` : `c${l - p.h + 1}`);
const known = (m: number) => (m & (m - 1)) === 0;
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const only = process.argv[3];
  const specs = (Object.values(mod).flat() as any[]).filter((s) => !only || s.id === only);
  for (const s of specs) {
    const p = buildPuzzle(s);
    console.log(`== ${s.id} ${p.w}x${p.h}`);
    // per-tally-line: smudge just that one / make it plain
    for (const t of s.tally ?? []) {
      const sm = logicSolve(buildPuzzle({ ...s, tally: s.tally.filter((x: string) => x !== t), smudge: [...(s.smudge ?? []), t] }));
      const pl = logicSolve(buildPuzzle({ ...s, tally: s.tally.filter((x: string) => x !== t) }));
      const tl = Number(t.slice(1)) + (t[0] === "c" ? p.h : 0);
      const cnt = clueOf(p, tl).blocks.reduce((a: number, b: any) => a + b.len, 0);
      console.log(`  ${nm(p, tl)} tally ${cnt} (runs ${clueOf(p, tl).blocks.map((b: any) => b.len).join(" ")}): as-smudge ${sm.unique ? "UNIQUE(decor)" : "needed(" + sm.unknown + ")"}; as-plain looks ${pl.steps} passes ${pl.passes}`);
    }
    // pass trace
    let masks = startMasks(p);
    for (let pass = 1; pass < 40; pass++) {
      const start = masks; let cur = masks; const fired: string[] = [];
      for (let l = 0; l < lineCount(p); l++) {
        if (!lineOpen(p, start, l)) continue;
        const nx = applyLine(p, start, l);
        if (!nx || nx === start) continue;
        let ink = 0, x = 0;
        const nxt = cur.slice();
        for (const i of lineIndices(p.w, p.h, l)) if (nx[i] !== start[i]) { nxt[i] &= nx[i]; if (known(nx[i])) (nx[i] === 1 ? x++ : ink++); }
        cur = nxt;
        fired.push(`${clueOf(p, l).tally ? "T*" : ""}${nm(p, l)}(+${ink}/x${x})`);
        if (clueOf(p, l).tally) { const ch = (m: number) => (known(m) ? (m === 1 ? "." : "#") : "?"); const idx = lineIndices(p.w, p.h, l); console.log(`     ${nm(p, l)} before ${idx.map((i) => ch(start[i])).join("")} after ${idx.map((i) => ch(nx[i])).join("")}`); }
      }
      if (!fired.length) break;
      console.log(`  pass ${pass}: ${fired.join(" ")}`);
      if (process.env.GRID) { for (let y = 0; y < p.h; y++) { let t = "        "; for (let x = 0; x < p.w; x++) { const m = cur[y * p.w + x]; t += known(m) ? (m === 1 ? "." : "#") : "?"; } console.log(t); } }
      masks = cur;
    }
    const unk = masks.filter((m) => !known(m)).length;
    if (unk) console.log(`  STUCK ${unk}`);
  }
})();
