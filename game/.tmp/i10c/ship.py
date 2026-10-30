import math
W=H=16
g=[['~' if math.hypot(x-7.5,y-7.5)>8.1 else '.' for x in range(W)] for y in range(H)]
def p(y,x,c):
    if g[y][x]!='~': g[y][x]=c
def hl(y,x0,x1,c):
    for x in range(x0,x1+1): p(y,x,c)
# sun low right
for y in range(5,10):
    for x in range(10,16):
        if math.hypot(x-13,y-9)<=3.2: p(y,x,'b')
# masts
for y in range(1,10): p(y,4,'a'); p(y,9,'a')
p(0,5,'c'); p(0,10,'c')  # pennants
p(1,5,'c'); p(1,10,'c')
for y in (2,3): hl(y,2,6,'c'); hl(y,8,10,'c')
for y in (5,6,7): hl(y,1,7,'c'); hl(y,8,11,'c')
for y in range(1,10): p(y,4,'a'); p(y,9,'a')
p(1,5,'.');p(1,10,'.')
hl(9,12,14,'a')
hl(10,1,14,'a'); hl(11,2,13,'a'); hl(12,4,11,'a')
for x in range(0,16):
    if x%4 in (1,2): p(14,x,'a')
    if x%4 in (3,0): p(13,x,'a')
for x in range(5,11):
    if x%3==0: p(15,x,'a')
print('\n'.join(''.join(r) for r in g))
