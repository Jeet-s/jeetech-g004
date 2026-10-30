import math,sys
W=H=17; cx=cy=8
sp=float(sys.argv[1]); th=float(sys.argv[2]); arms=int(sys.argv[3])
g=[['.']*W for _ in range(H)]
for y in range(H):
  for x in range(W):
    dx,dy=x-cx,y-cy; r=math.hypot(dx,dy); a=math.atan2(dy,dx)
    if r<1.6: g[y][x]='#'; continue
    if r>9.2: continue
    for ph in range(arms):
      # r = sp*(a+2pi k + ph*2pi/arms)/(2pi)
      for k in range(-1,4):
        rr=sp*(a+2*math.pi*k+ph*2*math.pi/arms)/(2*math.pi)
        if rr>0.5 and abs(r-rr)<th*(0.5+r/12): g[y][x]='#'
print('\n'.join(''.join(r) for r in g))
