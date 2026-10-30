W,H=20,20
g=[['.']*W for _ in range(H)]
def put(x,y,c):
    if 0<=x<W and 0<=y<H: g[y][x]=c
def rect(x0,y0,x1,y1,c):
    for x in range(x0,x1+1): put(x,y0,c); put(x,y1,c)
    for y in range(y0,y1+1): put(x0,y,c); put(x1,y,c)
# arch
arch=["~~~~~aaaaaaaaaa~~~~~","~~~aa..........aa~~~","~~a..............a~~","~a................a~"]
for y,s in enumerate(arch):
    for x,ch in enumerate(s): put(x,y,ch)
for y in range(4,15): put(0,y,'a'); put(19,y,'a')
# big frame
rect(6,2,13,9,'b')
pic=["......","..c...",".ccc..","cccccc","cc.ccc","cccccc"]  # mountain? 
pic=["....c.","......","..c...",".ccc..","cccccc","cccccc"]
for y,s in enumerate(pic):
    for x,ch in enumerate(s): put(7+x,3+y,ch)
# small frames
rect(2,5,4,8,'b'); put(3,6,'c'); put(3,7,'c')
rect(15,5,17,8,'b'); put(16,6,'c'); put(16,7,'c')
# visitors: adult at x=4..5, child at 15
person=[" a ","aaa","aaa"," a "," a "]  
for y in range(10,15): pass
adult=[".a.","aaa","aaa","aaa",".a.","a.a"]
for y,s in enumerate(adult):
    for x,ch in enumerate(s):
        if ch=='a': put(3+x,10+y,'a')
child=[".a.","aaa","aaa","a.a"]
for y,s in enumerate(child):
    for x,ch in enumerate(s):
        if ch=='a': put(15+x,12+y,'a')
# bench
for x in range(7,13): put(x,13,'b')
put(7,14,'b'); put(12,14,'b')
for x in range(W): put(x,15,'a')
# floor tiles
fl=["c.c.c.c.c.c.c.c.c.c.",".c.c.c.c.c.c.c.c.c.c"]
for y in range(16,20):
    for x in range(W): put(x,y,'c' if (x+y)%4==0 else '.')
print('= 3 hall'); print('\n'.join(''.join(r) for r in g))
