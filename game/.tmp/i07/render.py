import re,sys
from PIL import Image, ImageDraw
src=open(sys.argv[1]).read()
src=src.replace('INK','"#1F2A3A"')
items=re.findall(r'id: "([^"]+)".*?palette: \[([^\]]*)\].*?art: `([^`]*)`',src,re.S)
S=14
tiles=[]
for id_,pal,art in items:
    pal=re.findall(r'"(#[0-9A-Fa-f]{6})"',pal)
    rows=[r.strip() for r in art.strip().split('\n') if r.strip()]
    h=len(rows);w=len(rows[0])
    im=Image.new('RGB',(w*S+4,h*S+4),(250,245,235))
    d=ImageDraw.Draw(im)
    for y,r in enumerate(rows):
        for x,ch in enumerate(r):
            c=None
            l=ch.lower()
            if ch=='~': c=(200,200,200)
            elif l=='#' or ch=='@': c=pal[0]
            elif l in 'abcdef': c=pal['abcdef'.index(l)]
            if c: d.rectangle([2+x*S,2+y*S,2+x*S+S-1,2+y*S+S-1],fill=c)
            if ch.isupper() or ch in ',@': d.rectangle([2+x*S+4,2+y*S+4,2+x*S+9,2+y*S+9],outline=(255,255,255))
    tiles.append(im)
W=sum(t.width+10 for t in tiles[:6]);
out=Image.new('RGB',(max(sum(t.width+10 for t in tiles[i:i+4]) for i in range(0,len(tiles),4)),sum(max(t.height for t in tiles[i:i+4])+10 for i in range(0,len(tiles),4))),(255,255,255))
y=0
for i in range(0,len(tiles),4):
    x=0
    for t in tiles[i:i+4]:
        out.paste(t,(x,y)); x+=t.width+10
    y+=max(t.height for t in tiles[i:i+4])+10
out.save(sys.argv[2])
