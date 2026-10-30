// for each spec, try every single line as the tally (and flips if depth given): print OK + needed
import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const maxL = +(process.argv[3] ?? 99), maxP = +(process.argv[4] ?? 99), flips = process.argv[5] === "1";
  for (const s0 of Object.values(mod).flat() as any[]) {
    const rows: string[] = s0.art.trim().split("\n").map((l: string) => l.trim());
    const H = rows.length, W = rows[0].length;
    const arts: [string, string][] = [["base", rows.join("\n")]];
    if (flips) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const c = rows[y][x]; if (c !== "." && c !== "#") continue; const r2 = rows.slice(); r2[y] = c === "." ? r2[y].slice(0, x) + "#" + r2[y].slice(x + 1) : r2[y].slice(0, x) + "." + r2[y].slice(x + 1); arts.push([`r${y + 1}c${x + 1}`, r2.join("\n")]); }
    const lines = [...Array(H).keys()].map((k) => "r" + k).concat([...Array(W).keys()].map((k) => "c" + k));
    for (const [d, art] of arts) for (const t of lines) {
      const s = { ...s0, art, tally: [t] };
      let r; try { r = logicSolve(buildPuzzle(s)); } catch { continue; }
      if (process.env.ALL) { console.log(s0.title, d, t, r.unique ? "OK" : "BAD" + r.unknown, r.steps, r.passes, r.firstOpen); } if (!r.unique || r.steps > maxL || r.passes > maxP) continue;
      const q = logicSolve(buildPuzzle({ ...s, tally: [], smudge: [t] }));
      if (q.unique) continue;
      console.log(`${s0.title} ${d} tally ${t} (${t[0] === "r" ? "row" : "col"} ${+t.slice(1) + 1}) looks ${r.steps} passes ${r.passes} open ${r.firstOpen}`);
    }
  }
})();
