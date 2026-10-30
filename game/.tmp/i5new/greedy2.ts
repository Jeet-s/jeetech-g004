// add stamps greedily to bring passes down to target (args: file targetPasses [maxStamps])
import { readFileSync } from "fs";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
const art = readFileSync(process.argv[2], "utf8").trim();
const target = Number(process.argv[3]); const maxS = Number(process.argv[4] ?? 4);
const solve = (a: string) => logicSolve(buildPuzzle({ id: "t", title: "t", palette: Array(6).fill("#000"), art: a }));
let rows = art.split("\n");
for (let it = 0; it < maxS; it++) {
  const r = solve(rows.join("\n")); console.log(`stamps ${it}: ${r.unique ? "OK" : "STUCK " + r.unknown} p${r.passes} s${r.search.toFixed(1)} open${r.firstOpen}`);
  if (r.unique && r.passes <= target) break;
  let best: [number, string[], string] | null = null;
  for (let y = 0; y < rows.length; y++) for (let x = 0; x < rows[0].length; x++) {
    const ch = rows[y][x]; if (!".#abcdef".includes(ch)) continue;
    const s = ch === "." ? "," : ch === "#" ? "@" : ch.toUpperCase();
    const rs = rows.map((rr, yy) => (yy === y ? rr.slice(0, x) + s + rr.slice(x + 1) : rr));
    const r2 = solve(rs.join("\n"));
    const score = r2.unique ? r2.passes * 1000 + r2.search : 1e6 + r2.unknown;
    if (!best || score < best[0]) best = [score, rs, `r${y}c${x}${s}`];
  }
  rows = best![1]; console.log("add", best![2]);
}
console.log(rows.join("\n"));
const r = solve(rows.join("\n")); console.log(`final ${r.unique ? "OK" : "STUCK"} p${r.passes} s${r.search.toFixed(1)} open${r.firstOpen}`);
