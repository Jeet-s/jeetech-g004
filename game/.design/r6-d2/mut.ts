import * as path from "path";
import { buildPuzzle, logicSolve, clueOf, lineCount } from "../../src/game/nonogram";
// usage: mut.ts file id chars maxdiff [rowsAllowed e.g. 0-6]
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s0 = (Object.values(mod).flat() as any[]).find((s) => s.title === process.argv[3] || s.id === process.argv[3]);
  const chars = process.argv[4]; const maxd = +process.argv[5];
  const [r0, r1] = (process.argv[6] ?? "0-99").split("-").map(Number);
  const rows = s0.art.trim().split("\n");
  const att = (art: string) => { const g = art.split("\n"); for (let y = 0; y < g.length; y++) for (let x = 0; x < g[0].length; x++) { if (g[y][x] === "." || g[y][x] === "~") continue; const n = [g[y-1]?.[x], g[y+1]?.[x], g[y][x-1], g[y][x+1]]; if (!n.some((c) => c && c !== "." && c !== "~")) return false; } return true; };
  const ok = (art: string) => { if (process.env.ATT && !att(art)) return null; try { const p = buildPuzzle({ ...s0, art }); for (let l = 0; l < lineCount(p); l++) if (!clueOf(p, l).blocks.length) return null; const r = logicSolve(p); return r.unique ? r : null; } catch { return null; } };
  const base = ok(rows.join("\n")); console.log("base", base?.steps, base?.passes);
  const res: [number, string, any][] = [];
  const seen = new Set<string>();
  let frontier = [rows.map((r: string) => r.split(""))];
  for (let d = 1; d <= maxd; d++) {
    const nf: string[][][] = [];
    for (const g of frontier) for (let y = Math.max(0, r0); y < Math.min(g.length, r1 + 1); y++) for (let x = 0; x < g[0].length; x++) for (const c of chars) {
      if (g[y][x] === c) continue; const h = g.map((r) => r.slice()); h[y][x] = c; const art = h.map((r) => r.join("")).join("\n");
      if (seen.has(art)) continue; seen.add(art); const r = ok(art); if (!r) continue;
      res.push([r.passes * 100 + r.steps, art, r]); nf.push(h);
    }
    nf.sort(() => Math.random() - 0.5); frontier = nf.slice(0, 40);
  }
  res.sort((a, b) => b[0] - a[0]);
  for (const [sc, art, r] of res.slice(0, +(process.argv[7] ?? 8))) console.log(`passes ${r.passes} looks ${r.steps} open ${r.firstOpen}\n${art}\n`);
})();
