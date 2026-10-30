// mutate cells in a region so plain line logic stalls, then find single stamps in region that fix it
import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[]).find((x) => x.id === process.argv[3]);
  const [r0, r1, c0, c1] = process.argv[4].split(",").map(Number); // 1-based inclusive region
  const vals = (process.argv[5] ?? ".ab").split("");
  const depth = +(process.argv[6] ?? 1);
  const g0 = s.art.split("\n").map((l: string) => l.trim()).filter((l: string) => l.length);
  const H = g0.length, W = g0[0].length;
  const cells: [number, number][] = [];
  for (let r = r0 - 1; r < r1; r++) for (let c = c0 - 1; c < c1; c++) if (g0[r][c] !== "~") cells.push([r, c]);
  const solve = (g: string[]) => { try { return logicSolve(buildPuzzle({ ...s, art: g.join("\n") })); } catch { return null; } };
  const set = (g: string[], r: number, c: number, v: string) => g.map((l, k) => (k === r ? l.slice(0, c) + v + l.slice(c + 1) : l));
  const tryArt = (g: string[], tag: string) => {
    const b = solve(g); if (!b || b.unique) return;
    const out: string[] = [];
    for (const [r, c] of cells) {
      const m = b.masks[r * W + c]; if (!(m & (m - 1))) continue;
      const ch = g[r][c]; const st = ch === "." ? "," : ch.toUpperCase();
      const res = solve(set(g, r, c, st));
      if (res && res.unique) out.push(`r${r + 1}c${c + 1}${st}:${res.steps}/${res.passes}/${res.firstOpen}`);
    }
    if (out.length) console.log(tag, "unk", b.unknown, "|", out.join(" "));
  };
  const seen = new Set<string>();
  const rec = (g: string[], d: number, tag: string, from: number) => {
    for (let i = from; i < cells.length; i++) { const [r, c] = cells[i];
      for (const v of vals) { if (g[r][c] === v) continue; const h = set(g, r, c, v); const k = h.join("|"); if (seen.has(k)) continue; seen.add(k);
        const t = `${tag} r${r + 1}c${c + 1}=${v}`; tryArt(h, t); if (d > 1) rec(h, d - 1, t, i + 1); } }
  };
  rec(g0, depth, "", 0);
})();
