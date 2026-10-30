import { LEVELS } from "../src/game/levels";
import { logicSolve } from "../src/game/nonogram";
import pt from "../.agf/playtest.json";
const want = process.argv.slice(2).map(Number);
for (const n of want) {
  const L = LEVELS[n - 1]; const s = L.spec as any; const r = logicSolve(L.puzzle);
  console.log(`\n=== L${n} isl${L.island + 1} slot${L.slot} ${s.role} id=${s.id} "${s.title}" ${L.puzzle.w}x${L.puzzle.h} pal=${JSON.stringify(s.palette)} mech=${s.mechanics.join(",")} smudge=${s.smudge ?? ""} crack=${s.crack ?? ""} casual=${(pt as any).personas.casual[n - 1]} solver ${r.steps}/${r.passes}/${r.firstOpen}`);
  console.log(s.art.trim()); console.log("aha: " + s.aha);
}
