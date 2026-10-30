import type { Puzzle } from "./nonogram";

/**
 * QA level replay: the next solving stroke from the current marks — the straight run (row or column) that inks the
 * most still-missing cells of one colour. Runs of the colour already selected come first, so the replay switches
 * swatches as rarely as possible. Starts and ends on cells that still need ink, so a drag from `cells[0]` to the last
 * cell paints (never erases) and only skips cells already correct.
 */
export function qaNextRun(p: Puzzle, cells: number[], current = 1): { color: number; cells: number[] } | null {
  const need = (i: number) => p.solution[i] > 0 && !p.given[i] && cells[i] !== p.solution[i];
  let best: { color: number; cells: number[]; gain: number } | null = null;
  const consider = (idx: number[]) => {
    // Walk the line's solution runs; inside each, span from its first to its last needing cell.
    let k = 0;
    while (k < idx.length) {
      const c = p.solution[idx[k]];
      if (c <= 0) { k++; continue; }
      let e = k;
      while (e + 1 < idx.length && p.solution[idx[e + 1]] === c) e++;
      const seg = idx.slice(k, e + 1);
      const first = seg.findIndex(need);
      if (first >= 0) {
        let last = seg.length - 1;
        while (!need(seg[last])) last--;
        const run = seg.slice(first, last + 1);
        const gain = run.filter(need).length;
        const score = gain + (c === current ? 1000 : 0);
        if (!best || score > best.gain + (best.color === current ? 1000 : 0)) best = { color: c, cells: run, gain };
      }
      k = e + 1;
    }
  };
  for (let r = 0; r < p.h; r++) consider(Array.from({ length: p.w }, (_, c) => r * p.w + c));
  for (let c = 0; c < p.w; c++) consider(Array.from({ length: p.h }, (_, r) => r * p.w + c));
  if (!best) return null;
  const b = best as { color: number; cells: number[] };
  return { color: b.color, cells: b.cells };
}
