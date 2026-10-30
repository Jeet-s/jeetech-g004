/// <reference types="node" />
/**
 * Art checker for level authors: builds every picture through the real engine, proves it solves by
 * line logic alone to exactly the drawn picture, and prints the solver facts used to place it on
 * the difficulty curve.
 *   npx tsx scripts/art-check.ts <islandNumber | path/to/islNN.ts> [--show] [--explain] [--repair] [--stamp]
 * --explain: print the first deductions of the best-first solver (to write true "aha" lines).
 * --repair : for a stuck picture, search greedy single-cell edits (≤ 8) that make it line-solvable
 *            and print the repaired art (review it — keep the picture recognisable!).
 * --stamp  : like --repair but adds stamped (given) cells instead of editing the picture.
 */
import * as path from "path";
import { buildPuzzle, logicSolve, isKnown, startMasks, applyLine, lineCount, lineIndices, clueOf, lineName, maskValue, type Puzzle, type PuzzleSpec } from "../src/game/nonogram";
import type { LevelSpec } from "../src/game/types";

const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith("--"));
const show = args.includes("--show");
const explainMode = args.includes("--explain");
const repairMode = args.includes("--repair") ? "edit" : args.includes("--stamp") ? "stamp" : null;

const CH = ".#abcdef";
const UP = ",@ABCDEF";

function artRows(spec: PuzzleSpec): string[] {
  return spec.art.split("\n").map((l) => l.trim()).filter(Boolean);
}

function unknownCount(spec: PuzzleSpec): { unknown: number; ok: boolean } {
  try {
    const p = buildPuzzle(spec);
    const r = logicSolve(p);
    return { unknown: r.contradiction ? 9999 : r.unknown, ok: r.unique };
  } catch {
    return { unknown: 9999, ok: false };
  }
}

function repair(spec: PuzzleSpec, mode: "edit" | "stamp"): PuzzleSpec | null {
  let cur = spec;
  for (let round = 0; round < 10; round++) {
    const p = buildPuzzle(cur);
    const r = logicSolve(p);
    if (r.unique) return cur;
    const rows = artRows(cur);
    const w = p.w, h = p.h, K = p.palette.length;
    const unk = new Set<number>();
    r.masks.forEach((m, i) => { if (!isKnown(m)) unk.add(i); });
    const cand = new Set<number>();
    for (const i of unk) {
      const rr = Math.floor(i / w), cc = i % w;
      if (mode === "stamp") { cand.add(i); continue; }
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        const a = rr + dr, b = cc + dc;
        if (a >= 0 && a < h && b >= 0 && b < w) cand.add(a * w + b);
      }
    }
    let best: PuzzleSpec | null = null, bestU = r.unknown;
    for (const i of cand) {
      const rr = Math.floor(i / w), cc = i % w;
      const ch = rows[rr][cc];
      if (ch === "~" || UP.includes(ch)) continue;
      const opts: string[] = [];
      if (mode === "stamp") opts.push(UP[CH.indexOf(ch) >= 0 ? CH.indexOf(ch) : 1] ?? ch);
      else for (let v = 0; v <= K; v++) { const c = v === 0 ? "." : K === 1 ? "#" : CH[v + 1]; if (c !== ch) opts.push(c); }
      for (const o of opts) {
        const nr = rows.slice();
        nr[rr] = nr[rr].slice(0, cc) + o + nr[rr].slice(cc + 1);
        const ns = { ...cur, art: "\n" + nr.join("\n") };
        const u = unknownCount(ns);
        if (u.ok) return ns;
        if (u.unknown < bestU) { bestU = u.unknown; best = ns; }
      }
    }
    if (!best) return null;
    cur = best;
  }
  return null;
}

