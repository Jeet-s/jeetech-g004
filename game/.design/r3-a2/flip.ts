import * as path from "path";
import { buildPuzzle, logicSolve, clueOf } from "../../src/game/nonogram";
// flip file id [maxflips=1]: single-cell flips that make some single line a needed tally (board unique)
const works = (s: any, T: string[]) => {
  const r = logicSolve(buildPuzzle({ ...s, tally: T }));
  if (!r.unique) return null;
  for (const t of T) { const q = logicSolve(buildPuzzle({ ...s, tally: T.filter((x) => x !== t), smudge: [...(s.smudge ?? []), t] })); if (q.unique) return null; }
  return r;
};
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s0 = (Object.values(mod).flat() as any[]).find((x) => x.id === process.argv[3]);
  const rows = s0.art.trim().split("\n");
  const h = rows.length, w = rows[0].length;
  const base = s0.tally ?? [];
  const names = [...Array.from({ length: h }, (_, i) => "r" + i), ...Array.from({ length: w }, (_, i) => "c" + i)];
  for (let y = -1; y < h; y++) for (let x = 0; x < w; x++) {
    if (y < 0 && x > 0) continue;
    const g = rows.map((r: string) => r.split(""));
    if (y >= 0) g[y][x] = g[y][x] === "#" ? "." : "#";
    const s = { ...s0, art: "\n" + g.map((r: string[]) => r.join("")).join("\n") };
    let p; try { p = buildPuzzle(s); } catch { continue; }
    if (!logicSolve(buildPuzzle({ ...s, tally: [] })).unique) continue;
    const hits: string[] = [];
    for (const L of names) {
      if (base.includes(L)) continue;
      const r = works(s, [...base, L]);
      if (r) { const li = Number(L.slice(1)) + (L[0] === "c" ? h : 0); const b = clueOf(p, li).blocks; hits.push(`${L[0]}${Number(L.slice(1)) + 1}=${b.reduce((a: number, q: any) => a + q.len, 0)}(${b.map((q: any) => q.len).join(" ")}) L${r.steps}/P${r.passes}/O${r.firstOpen}`); }
    }
    if (hits.length) console.log(`${y < 0 ? "none" : `flip r${y + 1}c${x + 1}->${g[y][x]}`}: ${hits.join("  ")}`);
  }
})();
