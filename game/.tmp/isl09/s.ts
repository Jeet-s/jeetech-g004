// greedy stamp suggestions: npx tsx s.ts file  (first block only)
import { readFileSync } from "fs";
import { buildPuzzle, logicSolve, isKnown } from "../../src/game/nonogram";
const raw = readFileSync(process.argv[2], "utf8").split(/\n\s*\n/).filter(s=>s.trim())[Number(process.argv[3]??0)];
let rows = raw.split("\n").map(l=>l.trim()).filter(l=>l && !l.startsWith("="));
const ev = (rs: string[]) => { const p = buildPuzzle({ id:"t", title:"t", palette:["#000"], art: rs.join("\n") }); return logicSolve(p); };
for (let round=0; round<6; round++) {
  const r = ev(rows); if (r.unique) break;
  let best: string[]|null = null, bu = r.unknown, cands: string[] = [];
  rows.forEach((row,y)=>[...row].forEach((ch,x)=>{ if (ch!=="."&&ch!=="#") return;
    const nr = rows.slice(); nr[y] = row.slice(0,x)+(ch==="#"?"@":",")+row.slice(x+1);
    const q = ev(nr); const u = q.unique?0:q.unknown; if (u<=bu) { if (u<bu) cands=[]; cands.push(`(${y},${x})${ch}${q.unique?" OK p"+q.passes+" o"+q.firstOpen:""}`); bu=u; best=nr; } }));
  console.log("round",round,"best unknown",bu, cands.slice(0,30).join(" "));
  if (!best) break; rows = best;
}
console.log(rows.join("\n"));
