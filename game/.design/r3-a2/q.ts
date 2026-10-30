import { evalArt } from "./evalart";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
import { INK } from "../../src/game/types";
const K = Number(process.env.K ?? 1), joint = !!process.env.JOINT;
for (const a of process.argv.slice(2)) {
  const art = a.trim().split(/[\n\/ ]+/).join("\n");
  const r = logicSolve(buildPuzzle({ id: "q", title: "q", palette: [INK], art: "\n" + art } as any));
  if (!r.unique) { const p = buildPuzzle({ id: "q", title: "q", palette: [INK], art: "\n" + art } as any); for (let y = 0; y < p.h; y++) { let t = "     "; for (let x = 0; x < p.w; x++) { const m = r.masks[y * p.w + x]; t += (m & (m - 1)) ? "?" : p.solution[y * p.w + x] ? "#" : "."; } console.log(t); } }
  const hits = evalArt(art, K, { joint });
  console.log(`${art.split("\n").join("/")}  plain ${r.unique ? "OK" : "BAD"} L${r.steps} P${r.passes} O${r.firstOpen}  hits ${hits.length}`);
  hits.sort((x, y) => x.passes - y.passes).slice(0, Number(process.env.SHOW ?? 6)).forEach((h) => console.log(`   ${h.desc} L${h.looks} P${h.passes} O${h.open}`));
}
