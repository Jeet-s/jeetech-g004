# ra.py out.png pal1,pal2,.. art1 [art2...]  (pal as hex without # list per art separated by ;)
import sys
from PIL import Image, ImageDraw
out=sys.argv[1]; pals=sys.argv[2].split(';'); arts=sys.argv[3:]
S=16; tiles=[]
for pal,af in zip(pals,arts):
    pal=['#'+p for p in pal.split(',')]
    rows=[r.strip() for r in open(af) if r.strip()]
    im=Image.new('RGB',(len(rows[0])*S+4,len(rows)*S+4),(250,245,235)); d=ImageDraw.Draw(im)
    for y,r in enumerate(rows):
        for x,ch in enumerate(r):
            l=ch.lower(); c=None
            if ch=='~': c=(190,190,190)
            elif l=='#' or ch=='@': c=pal[0]
            elif l in 'abcdef': c=pal['abcdef'.index(l)]
            if c: d.rectangle([2+x*S,2+y*S,2+x*S+S-1,2+y*S+S-1],fill=c)
    tiles.append(im)
W=sum(t.width+8 for t in tiles); H=max(t.height for t in tiles)
o=Image.new('RGB',(W,H),(255,255,255)); x=0
for t in tiles: o.paste(t,(x,0)); x+=t.width+8
o.save(out)
