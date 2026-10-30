import * as path from "path";
import { buildPuzzle, logicSolve } from "../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const specs = Object.values(mod).flat() as any[];
  for (const s of specs) {
    const rows = s.art.trim().split("\n").map((l: string) => l.trim());
    const base = logicSolve(buildPuzzle(s));
    console.log(`${s.id}: base ${base.unique ? "UNIQUE" : "unknown " + base.unknown}`);
    if (base.unique) continue;
    const out: string[] = [];
    for (let r = 0; r < rows.length; r++) for (let c = 0; c < rows[r].length; c++) {
      const i = r * rows[r].length + c;
      const m = base.masks[i];
      if (!(m & (m - 1))) continue;
      const ch = rows[r][c];
      const st = ch === "." ? "," : ch === "#" ? "@" : "abcdef".includes(ch) ? ch.toUpperCase() : null;
      if (!st) continue;
      const art = rows.map((l: string, k: number) => (k === r ? l.slice(0, c) + st + l.slice(c + 1) : l)).join("\n");
      const res = logicSolve(buildPuzzle({ ...s, art }));
      if (res.unique) out.push(`r${r + 1}c${c + 1}${st} looks ${res.steps} passes ${res.passes} open ${res.firstOpen}`);
    }
    console.log(out.length ? "  " + out.join("\n  ") : "  no single stamp works");
  }
})();
