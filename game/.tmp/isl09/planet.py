import math
def make(W,H,cx,cy,R,a,b,ang,th,gap,bands=(),bw=.5):
    g=[['.']*W for _ in range(H)]
    ca,sa=math.cos(math.radians(ang)),math.sin(math.radians(ang))
    for y in range(H):
        for x in range(W):
            dx,dy=x-cx,y-cy
            u=dx*ca+dy*sa; v=-dx*sa+dy*ca
            e=math.sqrt((u/a)**2+(v/b)**2)
            ring=abs(e-1)<th
            front=v>0
            planet=dx*dx+dy*dy<=R*R
            nearring=abs(e-1)<th+gap
            if planet and not (front and nearring) and not any(abs(v-c)<bw for c in bands): g[y][x]='#'
            if ring and (front or not planet): g[y][x]='#'
    rows=[''.join(r) for r in g]
    rows=[r for r in rows if '#' in r]
    return rows
