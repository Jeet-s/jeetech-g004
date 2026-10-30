// mut.ts file id r0 r1 chars depth [top]  env MAXP MINP MINO GREP(on trace) NOT(regex must not match trace) DESC SORT=passes|looks
import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
import { trace } from "./tt";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[]).find((x) => x.id === process.argv[3]);
  const r0 = +process.argv[4], r1 = +process.argv[5], chars = process.argv[6], depth = +(process.argv[7] ?? 1);
  const E = (k: string, d: number) => Number(process.env[k] ?? d);
  const rows = s.art.trim().split("\n");
  const cells: [number, number][] = [];
  const C0 = E("C0", 1), C1 = E("C1", 99);
  for (let r = r0 - 1; r < r1; r++) for (let c = C0 - 1; c < Math.min(C1, rows[r].length); c++) if (chars.includes(rows[r][c])) cells.push([r, c]);
  const res: [number, string][] = []; const seen = new Set<string>();
  const tryArt = (g: string[][], label: string) => {
    const art = "\n" + g.map((x) => x.join("")).join("\n"); if (seen.has(art)) return; seen.add(art);
    try {
      const S = { ...s, art }; const p = buildPuzzle(S);
      if (p.rows.some((r: any) => !r.blocks.length) || p.cols.some((c: any) => !c.blocks.length)) return;
      const q = logicSolve(p); if (!q.unique) return;
      if (q.passes > E("MAXP", 99) || q.passes < E("MINP", 0) || q.firstOpen < E("MINO", 0)) return;
      if (process.env.IND) { for (const t of s.tally ?? []) if (logicSolve(buildPuzzle({ ...S, tally: s.tally.filter((x: string) => x !== t), smudge: [...(s.smudge ?? []), t] })).unique) return; }
      else if (s.tally?.length && logicSolve(buildPuzzle({ ...S, tally: [], smudge: [...(s.smudge ?? []), ...s.tally] })).unique) return;
      const tr = trace(S);
      if (process.env.GREP && !new RegExp(process.env.GREP).test(tr)) return;
      if (process.env.NOT && new RegExp(process.env.NOT).test(tr)) return;
      res.push([process.env.SORT === "looks" ? q.steps : q.passes * 100 + q.steps, `P${q.passes} L${q.steps} O${q.firstOpen} ${label}\n${g.map((x) => "   " + x.join("")).join("\n")}\n${tr}`]);
    } catch {}
  };
  const g0 = rows.map((x: string) => x.split(""));
  const rec = (start: number, d: number, g: string[][], label: string) => {
    if (d === 0) return;
    for (let i = start; i < cells.length; i++) {
      const [r, c] = cells[i];
      for (const ch of chars) { if (ch === g[r][c]) continue; const old = g[r][c]; g[r][c] = ch; const lab = label + ` r${r + 1}c${c + 1}=${ch}`; tryArt(g, lab); rec(i + 1, d - 1, g, lab); g[r][c] = old; }
    }
  };
  tryArt(g0, "orig");
  rec(0, depth, g0, "");
  res.sort((a, b) => (process.env.DESC ? -1 : 1) * (a[0] - b[0]));
  console.log(res.length + " ok"); console.log(res.slice(0, +(process.argv[8] ?? 10)).map((x) => x[1]).join("\n"));
})();
