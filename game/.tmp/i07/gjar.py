import sys
W=14
shape=["..cccccccccc..","..cccccccccc..","...aaaaaaaa...","..addddddddа..".replace("а","a"),".adddddddddda."]+["addddddddddddda"[:13]+"a"]*7+[".adddddddddda.","..aaaaaaaaaa.."]
def make(ff):
    g=[list(r) for r in shape]
    for (y,x) in ff: g[y][x]='b'
    return "\n".join("".join(r) for r in g)
sets=[
 [(3,8),(4,4),(5,10),(6,2),(7,7),(8,4),(9,11),(10,8),(11,3),(12,6)],
 [(3,9),(4,5),(5,11),(6,3),(7,8),(8,5),(9,10),(10,2),(11,7),(12,9)],
 [(4,4),(5,9),(6,2),(7,6),(8,11),(9,4),(10,8),(11,2),(12,7)],
]
for s in sets: print(sys.argv[1]); print(make(s)); print()
