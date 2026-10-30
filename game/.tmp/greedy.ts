import * as path from "path";
import { buildPuzzle, logicSolve } from "../src/game/nonogram";
const [n, idx, kStr, base] = process.argv.slice(2);
(async () => {
  const mod = await import(path.resolve(`src/game/islands/isl${n}.ts`));
  const specs = Object.values(mod).find((v) => Array.isArray(v)) as any[];
  const spec = specs[Number(idx)];
  let cur: string[] = base ? base.split(",") : [];
  for (let k = 0; k < Number(kStr); k++) {
    const p0 = buildPuzzle({ ...spec, crack: cur });
    let best: [string, number] | null = null;
    const lines = [...p0.rows.map((c, i) => ["r" + i, c] as const), ...p0.cols.map((c, i) => ["c" + i, c] as const)];
    for (const [nm, c] of lines) c.blocks.forEach((b, j) => {
      const key = `${nm}.${j}`;
      if (cur.includes(key)) return;
      const r = logicSolve(buildPuzzle({ ...spec, crack: [...cur, key] }));
      if (r.unique && (!best || r.search > best[1])) best = [key, r.search];
    });
    if (!best) break;
    cur.push(best[0]);
    const r = logicSolve(buildPuzzle({ ...spec, crack: cur }));
    console.log(`${cur.join(",")} search ${r.search.toFixed(1)} steps ${r.steps} passes ${r.passes} open0 ${r.firstOpen}`);
  }
})();
