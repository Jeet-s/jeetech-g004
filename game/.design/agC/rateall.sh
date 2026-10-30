#!/bin/zsh
# usage: rateall.sh <srcfile> ; runs probe per spec (sequential)
cd /Users/jagjeetsingh/ai-game-factory/.workspaces/d7bebc6d-5835-4075-b86d-b7e325900918
n=$(npx tsx -e "const m=require(require('path').resolve('$1'));console.log((Object.values(m).flat() as any[]).length)")
for i in $(seq 0 $((n-1))); do
  t=$(SRC=$1 IDX=$i npx tsx -e "const m=require(require('path').resolve(process.env.SRC));console.log((Object.values(m).flat() as any[])[Number(process.env.IDX)].title)")
  echo -n "$t: "; SRC=$1 IDX=$i npx tsx ${RATE:-.design/rate.ts} .design/agC/pick.ts 2>&1 | sed 's/^L[0-9]* //' | tail -1
done
