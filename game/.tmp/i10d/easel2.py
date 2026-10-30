W,H=22,24
g=[['.']*W for _ in range(H)]
def put(x,y,c):
    if 0<=x<W and 0<=y<H: g[y][x]=c
def line(x0,y0,x1,y1,c):
    n=max(abs(x1-x0),abs(y1-y0))
    for i in range(n+1): put(round(x0+(x1-x0)*i/n), round(y0+(y1-y0)*i/n),c)
put(10,0,'a');put(11,0,'a');put(10,1,'a');put(11,1,'a')
for x in range(1,21): put(x,2,'a'); put(x,16,'a')
for y in range(2,17): put(1,y,'a'); put(20,y,'a')
P=[
"................",
"...b.........cc.",
"...bb.......cccc",
"...b.b......cccc",
"...b..b......cc.",
"...b...b........",
"...b....b.......",
"...bbbbbbb......",
"...b............",
"cccccccccccc....",
".cccccccccc.....",
"..cccccccc......",
"b...bb....bb...b",
".bbb..bbbb..bbb.",
]
for i,s in enumerate(P):
    for j,ch in enumerate(s):
        if ch!='.': put(3+j,3+i,ch)
for x in range(0,22): put(x,17,'a')
line(4,18,0,23,'a'); line(17,18,21,23,'a')
for y in range(18,24): put(10,y,'a'); put(11,y,'a')
# palette left
pal=[".aaaa.","aacaba","aaaaaa",".aaaa."]
pal=["..aaa.","aacaaa","abaaca",".aaaa."]
for i,s in enumerate(pal):
    for j,ch in enumerate(s):
        if ch!='.': put(3+j,20+i,ch)
# jar right with brushes
for y in range(20,24):
    for x in range(13,17): put(x,y,'b')
put(13,18,'c'); put(13,19,'a'); put(15,18,'a'); put(15,19,'a'); put(16,17-0,'a') if False else None
put(16,18,'c'); put(16,19,'a')
print('= 3 easel'); print('\n'.join(''.join(r) for r in g))
