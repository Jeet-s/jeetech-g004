from g import G
import math
s=G(20,20)
cx,cy,R=11.5,15.0,7.6
for y in range(20):
  for x in range(20):
    if y<=14 and math.hypot(x-cx,y-cy)<=R: s.p(x,y)
# slit
for y in range(7,13):
  for x in (11,12): s.p(x,y,'.')
# dome rib
for y in range(9,15): s.p(7,y,'.') if math.hypot(7-cx,y-cy)<R-1.5 else None
# telescope tube: from (12,11) to (3,3), thick
ux,uy=-9,-8; L=math.hypot(ux,uy); ux/=L; uy/=L; px,py=-uy,ux
for y in range(20):
  for x in range(20):
    dx,dy=x-12,y-11.5
    a=dx*ux+dy*uy; b=dx*px+dy*py
    if 0<=a<=12.5 and abs(b)<=1.0+(0.4 if a>11 else 0): s.p(x,y)
    if 0<=a<=12.5 and abs(b)<=1.0 and abs(a-7.5)<0.5: s.p(x,y,'.')
# building
s.rect(4,15,19,17)
for x in (6,7): s.p(x,16,'.')
for x in (16,17): s.p(x,16,'.')
s.rect(11,16,12,17,'.')
s.rect(0,18,19,19)
s.rect(0,17,1,17); s.p(0,16); s.p(1,15) 
# moon
for x,y in [(16,0),(17,0),(18,0),(15,1),(16,1),(14,2),(15,2),(14,3),(15,3),(15,4),(16,4),(16,5),(17,5),(18,5)]: s.p(x,y)
for x,y in [(9,1),(8,2),(9,2),(10,2),(9,3),(1,9),(1,6),(0,7),(1,7),(2,7),(1,8),(19,8),(18,10)]: s.p(x,y)
print(s.out())
