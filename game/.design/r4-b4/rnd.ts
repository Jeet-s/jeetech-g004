// rnd.ts file id region vals flips iters maxPasses tallyLines(any|none|list) [seed]
import * as path from "path";
import { buildPuzzle, logicSolve, clueOf } from "../../src/game/nonogram";
import { prof } from "./f1";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[]).find((x) => x.id === process.argv[3]);
  const g0 = s.art.split("\n").map((l: string) => l.trim()).filter((l: string) => l.length);
  const H = g0.length, W = g0[0].length;
  const [r0, r1, c0, c1] = process.argv[4] === "all" ? [1, H, 1, W] : process.argv[4].split(",").map(Number);
  const vals = process.argv[5].split(""); const K = +process.argv[6]; const N = +process.argv[7]; const maxP = +process.argv[8];
  const tArg = process.argv[9] ?? "none"; let seed = +(process.argv[10] ?? 1);
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  const all: string[] = []; for (let r = 0; r < H; r++) all.push("r" + r); for (let c = 0; c < W; c++) all.push("c" + c);
  const tl = tArg === "none" ? [] : tArg === "any" ? all : tArg.split(",").map((x) => (x[0] === "r" ? "r" : "c") + (+x.slice(1) - 1));
  const cells: [number, number][] = [];
  for (let r = r0 - 1; r < r1; r++) for (let c = c0 - 1; c < c1; c++) if (g0[r][c] !== "~") cells.push([r, c]);
  const set = (g: string[], r: number, c: number, v: string) => g.map((l, k) => (k === r ? l.slice(0, c) + v + l.slice(c + 1) : l));
  const nm = (x: string) => x[0] + (+x.slice(1) + 1);
  const seen = new Set<string>(); const out: string[] = [];
  for (let it = 0; it < N; it++) {
    let g = g0; const tag: string[] = [];
    const k = 1 + Math.floor(rnd() * K);
    for (let j = 0; j < k; j++) { const [r, c] = cells[Math.floor(rnd() * cells.length)]; const v = vals[Math.floor(rnd() * vals.length)]; if (g[r][c] === v) continue; g = set(g, r, c, v); tag.push(`r${r + 1}c${c + 1}=${v}`); }
    const key = g.join("|"); if (seen.has(key)) continue; seen.add(key);
    const sp = { ...s, art: g.join("\n") };
    let base; try { base = logicSolve(buildPuzzle({ ...sp, tally: [] })); } catch { continue; }
    if (!base.unique) continue;
    if (tl.length === 0) { if (base.passes <= maxP && base.passes >= +(process.env.MINP ?? 0)) out.push(`${tag.join(" ")} looks ${base.steps} passes ${base.passes} open ${base.firstOpen}`); continue; }
    const P = buildPuzzle({ ...sp, tally: [] });
    for (const l of tl) {
      const L = l[0] === "r" ? +l.slice(1) : H + +l.slice(1); const bl = (clueOf(P, L) as any).blocks;
      if (process.env.MULTI && (bl.length < 2 || new Set(bl.map((b: any) => b.color)).size < +process.env.MULTI)) continue;
      const r = logicSolve(buildPuzzle({ ...sp, tally: [l] })); if (!r.unique || r.passes > maxP) continue;
      const q = logicSolve(buildPuzzle({ ...sp, tally: [], smudge: [...(s.smudge ?? []), l] })); if (q.unique) continue;
      out.push(`${tag.join(" ")} tally ${nm(l)} ${bl.map((b: any) => b.len + "abcdef"[b.color - 1]).join(" ")} looks ${r.steps} passes ${r.passes} open ${r.firstOpen} search ${r.search.toFixed(1)} prof ${prof({ ...sp, tally: [l] }).join(",")} | ${g.join("/")}`);
    }
  }
  console.log(out.slice(0, +(process.env.MAXN ?? 40)).join("\n"));
})();
