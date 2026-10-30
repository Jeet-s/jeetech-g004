/** pair search: npx tsx g2.ts file idx target  -> best pairs of (smudge|crack) adds */
import { readFileSync } from "fs";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
const [file, idxS, tS] = process.argv.slice(2);
const blocks = readFileSync(file, "utf8").split(/^=/m).filter((s) => s.trim());
const b = blocks[Number(idxS)]; const [head, ...rest] = b.split("\n"); const art = rest.join("\n");
const K = Number(head.trim().split(/\s+/)[0]);
const sm0 = (head.match(/smudge=(\S+)/)?.[1] ?? "").split(",").filter(Boolean);
const cr0 = (head.match(/crack=(\S+)/)?.[1] ?? "").split(",").filter(Boolean);
const T = Number(tS);
function run(s: string[], c: string[]) { try { const p = buildPuzzle({ id: "t", title: "t", palette: Array(K).fill("#000"), art, smudge: s, crack: c } as any); const r = logicSolve(p); return r; } catch { return null; } }
const p = buildPuzzle({ id: "t", title: "t", palette: Array(K).fill("#000"), art, smudge: sm0, crack: cr0 } as any);
const opts: string[] = [];
[...p.rows.map((c: any, i: number) => ["r" + i, c]), ...p.cols.map((c: any, i: number) => ["c" + i, c])].forEach(([nm, c]: any) => {
  opts.push("S" + nm); c.blocks.forEach((bl: any, k: number) => { if (bl.len >= 2) opts.push("C" + nm + "." + k); });
});
// singles first, keep those unique
const singles: [string, number][] = [];
for (const o of opts) { const r = run(o[0] === "S" ? [...sm0, o.slice(1)] : sm0, o[0] === "C" ? [...cr0, o.slice(1)] : cr0); if (r?.unique) singles.push([o, r.passes]); }
singles.sort((x, y) => y[1] - x[1]); singles.splice(Number(process.argv[5] ?? 18));
console.log('singles', singles.slice(0, 8).map((x) => x.join(':')).join(' '));
const res: [number, string, number][] = [];
for (let i = 0; i < singles.length; i++) for (let j = i + 1; j < singles.length; j++) {
  const a = singles[i][0], bb = singles[j][0]; if (a.slice(1).split(".")[0] === bb.slice(1).split(".")[0]) continue;
  const S = [...sm0], C = [...cr0]; for (const o of [a, bb]) (o[0] === "S" ? S : C).push(o.slice(1));
  if (S.length > 2 || C.length > 2) continue;
  const r = run(S, C); if (r?.unique && r.passes <= T) res.push([r.passes, `smudge=${S.join(",")} crack=${C.join(",")}`, r.firstOpen]);
}
res.sort((x, y) => y[0] - x[0]); console.log(res.slice(0, 12).map((x) => `${x[0]}p o${x[2]} ${x[1]}`).join("\n"));
