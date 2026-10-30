import { readFileSync } from "fs";
import { buildPuzzle, logicSolve, isKnown, startMasks, applyLine, lineCount, lineIndices, clueOf, lineName, maskValue } from "../../src/game/nonogram";
const parts = readFileSync(process.argv[2], "utf8").split(/\n\s*\n/).filter((s) => s.trim());
const N = Number(process.argv[3] ?? 0);
for (const raw of parts) {
  const lines = raw.split("\n").map(l=>l.trim()).filter(Boolean);
  const title = lines[0].startsWith("=") ? lines.shift() : "";
  const art = lines.join("\n");
  const p = buildPuzzle({ id: "t", title: "t", palette: ["#000"], art });
  const r = logicSolve(p);
  console.log(`${title} ${p.w}x${p.h} ${r.unique ? "OK" : `STUCK ${r.unknown}`} steps ${r.steps} passes ${r.passes} search ${r.search.toFixed(1)} open0 ${r.firstOpen}`);
  const empty: string[] = [];
  for (let l = 0; l < lineCount(p); l++) if (!clueOf(p, l).blocks.length) empty.push(lineName(p, l));
  if (empty.length) console.log("EMPTY", empty.join(","));
  if (!r.unique) console.log(lines.map((row, y) => [...row].map((ch, x) => (isKnown(r.masks[y * p.w + x]) ? ch : "?")).join("")).join("\n"));
  if (N) {
    let masks = startMasks(p);
    for (let k = 0; k < N; k++) {
      let best = -1, bestGain = 0, bestM: number[] | null = null, productive = 0, open = 0; const prodL: string[] = [];
      for (let l = 0; l < lineCount(p); l++) {
        const idx = lineIndices(p.w, p.h, l);
        if (idx.every((i) => isKnown(masks[i]))) continue;
        open++;
        const nx = applyLine(p, masks, l);
        if (!nx || nx === masks) continue;
        productive++; if (k===0) prodL.push(lineName(p,l).replace("row ","r").replace("column ","c")+"["+clueOf(p,l).blocks.map(b=>b.len).join(" ")+"]");
        const g = idx.filter((i) => nx[i] !== masks[i] && isKnown(nx[i])).length;
        if (g > bestGain) { best = l; bestGain = g; bestM = nx; }
      }
      if (k===0) console.log("  open:", prodL.join(" "));
      if (!bestM) break;
      const idx = lineIndices(p.w, p.h, best);
      const clue = clueOf(p, best).blocks.map((b) => b.len).join(" ");
      const line = idx.map((i) => (isKnown(bestM![i]) ? (maskValue(bestM![i]) === 0 ? "x" : "#") : "_")).join("");
      console.log(`   ${k + 1}: ${lineName(p, best)} [${clue}] -> ${line} (+${bestGain}; ${productive}/${open})`);
      masks = bestM;
    }
  }
}
