W,H=20,20
g=[['.']*W for _ in range(H)]
def put(x,y,c):
    if 0<=x<W and 0<=y<H: g[y][x]=c
def mountain(px,py,base,snow):
    for y in range(py,base+1):
        d=y-py
        for x in range(px-d,px+d+1):
            put(x,y,'b' if d<snow else 'a')
mountain(6,0,6,3)
mountain(15,2,6,2)
for (x,y) in [(15,0),(16,0),(17,0),(14,1)]: put(x,y,'b')   # placeholder cloud removed below
g[0]=list('......b.......bbb...'); g[1]=list('.....bbb....bbbbbb..')
for x in [1,5,9,13,17]:
    put(x,7,'a'); put(x-1,8,'a');put(x,8,'a');put(x+1,8,'a')
for x in range(W): put(x,9,'a')
rows=["cccccccccccccccccccc",
      "cc.ccccccccc.ccccc.c",
      "ccccc..ccccccc..cccc",
      "c..ccccc..ccccccc..c",
      "cccc..cccccc..cccccc",
      "ccccccc..ccccccc..cc",
      "cc..cccccccc..cccccc",
      "cccccc..cccccccc..cc",
      "cccccccccc..cccccccc",
      "cccccccccccccccccccc"]
for i,s in enumerate(rows):
    for x,ch in enumerate(s): put(x,10+i,ch)
for y in range(10,15):   # reflection
    d=14-y
    for x in range(6-d,6+d+1): put(x,y,'a')
for y in range(10,13):
    d=12-y
    for x in range(15-d,15+d+1): put(x,y,'a')
print('= 3 lake')
print('\n'.join(''.join(r) for r in g))
