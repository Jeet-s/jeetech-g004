import * as path from "path";
import { buildPuzzle, logicSolve } from "../src/game/nonogram";
const [n, idx, base] = process.argv.slice(2);
(async () => {
  const mod = await import(path.resolve(`src/game/islands/isl${n}.ts`));
  const specs = Object.values(mod).find((v) => Array.isArray(v)) as any[];
  const spec = specs[Number(idx)];
  const baseC: string[] = base ? base.split(",") : (spec.crack ?? []);
  const p0 = buildPuzzle({ ...spec, crack: baseC });
  const r0 = logicSolve(p0);
  console.log(`base ${baseC.join(",")} -> ${r0.unique ? "OK" : "STUCK"} search ${r0.search.toFixed(1)} steps ${r0.steps} passes ${r0.passes} open0 ${r0.firstOpen}`);
  const res: [string, number, number][] = [];
  const lines = [...p0.rows.map((c, i) => ["r" + i, c] as const), ...p0.cols.map((c, i) => ["c" + i, c] as const)];
  for (const [nm, c] of lines) c.blocks.forEach((b, k) => {
    const key = `${nm}.${k}`;
    if (baseC.includes(key)) return;
    const p = buildPuzzle({ ...spec, crack: [...baseC, key] });
    const r = logicSolve(p);
    if (r.unique) res.push([key + `(${b.len}${"abcdef"[b.color - 1]}/${c.blocks.length})`, r.search, r.firstOpen]);
  });
  res.sort((a, b) => b[1] - a[1]);
  console.log(res.slice(0, 40).map((x) => `${x[0]} s${x[1].toFixed(1)} o${x[2]}`).join("  "));
})();
