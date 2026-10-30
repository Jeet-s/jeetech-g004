// gen.ts '<template rows sep by / ; ? optional>' tally(comma, 0-based) [N]   env MAXP MINP MINO MAXL MINL GREP NOT NORUN2=rows(1-based comma) SHOW SEED
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
import { INK } from "../../src/game/types";
import { trace } from "./tt";
const tpl = process.argv[2].trim().split(/[\n/]/).map((r) => r.trim()).filter(Boolean);
const T = process.argv[3] ? process.argv[3].split(",").filter(Boolean) : [];
const N = Number(process.argv[4] ?? 20000);
const E = (k: string, d: number) => Number(process.env[k] ?? d);
const opts: [number, number][] = [];
tpl.forEach((r, y) => r.split("").forEach((c, x) => c === "?" && opts.push([y, x])));
const total = 2 ** opts.length; const seen = new Set<string>(); const res: [number, string][] = [];
const norun = (process.env.NORUN2 ?? "").split(",").filter(Boolean).map((x) => +x - 1);
let seed = E("SEED", 1); const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
for (let it = 0; it < Math.min(N, total); it++) {
  const g = tpl.map((r) => r.split(""));
  opts.forEach(([y, x], i) => (g[y][x] = (total <= N ? Math.floor(it / 2 ** i) % 2 === 1 : rnd() < E("DENS", 0.5)) ? "#" : "."));
  const art = g.map((r) => r.join("")).join("\n");
  if (seen.has(art)) continue; seen.add(art);
  if (norun.some((y) => /##/.test(g[y].join("")))) continue;
  const Ts: string[][] = T[0] === "ANY" ? [...Array.from({ length: tpl.length }, (_, i) => "r" + i), ...Array.from({ length: tpl[0].length }, (_, i) => "c" + i)].map((x) => [x]) : [T];
  for (const T of Ts) {
  const s: any = { id: "g", title: "g", palette: [INK], art: "\n" + art, tally: T };
  let p; try { p = buildPuzzle(s); } catch { continue; }
  if (p.rows.some((r: any) => !r.blocks.length) || p.cols.some((c: any) => !c.blocks.length)) continue;
  const r = logicSolve(p); if (process.env.DBG) console.error("u", r.unique, r.passes, r.firstOpen); if (!r.unique) continue;
  if (r.passes > E("MAXP", 99) || r.passes < E("MINP", 0) || r.firstOpen < E("MINO", 0) || r.steps > E("MAXL", 999) || r.steps < E("MINL", 0)) continue;
  if (process.env.IND ? !T.every((t) => !logicSolve(buildPuzzle({ ...s, tally: T.filter((x) => x !== t), smudge: [t] })).unique) : logicSolve(buildPuzzle({ ...s, tally: [], smudge: T })).unique) continue;
  const tr = trace(s);
  if (process.env.GREP && !new RegExp(process.env.GREP).test(tr)) continue;
  if (process.env.NOT && new RegExp(process.env.NOT).test(tr)) continue;
  res.push([r.passes * 100 + r.steps, `${T.join(",")} P${r.passes} L${r.steps} O${r.firstOpen}\n${art}\n${tr}\n`]);
  }
}
console.log(`combos ${seen.size}, hits ${res.length}`);
res.sort((a, b) => (process.env.DESC ? b[0] - a[0] : a[0] - b[0]));
console.log(res.slice(0, E("SHOW", 8)).map((x) => x[1]).join("\n"));
