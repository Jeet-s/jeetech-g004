// try single added stamps on a picture; print those yielding unique solve
import { readFileSync } from "fs";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
const parts = readFileSync(process.argv[3], "utf8").split(/\n\s*\n/).filter((s) => s.trim());
const K = Number(process.argv[2]);
const UP = "@ABCDEF";
for (const art of parts) {
  const rows = art.split("\n").map((l) => l.trim()).filter(Boolean);
  const res: string[] = [];
  for (let y = 0; y < rows.length; y++) for (let x = 0; x < rows[y].length; x++) {
    const ch = rows[y][x];
    let s: string;
    if (ch === ".") s = ","; else if (ch === "#") s = "@"; else if ("abcdef".includes(ch)) s = ch.toUpperCase(); else continue;
    const r2 = rows.map((r, yy) => (yy === y ? r.slice(0, x) + s + r.slice(x + 1) : r)).join("\n");
    const r = logicSolve(buildPuzzle({ id: "t", title: "t", palette: Array(6).fill("#000"), art: r2 }));
    if (r.unique) res.push(`r${y}c${x}${s} p${r.passes} s${r.search.toFixed(0)}`);
  }
  console.log(rows[0].length + "x" + rows.length, res.length ? res.join(" | ") : "NONE");
}
