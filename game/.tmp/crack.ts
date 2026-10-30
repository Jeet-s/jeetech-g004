import * as path from "path";
import { buildPuzzle, logicSolve } from "../src/game/nonogram";
const [f, id] = process.argv.slice(2);
(async () => {
  const mod = await import(path.resolve(f));
  const specs = Object.values(mod).find((v) => Array.isArray(v)) as any[];
  const spec = specs.find((s) => s.id === id);
  const base = { ...spec, crack: spec.crack ?? [] };
  const p0 = buildPuzzle(base);
  const r0 = logicSolve(p0);
  console.log("base", base.crack, r0.unique, r0.steps, r0.search.toFixed(1));
  const out: string[] = [];
  const lines = [...p0.rows.map((c, i) => ["r" + i, c] as const), ...p0.cols.map((c, i) => ["c" + i, c] as const)];
  for (const [nm, c] of lines) c.blocks.forEach((b: any, j: number) => {
    const key = `${nm}.${j}`;
    if (base.crack.includes(key) || c.smudged) return;
    const r = logicSolve(buildPuzzle({ ...base, crack: [...base.crack, key] }));
    if (r.unique) out.push(`${key}(${b.len}${"_abc"[b.color]}):${r.steps}/${r.search.toFixed(0)}`);
  });
  console.log(out.join(" "));
})();
