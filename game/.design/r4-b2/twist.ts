import { buildPuzzle, logicSolve, clueOf } from "../../src/game/nonogram";
import { INK } from "../../src/game/types";
import { tallyTrace } from "../r3-a2/evalart";
// twist.ts art... : pairs of lines with the same count, both fire, one closes (x) one fills (+)
for (const a of process.argv.slice(2)) {
  const art = a.trim().split(/[\n\/ ]+/).join("\n");
  const s: any = { id: "g", title: "g", palette: [INK], art: "\n" + art };
  let p; try { p = buildPuzzle(s); } catch (e) { console.log("ERR", (e as Error).message); continue; }
  const h = p.h, w = p.w; const pl = logicSolve(p);
  console.log(`${art.split("\n").join("/")} ${w}x${h} plain ${pl.unique ? "OK" : "BAD"} L${pl.steps} P${pl.passes} O${pl.firstOpen}`);
  if (p.rows.some((r: any) => !r.blocks.length) || p.cols.some((c: any) => !c.blocks.length)) { console.log("  EMPTY LINE"); continue; }
  const names = [...Array.from({ length: h }, (_, i) => "r" + i), ...Array.from({ length: w }, (_, i) => "c" + i)];
  const li = (L: string) => Number(L.slice(1)) + (L[0] === "c" ? h : 0);
  const cnt = (L: string) => clueOf(p, li(L)).blocks.reduce((x: number, q: any) => x + q.len, 0);
  const len = (L: string) => (L[0] === "c" ? h : w);
  const lab = (L: string) => L[0] + (Number(L.slice(1)) + 1);
  for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) {
    const A = names[i], B = names[j];
    if (process.env.SAME !== "0" && cnt(A) !== cnt(B)) continue;
    if (cnt(A) <= 1 || cnt(A) >= len(A) || cnt(B) <= 1 || cnt(B) >= len(B)) continue;
    const S = { ...s, tally: [A, B] }; const r = logicSolve(buildPuzzle(S)); if (!r.unique) continue;
    if (logicSolve(buildPuzzle({ ...s, smudge: [A, B] })).unique) continue;
    const tr = tallyTrace(S).split(" ");
    const ea = tr.filter((e) => e.startsWith(lab(A) + "@")), eb = tr.filter((e) => e.startsWith(lab(B) + "@"));
    if (!ea.length || !eb.length) continue;
    const kind = (es: string[]) => (es.some((e) => e.includes("+")) ? "+" : "") + (es.some((e) => e.includes("x")) ? "x" : "");
    const ka = kind(ea), kb = kind(eb);
    if (process.env.OPP && !((ka === "+" && kb === "x") || (ka === "x" && kb === "+"))) continue;
    const ind = [A, B].map((t) => (logicSolve(buildPuzzle({ ...s, tally: [A, B].filter((x) => x !== t), smudge: [t] })).unique ? "" : "!"));
    console.log(`  ${ind[0]}${lab(A)}=${cnt(A)}(${clueOf(p, li(A)).blocks.map((q: any) => q.len).join(" ")}) ${ea.join(",")}  ${ind[1]}${lab(B)}=${cnt(B)}(${clueOf(p, li(B)).blocks.map((q: any) => q.len).join(" ")}) ${eb.join(",")}  L${r.steps} P${r.passes} O${r.firstOpen}`);
  }
}
