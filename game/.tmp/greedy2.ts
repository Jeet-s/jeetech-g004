import * as path from "path";
import { buildPuzzle, logicSolve } from "../src/game/nonogram";
const [f, id, kStr, kind] = process.argv.slice(2);
(async () => {
  const mod = await import(path.resolve(f));
  const specs = Object.values(mod).find((v) => Array.isArray(v)) as any[];
  const spec = specs.find((s: any) => s.id === id);
  let cur: string[] = [...(spec[kind === "smudge" ? "smudge" : "crack"] ?? [])];
  const mk = (c: string[]) => buildPuzzle({ ...spec, [kind === "smudge" ? "smudge" : "crack"]: c });
  for (let k = 0; k < Number(kStr); k++) {
    const p0 = mk(cur);
    const cands: string[] = [];
    if (kind === "smudge") { for (let i = 0; i < p0.h; i++) cands.push("r" + i); for (let i = 0; i < p0.w; i++) cands.push("c" + i); }
    else [...p0.rows.map((c, i) => ["r" + i, c] as const), ...p0.cols.map((c, i) => ["c" + i, c] as const)].forEach(([nm, c]) => c.blocks.forEach((_, j) => cands.push(`${nm}.${j}`)));
    const res: [string, number, number][] = [];
    for (const key of cands) { if (cur.includes(key)) continue; const r = logicSolve(mk([...cur, key])); if (r.unique) res.push([key, r.steps, r.search]); }
    res.sort((a, b) => b[1] - a[1] || b[2] - a[2]);
    console.log("top:", res.slice(0, 8).map((x) => `${x[0]}:${x[1]}/${x[2].toFixed(0)}`).join(" "));
    if (!res.length) break;
    cur.push(res[0][0]);
  }
  console.log(cur);
})();
