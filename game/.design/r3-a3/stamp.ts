// tsx stamp.ts file id [maxPasses] -- try each single stamp cell; need: with stamp OK; no-stamp BAD; each tally needed (smudged -> BAD)
import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[]).find((x) => x.id === process.argv[3]);
  const maxP = +(process.argv[4] ?? 9);
  const rows = s.art.trim().split("\n"); const H = rows.length, W = rows[0].length;
  const T: string[] = s.tally ?? [];
  const base = logicSolve(buildPuzzle(s));
  console.log("without stamp:", base.unique ? "OK" : "BAD " + base.unknown);
  const out: string[] = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const ch = rows[y][x]; if (ch === "~") continue;
    const st = ch === "." ? (process.env.PAPER ? "," : null) : ch.toUpperCase(); if (!st || st === ch) continue;
    const r2 = rows.slice(); r2[y] = r2[y].slice(0, x) + st + r2[y].slice(x + 1); const art = "\n" + r2.join("\n");
    const a = logicSolve(buildPuzzle({ ...s, art })); if (!a.unique || a.passes > maxP) continue;
    if (base.unique) continue; // stamp would be decorative
    let ok = true;
    for (const t of T) { const c = logicSolve(buildPuzzle({ ...s, art, tally: T.filter((q) => q !== t), smudge: [...(s.smudge ?? []), t] })); if (c.unique) { ok = false; break; } }
    out.push(`stamp (${y + 1},${x + 1})=${st} passes ${a.passes} looks ${a.steps} open ${a.firstOpen}${ok ? " ALL-TALLY-NEEDED" : ""}`);
  }
  out.sort((a, b) => (b.includes("ALL") ? 1 : 0) - (a.includes("ALL") ? 1 : 0)); console.log(out.slice(0, 30).join("\n"));
})();
