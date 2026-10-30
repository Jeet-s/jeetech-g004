// usage: mut.ts file id region(r0,r1,c0,c1 1-based|all) vals depth maxPasses [tallyLines 1-based comma|any] [ntally=1]
import * as path from "path";
import { buildPuzzle, logicSolve, clueOf } from "../../src/game/nonogram";
import { prof } from "./f1";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[]).find((x) => x.id === process.argv[3]);
  const g0 = s.art.split("\n").map((l: string) => l.trim()).filter((l: string) => l.length);
  const H = g0.length, W = g0[0].length;
  const [r0, r1, c0, c1] = process.argv[4] === "all" ? [1, H, 1, W] : process.argv[4].split(",").map(Number);
  const vals = process.argv[5].split("");
  const depth = +process.argv[6]; const maxP = +process.argv[7];
  const tArg = process.argv[8] ?? "none"; const nt = +(process.argv[9] ?? 1);
  const all: string[] = []; for (let r = 0; r < H; r++) all.push("r" + r); for (let c = 0; c < W; c++) all.push("c" + c);
  const tl = tArg === "none" ? [] : tArg === "any" ? all : tArg.split(",").map((x) => (x[0] === "r" ? "r" : "c") + (+x.slice(1) - 1));
  const cells: [number, number][] = [];
  for (let r = r0 - 1; r < r1; r++) for (let c = c0 - 1; c < c1; c++) if (g0[r][c] !== "~") cells.push([r, c]);
  const set = (g: string[], r: number, c: number, v: string) => g.map((l, k) => (k === r ? l.slice(0, c) + v + l.slice(c + 1) : l));
  const ok = (g: string[], t: string[]) => { try { const sp = { ...s, art: g.join("\n") }; const r = logicSolve(buildPuzzle({ ...sp, tally: t }));
    if (!r.unique || r.passes > maxP) return null;
    if (process.env.MULTI) { const P = buildPuzzle({ ...sp, tally: [] }); for (const l of t) { const L = l[0] === "r" ? +l.slice(1) : P.h + +l.slice(1); const bl = (clueOf(P, L) as any).blocks; if (bl.length < 2 || new Set(bl.map((b: any) => b.color)).size < +process.env.MULTI) return null; } } for (const l of t) { const q = logicSolve(buildPuzzle({ ...sp, tally: t.filter((x) => x !== l), smudge: [...(s.smudge ?? []), l] })); if (q.unique) return null; } return r; } catch { return null; } };
  const subsets: string[][] = [];
  if (tl.length === 0) subsets.push([]); else if (nt === 1) for (const a of tl) subsets.push([a]); else for (let i = 0; i < tl.length; i++) for (let j = i + 1; j < tl.length; j++) subsets.push([tl[i], tl[j]]);
  const nm = (x: string) => x[0] + (+x.slice(1) + 1);
  const seen = new Set<string>(); let n = 0;
  const test = (g: string[], tag: string) => { for (const sub of subsets) { const res = ok(g, sub); if (res) { console.log(tag || "base", "tally", sub.map(nm).join("+"), `looks ${res.steps} passes ${res.passes} open ${res.firstOpen} search ${res.search.toFixed(1)} prof ${prof({ ...s, art: g.join("\n"), tally: sub }).join(",")}`); if (++n > +(process.env.MAXN ?? 40)) process.exit(0); } } };
  test(g0, "");
  const rec = (g: string[], d: number, tag: string, from: number) => {
    for (let i = from; i < cells.length; i++) { const [r, c] = cells[i];
      for (const v of vals) { if (g[r][c] === v) continue; const h = set(g, r, c, v); const k = h.join("|"); if (seen.has(k)) continue; seen.add(k);
        const t = `${tag} r${r + 1}c${c + 1}=${v}`; test(h, t); if (d > 1) rec(h, d - 1, t, i + 1); } }
  };
  if (depth > 0) rec(g0, depth, "", 0);
})();
