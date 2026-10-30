/// <reference types="node" />
// usage: npx tsx .tmp/isl05/t.ts file.txt   ; blocks separated by blank lines, first line "K name"
import { readFileSync } from "fs";
import { buildPuzzle, logicSolve, isKnown, startMasks, lineCount, lineIndices, clueOf, applyLine, lineName, maskValue } from "../../src/game/nonogram";
const parts = readFileSync(process.argv[2], "utf8").split(/\n\s*\n/).filter((s) => s.trim());
const only = process.argv[3];
for (const part of parts) {
  const lines = part.trim().split("\n");
  const [Ks, name] = lines[0].split(/\s+/);
  if (only && name !== only) continue;
  const K = Number(Ks);
  const art = lines.slice(1).join("\n");
  const run = (a: string) => { const p = buildPuzzle({ id: "t", title: "t", palette: Array(K).fill("#000"), art: a }); return { p, r: logicSolve(p) }; };
  const { p, r } = run(art);
  const plain = art.replace(/[A-F@,]/g, (c) => (c === "," ? "." : c === "@" ? "#" : c.toLowerCase()));
  const { r: r2 } = run(plain);
  const stamps = (art.match(/[A-F@,]/g) || []).length;
  console.log(`${name} ${p.w}x${p.h} ${r.unique ? "OK" : "STUCK " + r.unknown} steps ${r.steps} passes ${r.passes} search ${r.search.toFixed(1)} open0 ${r.firstOpen} | stamps ${stamps} | w/o stamps: ${r2.unique ? "OK" : "STUCK " + r2.unknown} passes ${r2.passes} search ${r2.search.toFixed(1)} open0 ${r2.firstOpen}`);
  const rows = art.split("\n").map((l) => l.trim()).filter(Boolean);
  if (process.argv.includes("-c")) {
    // candidate single stamps: gain of the stamp's row & col at start with stamp vs without
    const res: [number, string][] = [];
    const base = startMasks(p);
    const gainOf = (pp: typeof p, m: number[], l: number) => { const nx = applyLine(pp, m, l); return nx ? lineIndices(pp.w, pp.h, l).filter((i) => nx[i] !== m[i] && isKnown(nx[i])).length : 0; };
    for (let y = 0; y < rows.length; y++) for (let x = 0; x < rows[y].length; x++) {
      const ch = rows[y][x]; if ("~,@ABCDEF".includes(ch)) continue;
      const up = ch === "." ? "," : ch === "#" ? "@" : ch.toUpperCase();
      const nr = rows.slice(); nr[y] = nr[y].slice(0, x) + up + nr[y].slice(x + 1);
      const { p: p2, r: r2b } = run(nr.join("\n"));
      if (!r2b.unique) continue;
      const m2 = startMasks(p2);
      const gr = gainOf(p2, m2, y) - gainOf(p, base, y), gc = gainOf(p2, m2, p.h + x) - gainOf(p, base, p.h + x);
      res.push([Math.max(gr, gc), `(${y},${x})${ch} row+${gr} col+${gc} s${r2b.search.toFixed(0)}`]);
    }
    res.sort((a, b) => b[0] - a[0]);
    console.log("  best stamps: " + res.slice(0, 12).map((z) => z[1]).join(" | "));
  }
  if (process.argv.includes("-m")) {
    const m0 = startMasks(p);
    const out: string[] = [];
    for (let l = 0; l < lineCount(p); l++) {
      const idx = lineIndices(p.w, p.h, l);
      if (!idx.some((i) => p.given[i] && !p.void[i])) continue;
      const nx = applyLine(p, m0, l);
      const g = nx ? idx.filter((i) => nx[i] !== m0[i] && isKnown(nx[i])).length : 0;
      const clue = clueOf(p, l).blocks.map((b) => `${b.len}${K > 1 ? "abcdef"[b.color - 1] : ""}`).join(" ");
      const ln = nx ? idx.map((i) => (isKnown(nx[i]) ? (maskValue(nx[i]) === 0 ? "x" : K > 1 ? "abcdef"[maskValue(nx[i]) - 1] : "#") : "_")).join("") : "";
      out.push(`${lineName(p, l)} [${clue}] +${g} ${ln}`);
    }
    console.log("  stamp lines at start: " + out.join(" | "));
  }
  if (process.argv.includes("-f") && r.unique) {
    const out: string[] = [];
    for (let y = 0; y < rows.length; y++) for (let x = 0; x < rows[y].length; x++) {
      const ch = rows[y][x]; if ("~,@ABCDEF".includes(ch)) continue;
      const opts = K === 1 ? [ch === "." ? "#" : "."] : [".", "a", "b", "c"].slice(0, K + 1).filter((c) => c !== ch);
      for (const o of opts) {
        const nr = rows.slice(); nr[y] = nr[y].slice(0, x) + o + nr[y].slice(x + 1);
        const { r: r3 } = run(nr.join("\n"));
        if (r3.unique || r3.contradiction) continue;
        // which single stamps fix
        const fixes: string[] = [];
        for (let yy = 0; yy < nr.length; yy++) for (let xx = 0; xx < nr[yy].length; xx++) {
          const c2 = nr[yy][xx]; if ("~,@ABCDEF".includes(c2)) continue;
          const up = c2 === "." ? "," : c2 === "#" ? "@" : c2.toUpperCase();
          const n2 = nr.slice(); n2[yy] = n2[yy].slice(0, xx) + up + n2[yy].slice(xx + 1);
          const { r: r4 } = run(n2.join("\n"));
          if (r4.unique) fixes.push(`(${yy},${xx})${c2}`);
        }
        if (fixes.length) out.push(`flip (${y},${x})${ch}->${o} unk ${r3.unknown} fixes: ${fixes.slice(0, 8).join(" ")}`);
      }
    }
    console.log(out.join("\n"));
  }
  if (process.argv.includes("-s") && !r.unique) {
    // list single stamps that make it unique, or reduce unknowns most
    const res: [number, string][] = [];
    for (let y = 0; y < rows.length; y++) for (let x = 0; x < rows[y].length; x++) {
      const ch = rows[y][x]; if ("~,@ABCDEF".includes(ch)) continue;
      const up = ch === "." ? "," : ch === "#" ? "@" : ch.toUpperCase();
      const nr = rows.slice(); nr[y] = nr[y].slice(0, x) + up + nr[y].slice(x + 1);
      const { r: r3 } = run(nr.join("\n"));
      res.push([r3.unique ? -r3.passes : (r3.contradiction ? 9999 : r3.unknown), `(${y},${x})${ch}`]);
    }
    res.sort((a, b) => a[0] - b[0]);
    console.log("  stamp candidates:", res.slice(0, 14).map(([u, s]) => `${s}:${u <= 0 ? "OK" + -u : u}`).join(" "));
  }
  if (!r.unique) console.log(rows.map((row, y) => [...row].map((ch, x) => (isKnown(r.masks[y * p.w + x]) ? ch : "?")).join("")).join("\n"));
  else if (process.argv.includes("-e")) {
    let masks = startMasks(p);
    for (let k = 0; k < 8; k++) {
      let best = -1, bestGain = 0, bestM: number[] | null = null, productive = 0, open = 0;
      for (let l = 0; l < lineCount(p); l++) {
        const idx = lineIndices(p.w, p.h, l);
        if (idx.every((i) => isKnown(masks[i]))) continue;
        open++;
        const nx = applyLine(p, masks, l);
        if (!nx || nx === masks) continue;
        productive++;
        const g = idx.filter((i) => nx[i] !== masks[i] && isKnown(nx[i])).length;
        if (g > bestGain) { best = l; bestGain = g; bestM = nx; }
      }
      if (!bestM) break;
      const idx = lineIndices(p.w, p.h, best);
      const clue = clueOf(p, best).blocks.map((b) => `${b.len}${K > 1 ? "abcdef"[b.color - 1] : ""}`).join(" ");
      const ln = idx.map((i) => (isKnown(bestM![i]) ? (maskValue(bestM![i]) === 0 ? "x" : K > 1 ? "abcdef"[maskValue(bestM![i]) - 1] : "#") : "_")).join("");
      const before = idx.map((i) => (isKnown(masks[i]) ? (maskValue(masks[i]) === 0 ? "x" : K > 1 ? "abcdef"[maskValue(masks[i]) - 1] : "#") : "_")).join("");
      const st = idx.some((i) => p.given[i] && !p.void[i]) ? "*" : " ";
      console.log(`  ${st}${k + 1}: ${lineName(p, best)} [${clue}] ${before} -> ${ln} (+${bestGain}; ${productive}/${open})`);
      masks = bestM;
    }
  }
}
