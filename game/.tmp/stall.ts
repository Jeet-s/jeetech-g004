import * as path from "path";
import { buildPuzzle, logicSolve, isKnown, maskValue } from "../src/game/nonogram";
const [f, id, nosm] = process.argv.slice(2);
(async () => {
  const mod = await import(path.resolve(f));
  const specs = Object.values(mod).find((v) => Array.isArray(v)) as any[];
  const spec = specs.find((s) => s.id === id);
  const p = buildPuzzle(nosm ? { ...spec, smudge: [] } : spec);
  const r = logicSolve(p);
  console.log(r.unique, r.unknown);
  for (let y = 0; y < p.h; y++) {
    let s = "";
    for (let x = 0; x < p.w; x++) { const m = r.masks[y * p.w + x]; s += isKnown(m) ? ".#abcdef"[maskValue(m) === 0 ? 0 : maskValue(m) + (p.palette.length > 1 ? 1 : 0)] : "?"; }
    console.log(s);
  }
})();
