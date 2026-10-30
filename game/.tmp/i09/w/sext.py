from g import G
import math
s=G(18,18)
ax,ay=3,2
for y in range(18):
  for x in range(18):
    d=math.hypot(x-ax,y-ay); a=math.degrees(math.atan2(y-ay,x-ax))
    if 13.2<=d<=15.2 and 30<=a<=92: s.p(x,y)
    if 13.2<=d<=14.0 and 30<=a<=92 and (int(a)%8<2): s.p(x,y,'.')
s.line(ax,ay,ax,ay+14)
s.line(ax,ay,ax+13*math.cos(math.radians(32)),ay+13*math.sin(math.radians(32)))
s.line(ax,ay,ax+14*math.cos(math.radians(62)),ay+14*math.sin(math.radians(62)))
s.rect(4,8,12,9); s.rect(2,8,2,9); s.p(13,8.5)
s.rect(1,0,5,1); s.p(3,1,'.')
s.rect(14,10,15,13)
print(s.out())