function explain(p: Puzzle, steps = 8) {
  let masks = startMasks(p);
  const K = p.palette.length;
  for (let k = 0; k < steps; k++) {
    let best = -1, bestGain = 0, bestM: number[] | null = null, productive = 0, open = 0;
    for (let l = 0; l < lineCount(p); l++) {
      const idx = lineIndices(p.w, p.h, l);
      if (clueOf(p, l).smudged || idx.every((i) => isKnown(masks[i]))) continue;
      open++;
      const nx = applyLine(p, masks, l);
      if (!nx || nx === masks) continue;
      productive++;
      const g = idx.filter((i) => nx[i] !== masks[i] && isKnown(nx[i])).length;
      if (g > bestGain) { best = l; bestGain = g; bestM = nx; }
    }
    if (!bestM) break;
    const idx = lineIndices(p.w, p.h, best);
    const clue = clueOf(p, best).blocks.map((b) => `${b.hidden ? "?" : b.len}${K > 1 ? "abcdef"[b.color - 1] : ""}`).join(" ") || "0";
    const line = idx.map((i) => (isKnown(bestM![i]) ? (maskValue(bestM![i]) === 0 ? "x" : K > 1 ? "abcdef"[maskValue(bestM![i]) - 1] : "#") : "_")).join("");
    console.log(`   step ${k + 1}: ${lineName(p, best)} [${clue}] -> ${line}   (+${bestGain} cells; ${productive}/${open} lines yield)`);
    masks = bestM;
  }
}

async function main() {
  const file = !target ? null : /^\d+$/.test(target) ? `src/game/islands/isl${target.padStart(2, "0")}.ts` : target;
  if (!file) throw new Error("usage: art-check.ts <islandNumber | file>");
  const mod = await import(path.resolve(file));
  const specs = Object.values(mod).find((v) => Array.isArray(v)) as LevelSpec[];
  let bad = 0, n = 0;
  const seen = new Map<string, string>();
  console.log(`== ${file}: ${specs.length} levels ==`);
  for (const spec of specs) {
    n++;
    let p: Puzzle;
    try { p = buildPuzzle(spec); } catch (e) { console.log(`#${n} ${spec.id}: BUILD ERROR ${(e as Error).message}`); bad++; continue; }
    const r = logicSolve(p);
    const status = r.unique ? "OK " : r.contradiction ? "CONTRADICTION" : `STUCK(${r.unknown} unknown)`;
    const ahaLen = spec.aha.length;
    const key = spec.art.replace(/\s/g, "");
    if (seen.has(key)) { console.log(`#${n} ${spec.id}: DUPLICATE ART of ${seen.get(key)}`); bad++; }
    seen.set(key, spec.id);
    const emptyLines: string[] = [];
    for (let l = 0; l < lineCount(p); l++) if (!clueOf(p, l).blocks.length && !lineIndices(p.w, p.h, l).every((i) => p.void[i])) emptyLines.push(lineName(p, l));
    console.log(`#${String(n).padStart(2)} ${spec.id.padEnd(16)} ${p.w}x${p.h} K${p.palette.length} ${status} steps ${r.steps} passes ${r.passes} search ${r.search.toFixed(1)} open0 ${r.firstOpen} min ${r.minProductive} [${spec.role}] aha ${ahaLen}ch${ahaLen > 170 ? " (TOO LONG)" : ""}${emptyLines.length ? ` EMPTY LINES: ${emptyLines.join(", ")}` : ""}`);
    if (!r.unique) {
      bad++;
      const rows = artRows(spec);
      const grid = rows.map((row, y) => [...row].map((ch, x) => (isKnown(r.masks[y * p.w + x]) ? ch : "?")).join("")).join("\n");
      console.log(grid);
      if (repairMode) {
        const fixed = repair(spec, repairMode);
        if (fixed) {
          const fr = artRows(fixed);
          const diff: string[] = [];
          fr.forEach((row, y) => [...row].forEach((ch, x) => { if (ch !== rows[y][x]) diff.push(`(${y},${x}) ${rows[y][x]}→${ch}`); }));
          console.log(`  repaired with ${diff.length} edit(s): ${diff.join(" ")}\n${fr.join("\n")}`);
        } else console.log("  no repair found within 10 edits");
      }
    } else {
      if (show) console.log(artRows(spec).join("\n"));
      if (explainMode) explain(p);
    }
  }
  console.log(`\n${n - bad}/${n} pictures solve by logic alone`);
  process.exit(bad ? 1 : 0);
}
main();
