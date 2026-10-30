import sys
from PIL import Image, ImageDraw
# usage: render.py in.txt out.png  (blank-line separated arts, laid out horizontally)
parts=[p.strip().split("\n") for p in open(sys.argv[1]).read().split("\n\n") if p.strip()]
S=16; pad=20
cols={'.':(250,246,236),'#':(31,42,58),'a':(46,140,138),'b':(227,168,59),'c':(217,105,79),'d':(141,180,142),'e':(140,107,177),'f':(111,168,220),'~':(200,200,200)}
W=sum(len(p[0])*S+pad for p in parts)+pad; H=max(len(p) for p in parts)*S+2*pad
im=Image.new("RGB",(W,H),(255,255,255)); d=ImageDraw.Draw(im); x0=pad
for p in parts:
  for y,row in enumerate(p):
    for x,ch in enumerate(row.strip()):
      c=cols.get(ch.lower(),(255,0,255)); d.rectangle([x0+x*S,pad+y*S,x0+x*S+S-1,pad+y*S+S-1],fill=c,outline=(220,220,220))
  x0+=len(p[0])*S+pad
im.save(sys.argv[2])
