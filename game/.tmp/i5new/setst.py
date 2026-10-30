import sys,re
p='src/game/islands/isl05.ts'
s=open(p).read()
def edit(id_, y, x, ch):
    global s
    i=s.index('id: "%s"'%id_); a=s.index('art: `\n',i)+7; b=s.index('`',a)
    rows=s[a:b].split('\n'); r=rows[y]; rows[y]=r[:x]+ch+r[x+1:]
    s=s[:a]+'\n'.join(rows)+s[b:]
for arg in sys.argv[1:]:
    id_,y,x,ch=arg.split(':'); edit(id_,int(y),int(x),ch)
open(p,'w').write(s)
