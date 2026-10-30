import { LEVELS } from "../src/game/levels";
import { buildPuzzle, logicSolve, clueOf } from "../src/game/nonogram";
const L = LEVELS[Number(process.argv[2]) - 1];
const s = L.spec;
const p0 = buildPuzzle({ ...s, crack: [] });
const base = logicSolve(p0);
console.log(`plain: looks ${base.steps} passes ${base.passes} open ${base.firstOpen}`);
for (let l = 0; l < p0.w + p0.h; l++) {
  const c = clueOf(p0, l);
  c.blocks.forEach((b, k) => {
    const tag = (l < p0.h ? "r" + l : "c" + (l - p0.h)) + "." + k;
    const r = logicSolve(buildPuzzle({ ...s, crack: [tag] }));
    if (r.unique) console.log(`${tag} (len ${b.len}) looks ${r.steps} passes ${r.passes} open ${r.firstOpen} search ${r.search.toFixed(1)}`);
  });
}
