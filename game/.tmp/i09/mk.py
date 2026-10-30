# build draft.ts from blocks in files given: name.txt -> level
import sys,os
out=['import type { LevelSpec } from "../../src/game/types";','export const D: LevelSpec[] = [']
for f in sys.argv[1:]:
  K=1
  name=os.path.basename(f)[:-4]
  for blk in [b for b in open(f).read().split('\n\n') if b.strip()]:
    lines=blk.strip().split('\n')
    meta={}
    if lines[0].startswith('!'):
      meta=eval(lines[0][1:]); lines=lines[1:]
    pal=meta.get('pal',['#1F2A3A'])
    extra=''.join(f', {k}: {v!r}' for k,v in meta.items() if k in('smudge','crack'))
    out.append(f'{{ id: "{name}", title: "{name}", palette: {pal!r}, role: "teach", mechanics: [], aha: "x"{extra}, art: `\n'+'\n'.join(lines)+'` },')
out.append('];')
open('.tmp/i09/draft.ts','w').write('\n'.join(out))
