import math,sys
W,H=16,16
g=[['.']*W for _ in range(H)]
cy,cx=6.0,7.5
def disc(y0,x0,r):
    for y in range(H):
        for x in range(W):
            if (y-y0)**2+(x-x0)**2<=r*r: g[y][x]='#'
# orbit ring
rx,ry=7.4,3.0
for y in range(H):
    for x in range(W):
        d=((x-cx)/rx)**2+((y-cy)/ry)**2
        if abs(math.sqrt(d)-1)<0.13: g[y][x]='#'
# gap around sun then sun
for y in range(H):
    for x in range(W):
        if (y-cy)**2+(x-cx)**2<=3.3**2: g[y][x]='.'
disc(cy,cx,2.5)
# planets
disc(cy-ry, cx+3.5, 1.2)
disc(cy+ry*0.8, cx-5.0, 1.0)
# stand
for y in range(int(cy+3),H-2): g[y][7]=g[y][8]='#'
for x in range(5,11): g[H-2][x]='#'
for x in range(3,13): g[H-1][x]='#'
print("\n".join("".join(r) for r in g))
