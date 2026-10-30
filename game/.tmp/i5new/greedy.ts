// greedy: add stamps one by one minimizing unknown count; prints final art
import { readFileSync } from "fs";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
const parts = readFileSync(process.argv[2], "utf8").split(/\n\s*\n/).filter((s) => s.trim());
const kind = process.argv[3] ?? "any";
const pal = Array(6).fill("#000");
const solve = (a: string) => logicSolve(buildPuzzle({ id: "t", title: "t", palette: pal, art: a }));
for (const art of parts) {
  let rows = art.split("\n").map((l) => l.trim()).filter(Boolean);
  for (let it = 0; it < 6; it++) {
    const r = solve(rows.join("\n")); if (r.unique) break;
    let best: [number, string[], string] | null = null;
    for (let y = 0; y < rows.length; y++) for (let x = 0; x < rows[0].length; x++) {
      const ch = rows[y][x]; if (!".#abcdef".includes(ch)) continue;
      const s = ch === "." ? "," : ch === "#" ? "@" : ch.toUpperCase();
      if (kind === "ink" && s === ",") continue; if (kind === "paper" && s !== ",") continue;
      const rs = rows.map((rr, yy) => (yy === y ? rr.slice(0, x) + s + rr.slice(x + 1) : rr));
      const r2 = solve(rs.join("\n"));
      const score = r2.unique ? -1000 + r2.search * -1 : r2.unknown;
      if (!best || score < best[0]) best = [score, rs, `r${y}c${x}${s}`];
    }
    rows = best![1]; console.log("add", best![2]);
  }
  const r = solve(rows.join("\n"));
  console.log(rows.join("\n")); console.log(r.unique ? "OK" : "STUCK", "passes", r.passes, "search", r.search.toFixed(1), "open0", r.firstOpen, "\n");
}
