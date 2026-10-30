import * as path from "path";
import { buildPuzzle, logicSolve, clueOf, lineCount } from "../../src/game/nonogram";
// usage: stampsearch.ts file id "rules" depth maxPasses [top]
// strips existing stamps, mutates art, requires plain NOT unique, finds single stamps that make it unique; ranks by plain-stall unknown count
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s0 = (Object.values(mod).flat() as any[]).find((s) => s.id === process.argv[3]);
  const rules = process.argv[4].split(",").filter(Boolean).map((r) => r.split(">"));
  const depth = +process.argv[5], maxP = +process.argv[6], minP = +(process.env.MINP ?? 0);
  const plainArt = s0.art.trim().replace(/,/g, ".").replace(/@/g, "#").replace(/[A-F]/g, (c: string) => c.toLowerCase());
  const res: string[] = []; const seen = new Set<string>();
  const test = (art: string) => {
    let p; try { p = buildPuzzle({ ...s0, art }); } catch { return; }
    for (let l = 0; l < lineCount(p); l++) if (!clueOf(p, l).blocks.length && !process.env.ALLOWEMPTY) return;
    const r = logicSolve(p); if (r.unique || r.contradiction) return;
    const g = art.split("\n");
    const unk: number[] = []; r.masks.forEach((m: number, i: number) => { if (m & (m - 1)) unk.push(i); });
    const stampAt = (gg: string[], i: number) => { const y = Math.floor(i / p!.w), x = i % p!.w; const c = gg[y][x];
      const st = c === "." ? "," : c === "#" ? "@" : "abcdef".includes(c) ? c.toUpperCase() : null; if (!st) return null;
      return { g: gg.map((row, k) => (k === y ? row.slice(0, x) + st + row.slice(x + 1) : row)), tag: `r${y + 1}c${x + 1}${st}` }; };
    const pairs = process.env.PAIRS ? unk.flatMap((i, a) => unk.slice(a + 1).map((j) => [i, j])) : unk.map((i) => [i]);
    if (pairs.length > 600) return;
    for (const set of pairs) {
      let gg = g; const tags: string[] = []; let okk = true;
      for (const i of set) { const r2 = stampAt(gg, i); if (!r2) { okk = false; break; } gg = r2.g; tags.push(r2.tag); }
      if (!okk) continue; const a2 = gg.join("\n");
      const q = logicSolve(buildPuzzle({ ...s0, art: a2 })); if (!q.unique || q.passes > maxP || q.passes < minP) continue;
      if (set.length === 2) { let both = true; for (const i of set) { const one = stampAt(g, i)!; if (logicSolve(buildPuzzle({ ...s0, art: one.g.join("\n") })).unique) both = false; } if (!both) continue; }
      res.push(`${String(unk.length).padStart(3)} plainUnknown | stamp ${tags.join("+")} looks ${q.steps} passes ${q.passes} open ${q.firstOpen}\n${a2}\n`);
    }
  };
  let frontier = [plainArt]; test(plainArt);
  for (let d = 1; d <= depth; d++) {
    const nf: string[] = [];
    for (const art of frontier) { const g = art.split("\n").map((r) => r.split(""));
      const [R0, R1] = (process.env.ROWS ?? "0-99").split("-").map(Number); for (let y = Math.max(0, R0); y < Math.min(g.length, R1 + 1); y++) for (let x = 0; x < g[0].length; x++) for (const [f, t] of rules) {
        if (g[y][x] !== f) continue; const h = g.map((r) => r.slice()); h[y][x] = t; const a2 = h.map((r) => r.join("")).join("\n");
        if (seen.has(a2)) continue; seen.add(a2); nf.push(a2); test(a2); } }
    frontier = nf.sort(() => Math.random() - 0.5).slice(0, 150);
  }
  res.sort((a, b) => b.localeCompare(a));
  console.log(res.slice(0, +(process.argv[7] ?? 6)).join("\n")); console.log("found", res.length);
})();
