from g import G
s=G(17,17)
S=[(1,2),(5,3),(9,5),(11,8),(11,13),(15,14),(15,9)]
for a,b in zip(S,S[1:]+[S[3]]): s.line(a[0],a[1],b[0],b[1])
for (x,y) in S:
  for dx,dy in ((0,0),(1,0),(-1,0),(0,1),(0,-1)): s.p(x+dx,y+dy)
for (x,y) in [(3,9),(7,12),(14,1),(2,15),(6,7)]: s.p(x,y)
print(s.out())
