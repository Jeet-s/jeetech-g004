import math,sys
W=H=17; R=5.3; th=math.radians(28)
cx=cy=8
g=[['.']*W for _ in range(H)]
def rot(u,v): return cx+u*math.cos(th)+v*math.sin(th), cy-u*math.sin(th)+v*math.cos(th)
inside=lambda x,y: math.hypot(x-cx,y-cy)<=R
for y in range(H):
  for x in range(W):
    if inside(x,y): g[y][x]='#'
# bands on planet: line parallel to ring
for y in range(H):
  for x in range(W):
    if inside(x,y):
      # coordinate along ring normal
      dx,dy=x-cx,y-cy
      v= dx*math.sin(th)+dy*math.cos(th)
      if abs(v+2.6)<0.45: g[y][x]='.'
ring=[];
for A,B in ((8.2,2.6),(7.4,2.0)):
  for i in range(4000):
    t=2*math.pi*i/4000; u,v=A*math.cos(t),B*math.sin(t)
    x,y=rot(u,v); ring.append((round(x),round(y),v>0))
for x,y,f in ring:
  if 0<=x<W and 0<=y<H:
    if f or not inside(x,y): g[y][x]='#'
# gap above front ring on planet
fs={(x,y) for x,y,f in ring if f}
for x,y in fs:
  for d in (-1,):
    if (x,y+d) not in fs and inside(x,y+d) and 0<=y+d<H: g[y+d][x]='.'
print('\n'.join(''.join(r) for r in g))
