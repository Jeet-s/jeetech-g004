import math,sys
W=H=14
R=float(sys.argv[1]) if len(sys.argv)>1 else 4.6
A=float(sys.argv[2]) if len(sys.argv)>2 else 7.0
B=float(sys.argv[3]) if len(sys.argv)>3 else 2.0
T=float(sys.argv[4]) if len(sys.argv)>4 else 25
g=[['.']*W for _ in range(H)]
cx,cy=6.5,6.5
inside=lambda x,y: math.hypot(x-cx,y-cy)<=R
for y in range(H):
  for x in range(W):
    if inside(x,y): g[y][x]='#'
th=math.radians(T)
front=set();back=set()
for i in range(2000):
  t=2*math.pi*i/2000
  u,v=A*math.cos(t),B*math.sin(t)
  x=cx+u*math.cos(th)+v*math.sin(th); y=cy-u*math.sin(th)+v*math.cos(th)
  c=(round(y),round(x))
  if 0<=c[0]<H and 0<=c[1]<W:
    (front if v>0 else back).add(c)
for (y,x) in back:
  if not inside(x,y): g[y][x]='#'
for (y,x) in front:
  if inside(x,y):
    for dy in (-1,):
      if (y+dy,x) not in front and 0<=y+dy: g[y+dy][x]='.'
for (y,x) in front: g[y][x]='#'
print('\n'.join(''.join(r) for r in g))
