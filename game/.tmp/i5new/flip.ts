// for each single-cell flip of the picture that makes it STUCK, list single stamps (of kind arg) that fix it
import { readFileSync } from "fs";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
const art = readFileSync(process.argv[3], "utf8").trim();
const K = Number(process.argv[2]); const kind = process.argv[4] ?? "any";
const pal = Array(6).fill("#000");
const solve = (a: string) => logicSolve(buildPuzzle({ id: "t", title: "t", palette: pal, art: a }));
const rows = art.split("\n").map((l) => l.trim()).filter(Boolean);
const set = (rs: string[], y: number, x: number, c: string) => rs.map((r, yy) => (yy === y ? r.slice(0, x) + c + r.slice(x + 1) : r));
const alt = (ch: string) => (ch === "." ? (K === 1 ? ["#"] : "abcdef".slice(0, K).split("")) : ["."]);
for (let y = 0; y < rows.length; y++) for (let x = 0; x < rows[0].length; x++) for (const c of alt(rows[y][x])) {
  const rs = set(rows, y, x, c); const r = solve(rs.join("\n"));
  if (r.unique) continue;
  const fixes: string[] = [];
  for (let yy = 0; yy < rs.length; yy++) for (let xx = 0; xx < rs[0].length; xx++) {
    const ch = rs[yy][xx]; const s = ch === "." ? "," : ch === "#" ? "@" : ch.toUpperCase();
    if (kind === "paper" && s !== ",") continue; if (kind === "ink" && s === ",") continue;
    const r2 = solve(set(rs, yy, xx, s).join("\n"));
    if (r2.unique) fixes.push(`r${yy}c${xx}${s}(p${r2.passes})`);
  }
  if (fixes.length) console.log(`flip r${y}c${x}->${c} unk ${r.unknown}: ${fixes.join(" ")}`);
}
