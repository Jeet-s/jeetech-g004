import { readFileSync } from "fs";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
const K = Number(process.argv[2] ?? 1);
const top = Number(process.argv[3] ?? 15);
const art = readFileSync(0, "utf8").trim();
const rows = art.split("\n").map((l) => l.trim());
const CH = K === 1 ? [".", "#"] : [".", ..."abcdef".slice(0, K)];
function score(rs: string[]) {
  try {
    const p = buildPuzzle({ id: "t", title: "t", palette: Array(K).fill("#000"), art: rs.join("\n") });
    const r = logicSolve(p);
    return r.unique ? r.search : -1;
  } catch { return -1; }
}
const base = score(rows);
console.log("base", base.toFixed(1));
const res: [number, string][] = [];
for (let y = 0; y < rows.length; y++) for (let x = 0; x < rows[y].length; x++) {
  const ch = rows[y][x];
  if (ch === "~") continue;
  for (const o of CH) {
    if (o === ch) continue;
    const nr = rows.slice();
    nr[y] = nr[y].slice(0, x) + o + nr[y].slice(x + 1);
    const s = score(nr);
    if (s > 0) res.push([s, `r${y} c${x} ${ch}->${o}`]);
  }
}
res.sort((a, b) => b[0] - a[0]);
for (const [s, d] of res.slice(0, top)) console.log(s.toFixed(1), d);
