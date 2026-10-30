import { readFileSync } from "fs";
import { buildPuzzle, logicSolve, isKnown } from "../../../src/game/nonogram";
const run = (rows: string[]) => logicSolve(buildPuzzle({ id: "t", title: "t", palette: ["#000"], art: rows.join("\n") } as any));
let rows = readFileSync(0, "utf8").split("\n").map((l) => l.trim()).filter(Boolean);
const lock = new Set((process.argv[2] ?? "").split(";").filter(Boolean)); // "x,y" cells not to touch
const H = rows.length, W = rows[0].length;
for (let it = 0; it < 12; it++) {
  const r = run(rows);
  if (r.unique) { console.log(`OK search ${r.search.toFixed(1)} passes ${r.passes} open0 ${r.firstOpen}`); break; }
  let best: any = null;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (isKnown(r.masks[y * W + x]) || lock.has(`${x},${y}`)) continue;
    const rr = rows.map((s) => s.split("")); rr[y][x] = rr[y][x] === "#" ? "." : "#";
    const nr = rr.map((a) => a.join(""));
    if (!nr.every((s) => s.includes("#"))) continue;
    const t = run(nr); const sc = t.unique ? -t.search : 1e6 + t.unknown;
    // prefer: unique (any), else fewest unknowns
    const key = t.unique ? -1e9 + 0 : t.unknown;
    if (!best || key < best.key || (key === best.key && sc < best.sc)) best = { key, sc, nr, d: `(${x},${y})->${rr[y][x]}` };
  }
  if (!best) break; rows = best.nr; console.log("edit", best.d, best.key < 0 ? "unique" : "unk " + best.key);
}
console.log(rows.join("\n"));
