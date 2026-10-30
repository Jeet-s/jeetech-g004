import { buildPuzzle, logicSolve, type PuzzleSpec } from "../../src/game/nonogram";
export function chk(spec: PuzzleSpec) {
  const p = buildPuzzle(spec);
  const r = logicSolve(p);
  const fmt = (c: any) => c.blocks.map((b: any) => b.len + (p.palette.length > 1 ? "abcdef"[b.color - 1] : "")).join(" ") || "0";
  console.log(`${spec.id} ${p.w}x${p.h} unique=${r.unique} unknown=${r.unknown} looks=${r.steps} passes=${r.passes} open=${r.firstOpen} search=${r.search.toFixed(1)}`);
  const empty = [...p.rows.map((c, i) => [c, "r" + (i + 1)] as const), ...p.cols.map((c, i) => [c, "c" + (i + 1)] as const)].filter(([c]) => !c.blocks.length).map(([, n]) => n);
  if (empty.length) console.log("  EMPTY lines", empty.join(","));
  if (process.env.V) { console.log("  rows:", p.rows.map(fmt).join(" | ")); console.log("  cols:", p.cols.map(fmt).join(" | ")); }
  return r;
}
import { applyLine, startMasks, lineOpen, clueOf, lineIndices, isKnown, maskValue } from "../../src/game/nonogram";
/** Print the first n best-first steps: which line, its clue, and what it settled. */
export function trace(spec: PuzzleSpec, n = 8) {
  const p = buildPuzzle(spec);
  let m = startMasks(p);
  const name = (l: number) => (l < p.h ? `r${l + 1}` : `c${l - p.h + 1}`);
  const fmt = (c: any) => c.blocks.map((b: any) => (b.hidden ? "?" : b.len) + (p.palette.length > 1 ? "abcdef"[b.color - 1] : "")).join(" ");
  for (let s = 0; s < n; s++) {
    const prods: string[] = [];
    let best = -1, bg = 0, bm: number[] | null = null;
    for (let l = 0; l < p.w + p.h; l++) {
      if (!lineOpen(p, m, l) || clueOf(p, l).smudged) continue;
      const nx = applyLine(p, m, l);
      if (!nx || nx === m) continue;
      let g = 0; for (const i of lineIndices(p.w, p.h, l)) if (nx[i] !== m[i] && isKnown(nx[i])) g++;
      prods.push(`${name(l)}[${fmt(clueOf(p, l))}]+${g}`);
      if (g > bg || best < 0) { best = l; bg = g; bm = nx; }
    }
    if (!bm) break;
    console.log(`  step ${s + 1}: ${prods.length} productive: ${prods.join(" ")}`);
    m = bm;
  }
}
