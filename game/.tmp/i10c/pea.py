import math
W,H=17,16
g=[['.']*W for _ in range(H)]
cx,cy=8,13
def put(x,y,c):
    if 0<=x<W and 0<=y<H: g[y][x]=c
angs=[15,37,60,82,98,120,143,165]
angs=[10,32,55,78,102,125,148,170]
for a in angs:
    r=math.radians(a)
    for t in [x*0.25 for x in range(14,26)]:
        put(round(cx+t*math.cos(r)), round(cy-t*math.sin(r)),'a')
    ex,ey=round(cx+7.6*math.cos(r)), round(cy-7.6*math.sin(r)*1.0)
    for dx in (-1,0,1):
        for dy in (-1,0,1):
            if abs(dx)+abs(dy)<=1: put(ex+dx,ey+dy,'b')
    put(ex,ey,'c')
# body
for y in range(8,16):
    for x in range(W):
        if ((x-cx)/1.6)**2+((y-12.5)/3.2)**2<=1: put(x,y,'c')
for y,x in [(5,8),(6,8),(7,8),(4,8),(3,7),(3,9),(2,8)]: put(x,y,'c')
print('\n'.join(''.join(r) for r in g))
