// usage: npx tsx mut.ts file id r0 r1 chars [depth]   toggles cells in rows r0..r1 (1-based) among chars (e.g. ".b")
import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[]).find((x) => x.id === process.argv[3]);
  const r0 = +process.argv[4], r1 = +process.argv[5], chars = process.argv[6], depth = +(process.argv[7] ?? 1);
  const rows = s.art.trim().split("\n");
  const cells: [number, number][] = [];
  for (let r = r0 - 1; r < r1; r++) for (let c = 0; c < rows[r].length; c++) if (chars.includes(rows[r][c])) cells.push([r, c]);
  const res: string[] = [];
  const tryArt = (g: string[][], label: string) => {
    try { const p = buildPuzzle({ ...s, art: "\n" + g.map((x) => x.join("")).join("\n") }); const q = logicSolve(p); if (q.unique) res.push(`${q.passes} ${q.steps} ${label}\n${g.map((x) => "   " + x.join("")).join("\n")}`); } catch {}
  };
  const g0 = rows.map((x: string) => x.split(""));
  const rec = (start: number, d: number, g: string[][], label: string) => {
    if (d === 0) return;
    for (let i = start; i < cells.length; i++) {
      const [r, c] = cells[i];
      for (const ch of chars) { if (ch === g[r][c]) continue; const old = g[r][c]; g[r][c] = ch; const lab = label + ` r${r + 1}c${c + 1}=${ch}`; tryArt(g, lab); rec(i + 1, d - 1, g, lab); g[r][c] = old; }
    }
  };
  rec(0, depth, g0, "");
  res.sort((a, b) => (process.env.DESC ? -1 : 1) * (+a.split(" ")[0] - +b.split(" ")[0]));
  console.log(res.length + " unique"); console.log(res.slice(0, +(process.argv[8] ?? 12)).join("\n"));
})();
