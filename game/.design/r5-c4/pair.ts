import * as path from "path";
import { buildPuzzle, logicSolve, clueOf } from "../../src/game/nonogram";
// try row+col tally pairs: unique, both NEEDED (smudging either breaks uniqueness), and neither alone-as-tally plus other-plain trivially decorative
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const want = process.argv[3];
  const specs = (Object.values(mod).flat() as any[]).filter((s) => !want || s.id === want);
  for (const s of specs) {
    const p = buildPuzzle({ ...s, tally: [] }); const r0 = logicSolve(p);
    console.log(`${s.id} ${p.w}x${p.h} plain ${r0.unique ? "OK" : "BAD"} looks ${r0.steps} passes ${r0.passes} open ${r0.firstOpen}`);
    const lines = [...Array(p.h).keys()].map((r) => "r" + r).concat([...Array(p.w).keys()].map((c) => "c" + c));
    const full = (k: string) => { const l = k[0] === "r" ? +k.slice(1) : p.h + +k.slice(1); const n = k[0] === "r" ? p.w : p.h; const bl = clueOf(p, l).blocks; const t = bl.reduce((a: number, b: any) => a + b.len, 0); return t === 0 || t === n; };
    const res: [number, string][] = [];
    for (const a of lines) if (a[0] === "r" && !full(a)) for (const b of lines) if (b[0] === "c" && !full(b)) {
      const T = [a, b]; const r = logicSolve(buildPuzzle({ ...s, tally: T })); if (!r.unique) continue;
      const na = !logicSolve(buildPuzzle({ ...s, tally: [b], smudge: [a] })).unique;
      const nb = !logicSolve(buildPuzzle({ ...s, tally: [a], smudge: [b] })).unique;
      if (!na || !nb) continue;
      const ra = logicSolve(buildPuzzle({ ...s, tally: [a] })), rb = logicSolve(buildPuzzle({ ...s, tally: [b] }));
      const sum = (k: string) => { const l = k[0] === "r" ? +k.slice(1) : p.h + +k.slice(1); const bl = clueOf(p, l).blocks; const t: Record<string, number> = {}; for (const x of bl) t["abcdef"[x.color - 1]] = (t["abcdef"[x.color - 1]] ?? 0) + x.len; return JSON.stringify(t); };
      res.push([r.passes * 100 + r.steps, `  ${a}+${b} (row ${+a.slice(1) + 1} ${sum(a)}, col ${+b.slice(1) + 1} ${sum(b)}) passes ${r.passes} looks ${r.steps} open ${r.firstOpen} | rowonly p${ra.passes} colonly p${rb.passes}`]);
    }
    res.sort((x, y) => y[0] - x[0]); console.log(res.map((x) => x[1]).join("\n"));
  }
})();
