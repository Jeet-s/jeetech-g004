import { readFileSync } from "fs";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
const art = readFileSync(process.argv[2], "utf8").trim(); const K = Number(process.argv[3] ?? 1); const MODE = process.argv[4] ?? "any";
const CH = ".#abcdef", UP = ",@ABCDEF";
const rows = art.split("\n").map((l) => l.trim()).filter(Boolean);
const run = (r: string[]) => logicSolve(buildPuzzle({ id: "t", title: "t", palette: Array(K).fill("#000"), art: r.join("\n") }));
const base = run(rows); console.log(`base ${base.unique ? "OK" : "STUCK " + base.unknown} search ${base.search.toFixed(1)}`);
const c: [number, string, number][] = [];
for (let y = 0; y < rows.length; y++) for (let x = 0; x < rows[0].length; x++) { const i = CH.indexOf(rows[y][x]); if (i < 0) continue; if (MODE === "paper" && i) continue; if (MODE === "ink" && !i) continue;
  const nr = rows.slice(); nr[y] = nr[y].slice(0, x) + UP[i] + nr[y].slice(x + 1); const r = run(nr); c.push([r.unique ? r.search : -1, `(${y},${x})${UP[i]}`, r.unknown]); }
const ok = c.filter((z) => z[0] >= 0).sort((a, b) => b[0] - a[0]);
console.log("unique:", ok.length, "of", c.length, "| highest:", ok.slice(0, 8).map((z) => z[1] + " " + z[0].toFixed(1)).join("  "));
console.log("lowest:", ok.slice(-5).map((z) => z[1] + " " + z[0].toFixed(1)).join("  "));
if (!base.unique) { const st = c.filter((z) => z[0] < 0).sort((a, b) => a[2] - b[2]); console.log("best partial:", st.slice(0, 6).map((z) => z[1] + " unk" + z[2]).join("  ")); }
