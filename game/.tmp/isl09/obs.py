W,H=20,20
g=[['.']*W for _ in range(H)]
def put(y,x,c='#'):
    if 0<=y<H and 0<=x<W: g[y][x]=c
def row(y,a,b,c='#'):
    for x in range(a,b+1): put(y,x,c)
# moon crescent
for y,a,b in [(0,2,4),(1,1,2),(2,0,1),(3,0,1),(4,1,2),(5,2,4)]: row(y,a,b)
# stars (plus)
for (y,x) in [(1,9),(9,1)]:
    put(y,x);put(y-1,x);put(y+1,x);put(y,x-1);put(y,x+1)
# dome: half disc rows 7-12 cols 3-16
dome=[(7,7,12),(8,5,14),(9,4,15),(10,3,16),(11,3,16),(12,3,16)]
for y,a,b in dome: row(y,a,b)
# slit
for y in range(7,12): put(y,10,'.')
# telescope diagonal from (8,10) to upper right, 2 thick
tel=[(7,10,11),(6,10,12),(5,12,14),(4,13,15),(3,15,17),(2,16,18),(1,17,19)]
for y,a,b in tel: row(y,a,b)
# ledge
row(13,2,17)
# building walls rows 14-17 cols 3-16 with door and windows
for y in range(14,18): row(y,3,16)
for y in range(14,16): put(y,5,'.');put(y,6,'.');put(y,13,'.');put(y,14,'.')
for y in range(15,18): put(y,9,'.');put(y,10,'.')
row(18,0,19); row(19,0,19)
print("\n".join("".join(r) for r in g))
