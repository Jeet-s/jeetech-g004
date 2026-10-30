import { buildPuzzle, startMasks, applyLine, lineCount, lineIndices, clueOf, lineName, isKnown, maskValue } from "../../src/game/nonogram";
import { ISL08 } from "../../src/game/islands/isl08";
const lv = Number(process.argv[2]); const spec: any = ISL08[lv - 1]; const p = buildPuzzle(spec);
const K = p.palette.length;
const special = new Set<number>();
for (const s of [...(spec.crack ?? []), ...(spec.smudge ?? [])]) { const k = Number(s.split(".")[0].slice(1)); special.add(s[0] === "r" ? k : p.h + k); }
const sh = (m: number[], l: number) => lineIndices(p.w, p.h, l).map((i) => (isKnown(m[i]) ? (maskValue(m[i]) === 0 ? "x" : "abcdef"[maskValue(m[i]) - 1]) : "_")).join("");
let masks = startMasks(p);
console.log(spec.id, spec.crack, spec.smudge);
for (let k = 0; k < 200; k++) {
  let best = -1, bestGain = 0, bestM: number[] | null = null;
  for (let l = 0; l < lineCount(p); l++) {
    const idx = lineIndices(p.w, p.h, l);
    if (clueOf(p, l).smudged || idx.every((i) => isKnown(masks[i]))) continue;
    const nx = applyLine(p, masks, l); if (!nx || nx === masks) continue;
    const g = idx.filter((i) => nx[i] !== masks[i] && isKnown(nx[i])).length;
    if (g > bestGain) { best = l; bestGain = g; bestM = nx; }
  }
  if (!bestM) break;
  const clue = clueOf(p, best).blocks.map((b) => `${b.hidden ? "?" : b.len}${"abcdef"[b.color - 1]}`).join(" ");
  const touched = [...special].filter((l) => sh(masks, l) !== sh(bestM!, l));
  if (special.has(best) || touched.length) console.log(`step ${k + 1}: ${lineName(p, best)} [${clue}] -> ${sh(bestM, best)}` + touched.filter(l=>l!==best).map((l) => `  | ${lineName(p, l)}: ${sh(bestM!, l)}`).join(""));
  masks = bestM;
}
