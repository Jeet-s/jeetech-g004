import math,sys
W=H=int(sys.argv[1]); R=float(sys.argv[2]); A=float(sys.argv[3]); B=float(sys.argv[4]); T=float(sys.argv[5])
g=[['.']*W for _ in range(H)]
cx=cy=(W-1)/2
inside=lambda x,y: math.hypot(x-cx,y-cy)<=R
for y in range(H):
  for x in range(W):
    if inside(x,y): g[y][x]='#'
th=math.radians(T); front=set();back=set()
for i in range(4000):
  t=2*math.pi*i/4000; u,v=A*math.cos(t),B*math.sin(t)
  x=cx+u*math.cos(th)+v*math.sin(th); y=cy-u*math.sin(th)+v*math.cos(th)
  c=(round(y),round(x))
  if 0<=c[0]<H and 0<=c[1]<W: (front if v>0 else back).add(c)
for (y,x) in back:
  if not inside(x,y): g[y][x]='#'
for (y,x) in front:
  if inside(x,y) and (y-1,x) not in front: g[y-1][x]='.'
for (y,x) in front: g[y][x]='#'
print('\n'.join(''.join(r) for r in g))
