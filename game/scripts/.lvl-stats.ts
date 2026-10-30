/// <reference types="node" />
/** Scratch: per-level solver stats.  npx tsx scripts/.lvl-stats.ts [1-12 30 ...] [--sum] */
import { LEVELS } from "../src/game/levels";
import { logicSolve, startMasks, lineCount, lineOpen, clueOf, applyLine, lineIndices, isKnown } from "../src/game/nonogram";

function profile(p: (typeof LEVELS)[number]["puzzle"]) {
  // productive-line count at each best-first step
  let masks = startMasks(p);
  const prods: number[] = [];
  for (;;) {
    let best: number[] | null = null, bg = -1, prod = 0;
    for (let l = 0; l < lineCount(p); l++) {
      if (!lineOpen(p, masks, l) || clueOf(p, l).smudged) continue;
      const nx = applyLine(p, masks, l);
      if (!nx || nx === masks) continue;
      prod++;
      let g = 0;
      for (const i of lineIndices(p.w, p.h, l)) if (nx[i] !== masks[i] && isKnown(nx[i])) g++;
      if (g > bg) { bg = g; best = nx; }
    }
    if (!best) break;
    prods.push(prod);
    masks = best;
  }
  let run = 0, longest1 = 0;
  for (const v of prods) { run = v <= 1 ? run + 1 : 0; longest1 = Math.max(longest1, run); }
  const one = prods.filter((v) => v <= 1).length, two = prods.filter((v) => v <= 2).length;
  return { one, two, longest1, prods };
}

const want: number[] = [];
for (const a of process.argv.slice(2).filter((x) => !x.startsWith("--"))) {
  const [x, y] = a.split("-").map(Number);
  for (let n = x; n <= (y || x); n++) want.push(n);
}
const diffs: number[] = [];
for (const L of LEVELS) {
  const p = L.puzzle, r = logicSolve(p);
  const hidden = (L.spec.smudge?.length ?? 0) + (L.spec.crack?.length ?? 0);
  const d = r.search * Math.sqrt(Math.max(1, r.passes)) * (1 + 0.4 * (p.palette.length - 1)) * (1 + 0.3 * hidden);
  diffs.push(d);
  if (want.length && !want.includes(L.number)) continue;
  const pr = profile(p);
  const stamps = p.given.filter((g, i) => g && !p.void[i]).length;
  console.log(
    `L${String(L.number).padStart(3)} ${L.spec.id.padEnd(24)} ${`${p.w}x${p.h}`.padEnd(6)} K${p.palette.length} ${L.role.padEnd(8)} ${r.unique ? "ok" : "STUCK" + r.unknown} ` +
      `looks ${String(r.steps).padStart(3)} passes ${String(r.passes).padStart(2)} open0 ${String(r.firstOpen).padStart(2)} min ${r.minProductive} ≤1:${pr.one} ≤2:${pr.two} run1:${pr.longest1} stamps ${stamps} hidden ${hidden} diff ${d.toFixed(1)}` +
      (process.argv.includes("--prof") ? `  [${pr.prods.join(",")}]` : ""),
  );
}
if (process.argv.includes("--sum")) {
  const N = diffs.length, t = Math.floor(N / 3);
  const avg = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length;
  console.log(`difficulty first third ${avg(diffs.slice(0, t)).toFixed(1)} last third ${avg(diffs.slice(-t)).toFixed(1)} ratio ${(avg(diffs.slice(-t)) / avg(diffs.slice(0, t))).toFixed(2)}`);
}
