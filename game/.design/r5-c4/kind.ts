// kind.ts file id region vals depth maxPasses KIND(INK?|RECOLOR) secs : depth-1/2 mutations, single tally lines needed, whose own action includes KIND
import * as path from "path";
import { buildPuzzle, logicSolve, clueOf, lineCount, lineIndices, startMasks, applyLine, isKnown } from "../../src/game/nonogram";
function acts(s: any, tl: number) { const p = buildPuzzle(s); let masks = startMasks(p); const L = lineCount(p); const kinds: string[] = [];
  for (let pass = 1; pass < 40; pass++) { const base = masks; const next = masks.slice(); let ch = false;
    for (let l = 0; l < L; l++) { const nx = applyLine(p, base, l); if (!nx || nx === base) continue;
      for (const i of lineIndices(p.w, p.h, l)) if (nx[i] !== base[i]) { next[i] &= nx[i]; ch = true;
        if (l === tl) { const o = base[i], n = nx[i]; kinds.push(`${pass}:` + (n === 1 ? "X" : !(o & 1) ? "RECOLOR" : (n & 1) ? "narrow" : isKnown(n) ? "FILL" + (31 - Math.clz32(n)) : "INK?")); } } }
    if (!ch) break; masks = next; }
  return kinds; }
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[]).find((x) => x.id === process.argv[3]);
  const g0: string[] = s.art.split("\n").map((l: string) => l.trim()).filter((l: string) => l.length);
  const H = g0.length, W = g0[0].length;
  const [r0, r1, c0, c1] = process.argv[4] === "all" ? [1, H, 1, W] : process.argv[4].split(",").map(Number);
  const vals = process.argv[5].split(""); const depth = +process.argv[6]; const maxP = +process.argv[7]; const KIND = process.argv[8]; const secs = +process.argv[9];
  const t0 = Date.now(); const seen = new Set<string>();
  const cells: [number, number][] = []; for (let r = r0 - 1; r < r1; r++) for (let c = c0 - 1; c < c1; c++) cells.push([r, c]);
  const test = (g: string[], tag: string) => {
    if (Date.now() - t0 > secs * 1000) { console.log("time up"); process.exit(0); }
    const sp = { ...s, art: g.join("\n"), tally: [] as string[] }; let P; try { P = buildPuzzle(sp); } catch { return; }
    if (!logicSolve(P).unique) return;
    for (let l = 0; l < H + W; l++) { const n = l < H ? W : H; const tot = clueOf(P, l).blocks.reduce((a: number, b: any) => a + b.len, 0); if (tot === 0 || tot === n) continue;
      const k = l < H ? "r" + l : "c" + (l - H); if (process.env.ROWS && l >= H) continue;
      if (logicSolve(buildPuzzle({ ...sp, smudge: [k] })).unique) continue;
      const q = logicSolve(buildPuzzle({ ...sp, tally: [k] })); if (!q.unique || q.passes > maxP) continue;
      const ks = acts({ ...sp, tally: [k] }, l); if (KIND === "PUREFILL") { if (!ks.some((x) => x.includes("FILL")) || ks.some((x) => x.endsWith(":X"))) continue; } else if (KIND === "MULTI") { const by: Record<string, Set<string>> = {}; for (const x of ks) { const m = x.match(/^(\d+):FILL(\d)/); if (m) (by[m[1]] ??= new Set()).add(m[2]); } if (!Object.values(by).some((v) => v.size >= 2)) continue; } else if (!ks.some((x) => x.includes(KIND))) continue;
      if (process.env.EARLY) { const f = ks.filter((x) => x.includes("FILL")).map((x) => +x.split(":")[0]); if (!f.length || Math.min(...f) > q.passes - +process.env.EARLY) continue; }
      console.log(`${tag || "base"} tally ${l < H ? "r" + (l + 1) : "c" + (l - H + 1)} passes ${q.passes} looks ${q.steps} open ${q.firstOpen} acts ${ks.join(" ")}`);
    } };
  test(g0, "");
  const set = (g: string[], r: number, c: number, v: string) => g.map((l, k) => (k === r ? l.slice(0, c) + v + l.slice(c + 1) : l));
  const rec = (g: string[], d: number, tag: string, from: number) => { for (let i = from; i < cells.length; i++) { const [r, c] = cells[i]; for (const v of vals) { if (g[r][c] === v) continue; const h = set(g, r, c, v); const k = h.join("|"); if (seen.has(k)) continue; seen.add(k); const t = `${tag} r${r + 1}c${c + 1}=${v}`; test(h, t); if (d > 1) rec(h, d - 1, t, i + 1); } } };
  if (depth > 0) rec(g0, depth, "", 0);
  console.log("done");
})();
