#!/bin/sh
# usage: r1.sh <file> <idx...>  — rate each spec in its own process (sim caches are per level)
f=$1; shift
for i in "$@"; do
  echo "import * as M from \"./$(basename $f .ts)\"; export const X = [(Object.values(M).flat() as any[])[$i]];" > .design/r7-b/_one.ts
  printf "[%s] " $i; npx tsx .design/rate.ts .design/r7-b/_one.ts 2>&1 | grep -v npm
done
