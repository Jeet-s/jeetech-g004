import * as path from "path";
import { buildPuzzle, logicSolve, clueOf, lineCount } from "../../src/game/nonogram";
// usage: mut2.ts file id "from>to,from>to" depth maxPasses  — mutations: change cells with char from->to; require OK, all tallies needed, stamp needed
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s0 = (Object.values(mod).flat() as any[]).find((s) => s.id === process.argv[3]);
  const rules = process.argv[4].split(",").map((r) => r.split(">"));
  const depth = +process.argv[5], maxP = +process.argv[6];
  const rows = s0.art.trim().split("\n");
  const evalArt = (art: string) => {
    try {
      const sp = { ...s0, art }; const p = buildPuzzle(sp);
      for (let l = 0; l < lineCount(p); l++) if (!clueOf(p, l).blocks.length && !(p.void && false)) return null;
      const r = logicSolve(p); if (!r.unique || r.passes > maxP) return null;
      for (const t of s0.tally ?? []) { const q = logicSolve(buildPuzzle({ ...sp, tally: s0.tally.filter((x: string) => x !== t), smudge: [...(s0.smudge ?? []), t] })); if (q.unique) return null; }
      if (/[,@A-F]/.test(art)) { const q = logicSolve(buildPuzzle({ ...sp, art: art.replace(/,/g, ".").replace(/@/g, "#").replace(/[A-F]/g, (c: string) => c.toLowerCase()) })); if (q.unique) return null; }
      return r;
    } catch { return null; }
  };
  const seen = new Set<string>(); const res: [string, any][] = [];
  let frontier = [rows.join("\n")];
  for (let d = 1; d <= depth; d++) {
    const nf: string[] = [];
    for (const art of frontier) {
      const g = art.split("\n").map((r) => r.split(""));
      for (let y = 0; y < g.length; y++) for (let x = 0; x < g[0].length; x++) for (const [f, t] of rules) {
        if (g[y][x] !== f) continue; const h = g.map((r) => r.slice()); h[y][x] = t; const a2 = h.map((r) => r.join("")).join("\n");
        if (seen.has(a2)) continue; seen.add(a2); nf.push(a2); const r = evalArt(a2); if (r) res.push([a2, r]);
      }
    }
    frontier = nf.sort(() => Math.random() - 0.5).slice(0, 300);
  }
  res.sort((a, b) => a[1].passes - b[1].passes || a[1].steps - b[1].steps);
  for (const [a, r] of res.slice(0, +(process.argv[7] ?? 6))) console.log(`passes ${r.passes} looks ${r.steps} open ${r.firstOpen}\n${a}\n`);
  console.log("found", res.length);
})();
