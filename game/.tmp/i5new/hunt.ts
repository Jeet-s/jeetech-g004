// for art (may contain stamps) report: stamp-aware explain; with --hunt, try each single extra stamp and report first step using it
import { readFileSync } from "fs";
import { buildPuzzle, logicSolve, startMasks, applyLine, lineIndices, isKnown } from "../../src/game/nonogram";
const art = readFileSync(process.argv[2], "utf8").trim();
const hunt = process.argv.includes("--hunt");
const pal = Array(6).fill("#000");
const full = (K: number) => (1 << (K + 1)) - 1;
function firstStampUse(a: string, maxSteps = Number(process.env.MS ?? 6)): [number, string] {
  const p = buildPuzzle({ id: "t", title: "t", palette: pal, art: a });
  const K = p.palette.length;
  let masks = startMasks(p);
  const L = p.w + p.h;
  for (let k = 0; k < maxSteps; k++) {
    let best = -1, bestGain = 0, bestM: number[] | null = null;
    for (let l = 0; l < L; l++) {
      const idx = lineIndices(p.w, p.h, l);
      if (idx.every((i) => isKnown(masks[i]))) continue;
      const nx = applyLine(p, masks, l); if (!nx || nx === masks) continue;
      const g = idx.filter((i) => nx[i] !== masks[i] && isKnown(nx[i])).length;
      if (g > bestGain) { best = l; bestGain = g; bestM = nx; }
    }
    if (!bestM) break;
    const idx = lineIndices(p.w, p.h, best);
    const st = idx.filter((i) => p.given[i]);
    if (st.length) {
      // would the line yield as much without its stamps?
      const m2 = masks.slice(); for (const i of st) m2[i] = full(K);
      const nx2 = applyLine(p, m2, best);
      const g2 = nx2 ? idx.filter((i) => !p.given[i] && nx2[i] !== m2[i] && isKnown(nx2[i]) ).length : 0;
      const g1 = idx.filter((i) => !p.given[i] && bestM![i] !== masks[i] && isKnown(bestM![i])).length;
      if (g2 < g1) return [k + 1, (best < p.h ? `row ${best + 1}` : `column ${best - p.h + 1}`) + ` +${g1} (w/o ${g2})`];
    }
    masks = bestM;
  }
  return [99, ""];
}
const r = logicSolve(buildPuzzle({ id: "t", title: "t", palette: pal, art }));
console.log(`base ${r.unique ? "OK" : "STUCK " + r.unknown} p${r.passes} s${r.search.toFixed(1)} open${r.firstOpen} stampUse ${firstStampUse(art)}`);
if (hunt) {
  const rows = art.split("\n"); const out: [number, string][] = [];
  for (let y = 0; y < rows.length; y++) for (let x = 0; x < rows[0].length; x++) {
    const ch = rows[y][x]; if (!".#abcdef".includes(ch)) continue;
    const s = ch === "." ? "," : ch === "#" ? "@" : ch.toUpperCase();
    const a2 = rows.map((rr, yy) => (yy === y ? rr.slice(0, x) + s + rr.slice(x + 1) : rr)).join("\n");
    const r2 = logicSolve(buildPuzzle({ id: "t", title: "t", palette: pal, art: a2 }));
    if (!r2.unique) continue;
    const [k, d] = firstStampUse(a2);
    if (k <= Number(process.env.MK ?? 4)) out.push([k * 1000 - r2.search, `r${y}c${x}${s} step${k} ${d} p${r2.passes} s${r2.search.toFixed(0)}`]);
  }
  out.sort((a, b) => a[0] - b[0]).forEach((o) => console.log(o[1]));
}
