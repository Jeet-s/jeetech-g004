#!/bin/sh
cd /Users/jagjeetsingh/ai-game-factory/.workspaces/d7bebc6d-5835-4075-b86d-b7e325900918
npx tsx .design/try.ts "$1" 2>&1 | grep -E "OK|BAD|DUP|ERR|STILL|needs" 
n=$(grep -c "^mk(\|^ *{ *id:" "$1")
i=0; while [ $i -lt ${2:-6} ]; do SPEC="$1" I=$i npx tsx .design/rate.ts .design/agB/pick.ts 2>&1 | grep -v "^ *$" | sed 's/.*search/  search/' | grep -v "^    at\|Node\|TypeError\|\^\|sim.ts" ; i=$((i+1)); done
