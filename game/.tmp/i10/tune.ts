// usage: tsx tune.ts file name nSmudge nCrack target [tries]
import { readFileSync } from "fs";
import { buildPuzzle } from "../../src/game/nonogram";
import { fastSolve as logicSolve } from "./fast";
const [file, name, nsS, ncS, tgS, trS] = process.argv.slice(2);
const parts = readFileSync(file, "utf8").split(/\n\s*\n/).filter((s) => s.trim());
const part = parts.find((p) => p.includes("N:" + name + "\n"))!;
const lines = part.split("\n").map((l) => l.trim()).filter(Boolean);
let fixedS: string[] = [], fixedC: string[] = [];
const art: string[] = [];
for (const l of lines) {
  if (l.startsWith("S:")) fixedS = l.slice(2).trim().split(/[ ,]+/).filter(Boolean);
  else if (l.startsWith("C:")) fixedC = l.slice(2).trim().split(/[ ,]+/).filter(Boolean);
  else if (!l.startsWith("N:")) art.push(l);
}
const spec = { id: "t", title: "t", palette: Array(6).fill("#000"), art: art.join("\n") };
const p0 = buildPuzzle(spec);
const lineIds: string[] = [];
for (let r = 0; r < p0.h; r++) lineIds.push("r" + r);
for (let c = 0; c < p0.w; c++) lineIds.push("c" + c);
const crackIds: string[] = [];
p0.rows.forEach((cl, r) => cl.blocks.forEach((b, i) => { if (b.len > 1) crackIds.push(`r${r}.${i}`); }));
p0.cols.forEach((cl, c) => cl.blocks.forEach((b, i) => { if (b.len > 1) crackIds.push(`c${c}.${i}`); }));
const nS = Number(nsS), nC = Number(ncS), tg = Number(tgS), tries = Number(trS ?? 3000);
const pick = (a: string[], n: number, ex: string[]) => { const out: string[] = []; const pool = a.filter((x) => !ex.includes(x)); while (out.length < n && pool.length) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]); return out; };
const res: { s: string[]; c: string[]; search: number; steps: number; passes: number }[] = [];
const seen = new Set<string>();
for (let t = 0; t < tries; t++) {
  const s = [...fixedS, ...pick(lineIds, nS, fixedS)];
  const c = [...fixedC, ...pick(crackIds, nC, fixedC)];
  // no crack on smudged line
  if (c.some((x) => s.includes(x.split(".")[0]))) continue;
  const key = [...s].sort().join() + "|" + [...c].sort().join();
  if (seen.has(key)) continue; seen.add(key);
  const r = logicSolve(buildPuzzle({ ...spec, smudge: s, crack: c }));
  if (!r.unique) continue;
  res.push({ s, c, search: r.search, steps: r.steps, passes: 0 });
}
res.sort((a, b) => Math.abs(a.search - tg) - Math.abs(b.search - tg));
console.log(`${res.length} unique of ${seen.size}`);
for (const x of res.slice(0, 8)) console.log(`search ${x.search.toFixed(1)} steps ${x.steps} passes ${x.passes}  S: ${x.s.join(" ")}  C: ${x.c.join(" ")}`);
const mx = res.reduce((m, x) => Math.max(m, x.search), 0); console.log("max", mx.toFixed(1));
