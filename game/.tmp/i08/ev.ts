import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
import { ISL08 } from "../../src/game/islands/isl08";
const [lv, fc = "", fs = ""] = process.argv.slice(2);
const spec: any = ISL08[Number(lv) - 1];
const r = logicSolve(buildPuzzle({ ...spec, crack: fc ? fc.split(",") : [], smudge: fs ? fs.split(",") : [] }));
console.log(lv, fc, fs, r.unique, r.search.toFixed(1), "p", r.passes, "steps", r.steps);
