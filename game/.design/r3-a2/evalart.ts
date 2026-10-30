import { buildPuzzle, logicSolve, clueOf, startMasks, lineCount, lineOpen, applyLine, lineIndices } from "../../src/game/nonogram";
export function tallyTrace(s: any) {
  const p = buildPuzzle(s); const known = (m: number) => (m & (m - 1)) === 0;
  let masks = startMasks(p); const ev: string[] = [];
  for (let pass = 1; pass < 40; pass++) {
    const start = masks; let cur = masks; let any = false;
    for (let l = 0; l < lineCount(p); l++) {
      if (!lineOpen(p, start, l)) continue;
      const nx = applyLine(p, start, l); if (!nx || nx === start) continue; any = true;
      let ink = 0, x = 0; const nxt = cur.slice();
      for (const i of lineIndices(p.w, p.h, l)) if (nx[i] !== start[i]) { nxt[i] &= nx[i]; if (known(nx[i])) (nx[i] === 1 ? x++ : ink++); }
      cur = nxt;
      if (clueOf(p, l).tally) ev.push(`${l < p.h ? "r" + (l + 1) : "c" + (l - p.h + 1)}@${pass}${ink ? "+" + ink : ""}${x ? "x" + x : ""}`);
    }
    if (!any) break; masks = cur;
  }
  return ev.join(" ");
}
import { INK } from "../../src/game/types";
export function evalArt(art: string, K = 1, opt: { maxp?: number; mino?: number; joint?: boolean; nofull?: boolean } = {}) {
  const s: any = { id: "g", title: "g", palette: [INK], art: "\n" + art };
  const p = buildPuzzle(s);
  const h = p.h, w = p.w;
  if (p.rows.some((r) => !r.blocks.length) || p.cols.some((c) => !c.blocks.length)) return [];
  if (!logicSolve(p).unique) return [];
  const names = [...Array.from({ length: h }, (_, i) => "r" + i), ...Array.from({ length: w }, (_, i) => "c" + i)];
  const cnt = (L: string) => { const li = Number(L.slice(1)) + (L[0] === "c" ? h : 0); return clueOf(p, li).blocks.reduce((a: number, q: any) => a + q.len, 0); };
  const len = (L: string) => (L[0] === "c" ? h : w);
  const ok = names.filter((L) => !(opt.nofull ?? true) || cnt(L) < len(L));
  const ess = K === 1 || !opt.joint ? ok.filter((L) => !logicSolve(buildPuzzle({ ...s, smudge: [L] })).unique) : ok;
  const cand = K === 1 ? ess.map((L) => [L]) : ess.flatMap((a, i) => ess.slice(i + 1).map((b) => [a, b]));
  const out: { T: string[]; desc: string; looks: number; passes: number; open: number }[] = [];
  for (const T of cand) {
    const r = logicSolve(buildPuzzle({ ...s, tally: T }));
    if (!r.unique) continue;
    if (r.passes > (opt.maxp ?? 99) || r.firstOpen < (opt.mino ?? 0)) continue;
    if (opt.joint) { if (logicSolve(buildPuzzle({ ...s, smudge: T })).unique) continue; }
    else if (!T.every((t) => !logicSolve(buildPuzzle({ ...s, tally: T.filter((x) => x !== t), smudge: [t] })).unique)) continue;
    const desc = T.map((L) => { const li = Number(L.slice(1)) + (L[0] === "c" ? h : 0); const b = clueOf(p, li).blocks; return `${L[0]}${Number(L.slice(1)) + 1}=${cnt(L)}(${b.map((q: any) => q.len).join(" ")})`; }).join(" + ");
    out.push({ T, desc: desc + " [" + tallyTrace({ ...s, tally: T }) + "]", looks: r.steps, passes: r.passes, open: r.firstOpen });
  }
  return out;
}
