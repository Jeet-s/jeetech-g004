import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
import { ISL08 } from "../../src/game/islands/isl08";
// usage: scan.ts level mode(crack|smudge) fixedCracks(comma) fixedSmudges(comma)
const [lv, mode = "crack", fc = "", fs = ""] = process.argv.slice(2);
const spec: any = ISL08[Number(lv) - 1];
const cracks = fc ? fc.split(",") : [], smudges = fs ? fs.split(",") : [];
const base = buildPuzzle({ ...spec, crack: [], smudge: [] });
const b0 = logicSolve(buildPuzzle({ ...spec, crack: cracks, smudge: smudges }));
console.log(spec.id, `${base.w}x${base.h}`, "fixed:", b0.unique, b0.search.toFixed(1), "p", b0.passes);
const res: [number, string, number][] = [];
const lines = [...base.rows.map((c, i) => ["r" + i, c] as const), ...base.cols.map((c, i) => ["c" + i, c] as const)];
const fmt = (c: any) => c.blocks.map((b: any) => "abcdef"[b.color - 1] + b.len).join(" ");
for (const [n, c] of lines) {
  if (mode === "smudge") {
    const r = logicSolve(buildPuzzle({ ...spec, crack: cracks, smudge: [...smudges, n] }));
    if (r.unique) res.push([r.search, `${n} [${fmt(c)}]`, r.passes]);
    continue;
  }
  for (let b = 0; b < c.blocks.length; b++) {
    const cr = `${n}.${b}`;
    if (cracks.includes(cr)) continue;
    const r = logicSolve(buildPuzzle({ ...spec, crack: [...cracks, cr], smudge: smudges }));
    if (r.unique) res.push([r.search, `${cr} [${fmt(c)}]`, r.passes]);
  }
}
res.sort((a, b) => a[0] - b[0]);
console.log("ok", res.length);
const n = res.length; const pick = n <= 30 ? res : [...res.slice(0, 8), ...res.slice(Math.floor(n / 2) - 4, Math.floor(n / 2) + 4), ...res.slice(-14)];
console.log(pick.map((x) => `${x[1]} s${x[0].toFixed(1)} p${x[2]}`).join("\n"));
