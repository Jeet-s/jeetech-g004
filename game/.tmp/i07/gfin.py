import sys
W,H=18,18
g=[['.']*W for _ in range(H)]
def put(y,x,rows):
    for i,r in enumerate(rows):
        for j,ch in enumerate(r):
            if ch!=' ': g[y+i][x+j]=ch
g[0]=list("aaa............aaa")
g[1]=list("..aaaa......aaaa..")
g[2]=list(".a....aaaaaa....a.")
side=[".a...",".aaa.","ccccc","cdcdc","cdbdc","cdcdc","ccccc",".aaa.","..b..",".bbb."]
side2=["...a.",".aaa.","ccccc","cdcdc","cdbdc","cdcdc","ccccc",".aaa.","..b..",".bbb."]
cen=["..aa..",".cccc.","ccddcc","cdbbdc","cbbbbc","cbbbbc","cdbbdc","ccddcc",".cccc.","..aa..","..bb..",".bbbb."]
put(2,0,side); put(2,13,side2)
put(3,6,cen)
g[15]=list("bb...aaaa.aaa...bb")
g[16]=list(".aaa..bb..bb..aaa.")
g[17]=list("aa..aaaaaaaaaa..aa")
for k in sys.argv[1:]:
    y,x=map(int,k.split(','));c=g[y][x]; g[y][x]=',' if c=='.' else c.upper()
print("\n".join("".join(r) for r in g))
