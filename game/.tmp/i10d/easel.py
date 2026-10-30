import sys
W,H=24,24
g=[['.']*W for _ in range(H)]
def put(x,y,c):
    if 0<=x<W and 0<=y<H: g[y][x]=c
def line(x0,y0,x1,y1,c):
    n=max(abs(x1-x0),abs(y1-y0))
    for i in range(n+1): put(round(x0+(x1-x0)*i/n), round(y0+(y1-y0)*i/n),c)
# easel top
put(11,0,'a');put(12,0,'a');put(11,1,'a');put(12,1,'a')
# canvas frame x 3..20, rows 2..15
for x in range(3,21): put(x,2,'a'); put(x,15,'a')
for y in range(2,16): put(3,y,'a'); put(20,y,'a')
# painting inside x4..19 rows 3..14
P=[
"..............cc",   #3 sun
".........b...cccc",
"........bb...cccc",
".......b.b....cc.",
"......b..b.......",
".....b...b.......",
"....bbbbbbb......",
".........b.......",
"..cccccccccccc...",
"...cccccccccc....",
"b...b...b...b...b",
".bbb.bbb.bbb.bbb.",
]
for i,s in enumerate(P):
    for j,ch in enumerate(s[:16]):
        if ch!='.': put(4+j,3+i,ch)
# tray
for x in range(2,22): put(x,16,'a')
# legs
line(5,17,1,23,'a'); line(18,17,22,23,'a')
for y in range(17,24): put(11,y,'a'); put(12,y,'a')
# palette bottom-left between legs? jar right
for x,y in [(4,21),(5,21),(6,21),(7,21),(8,21),(3,22),(4,22),(5,22),(6,22),(7,22),(8,22),(9,22)]: put(x,y,'a')
for x,y in [(5,20),(7,20),(4,21),(6,22)]: put(x,y,'c' if x!=7 else 'b')
# jar right
for y in range(20,24):
    for x in range(15,18): put(x,y,'b')
line(15,17,15,19,'a'); line(17,17,17,19,'a'); put(16,18,'a'); put(16,19,'a')
put(15,17,'c'); put(17,17,'b')
print('= 3 easel'); print('\n'.join(''.join(r) for r in g))
