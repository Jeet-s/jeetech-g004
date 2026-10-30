// list all single-stamp outcomes: npx tsx s1.ts file idx
import { readFileSync } from "fs";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
const raw = readFileSync(process.argv[2], "utf8").split(/\n\s*\n/).filter(s=>s.trim())[Number(process.argv[3]??0)];
const rows = raw.split("\n").map(l=>l.trim()).filter(l=>l && !l.startsWith("="));
const ev = (rs: string[]) => logicSolve(buildPuzzle({ id:"t", title:"t", palette:["#000"], art: rs.join("\n") }));
const out: [number,string][] = [];
rows.forEach((row,y)=>[...row].forEach((ch,x)=>{ if (ch!=="."&&ch!=="#") return;
  const nr = rows.slice(); nr[y] = row.slice(0,x)+(ch==="#"?"@":",")+row.slice(x+1);
  const q = ev(nr); if (q.unique) out.push([q.search, `(${y},${x})${ch} p${q.passes} s${q.search.toFixed(0)} o${q.firstOpen}`]); }));
out.sort((a,b)=>b[0]-a[0]); console.log(out.map(o=>o[1]).join("\n"));
