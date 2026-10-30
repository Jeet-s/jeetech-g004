W,H=20,20
g=[['.']*W for _ in range(H)]
def put(x,y,c):
    if 0<=x<W and 0<=y<H: g[y][x]=c
def mountain(px,py,base,snow):
    for y in range(py,base+1):
        d=y-py
        if d<snow:
            for x in range(px-d,px+d+1): put(x,y,'b')
        else:
            put(px-d,y,'a'); put(px+d,y,'a')
            # snow drip
            if d==snow:
                for x in range(px-d+1,px+d): put(x,y,'b' if (x-px)%2==0 else 'a')
mountain(7,0,7,3)
mountain(15,3,7,2)
g[0][16]=g[0][17]=g[1][15]=g[1][16]=g[1][17]=g[1][18]='b'
for x in [1,5,9,13,17]:
    put(x,7,'a'); put(x-1,8,'a');put(x,8,'a');put(x+1,8,'a')
for x in range(W): put(x,9,'a')
rows=["cccccccccccccccccccc",
      "....................",
      ".ccc....cc....ccc...",
      "......cc...cc.......",
      "..cc........ccc..cc.",
      ".....ccc...........",
      "...........cc..ccc..",
      ".cc...cc...........c",
      "....ccc....cccc.....",
      "cccccccccccccccccccc"]
for i,s in enumerate(rows):
    for x,ch in enumerate(s): put(x,10+i,ch)
print('= 3 lake2')
print('\n'.join(''.join(r) for r in g))
