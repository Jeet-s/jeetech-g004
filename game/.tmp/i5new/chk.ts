import { readFileSync } from "fs";
import { buildPuzzle, logicSolve, isKnown } from "../../src/game/nonogram";
const parts = readFileSync(process.argv[3] ?? 0, "utf8").split(/\n\s*\n/).filter((s) => s.trim());
const K = Number(process.argv[2] ?? 1);
for (const raw of parts) {
  const art = raw.split("\n").filter(l=>!l.startsWith("//")).join("\n");
  const plain = art.replace(/[A-F]/g, (c) => c.toLowerCase()).replace(/@/g, "#").replace(/,/g, ".");
  const ns = (art.match(/[A-F@,]/g) ?? []).length;
  const p = buildPuzzle({ id: "t", title: "t", palette: Array(6).fill("#000"), art });
  const r = logicSolve(p);
  const r0 = logicSolve(buildPuzzle({ id: "t", title: "t", palette: Array(6).fill("#000"), art: plain }));
  const rows = art.split("\n").map((l) => l.trim()).filter(Boolean);
  const empty = [] as string[];
  for (let y = 0; y < p.h; y++) if (p.rows[y].length === 0) empty.push("r" + y);
  for (let x = 0; x < p.w; x++) if (p.cols[x].length === 0) empty.push("c" + x);
  console.log(`${p.w}x${p.h} stamps ${ns} ${r.unique ? "OK" : `STUCK ${r.unknown}`} steps ${r.steps} passes ${r.passes} search ${r.search.toFixed(1)} open0 ${r.firstOpen} | nostamp ${r0.unique ? "OK" : "STUCK " + r0.unknown} ${empty.length ? "EMPTY " + empty : ""}`);
  if (!r.unique) console.log(rows.map((row, y) => [...row].map((ch, x) => (isKnown(r.masks[y * p.w + x]) ? ch : "?")).join("")).join("\n"));
}
