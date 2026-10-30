from g import G
import math
s=G(18,18)
cx,cy=8.5,7.5
s.ring(cx,cy,6.6,7.5)            # outer meridian ring
s.ell(cx,cy,7.0,2.2,math.radians(-22))  # ecliptic band tilted
s.ell(cx,cy,7.0,1.6,math.radians(-22))
s.ell(cx,cy,2.6,7.0,math.radians(0))    # colure
s.disk(cx,cy,1.6)                # earth
s.line(cx-6,cy+6.5,cx+6,cy-6.5)  # axis? 
s.rect(7,15,10,15); s.rect(8,16,9,16); s.rect(4,17,13,17)
print(s.out())
