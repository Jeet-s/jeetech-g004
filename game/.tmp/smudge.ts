import * as path from "path";
import { buildPuzzle, logicSolve } from "../src/game/nonogram";
const [f, id, mode] = process.argv.slice(2);
(async () => {
  const mod = await import(path.resolve(f));
  const specs = Object.values(mod).find((v) => Array.isArray(v)) as any[];
  const spec = specs.find((s) => s.id === id);
  const base = { ...spec, smudge: mode === "add" ? spec.smudge ?? [] : [], crack: spec.crack };
  const p0 = buildPuzzle(base);
  const r0 = logicSolve(p0);
  console.log("base", base.smudge, r0.unique, r0.steps, r0.search.toFixed(1), "unknown", r0.unknown);
  const names = [...Array.from({ length: p0.h }, (_, i) => "r" + i), ...Array.from({ length: p0.w }, (_, i) => "c" + i)];
  const res: string[] = [];
  for (const n of names) {
    if (base.smudge.includes(n)) continue;
    const r = logicSolve(buildPuzzle({ ...base, smudge: [...base.smudge, n] }));
    if (r.unique) res.push(`${n}:${r.steps}/${r.search.toFixed(0)}`);
  }
  console.log(res.join(" "));
})();
