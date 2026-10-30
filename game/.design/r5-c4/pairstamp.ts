import * as path from "path";
import { buildPuzzle, logicSolve, clueOf } from "../../src/game/nonogram";
// for spec with crack[0] fixed: try adding a second crack; if non-unique, try one stamp in row given by argv[3] (1-based) or anywhere
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const rowOnly = process.argv[3] ? +process.argv[3] - 1 : -1;
  const specs = Object.values(mod).flat() as any[];
  for (const s of specs) {
    const p = buildPuzzle(s);
    const rows = s.art.trim().split("\n").map((l: string) => l.trim());
    const opts: string[][] = [s.crack];
    for (let l = 0; l < p.h + p.w; l++) { const bl = clueOf(p, l).blocks; for (let k = 0; k < bl.length; k++) { const key = (l < p.h ? "r" + l : "c" + (l - p.h)) + "." + k; if (!s.crack.includes(key)) opts.push([...s.crack, key]); } }
    for (const crack of opts) {
      const base = logicSolve(buildPuzzle({ ...s, crack }));
      if (base.unique) continue;
      for (let r = 0; r < rows.length; r++) { if (rowOnly >= 0 && r !== rowOnly) continue; for (let c = 0; c < rows[r].length; c++) {
        const m = base.masks[r * rows[r].length + c]; if (!(m & (m - 1))) continue;
        const ch = rows[r][c]; const st = ch === "." ? "," : ch === "#" ? "@" : "abcdef".includes(ch) ? ch.toUpperCase() : null; if (!st) continue;
        const art = rows.map((l: string, k: number) => (k === r ? l.slice(0, c) + st + l.slice(c + 1) : l)).join("\n");
        const res = logicSolve(buildPuzzle({ ...s, crack, art }));
        if (res.unique) console.log(`${s.id} crack ${crack.join(",")} stamp r${r + 1}c${c + 1}${st} looks ${res.steps} passes ${res.passes} open ${res.firstOpen} (base unk ${base.unknown})`);
      } }
    }
  }
})();
