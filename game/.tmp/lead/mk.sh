#!/bin/sh
# usage: mk.sh K file.txt -> writes .tmp/lead/scr.ts and runs art-check --explain
K=$1; F=$2
node -e '
const fs=require("fs");const K=+process.argv[1];const parts=fs.readFileSync(process.argv[2],"utf8").split(/\n\s*\n/).filter(s=>s.trim());
const pal=JSON.stringify(Array(K).fill("#000000"));
let o="export const S = [\n";parts.forEach((a,i)=>{o+=`{id:"s${i}",title:"s${i}",palette:${pal},role:"practise",mechanics:["fill"],aha:"x",art:\`\n${a.trim()}\`},\n`});o+="];\n";fs.writeFileSync(".tmp/lead/scr.ts",o);' "$K" "$F"
npx tsx scripts/art-check.ts .tmp/lead/scr.ts --explain
