// npx tsx .design/r7-b/mut.ts <file> <idx> <tally|smudge|crack> [maxLooks]
// try single-cell edits of spec idx; report edits where one line as the mechanic is NEEDED and the board is OK
import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[])[+process.argv[3]];
  const kind = process.argv[4]; const maxL = +(process.argv[5] ?? 99); const only = process.argv[6] ? process.argv[6].split(",") : null;
  const rows = s.art.trim().split("\n");
  const h = rows.length, w = rows[0].length;
  const syms = [".", ..."abcdef".slice(0, s.palette.length)];
  const res: string[] = [];
  const test = (art: string, tag: string) => {
    for (let l = 0; l < w + h; l++) {
      const nm = l < h ? "r" + l : "c" + (l - h);
      const nmh = l < h ? "r" + (l + 1) : "c" + (l - h + 1); if (only && !only.includes(nmh)) continue;
      const sp = { ...s, art, [kind === "tally" ? "tally" : "smudge"]: [...(kind === "tally" ? [] : s.smudge ?? []), nm] };
      let r; try { r = logicSolve(buildPuzzle(sp)); } catch { continue; }
      if (!r.unique || r.steps > maxL) continue;
      if (kind === "tally") { const q = logicSolve(buildPuzzle({ ...s, art, tally: [], smudge: [nm] })); if (q.unique) continue; }
      if (kind === "smudge") { const q = logicSolve(buildPuzzle({ ...s, art, smudge: [] })); if (q.steps >= r.steps) continue; }
      res.push(`${tag} ${nmh} looks ${r.steps} passes ${r.passes} open ${r.firstOpen}`);
    }
  };
  test(rows.join("\n"), "base");
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) for (const c of syms) {
    if (rows[y][x] === c || rows[y][x] === "~") continue;
    const nr = rows.map((r: string, i: number) => i === y ? r.slice(0, x) + c + r.slice(x + 1) : r);
    test(nr.join("\n"), `(${y + 1},${x + 1})=${c}`);
  }
  console.log(res.join("\n"));
})();
