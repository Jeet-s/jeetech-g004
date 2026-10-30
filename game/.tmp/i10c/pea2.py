W,H=17,16
g=[['.']*W for _ in range(H)]
def put(x,y,c):
    if 0<=x<W and 0<=y<H: g[y][x]=c
def eye(x,y):
    for dx,dy in [(-1,0),(1,0),(0,-1),(0,1)]: put(x+dx,y+dy,'b')
    put(x,y,'c')
def line(x0,y0,x1,y1):
    n=max(abs(x1-x0),abs(y1-y0))
    for i in range(n+1):
        put(round(x0+(x1-x0)*i/n), round(y0+(y1-y0)*i/n),'a')
cx,cy=8,11
outer=[(8,1),(4,2),(12,2),(1,5),(15,5),(1,9),(15,9)]
inner=[(6,5),(10,5),(4,8),(12,8)]
for (x,y) in outer+inner: line(x,y,cx,cy)
for (x,y) in outer+inner: eye(x,y)
# neck/head
for y in range(6,12): put(8,y,'c')
put(8,5,'c');put(7,5,'c') if False else None
for (x,y) in [(8,4),(7,3),(9,3),(8,3)]: pass
# body
rows={10:(7,9),11:(6,10),12:(6,10),13:(6,10),14:(7,9)}
for y,(a,b) in rows.items():
    for x in range(a,b+1): put(x,y,'c')
put(7,15,'c');put(9,15,'c')
print('\n'.join(''.join(r) for r in g))
