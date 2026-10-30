/// <reference types="node" />
/** Regenerates the per-level table in docs/LEVELS.md from the level data:  npx tsx scripts/levels-doc.ts */
import { readFileSync, writeFileSync } from "fs";
import * as path from "path";
import { ISLANDS, LEVELS } from "../src/game/levels";
import { logicSolve } from "../src/game/nonogram";
import { twistLabel } from "../src/game/sim";

const file = path.join(__dirname, "../docs/LEVELS.md");
const doc = readFileSync(file, "utf8");
const out: string[] = [];
ISLANDS.forEach((isl, k) => {
  out.push(`\n### Island ${k + 1} — ${isl.name} (Masterwork renovates the ${isl.room})\n`);
  out.push("| # | slot | role | picture | mechanics | aha | solver (looks / passes / search) |");
  out.push("|---|---|---|---|---|---|---|");
  for (const L of LEVELS.filter((l) => l.island === k)) {
    const p = L.puzzle, s = L.spec;
    const r = logicSolve(p);
    const twist = twistLabel(s.smudge, s.crack, s.tally);
    const pic = `${s.title} (${p.w}x${p.h}${p.palette.length > 1 ? `, ${p.palette.length} colours` : ""}${twist ? `; ${twist}` : ""})`;
    out.push(`| ${L.number} | ${L.slot} | ${L.role}${L.masterwork ? " ★" : ""} | ${pic} | ${s.mechanics.join(", ")} | ${s.aha.replace(/\|/g, "/")} | ${r.steps} / ${r.passes} / ${r.search.toFixed(0)} |`);
  }
});
const a = doc.indexOf("<!-- LEVELS:BEGIN -->"), b = doc.indexOf("<!-- LEVELS:END -->");
writeFileSync(file, doc.slice(0, a) + "<!-- LEVELS:BEGIN -->\n" + out.join("\n") + "\n" + doc.slice(b));
console.log(`docs/LEVELS.md: ${LEVELS.length} levels written`);
