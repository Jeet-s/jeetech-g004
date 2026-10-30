W,H=20,20
def build(p1,p2y,p2x,pines,holes):
    g=[['.']*W for _ in range(H)]
    def put(x,y,c):
        if 0<=x<W and 0<=y<H: g[y][x]=c
    def mountain(px,py,base,snow):
        for y in range(py,base+1):
            d=y-py
            if d<snow: put(px-d,y,'a'); put(px+d,y,'a')
            elif d==snow:
                for x in range(px-d,px+d+1): put(x,y,'a' if (x-px)%2==0 or abs(x-px)==d else '.')
            else:
                for x in range(px-d,px+d+1): put(x,y,'a')
    mountain(p1,0,6,3)
    mountain(p2x,p2y,6,2)
    for x in pines:
        put(x,7,'a'); put(x-1,8,'a');put(x,8,'a');put(x+1,8,'a')
    for y in range(9,20):
        for x in range(W): put(x,y,'b')
    for y in range(9,16):
        d=15-y
        for x in range(p1-d,p1+d+1): put(x,y,'a')
    for y in range(9,9+(6-p2y)+1):
        d=6-p2y-(y-9)
        for x in range(p2x-d,p2x+d+1): put(x,y,'a')
    for (x,y) in holes: put(x,y,'.')
    return g
H1=[(1,12),(2,12),(18,11),(10,13),(11,13),(3,17),(4,17),(5,17),(13,16),(14,16),(9,18),(10,18),(17,18),(18,18)]
import itertools
i=0
for p1 in [5,6]:
  for p2y,p2x in [(3,16),(3,17),(2,16)]:
    for pines in [[2,7,12,17],[1,6,11,16]]:
      g=build(p1,p2y,p2x,pines,H1); print('= 2 v%d p1=%d p2=%d,%d pines=%s'%(i,p1,p2y,p2x,pines[0])); print('\n'.join(''.join(r) for r in g)); i+=1
