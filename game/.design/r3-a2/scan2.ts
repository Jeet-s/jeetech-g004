import * as path from "path";
import { buildPuzzle, logicSolve, clueOf } from "../../src/game/nonogram";
// scan2 file id k : all k-sets (1..3) of tally lines where board unique and every tally needed
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const ids = process.argv[3] === "all" ? null : process.argv[3].split(",");
  const K = Number(process.argv[4] ?? 2);
  for (const s of (Object.values(mod).flat() as any[]).filter((x) => !ids || ids.includes(x.id))) {
    const p = buildPuzzle({ ...s, tally: [] });
    const plain = logicSolve(p);
    const names = [...Array.from({ length: p.h }, (_, i) => "r" + i), ...Array.from({ length: p.w }, (_, i) => "c" + i)];
    const nm = (L: string) => { const li = Number(L.slice(1)) + (L[0] === "c" ? p.h : 0); const b = clueOf(p, li).blocks; return `${L[0]}${Number(L.slice(1)) + 1}=${b.reduce((a: number, x: any) => a + x.len, 0)}(${b.map((x: any) => x.len).join(" ")})`; };
    const res: [number, string][] = [];
    const ok = (T: string[]) => {
      const r = logicSolve(buildPuzzle({ ...s, tally: T }));
      if (!r.unique) return;
      if (process.env.JOINT) { const q = logicSolve(buildPuzzle({ ...s, tally: [], smudge: [...(s.smudge ?? []), ...T] })); if (q.unique) return; }
      else for (const t of T) { const q = logicSolve(buildPuzzle({ ...s, tally: T.filter((x) => x !== t), smudge: [...(s.smudge ?? []), t] })); if (q.unique) return; }
      res.push([r.steps, `${T.map(nm).join(" + ")}  looks ${r.steps} passes ${r.passes} open ${r.firstOpen}`]);
    };
    const n = names.length;
    for (let a = 0; a < n; a++) { if (K === 1) ok([names[a]]); else for (let b = a + 1; b < n; b++) { if (K === 2) ok([names[a], names[b]]); else for (let c = b + 1; c < n; c++) ok([names[a], names[b], names[c]]); } }
    console.log(`== ${s.id} ${p.w}x${p.h} plain ${plain.unique ? "OK" : "BAD"} looks ${plain.steps} passes ${plain.passes}: ${res.length} sets`);
    res.sort((x, y) => y[0] - x[0]).slice(0, Number(process.argv[5] ?? 12)).forEach((r) => console.log("  " + r[1]));
  }
})();
