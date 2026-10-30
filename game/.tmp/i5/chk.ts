import { readFileSync } from "fs";
import { buildPuzzle, logicSolve, isKnown } from "../../src/game/nonogram";
const parts = readFileSync(process.argv[2], "utf8").split(/\n\s*\n/).filter((s) => s.trim());
const K = Number(process.argv[3] ?? 1);
const low = (s: string) => s.replace(/@/g, K === 1 ? "#" : "a").replace(/,/g, ".").replace(/[A-F]/g, (c) => c.toLowerCase());
function rep(art: string, tag: string, showStuck = true) {
  const p = buildPuzzle({ id: "t", title: "t", palette: Array(K).fill("#000"), art });
  const r = logicSolve(p);
  const rows = art.split("\n").map((l) => l.trim()).filter(Boolean);
  const empty: string[] = [];
  for (let y = 0; y < p.h; y++) if (![...rows[y]].some((c) => !".,~".includes(c)) && ![...rows[y]].every((c) => c === "~")) empty.push("r" + y);
  for (let x = 0; x < p.w; x++) { const col = rows.map((r) => r[x]); if (!col.some((c) => !".,~".includes(c)) && !col.every((c) => c === "~")) empty.push("c" + x); }
  console.log(`${tag} ${p.w}x${p.h} ${r.unique ? "OK" : `STUCK ${r.unknown}`} steps ${r.steps} passes ${r.passes} search ${r.search.toFixed(1)} open0 ${r.firstOpen}${empty.length ? " EMPTY " + empty.join(",") : ""}`);
  if (!r.unique && showStuck) console.log(rows.map((row, y) => [...row].map((ch, x) => (isKnown(r.masks[y * p.w + x]) ? ch : "?")).join("")).join("\n"));
}
parts.forEach((art, i) => { console.log(`--- #${i + 1}`); const a = art.trim(); if (low(a) !== a) rep(low(a), "nostamp", false); rep(a, "stamped"); });
