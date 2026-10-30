import * as path from "path";
import { buildPuzzle, logicSolve, lineCount, lineIndices, clueOf, startMasks, applyLine } from "../src/game/nonogram";
import { LEVELS } from "../src/game/levels";
const sig = (p: any) => JSON.stringify([p.rows, p.cols, p.w, p.h]);
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const specs = Object.values(mod).flat() as any[];
  const known = new Map(LEVELS.map((l) => [sig(l.puzzle), l.spec.id]));
  for (const s of specs) {
    try {
      const p = buildPuzzle(s);
      const r = logicSolve(p);
      const m0 = startMasks(p);
      const first: string[] = [];
      for (let l = 0; l < lineCount(p); l++) { if (clueOf(p, l).smudged) continue; const nx = applyLine(p, m0, l); if (nx && nx !== m0) first.push(l < p.h ? `r${l + 1}` : `c${l - p.h + 1}`); }
      const clue = (l: number) => { const c = clueOf(p, l); return (c.smudged ? "S:" : "") + ((c as any).tally ? "TALLY:" : "") + c.blocks.map((b: any) => (b.hidden ? "?" : b.len) + (p.palette.length > 1 ? "abcdef"[b.color - 1] : "")).join(" "); };
      const rows = Array.from({ length: p.h }, (_, r) => clue(r)).join(" | ");
      const cols = Array.from({ length: p.w }, (_, c) => clue(p.h + c)).join(" | ");
      const dup = known.get(sig(p));
      if (/[,@A-F]/.test(s.art)) { const q = buildPuzzle({ ...s, art: s.art.replace(/,/g, ".").replace(/@/g, "#").replace(/[A-F]/g, (c: string) => c.toLowerCase()) }); const rr = logicSolve(q); console.log(`  no-stamp: ${rr.unique ? "STILL UNIQUE (stamp decorative)" : "needs stamp (" + rr.unknown + " unknown)"} looks ${rr.steps}`); }
      if (s.smudge?.length || s.crack?.length || s.tally?.length) { const q = buildPuzzle({ ...s, smudge: [], crack: [], tally: [] }); const rr = logicSolve(q); console.log(`  plain clues: looks ${rr.steps} passes ${rr.passes} open ${rr.firstOpen}`); }
      if (s.tally?.length) { const q = buildPuzzle({ ...s, tally: [], smudge: [...(s.smudge ?? []), ...s.tally] }); const rr = logicSolve(q); console.log(`  tally-as-smudge: ${rr.unique ? "STILL UNIQUE (tally count never used - decorative)" : "tally count NEEDED (" + rr.unknown + " unknown without it)"}`); }
      if (!r.unique) { const g: string[] = []; for (let y = 0; y < p.h; y++) { let t = ""; for (let x = 0; x < p.w; x++) { const m = r.masks[y * p.w + x]; t += (m & (m - 1)) ? "?" : p.solution[y * p.w + x] ? "#" : "."; } g.push("    " + t); } console.log(g.join("\n")); }
      console.log(`${s.id} ${p.w}x${p.h} ${r.unique ? "OK" : "BAD(" + r.unknown + ")"} looks ${r.steps} passes ${r.passes} open ${r.firstOpen} search ${r.search.toFixed(1)} first[${first.join(",")}]${dup && dup !== s.id ? " DUP " + dup : ""}\n  rows: ${rows}\n  cols: ${cols}`);
    } catch (e) { console.log(s.id, "ERR", (e as Error).message); }
  }
})();
