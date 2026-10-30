import * as path from "path";
import { buildPuzzle, logicSolve, clueOf } from "../../src/game/nonogram";
// For spec id: try adding each single line as tally on top of spec.tally; report unique + all tallies needed.
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[]).find((x) => x.id === process.argv[3]);
  const p = buildPuzzle({ ...s, tally: [] });
  const base = s.tally ?? [];
  const names = [...Array.from({ length: p.h }, (_, i) => "r" + i), ...Array.from({ length: p.w }, (_, i) => "c" + i)];
  const out: string[] = [];
  for (const L of names) {
    if (base.includes(L)) continue;
    const T = [...base, L];
    const r = logicSolve(buildPuzzle({ ...s, tally: T }));
    const li0 = Number(L.slice(1)) + (L[0] === "c" ? p.h : 0);
    const sm0 = logicSolve(buildPuzzle({ ...s, tally: base, smudge: [...(s.smudge ?? []), L] }));
    if (!r.unique) { if (!sm0.unique && process.argv[4]) out.push(`  ${L[0]}${Number(L.slice(1)) + 1} essential but tally not unique (${r.unknown})`); continue; }
    const need = T.map((t: string) => { const q = logicSolve(buildPuzzle({ ...s, tally: T.filter((x: string) => x !== t), smudge: [...(s.smudge ?? []), t] })); return q.unique ? 0 : 1; });
    if (need.every((x: number) => x)) {
      const li = Number(L.slice(1)) + (L[0] === "c" ? p.h : 0);
      const cl = clueOf(p, li).blocks.map((b: any) => b.len);
      out.push(`${L[0]}${Number(L.slice(1)) + 1}[${cl.join(" ")}] looks ${r.steps} passes ${r.passes} open ${r.firstOpen}`);
    }
  }
  console.log(out.join("\n") || "none");
})();
