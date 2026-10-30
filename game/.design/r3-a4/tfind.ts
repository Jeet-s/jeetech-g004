// for a spec: try tally on 1 or 2 lines (from a candidate set), report OK boards where every tally line is needed
import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[]).find((x) => x.id === process.argv[3]);
  const k = +(process.argv[4] ?? 2);
  const only = process.argv[5] ? process.argv[5].split(",") : null; // lines that must be among picks
  const p0 = buildPuzzle(s);
  const lines: string[] = [];
  for (let r = 0; r < p0.h; r++) lines.push("r" + r);
  for (let c = 0; c < p0.w; c++) lines.push("c" + c);
  const smud = s.smudge ?? [];
  const cand = lines.filter((l) => !smud.includes(l));
  const res: string[] = [];
  const test = (t: string[]) => {
    if (only && !only.some((o) => t.includes(o))) return;
    const r = logicSolve(buildPuzzle({ ...s, tally: [...(s.tally ?? []), ...t] }));
    if (!r.unique) return;
    for (const l of t) { const q = logicSolve(buildPuzzle({ ...s, tally: [...(s.tally ?? []), ...t.filter((x) => x !== l)], smudge: [...smud, l] })); if (q.unique) return; }
    const name = (l: string) => (l[0] === "r" ? "r" : "c") + (+l.slice(1) + 1);
    res.push(`${t.map(name).join("+")} looks ${r.steps} passes ${r.passes} open ${r.firstOpen}`);
  };
  for (let i = 0; i < cand.length; i++) { if (k === 1) test([cand[i]]); else for (let j = i + 1; j < cand.length; j++) test([cand[i], cand[j]]); }
  console.log(res.join("\n") || "none");
})();
