star="""....#....
...###...
...###...
#########
.#######.
..#####..
..#####..
.###.###.
.##...##.
.#.....#."""
W=H=16
g=[['.']*W for _ in range(H)]
ox,oy=7,0
for y,r in enumerate(star.split()):
  for x,c in enumerate(r):
    if c=='#': g[oy+y][ox+x]='#'
for x in range(W):
  for y in range(H):
    s=x+y; ok=False
    if s in (10,11) and y>=4 and x<=7: ok=True
    if s in (14,15) and y>=7 and x<=8: ok=True
    if s in (19,) and y>=10 and x<=8: ok=True
    if ok: g[y][x]='#'
print('\n'.join(''.join(r) for r in g))
