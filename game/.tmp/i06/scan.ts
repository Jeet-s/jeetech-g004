import { readFileSync } from "fs";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
const art = readFileSync(process.argv[2], "utf8").trim().split("\n");
const K = Number(process.argv[3]);
const sc = (a: string[]) => { const r = logicSolve(buildPuzzle({ id: "t", title: "t", palette: Array(K).fill("#000"), art: a.join("\n") })); return r.unique ? r.search : -1; };
const base = sc(art); const out: [number, string][] = [];
art.forEach((row, y) => [...row].forEach((ch, x) => {
  if (ch === "~") return;
  const up = ch === "." ? "," : ch.toUpperCase();
  const a = art.map((r, yy) => (yy === y ? r.slice(0, x) + up + r.slice(x + 1) : r));
  const s = sc(a); if (s !== base) out.push([s, `(${y},${x}) ${ch}->${up}`]);
}));
console.log("base", base.toFixed(1)); out.sort((a, b) => b[0] - a[0]); for (const [s, d] of out.slice(0, 25)) console.log(s.toFixed(1), d);
