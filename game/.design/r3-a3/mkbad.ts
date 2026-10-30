// find small tally sets (mixed-colour lines) that make the board BAD, then single stamps that rescue with every tally needed
import * as path from "path";
import { buildPuzzle, logicSolve, clueOf } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[]).find((x) => x.id === process.argv[3]);
  const maxK = +(process.argv[4] ?? 2), maxP = +(process.argv[5] ?? 9);
  const rows = s.art.trim().split("\n"); const H = rows.length, W = rows[0].length;
  const p = buildPuzzle({ ...s, tally: [] });
  const fixedT: string[] = s.tally ?? [];
  const L: string[] = [];
  for (let l = 0; l < H + W; l++) { const k = l < H ? "r" + l : "c" + (l - H); if (fixedT.includes(k) || (s.smudge ?? []).includes(k)) continue; const bl = clueOf(p, l).blocks; const nc = new Set(bl.map((b: any) => b.color)).size; const tot = bl.reduce((a: number, b: any) => a + b.len, 0); if (nc >= +(process.env.MINC ?? 2) && tot < (l < H ? W : H)) L.push(k); }
  const nm = (k: string) => k[0] + (+k.slice(1) + 1);
  const sets: string[][] = [];
  const rec = (st: number, cur: string[]) => { if (cur.length) sets.push(cur.slice()); if (cur.length === maxK) return; for (let i = st; i < L.length; i++) { cur.push(L[i]); rec(i + 1, cur); cur.pop(); } };
  rec(0, []);
  const res: string[] = [];
  for (const add of sets) {
    const T = [...fixedT, ...add];
    const b = logicSolve(buildPuzzle({ ...s, tally: T })); if (b.unique) continue;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const ch = rows[y][x]; if (ch === "~" || /[A-F,@]/.test(ch)) continue;
      const st = ch === "." ? (process.env.PAPER ? "," : null) : ch.toUpperCase(); if (!st) continue;
      const r2 = rows.slice(); r2[y] = r2[y].slice(0, x) + st + r2[y].slice(x + 1); const art = "\n" + r2.join("\n");
      const a = logicSolve(buildPuzzle({ ...s, art, tally: T })); if (!a.unique || a.passes > maxP) continue;
      let nNeed = 0;
      for (const t of T) { const c = logicSolve(buildPuzzle({ ...s, art, tally: T.filter((q) => q !== t), smudge: [...(s.smudge ?? []), t] })); if (!c.unique) nNeed++; }
      const allS = logicSolve(buildPuzzle({ ...s, art, tally: [], smudge: [...(s.smudge ?? []), ...T] }));
      const ok = process.env.LOOSE ? (nNeed >= 1 && !allS.unique) : nNeed === T.length;
      if (ok) res.push(`need ${nNeed}/${T.length} ` + `T=${T.map(nm).join("+")} stamp (${y + 1},${x + 1})=${st} passes ${a.passes} looks ${a.steps} open ${a.firstOpen}`);
    }
  }
  console.log(res.slice(0, +(process.env.TOP ?? 40)).join("\n")); console.log("found", res.length);
})();
