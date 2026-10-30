import math,sys
W=H=17; cx=cy=8
k=float(sys.argv[1]); w=float(sys.argv[2])
g=[['.']*W for _ in range(H)]
for y in range(H):
  for x in range(W):
    dx,dy=x-cx,(y-cy)*1.0
    r=math.hypot(dx,dy); a=math.atan2(dy,dx)
    if r<1.8: g[y][x]='#'; continue
    if r>8.6: continue
    # two arms: a = k*log(r)+phase
    for ph in (0,math.pi):
      d=(a - k*math.log(r) - ph)%(2*math.pi)
      d=min(d,2*math.pi-d)
      if d*r < w*(1+r/8): g[y][x]='#'
print('\n'.join(''.join(r) for r in g))
