import sys
def sat(W,H,cx,cy,R,y0,y1,thick,stripes=()):
    g=[['.']*W for _ in range(H)]
    ringy=lambda x: y0+(y1-y0)*x/(W-1)
    for y in range(H):
        for x in range(W):
            d=(x-cx)**2+(y-cy)**2<=R*R
            ry=ringy(x); off=y-ry
            if d: g[y][x]='#'
            for s in stripes:
                if d and abs(off-s)<.5: g[y][x]='.'
            if d and -thick/2-1.0<=off<=thick/2+1.0: g[y][x]='.'
            if -thick/2<=off<=thick/2: g[y][x]='#'
    return [''.join(r) for r in g if '#' in ''.join(r)]
for i,a in enumerate([(17,13,8,6,5.6,10,3,1.0),(17,13,8,6,5.6,10,3,1.0,(-3.5,)),(17,14,8,6.5,6,11,2,1.2,(-3.6,3.4)),(16,14,7.5,6.5,6,11,2,1.0,(-3.5,))]):
    print('=s%d'%i); print('\n'.join(sat(*a))); print()
