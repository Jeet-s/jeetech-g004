W,H=24,23
g=[['.']*W for _ in range(H)]
def put(x,y,c):
    if 0<=x<W and 0<=y<H: g[y][x]=c
# flag
for y in range(0,3): put(11,y,'a')
for x,y in [(12,0),(13,0),(14,0),(12,1),(13,1)]: put(x,y,'c')
# pediment outline rows 3..7, apex at x=11/12
for i,y in enumerate(range(3,8)):
    l=10-2*i; r=13+2*i
    put(l,y,'a');put(l+1,y,'a'); put(r,y,'a'); put(r-1,y,'a')
for x in range(1,23): put(x,8,'a')
# emblem
for x,y in [(11,5),(12,5),(10,6),(11,6),(12,6),(13,6)]: put(x,y,'b')
# frieze row 9 gold dashes
for x in range(2,22):
    if x%3!=1: put(x,9,'b')
for x in range(1,23): put(x,10,'a')
# columns
for cx in [2,6,16,20]:
    for y in range(11,19): put(cx,y,'a'); put(cx+1,y,'a')
# banners
for bx in [4,18]:
    for y in range(11,15): put(bx,y,'c')
    put(bx,15,'c') if False else None
# door arch
for y in range(13,19):
    for x in range(10,14): put(x,y,'b')
for x in [10,13]: put(x,13,'.')
put(11,16,'.'); put(12,16,'.')  # handles gap? 
# lanterns/windows
for x,y in [(8,12),(15,12)]: put(x,y,'b'); put(x,13,'b')
# steps
for x in range(1,23): put(x,19,'a')
for x in range(0,24): put(x,21,'a')
for x in range(0,24):
    if x%2==0: put(x,20,'b')
for x in range(0,24):
    put(x,22,'c' if x%5!=2 else '.')
print('= 3 fin'); print('\n'.join(''.join(r) for r in g))
