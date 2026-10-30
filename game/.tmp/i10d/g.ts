/** greedy twists: npx tsx g.ts file idx target maxSmudge maxCrack */
import { readFileSync } from "fs";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
const [file, idxS, tS, msS, mcS] = process.argv.slice(2);
const blocks = readFileSync(file, "utf8").split(/^=/m).filter((s) => s.trim());
const b = blocks[Number(idxS)]; const [head, ...rest] = b.split("\n"); const art = rest.join("\n");
const K = Number(head.trim().split(/\s+/)[0]);
let sm = (head.match(/smudge=(\S+)/)?.[1] ?? "").split(",").filter(Boolean);
let cr = (head.match(/crack=(\S+)/)?.[1] ?? "").split(",").filter(Boolean);
const T = Number(tS), MS = Number(msS), MC = Number(mcS);
function run(s: string[], c: string[]) { try { const p = buildPuzzle({ id: "t", title: "t", palette: Array(K).fill("#000"), art, smudge: s, crack: c } as any); const r = logicSolve(p); return { p, r }; } catch { return null; } }
let cur = run(sm, cr)!; console.log("start", cur.r.passes, cur.r.unique);
for (let it = 0; it < MS + MC; it++) {
  const p = cur.p; const lines = [...p.rows.map((c: any, i: number) => ["r" + i, c]), ...p.cols.map((c: any, i: number) => ["c" + i, c])] as [string, any][];
  let best: any = null;
  for (const [nm, c] of lines) {
    if (sm.length < MS && !sm.includes(nm) && !cr.some((k) => k.startsWith(nm + "."))) { const y = run([...sm, nm], cr); if (y?.r.unique && y.r.passes <= T && (!best || y.r.passes > best.pa)) best = { pa: y.r.passes, s: [...sm, nm], c: cr, y }; }
    if (cr.length < MC && !sm.includes(nm)) c.blocks.forEach((_: any, k: number) => { const key = `${nm}.${k}`; if (cr.includes(key)) return; const y = run(sm, [...cr, key]); if (y?.r.unique && y.r.passes <= T && (!best || y.r.passes > best.pa)) best = { pa: y.r.passes, s: sm, c: [...cr, key], y }; });
  }
  if (!best || best.pa <= cur.r.passes) break;
  sm = best.s; cr = best.c; cur = best.y; console.log(best.pa, "smudge=" + sm.join(","), "crack=" + cr.join(","), "open", cur.r.firstOpen);
}
