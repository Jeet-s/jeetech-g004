import { buildPuzzle, logicSolve, clueOf } from "../../src/game/nonogram";
import { INK } from "../../src/game/types";
import { tallyTrace } from "../r3-a2/evalart";
// pick.ts art K  env: MAXP MINP MINO MAXL MINL SHOW FIX=r3,c4 (0-based) ; prints sets where every tally fires & joint needed
const art = process.argv[2].trim().split(/[\n\/ ]+/).join("\n");
const K = Number(process.argv[3] ?? 2);
const s: any = { id: "g", title: "g", palette: [INK], art: "\n" + art };
const p = buildPuzzle(s); const h = p.h, w = p.w;
const plain = logicSolve(p);
console.log(`${w}x${h} plain ${plain.unique ? "OK" : "BAD"} L${plain.steps} P${plain.passes} O${plain.firstOpen}`);
const names = [...Array.from({ length: h }, (_, i) => "r" + i), ...Array.from({ length: w }, (_, i) => "c" + i)];
const li = (L: string) => Number(L.slice(1)) + (L[0] === "c" ? h : 0);
const cnt = (L: string) => clueOf(p, li(L)).blocks.reduce((a: number, q: any) => a + q.len, 0);
const len = (L: string) => (L[0] === "c" ? h : w);
const fix = process.env.FIX ? process.env.FIX.split(",") : [];
const pool = names.filter((L) => (!process.env.POOL || process.env.POOL.split(",").some((pp) => L.startsWith(pp) && (pp.length===1 || L===pp))) && cnt(L) > 1 && cnt(L) < len(L) && !fix.includes(L));
const E = (k: string, d: number) => Number(process.env[k] ?? d);
const res: [number, string][] = [];
const rec = (start: number, T: string[]) => {
  if (T.length === K) {
    const S = { ...s, tally: T };
    const r = logicSolve(buildPuzzle(S));
    if (!r.unique || r.passes > E("MAXP", 99) || r.passes < E("MINP", 0) || r.firstOpen < E("MINO", 0) || r.steps > E("MAXL", 999) || r.steps < E("MINL", 0)) return;
    const js = logicSolve(buildPuzzle({ ...s, smudge: T })); if (js.unique || js.unknown < E("MINU", 0)) return;
    const tr = tallyTrace(S);
    if (!T.every((t) => tr.split(" ").some((e) => e.startsWith((t[0]) + (Number(t.slice(1)) + 1) + "@")))) return;
    const indiv = T.map((t) => (logicSolve(buildPuzzle({ ...s, tally: T.filter((x) => x !== t), smudge: [t] })).unique ? "" : "!"));
    const nInd = indiv.filter(Boolean).length;
    if (process.env.IND && nInd < T.length) return;
    const desc = T.map((L, i) => `${indiv[i]}${L[0]}${Number(L.slice(1)) + 1}=${cnt(L)}(${clueOf(p, li(L)).blocks.map((q: any) => q.len).join(" ")})`).join(" + ");
    res.push([-nInd * 1000 + r.passes * 50 - r.steps, `${desc} [${tr}] L${r.steps} P${r.passes} O${r.firstOpen} U${js.unknown}`]);
    return;
  }
  for (let i = start; i < pool.length; i++) rec(i + 1, [...T, pool[i]]);
};
rec(0, [...fix]);
res.sort((a, b) => a[0] - b[0]);
console.log(`sets ${res.length}`);
res.slice(0, E("SHOW", 15)).forEach((r) => console.log("  " + r[1]));
