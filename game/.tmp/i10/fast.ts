import { applyLine, lineCount, lineIndices, clueOf, isKnown, startMasks, maskValue, type Puzzle } from "../../src/game/nonogram";
export function fastSolve(p: Puzzle) {
  let masks = startMasks(p);
  const L = lineCount(p);
  const idx = Array.from({ length: L }, (_, l) => lineIndices(p.w, p.h, l));
  const cache: (number[] | null | undefined)[] = Array(L).fill(undefined);
  const dirty = Array(L).fill(true);
  let steps = 0, search = 0;
  for (;;) {
    let open = 0, productive = 0, best = -1, bestGain = 0;
    for (let l = 0; l < L; l++) {
      if (!idx[l].some((i) => !isKnown(masks[i]))) continue;
      if (clueOf(p, l).smudged) continue;
      open++;
      if (dirty[l]) { cache[l] = applyLine(p, masks, l); dirty[l] = false; }
      const nx = cache[l];
      if (nx === null) return { unique: false, search, steps };
      if (nx === masks || nx === undefined) continue;
      let changed = false, gain = 0;
      for (const i of idx[l]) if (nx[i] !== masks[i]) { changed = true; if (isKnown(nx[i])) gain++; }
      if (!changed) continue;
      productive++;
      if (gain > bestGain || best < 0) { best = l; bestGain = gain; }
    }
    if (!productive) break;
    steps++; search += open / productive;
    const nx = cache[best]!;
    const ch = new Set<number>();
    for (const i of idx[best]) if (nx[i] !== masks[i]) ch.add(i);
    const nm = masks.slice(); for (const i of ch) nm[i] = nx[i];
    masks = nm;
    for (let l = 0; l < L; l++) { if (dirty[l]) continue; if (idx[l].some((i) => ch.has(i))) dirty[l] = true; else if (cache[l] && cache[l] !== null) { /* rebase cached result onto new masks */ const c = cache[l]!; const r = masks.slice(); for (const i of idx[l]) r[i] = c[i]; cache[l] = r; } }
  }
  const unique = masks.every((m, i) => isKnown(m) && maskValue(m) === p.solution[i]);
  return { unique, search, steps };
}
