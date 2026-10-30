// For an art (no stamps), try single/double cell flips that make it ambiguous, then single stamps that restore uniqueness.
import * as path from "path";
import { buildPuzzle, logicSolve } from "../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[])[Number(process.argv[3] ?? 0)];
  const rows: string[] = s.art.trim().split("\n").map((l: string) => l.trim());
  const H = rows.length, W = rows[0].length;
  const set = (rs: string[], r: number, c: number, ch: string) => rs.map((l, k) => (k === r ? l.slice(0, c) + ch + l.slice(c + 1) : l));
  const res: string[] = [];
  for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) {
    const ch = rows[r][c]; if (ch !== "." && ch !== "#") continue;
    const rs = set(rows, r, c, ch === "." ? "#" : ".");
    const b = logicSolve(buildPuzzle({ ...s, art: rs.join("\n") }));
    if (b.unique || b.contradiction || b.unknown > 12) continue;
    for (let i = 0; i < H * W; i++) {
      const m = b.masks[i]; if (!(m & (m - 1))) continue;
      const rr = Math.floor(i / W), cc = i % W, c2 = rs[rr][cc];
      const st = c2 === "." ? "," : "@";
      const rs2 = set(rs, rr, cc, st);
      const q = logicSolve(buildPuzzle({ ...s, art: rs2.join("\n") }));
      if (q.unique) res.push(`flip r${r + 1}c${c + 1}->${ch === "." ? "#" : "."} stamp r${rr + 1}c${cc + 1}${st} unk${b.unknown} looks ${q.steps} passes ${q.passes} open ${q.firstOpen}`);
    }
  }
  console.log(res.join("\n") || "none");
})();
