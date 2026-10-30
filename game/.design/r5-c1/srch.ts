import * as path from "path";
import { buildPuzzle, logicSolve, clueOf } from "../../src/game/nonogram";
import { trace } from "./tt";
// srch.ts file id K   env: MAXP MINP MINO POOL=r,c4 FIX=r3 (0-based) GREP=regex on trace
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s0 = (Object.values(mod).flat() as any[]).find((x) => x.id === process.argv[3]);
  const K = Number(process.argv[4] ?? 1);
  const s: any = { ...s0, tally: [], smudge: [] };
  const p = buildPuzzle(s); const h = p.h, w = p.w;
  const E = (k: string, d: number) => Number(process.env[k] ?? d);
  const names = [...Array.from({ length: h }, (_, i) => "r" + i), ...Array.from({ length: w }, (_, i) => "c" + i)];
  const li = (L: string) => Number(L.slice(1)) + (L[0] === "c" ? h : 0);
  const cnt = (L: string) => clueOf(p, li(L)).blocks.reduce((a: number, q: any) => a + q.len, 0);
  const len = (L: string) => (L[0] === "c" ? h : w);
  const fix = process.env.FIX ? process.env.FIX.split(",") : [];
  const pool = names.filter((L) => (!process.env.POOL || process.env.POOL.split(",").some((pp) => L === pp || (pp.length === 1 && L[0] === pp))) && cnt(L) > 1 && cnt(L) < len(L) && !fix.includes(L));
  const res: [number, string][] = [];
  const rec = (start: number, T: string[]) => {
    if (T.length === K) {
      const TT = [...fix, ...T];
      const S = { ...s, tally: TT };
      const r = logicSolve(buildPuzzle(S));
      if (!r.unique || r.passes > E("MAXP", 99) || r.passes < E("MINP", 0) || r.firstOpen < E("MINO", 0)) return;
      const indiv = TT.map((t) => (logicSolve(buildPuzzle({ ...s, tally: TT.filter((x) => x !== t), smudge: [t] })).unique ? "" : "!"));
      if (process.env.IND && indiv.some((x) => !x)) return;
      const tr = trace(S);
      if (process.env.GREP && !new RegExp(process.env.GREP).test(tr)) return;
      const desc = TT.map((L, i) => `${indiv[i]}${L[0]}${Number(L.slice(1)) + 1}=${cnt(L)}(${clueOf(p, li(L)).blocks.map((q: any) => q.len).join(" ")})`).join(" + ");
      res.push([r.passes, `${desc} L${r.steps} P${r.passes} O${r.firstOpen}\n${tr}`]);
      return;
    }
    for (let i = start; i < pool.length; i++) rec(i + 1, [...T, pool[i]]);
  };
  const pl = logicSolve(p);
  console.log(`plain ${pl.unique ? "OK" : "BAD"} L${pl.steps} P${pl.passes} O${pl.firstOpen}`);
  rec(0, []);
  res.sort((a, b) => a[0] - b[0]);
  console.log(res.map((x) => x[1]).join("\n"));
})();
