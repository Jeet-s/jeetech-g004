import sys
W,H=20,20
def build(v):
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
    mountain(6,0,6,3)
    mountain(15,2,6,2)
    for x in [1,5,9,13,17] if v==0 else [2,7,12,17]:
        put(x,7,'a'); put(x-1,8,'a');put(x,8,'a');put(x+1,8,'a')
    for y in range(9,20):
        for x in range(W): put(x,y,'b')
    # reflection
    for y in range(9,16):
        d=15-y
        for x in range(6-d,6+d+1): put(x,y,'a')
    for y in range(9,13):
        d=12-y
        for x in range(15-d,15+d+1): put(x,y,'a')
    for (x,y) in [(1,12),(2,12),(18,11),(10,13),(11,13),(3,17),(4,17),(5,17),(13,16),(14,16),(9,18),(10,18),(17,18),(18,18)]: put(x,y,'.')
    return g
for v in range(2):
    g=build(v); print('= 2 lake3_%d'%v); print('\n'.join(''.join(r) for r in g))
