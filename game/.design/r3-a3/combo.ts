// tsx combo.ts file id maxPasses -- pairs (smudge S, tally T): OK, T needed (T as smudge -> BAD); also with spec.tally/smudge fixed
import * as path from "path";
import { buildPuzzle, logicSolve, clueOf } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[]).find((x) => x.id === process.argv[3]);
  const maxP = +(process.argv[4] ?? 9);
  const p = buildPuzzle({ ...s, tally: [], smudge: [] }); const H = p.h, W = p.w;
  const fT: string[] = s.tally ?? [], fS: string[] = s.smudge ?? [];
  const nm = (k: string) => k[0] + (+k.slice(1) + 1);
  const all: string[] = []; const mixed: string[] = [];
  for (let l = 0; l < H + W; l++) { const k = l < H ? "r" + l : "c" + (l - H); if (fT.includes(k) || fS.includes(k)) continue; all.push(k); const bl = clueOf(p, l).blocks; const nc = new Set(bl.map((b: any) => b.color)).size; const tot = bl.reduce((a: number, b: any) => a + b.len, 0); if (nc >= 2 && tot < (l < H ? W : H)) mixed.push(k); }
  const res: string[] = [];
  const SS = process.env.NOSMUDGE ? [""] : all;
  for (const S of SS) for (const T of mixed) {
    if (S === T) continue;
    const sm = S ? [...fS, S] : fS; const tl = [...fT, T];
    const a = logicSolve(buildPuzzle({ ...s, smudge: sm, tally: tl })); if (!a.unique || a.passes > maxP) continue;
    let ok = true;
    for (const t of tl) { const c = logicSolve(buildPuzzle({ ...s, smudge: [...sm, t], tally: tl.filter((x) => x !== t) })); if (c.unique) { ok = false; break; } }
    if (!ok) continue;
    // smudge must cost something: board with S normal should be easier (fewer looks) - report
    const b = S ? logicSolve(buildPuzzle({ ...s, smudge: fS, tally: tl })) : a;
    res.push(`S=${S ? nm(S) : "-"} T=${nm(T)} passes ${a.passes} looks ${a.steps} open ${a.firstOpen} | S-normal looks ${b.steps}`);
  }
  console.log(res.slice(0, +(process.env.TOP ?? 50)).join("\n")); console.log("found", res.length);
})();
