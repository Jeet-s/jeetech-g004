import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[]).find((x) => x.id === process.argv[3]);
  const [r0, r1, c0, c1] = process.argv[4].split(",").map(Number);
  const vals = process.argv[5].split("");
  const tl = process.argv[6].split(",").map((x) => (x[0] === "r" ? "r" : "c") + (+x.slice(1) - 1));
  const g0 = s.art.split("\n").map((l: string) => l.trim()).filter((l: string) => l.length);
  const set = (g: string[], r: number, c: number, v: string) => g.map((l, k) => (k === r ? l.slice(0, c) + v + l.slice(c + 1) : l));
  const t0 = Date.now();
  for (let r = r0 - 1; r < r1; r++) for (let c = c0 - 1; c < c1; c++) for (const v of vals) {
    if (g0[r][c] === "~" || g0[r][c] === v) continue;
    const g = set(g0, r, c, v); const sp = { ...s, art: g.join("\n") };
    for (const l of tl) {
      try {
        const q = logicSolve(buildPuzzle({ ...sp, smudge: [...(s.smudge ?? []), l] })); if (q.unique) continue;
        const res = logicSolve(buildPuzzle({ ...sp, tally: [l] })); if (!res.unique) continue;
        console.log(`r${r + 1}c${c + 1}=${v} tally ${l[0]}${+l.slice(1) + 1} looks ${res.steps} passes ${res.passes} open ${res.firstOpen} (smudged unk ${q.unknown})`);
      } catch {}
    }
    if (Date.now() - t0 > 90000) { console.log("timeout"); process.exit(0); }
  }
})();
