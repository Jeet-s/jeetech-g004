import re,sys
p='src/game/islands/isl08.ts'; s=open(p).read()
m={'kiln-teapot':('["r10.0"]',None),'kiln-heart-mug':('["r4.1"]',None),'kiln-tall-vase':('["r9.0"]',None),
'kiln-willow-plate':('["r13.0", "r4.2"]',None),'kiln-glazed-tile':('["r5.3"]',None),'kiln-pitcher':('["c3.1", "r5.1"]',None),
'kiln-tea-bowl':('["r4.2"]',None),'kiln-honey-jar':('["c5.4"]',None),'kiln-brick-dome':('["c6.1", "r9.2"]','["c3"]'),
'kiln-lucky-cat':('["r7.3"]','["c3"]'),'kiln-noodle-bowl':('["r6.2"]','["c0"]'),'kiln-fire-masterwork':('["c10.1"]','["r13"]')}
parts=re.split(r'(?=\n  \{\n)', s)
head, entries, tail = parts[0], parts[1:], ''
last=entries[-1]; i=last.index('\n];'); entries[-1]=last[:i]; tail=last[i:]
out=[]
for e in entries:
  id_=re.search(r'id: "([^"]+)"',e).group(1); c,sm=m[id_]
  e=e.replace('crack: []','crack: %s%s'%(c, (', smudge: '+sm) if sm else ''))
  out.append((id_,e))
d=dict(out); order=[i for i,_ in out]
a,b=order.index('kiln-noodle-bowl'),order.index('kiln-brick-dome'); order[a],order[b]=order[b],order[a]
open(p,'w').write(head+''.join(d[i] for i in order)+tail)
