import math
W=H=18; th=math.radians(-35); cx,cy=8.6,9.2
g=[['.']*W for _ in range(H)]
def loc(x,y):
  dx,dy=x-cx,y-cy
  return dx*math.cos(th)+dy*math.sin(th), -dx*math.sin(th)+dy*math.cos(th)
for y in range(H):
  for x in range(W):
    u,v=loc(x,y); c=False
    # body
    if abs(u)<=2.0 and abs(v)<=2.2: c=True
    if abs(u)<=1.0 and abs(v)<=1.0: c=False
    # arms
    if 2.0<abs(u)<3.3 and abs(v)<0.5: c=True
    # panels
    if 3.3<=abs(u)<=9.5 and abs(v)<=2.6:
      c=True
      if abs(v)<0.5: c=False
      if abs(abs(u)-6.4)<0.45: c=False
    # dish on top (v negative)
    if abs(u)<=0.5 and -4.2<v<-2.2: c=True
    if -5.6<=v<=-4.2 and abs(u)<= (v+6.4)*1.1: c=True
    if c: g[y][x]='#'
print('\n'.join(''.join(r) for r in g))
