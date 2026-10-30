import sys,re
src=open('lv.txt').read().strip().split('\n\n')
out=['import { INK, type LevelSpec } from "../types";','','/** Island 9 — Observatory Studio. Ink only. Teaches: deep-chain (each deduction unlocks the next over many passes). */','export const ISL09: LevelSpec[] = [']
for b in src:
    L=b.strip().split('\n'); h=L[0][1:].split('|'); art=L[1:]
    id,title,role,mech,aha=h
    ms=', '.join('"%s"'%m for m in mech.split(','))
    aha=aha.replace('"','\\"')
    out.append('  {')
    out.append(f'    id: "{id}", title: "{title}", palette: [INK], role: "{role}", mechanics: [{ms}],')
    out.append(f'    aha: "{aha}",')
    out.append('    art: `\n'+'\n'.join(art)+'`,')
    out.append('  },')
out.append('];')
open('../../src/game/islands/isl09.ts','w').write('\n'.join(out)+'\n')
