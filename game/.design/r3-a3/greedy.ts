// tsx greedy.ts file id maxPasses [maxLines] -- list all-needed tally sets of size 1..maxLines (extending), lines with >=2 colours
import * as path from "path";
import { buildPuzzle, logicSolve, clueOf } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[]).find((x) => x.id === process.argv[3]);
  const maxP = +(process.argv[4] ?? 9), maxL = +(process.argv[5] ?? 4), minC = +(process.env.MINC ?? 2);
  const p = buildPuzzle({ ...s, tally: [] }); const H = p.h, W = p.w;
  const nm = (k: string) => k[0] + (+k.slice(1) + 1);
  const base: string[] = s.tally ?? [];
  const L: string[] = [];
  for (let l = 0; l < H + W; l++) { const k = l < H ? "r" + l : "c" + (l - H); if (base.includes(k) || (s.smudge ?? []).includes(k)) continue; const bl = clueOf(p, l).blocks; const nc = new Set(bl.map((b: any) => b.color)).size; const tot = bl.reduce((a: number, b: any) => a + b.len, 0); if (nc >= minC && tot < (l < H ? W : H)) L.push(k); }
  const ok = (T: string[]) => { const a = logicSolve(buildPuzzle({ ...s, tally: T })); if (!a.unique) return null; for (const t of T) { if (base.includes(t) && process.env.LOOSE) continue; const c = logicSolve(buildPuzzle({ ...s, tally: T.filter((x) => x !== t), smudge: [...(s.smudge ?? []), t] })); if (c.unique) return null; } return a; };
  let frontier: string[][] = [base];
  const seen = new Set<string>();
  for (let size = base.length + 1; size <= maxL; size++) {
    const next: string[][] = [];
    for (const T of frontier) for (const l of L) {
      if (T.includes(l)) continue; const T2 = [...T, l].sort(); const key = T2.join(","); if (seen.has(key)) continue; seen.add(key);
      const a = logicSolve(buildPuzzle({ ...s, tally: T2 })); if (!a.unique) continue;
      next.push(T2);
      const r = ok(T2); if (r && r.passes <= maxP) console.log(`size ${size} T=${T2.map(nm).join("+")} passes ${r.passes} looks ${r.steps}`);
    }
    frontier = next.slice(0, +(process.env.BEAM ?? 400));
    if (!frontier.length) break;
  }
})();
