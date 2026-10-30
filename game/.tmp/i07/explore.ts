/// <reference types="node" />
import { readFileSync } from "fs";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
// usage: explore.ts K artfile [pair]
const K = Number(process.argv[2]);
const art0 = readFileSync(process.argv[3], "utf8").split("\n").map((l) => l.trim()).filter(Boolean);
const pair = process.argv[4] === "pair";
const h = art0.length, w = art0[0].length;
const lines: string[] = [];
for (let y = 0; y < h; y++) lines.push("r" + y);
for (let x = 0; x < w; x++) lines.push("c" + x);
const res: [number, string, number, number][] = [];
function run(sm: string[], art: string[]) {
  const p = buildPuzzle({ id: "t", title: "t", palette: Array(K).fill("#000"), art: art.join("\n"), smudge: sm } as any);
  const r = logicSolve(p);
  if (r.unique) res.push([r.search, sm.join(","), r.passes, r.firstOpen]);
}
if (!pair) for (const l of lines) run([l], art0);
else for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
  const a = art0.map((r) => r.split(""));
  const c = a[y][x]; a[y][x] = c === "." ? "," : c.toUpperCase();
  run(["r" + y, "c" + x], a.map((r) => r.join("")));
}
res.sort((a, b) => a[0] - b[0]);
console.log(res.map((r) => `${r[1]}:${r[0].toFixed(1)}/p${r[2]}`).join("  "));
