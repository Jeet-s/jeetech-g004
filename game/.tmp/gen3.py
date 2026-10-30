import sys,re
src=open(sys.argv[1]).read()
blocks=[b.strip() for b in re.split(r'\n\s*\n',src) if b.strip()]
out=['import { type LevelSpec } from "../types";','','export const ISL03: LevelSpec[] = [']
for b in blocks:
    lines=b.split('\n'); meta=lines[0]; art='\n'.join(lines[1:])
    out.append('  {'+meta+', art: `\n'+art+'`,\n  },')
out.append('];')
open(sys.argv[2],'w').write('\n'.join(out)+'\n')
