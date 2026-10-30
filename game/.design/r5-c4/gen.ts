// gen.ts file id region(r0,r1,c0,c1 1-based) starChar count tries secs [maxPasses]
// randomly places `count` star cells (starChar) in '.' cells of region (removing existing stars of that char there), finds crossing tally pairs both needed
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
  const [r0, r1, c0, c1] = process.argv[4].split(",").map(Number);
  const ch = process.argv[5], cnt = +process.argv[6], tries = +process.argv[7], secs = +process.argv[8], maxP = +(process.argv[9] ?? 8);
  const t0 = Date.now(); let seed = +(process.env.SEED ?? 7);
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  const base = g0.map((l, r) => l.split("").map((x, c) => (r >= r0 - 1 && r < r1 && c >= c0 - 1 && c < c1 && x === ch ? (process.env.BG ?? ".") : x)));
  const free: [number, number][] = []; for (let r = r0 - 1; r < r1; r++) for (let c = c0 - 1; c < c1; c++) if (base[r][c] === (process.env.BG ?? ".")) free.push([r, c]);
  const seen = new Set<string>();
  for (let t = 0; t < tries && Date.now() - t0 < secs * 1000; t++) {
    const g = base.map((l) => l.slice());
    const pick = new Set<number>(); while (pick.size < cnt) pick.add(Math.floor(rnd() * free.length));
    for (const i of pick) g[free[i][0]][free[i][1]] = ch;
    const art = g.map((l) => l.join("")).join("\n"); if (seen.has(art)) continue; seen.add(art);
    const sp = { ...s, art, tally: [] as string[] };
    let r = logicSolve(buildPuzzle(sp)); if (!r.unique) continue;
    const P = buildPuzzle(sp);
    const need: string[] = [];
    for (let L = 0; L < H + W; L++) { const k = L < H ? "r" + L : "c" + (L - H); const n = L < H ? W : H; const tot = clueOf(P, L).blocks.reduce((a: number, b: any) => a + b.len, 0); if (tot === 0 || tot === n) continue;
      if (process.env.FULL || !logicSolve(buildPuzzle({ ...sp, smudge: [k] })).unique) need.push(k); }
    if (process.env.DBG) console.log(t, need.join(","));
    if (process.env.SINGLE) { for (const a of need) { const q = logicSolve(buildPuzzle({ ...sp, tally: [a] })); if (!q.unique || q.passes > maxP) continue; if (logicSolve(buildPuzzle({ ...sp, smudge: [a] })).unique) continue; { const L0 = a[0] === 'r' ? +a.slice(1) : H + +a.slice(1); const ks = acts({ ...sp, tally: [a] }, L0); const f = ks.filter((x) => x.includes('FILL')).map((x) => +x.split(':')[0]); if (process.env.PURE && (ks.some((x) => x.endsWith(':X')) || !f.length || Math.min(...f) > q.passes - +(process.env.EARLY ?? 0))) continue; } console.log(`try ${t} ${a} passes ${q.passes} looks ${q.steps} open ${q.firstOpen}\n${art}\n`); } continue; }
    for (const a of need) if (a[0] === "r") for (const b of need) if (b[0] === "c") {
      const T = [a, b]; const q = logicSolve(buildPuzzle({ ...sp, tally: T })); if (!q.unique || q.passes > maxP) continue;
      if (logicSolve(buildPuzzle({ ...sp, tally: [b], smudge: [a] })).unique) continue;
      if (logicSolve(buildPuzzle({ ...sp, tally: [a], smudge: [b] })).unique) continue;
      console.log(`try ${t} r${+a.slice(1) + 1}+c${+b.slice(1) + 1} passes ${q.passes} looks ${q.steps} open ${q.firstOpen}\n${art}\n`);
    }
  }
  console.log("done", Date.now() - t0, "ms");
})();
