import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
// for each spec: plain solve; if not unique list single stamps that make it unique
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  for (const s of Object.values(mod).flat() as any[]) {
    const rows: string[] = s.art.trim().split("\n").map((l: string) => l.trim());
    const set = (rs: string[], r: number, c: number, ch: string) => rs.map((l, k) => (k === r ? l.slice(0, c) + ch + l.slice(c + 1) : l));
    const base = logicSolve(buildPuzzle({ ...s, art: rows.join("\n") }));
    if (base.unique) { console.log(s.id, "plain UNIQUE passes", base.passes); continue; }
    const ok: string[] = [];
    for (let rr = 0; rr < rows.length; rr++) for (let cc = 0; cc < rows[rr].length; cc++) {
      const m = base.masks[rr * rows[rr].length + cc]; if (!(m & (m - 1))) continue;
      const ch = rows[rr][cc]; const st = ch === "." ? "," : ch === "#" ? "@" : ch.toUpperCase();
      const res = logicSolve(buildPuzzle({ ...s, art: set(rows, rr, cc, st).join("\n") }));
      if (res.unique) ok.push(`r${rr + 1}c${cc + 1}${st}(p${res.passes},l${res.steps},o${res.firstOpen})`);
    }
    console.log(s.id, "unk", base.unknown, ok.join(" ") || "NO single stamp");
  }
})();
