import math,sys
W,H=17,17
g=[['.']*W for _ in range(H)]
def put(x,y,c):
    if 0<=x<W and 0<=y<H: g[y][x]=c
cx,cy=8,12
sy=0.75
for y in range(H):
    for x in range(W):
        r=math.hypot(x-cx,(y-cy)*sy)
        if r<=8.7 and y<=13: put(x,y,'a')
        if 4.7<r<5.7 and y<=13: put(x,y,'.')
for a in [8,32,56,80,100,124,148,172]:
    t=math.radians(a); ex=round(cx+7.2*math.cos(t)); ey=round(cy-7.2*math.sin(t)/sy)
    for dx,dy in [(-1,0),(1,0),(0,-1),(0,1),(0,0)]: put(ex+dx,ey+dy,'b')
    put(ex,ey,'c')
for a in [30,70,110,150]:
    t=math.radians(a); ex=round(cx+3.0*math.cos(t)); ey=round(cy-3.0*math.sin(t)/sy)
    put(ex,ey,'b')
body={3:(8,8),4:(7,9),5:(8,9),6:(8,8),7:(8,8),8:(8,8),9:(8,8),10:(7,9),11:(7,9),12:(6,10),13:(6,10),14:(6,10),15:(7,9)}
for y,(a,b) in body.items():
    for x in range(a,b+1): put(x,y,'c')
put(7,16,'c');put(9,16,'c')
print('\n'.join(''.join(r) for r in g))
