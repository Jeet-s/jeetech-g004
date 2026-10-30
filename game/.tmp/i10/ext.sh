#!/bin/sh
python3 - "$1" <<'PY'
import sys,re
id=sys.argv[1]
for b in re.split(r'\n\s*\n', open('levels.txt').read()):
    ls=[l.strip() for l in b.strip().split('\n')]
    if ('ID: '+id) in ls:
        out=['N:'+id]+[l for l in ls if not re.match(r'^[A-Z]+:',l)]
        open('x.txt','w').write('\n'.join(out)+'\n')
PY
