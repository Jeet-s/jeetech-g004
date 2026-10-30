// art mutations (depth 1-2) in a region x tally on candidate lines -> OK + every tally needed
import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[]).find((x) => x.id === process.argv[3]);
  const [r0, r1, c0, c1] = process.argv[4].split(",").map(Number);
  const vals = process.argv[5].split("");
  const tl = process.argv[6].split(",").map((x) => (x[0] === "r" ? "r" : "c") + (+x.slice(1) - 1)); // 1-based in
  const depth = +(process.argv[7] ?? 1);
  const g0 = s.art.split("\n").map((l: string) => l.trim()).filter((l: string) => l.length);
  const cells: [number, number][] = [];
  for (let r = r0 - 1; r < r1; r++) for (let c = c0 - 1; c < c1; c++) if (g0[r][c] !== "~") cells.push([r, c]);
  const set = (g: string[], r: number, c: number, v: string) => g.map((l, k) => (k === r ? l.slice(0, c) + v + l.slice(c + 1) : l));
  const ok = (g: string[], t: string[]) => { try { const sp = { ...s, art: g.join("\n") }; const r = logicSolve(buildPuzzle({ ...sp, tally: t }));
    if (!r.unique) return null; for (const l of t) { const q = logicSolve(buildPuzzle({ ...sp, tally: t.filter((x) => x !== l), smudge: [...(s.smudge ?? []), l] })); if (q.unique) return null; } return r; } catch { return null; } };
  const subsets: string[][] = []; for (const a of tl) subsets.push([a]); for (let i = 0; i < tl.length; i++) for (let j = i + 1; j < tl.length; j++) subsets.push([tl[i], tl[j]]);
  const seen = new Set<string>(); let n = 0;
  const rec = (g: string[], d: number, tag: string, from: number) => {
    for (let i = from; i < cells.length; i++) { const [r, c] = cells[i];
      for (const v of vals) { if (g[r][c] === v) continue; const h = set(g, r, c, v); const k = h.join("|"); if (seen.has(k)) continue; seen.add(k);
        const t = `${tag} r${r + 1}c${c + 1}=${v}`;
        for (const sub of subsets) { const res = ok(h, sub); if (res) { console.log(t, "tally", sub.map((x) => x[0] + (+x.slice(1) + 1)).join("+"), `looks ${res.steps} passes ${res.passes} open ${res.firstOpen}`); if (++n > 60) process.exit(0); } }
        if (d > 1) rec(h, d - 1, t, i + 1); } }
  };
  for (const sub of subsets) { const res = ok(g0, sub); if (res) console.log("base tally", sub.join("+"), res.steps, res.passes); }
  rec(g0, depth, "", 0);
})();
