import * as fs from "fs";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
import { INK } from "../../src/game/types";
// usage: scan.ts file.txt [pairs]  (file: arts separated by blank lines; first line of each block may be "# name")
const txt = fs.readFileSync(process.argv[2], "utf8");
const pairs = process.argv[3] === "pairs";
for (const block of txt.split(/\n\s*\n/)) {
  const lines = block.trim().split("\n"); if (!lines[0]) continue;
  const name = lines[0].startsWith("#") ? lines.shift()! : "#";
  const art = "\n" + lines.join("\n");
  const h = lines.length, w = lines[0].length;
  const base = { id: "x", title: "x", palette: [INK], role: "teach", mechanics: [], aha: "", art } as any;
  const pl = logicSolve(buildPuzzle(base));
  console.log(`${name} ${w}x${h} plain ${pl.unique ? "OK" : "BAD"} looks ${pl.steps} passes ${pl.passes} open ${pl.firstOpen}`);
  const names = [...Array.from({ length: h }, (_, i) => "r" + i), ...Array.from({ length: w }, (_, i) => "c" + i)];
  const nm = (s: string) => (s[0] + (+s.slice(1) + 1));
  const test = (t: string[]) => {
    const r = logicSolve(buildPuzzle({ ...base, tally: t }));
    if (!r.unique) return null;
    const s = logicSolve(buildPuzzle({ ...base, smudge: t }));
    const need = t.map((x) => logicSolve(buildPuzzle({ ...base, tally: t.filter((y) => y !== x), smudge: [x] })).unique ? "-" : "N").join("");
    return `looks ${r.steps} passes ${r.passes} open ${r.firstOpen} need ${need}${s.unique ? " (all smudge uniq)" : ""}`;
  };
  for (const a of names) { const o = test([a]); if (o && o.includes("need N")) console.log(`  ${nm(a)}: ${o}`); }
  if (pairs) for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) { const o = test([names[i], names[j]]); if (o && o.includes("need NN")) console.log(`  ${nm(names[i])}+${nm(names[j])}: ${o}`); }
}
