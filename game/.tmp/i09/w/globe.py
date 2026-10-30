from g import G
import math
s=G(17,17)
cx,cy=7,7
s.ring(cx,cy,6.0,7.0)
for x in range(17):
  for yy in (3,11):
    if math.hypot(x-cx,yy-cy)<6: s.p(x,yy)
for y in range(17):
  for x in range(17):
    d=math.hypot(x-cx,y-cy)
    if 8.2<=d<=9.0 and x>cx+3 and y<15: s.p(x,y)
s.ell(cx,cy,2.6,6.0,0)
s.line(7,7,7,7)
s.rect(6,15,8,15); s.rect(3,16,11,16)
print(s.out())
