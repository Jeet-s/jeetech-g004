import math,sys
W,H=17,16
g=[['.']*W for _ in range(H)]
def put(x,y,c):
    if 0<=x<W and 0<=y<H: g[y][x]=c
cx,cy=8,12.5
for y in range(H):
    for x in range(W):
        r=math.hypot(x-cx,(y-cy)*1.05)
        if r<=8.6 and y<=12: put(x,y,'a')
        if 4.6<r<5.6 and y<=12: put(x,y,'.')
for a in [12,38,64,90,116,142,168]:
    t=math.radians(a); ex=round(cx+7.1*math.cos(t)); ey=round(cy-7.1*math.sin(t))
    for dx,dy in [(-1,0),(1,0),(0,-1),(0,1),(0,0)]: put(ex+dx,ey+dy,'b')
    put(ex,ey,'c')
for a in [25,65,115,155]:
    t=math.radians(a); ex=round(cx+3.2*math.cos(t)); ey=round(cy-3.2*math.sin(t))
    put(ex,ey,'b')
for y,(a,b) in {6:(8,8),5:(8,9),7:(8,8),8:(8,8),9:(7,9),10:(7,9),11:(6,10),12:(6,10),13:(6,10),14:(7,9)}.items():
    for x in range(a,b+1): put(x,y,'c')
put(7,4,'c');put(9,4,'c');put(8,3,'c')
put(7,15,'c');put(9,15,'c')
print('\n'.join(''.join(r) for r in g))
