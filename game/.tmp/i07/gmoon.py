import sys
N=15; c=(N-1)/2
g=[['~' if (x-c)**2+(y-c)**2>(7.4)**2 else '.' for x in range(N)] for y in range(N)]
def s(y,x,ch):
    assert g[y][x]!='~',(y,x)
    g[y][x]=ch
for y,a,b in [(1,9,11),(2,10,12),(3,11,13),(4,11,13),(5,11,13),(6,10,12),(7,8,11)]:
    for x in range(a,b+1): s(y,x,'b')
L=[(0,5,"a"),(1,5,"a"),(2,4,"aaa"),(3,3,"ccccc"),(4,3,"cbcbc"),(5,3,"cbcbc"),(6,3,"cbcbc"),(7,3,"ccccc"),(8,4,"aaa"),(9,5,"b"),(10,4,"bbb")]
for y,x,st in L:
  for i,ch in enumerate(st):
    if ch!='.': s(y,x+i,ch)
H=[13,12,12,12,12,12,11,11,10,10,11,11,12,12,13]
for x in range(N):
  for y in range(H[x],N):
    if g[y][x]!='~': s(y,x,'a')
for y,x in [(eval(p)) for p in (sys.argv[1].split(';') if len(sys.argv)>1 and sys.argv[1] else [])]: s(y,x,'b')
for k in sys.argv[2:]:
    y,x=map(int,k.split(','));ch=g[y][x]; g[y][x]=',' if ch=='.' else ch.upper()
print("\n".join("".join(r) for r in g))
