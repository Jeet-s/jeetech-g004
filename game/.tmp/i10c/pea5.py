W,H=17,17
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
cx,cy=8,13
outer=[(4,1),(12,1),(1,4),(15,4),(1,9),(15,9)]
mid=[(8,1)]
inner=[(5,5),(11,5),(3,10)]
inner=[(5,5),(11,5)]
for (x,y) in outer+inner+mid: line(x,y,cx,cy)
for (x,y) in outer+inner+mid: eye(x,y)
body={5:(8,8),6:(8,8),7:(7,8),8:(8,8),9:(8,8),10:(7,9),11:(7,9),12:(6,10),13:(6,10),14:(6,10),15:(7,9)}
for y,(a,b) in body.items():
    for x in range(a,b+1): put(x,y,'c')
put(7,16,'c');put(9,16,'c')
print('\n'.join(''.join(r) for r in g))
