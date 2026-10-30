import math
class G:
  def __init__(s,w,h): s.w,s.h=w,h; s.g=[['.']*w for _ in range(h)]
  def p(s,x,y,c='#'):
    x,y=int(round(x)),int(round(y))
    if 0<=x<s.w and 0<=y<s.h: s.g[y][x]=c
  def disk(s,cx,cy,r,c='#'):
    for y in range(s.h):
      for x in range(s.w):
        if math.hypot(x-cx,y-cy)<=r: s.g[y][x]=c
  def ring(s,cx,cy,r1,r2,c='#'):
    for y in range(s.h):
      for x in range(s.w):
        d=math.hypot(x-cx,y-cy)
        if r1<=d<=r2: s.g[y][x]=c
  def line(s,x0,y0,x1,y1,c='#'):
    n=int(max(abs(x1-x0),abs(y1-y0)))+1
    for i in range(n+1):
      t=i/max(n,1); s.p(x0+(x1-x0)*t,y0+(y1-y0)*t,c)
  def rect(s,x0,y0,x1,y1,c='#'):
    for y in range(y0,y1+1):
      for x in range(x0,x1+1): s.p(x,y,c)
  def ell(s,cx,cy,a,b,th,c='#',half=None):
    for i in range(3000):
      t=2*math.pi*i/3000; u,v=a*math.cos(t),b*math.sin(t)
      if half is not None and (v>0)!=half: continue
      s.p(cx+u*math.cos(th)-v*math.sin(th), cy+u*math.sin(th)+v*math.cos(th),c)
  def out(s): return '\n'.join(''.join(r) for r in s.g)
