import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[]).find((x) => x.id === process.argv[3]);
  const syms = process.argv[4] ?? ".#";
  const rows: string[] = s.art.trim().split("\n").map((l: string) => l.trim());
  const set = (rs: string[], r: number, c: number, ch: string) => rs.map((l, k) => (k === r ? l.slice(0, c) + ch + l.slice(c + 1) : l));
  const stampOf = (ch: string) => (ch === "." ? "," : ch === "#" ? "@" : ch.toUpperCase());
  const tryStamps = (rs: string[], base: any) => { const ok: string[] = [];
    for (let rr = 0; rr < rs.length; rr++) for (let cc = 0; cc < rs[rr].length; cc++) {
      const m = base.masks[rr * rs[rr].length + cc]; if (!(m & (m - 1))) continue;
      const ch = rs[rr][cc]; if (!syms.includes(ch)) continue;
      const res = logicSolve(buildPuzzle({ ...s, art: set(rs, rr, cc, stampOf(ch)).join("\n") }));
      if (res.unique) ok.push(`r${rr + 1}c${cc + 1}${stampOf(ch)}(p${res.passes},l${res.steps})`);
    } return ok; };
  const b0 = logicSolve(buildPuzzle(s));
  if (!b0.unique) { console.log("base unk", b0.unknown, tryStamps(rows, b0).join(" ")); }
  for (let r = 0; r < rows.length; r++) for (let c = 0; c < rows[r].length; c++) {
    const ch = rows[r][c]; if (!syms.includes(ch)) continue;
    for (const to of syms) { if (to === ch) continue;
      const rs = set(rows, r, c, to);
      const base = logicSolve(buildPuzzle({ ...s, art: rs.join("\n") }));
      if (base.unique || base.unknown > 10) continue;
      const ok = tryStamps(rs, base);
      if (ok.length) console.log(`r${r + 1}c${c + 1}${ch}->${to} unk ${base.unknown}: ${ok.join(" ")}`);
    }
  }
})();
