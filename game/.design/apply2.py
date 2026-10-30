import re, glob
def block(id_):
    for f in glob.glob('src/game/islands/*.ts'):
        s=open(f).read()
        i=s.find(f'id: "{id_}"')
        if i>=0:
            a=s.rfind('{',0,i); b=s.find('\n  },',i)
            return f,s,a,b
    raise Exception(id_)
def upd(id_, art=None, aha=None, role=None, mech=None, crack=None, title=None, smudge=None):
    f,s,a,b=block(id_)
    t=s[a:b]
    if art is not None:
        t=re.sub(r'art: `[^`]*`', 'art: `\n'+art.strip('\n')+'`', t)
    if aha is not None:
        t=re.sub(r'aha: "(?:[^"\\]|\\.)*"', 'aha: '+json.dumps(aha,ensure_ascii=False), t)
    if role: t=re.sub(r'role: "[a-z]+"', f'role: "{role}"', t)
    if mech is not None: t=re.sub(r'mechanics: \[[^\]]*\]', 'mechanics: ['+', '.join(json.dumps(m) for m in mech)+']', t)
    if title: t=re.sub(r'title: "(?:[^"\\]|\\.)*"', 'title: '+json.dumps(title,ensure_ascii=False), t)
    if crack is not None: t=re.sub(r'crack: \[[^\]]*\]', 'crack: ['+', '.join(json.dumps(m) for m in crack)+']', t)
    s=s[:a]+t+s[b:]
    open(f,'w').write(s)
import json
upd("lighthouse", art="""
#.#..#...
.#..###..
...#.#.##
..#####..
...#.#...
...###...
...#.#...
..#####..
.##.#.##.
####.####""", aha="No full line: column 6's 8 1 fits exactly (8+1+1 = 10) — the tower's right wall from the lamp to the rocks — and row 10's 4 4 (4+1+4 = 9) fits too: rocks either side of the landing. Column 4's 6 1 then overlaps beside the wall, and the gull (top left) and the light beam (row 3, right) are read last from rows 1-3.")
upd("sand-bucket", art="""
..####.#
.#....##
########
.######.
.######.
..####..""", aha="A calm breather: row 3's 8 is the rim. Columns 3-6's 1 4 fit exactly (1+1+4 = 6): the handle arc on top, a gap, then the bucket body down to the base; rows 4-6 (6, 6, 4) taper it, and the spade leans in column 8. Three easy passes.")
upd("anchor", art="""
...###...
...#.#...
...###...
.#######.
....#....
#...#...#
##..#..##
.##.#.##.
..#####..""", aha="Column 5's 1 7 fits exactly (1+1+7 = 9): the top of the ring, its hole, then the whole shaft. Row 4's 7 overlaps on columns 3-7 (the stock), columns 4 and 6's 4 1 hang the ring from it, and the crescent flukes are read from rows 6-9's outer runs curving up to their tips.")
upd("toadstools", art="""
..####....
.##.###...
########..
...##.....
...##..##.
...##.####
...##...#.
...##...#.
#.########""", aha="Runs grow from the floor: row 9's 1 8 fits exactly (a stone, a gap, then the forest floor). Column 9's 5 must stand on that floor, so it fills rows 5-9 — the small toadstool's stem and cap — and rows 1-4 above it are paper. The tall toadstool rises the same way: column 4's 1 7 (1+1+7 = 9) is its stem under the spotted cap.")
upd("wandering-bear", art="""
.........#.#
........#.##
..######.###
.###########
.###...####.
.#########..
.##.####.#..
.##..##..##.
.##..#...##.
###..##.###.""", aha="Column 10's 1 8 fits exactly (1+1+8 = 10): an ear tip, the eye, then head, chest and front leg down to the floor. Row 4's 11 overlaps across the back; the belly is hollow — row 5's 3 4 leaves a gap that columns 5-7 place — and the four legs drop from rows 7-10's runs.")
upd("mosaic-seahorse", art="""
....##...
####.##..
...####..
...#####.
..####.##
..@####..
...####..
....##...
.##.#....
#..#.....""", aha="Row 2's 4 2 starts the snout at the wall, and the body columns overlap down the middle. The catch is the belly: without the stamp, rows 4-7 and the curled tail could shift a column either way. The stamped tile at row 6 column 3 is the left end of row 6's 5, which pins columns 3-7, and the curled tail (rows 9-10) follows from it.")
upd("mosaic-elephant", art="""
...####....
..####.@##.
.##########
##.########
#..########
#...#######
#...##..###
.#..##..##.
....##..##.
....##..##.""", aha="Row 4's 2 8 fills all eleven exactly (2+1+8). The twist is the ear crease: row 2 reads 4 3, and no line can say where its gap falls. The stamped ink tile at row 2 column 8 can: the 3 starts there, so the crease is column 7, and the trunk and legs chain down in five passes.")
upd("mosaic-cat-face", art="""
.#......#.
.##....##.
.###..###.
##########
#..###.,.#
#..#######
####,#####
##.#.#.###
.########.
...####...""", aha="A calm breather: row 4's 10 is the brow, and the ears grow up from it (rows 1-3). The open eye is a 2x2 window (rows 5-6), the winking eye a stamped slit in row 5, and the stamped nose tile splits row 7's 4 5. Ten lines open at the start, three passes.")
upd("sunflower-head", aha="The umber disc is the deduction. Column 6 reads gold 2, umber 5, gold 1, sage 4: the disc runs its full height (rows 3-7). Column 7 reads gold 2, umber 2, umber 2, gold 1, sage 4, so its umber splits around a paper seed in row 5 — the seed head is no solid block. The paper seeds in rows 4-6 make the disc's rows partial lines, and each petal and seed cell is gold or umber only where its row and column both allow it.")
upd("monstera-leaf", role="combine", mech=["color-cross", "exact-fit", "stamp"], aha="A combine, not a new idea: column 8's sage 1, teal 12, umber 1 fills all 14 cells — the midrib. The stamped hole in row 7 is a free foothold beside it. From the midrib out, each leaf slit is read by colour-cross: a cell is sage only where its row and its column both hold sage.")
f,s,a,b=block("firefly-jar")
t=s[a:b].replace("aaBaaaaaaa","aabaaaaaaa"); s=s[:a]+t+s[b:]; open(f,'w').write(s)
upd("firefly-jar", aha="Column 3 is smudged and nothing in it is given: it is read entirely from its crossings. Row 1's gold 1 6 1 fills all ten and columns 5 and 7 fit; then each row names its own column-3 cell — row 6's night 2, gold 1, night 7 fills all ten (2+1+7, colours touching) and puts a firefly in column 3.")
upd("kiln-teapot", art="""
...#....
.#####..
#.####.#
.#.#####
..######
..####..
..####..""", crack=["r6.0"], aha="New idea: row 7's number is cracked — one run, length unknown. Column 4's 7 fills top to bottom and columns 5-6's 6s overlap down to the base. The spout (columns 1-2) and the handle (columns 7-8) end above row 7, so the ? can only span columns 3-6: a 4, not the full row.")
upd("kiln-fire-masterwork", title="Glazed Amphora", art="""
..aaaaaaaaa..
.aa.aaaaa.aa.
.a..bbbbb..a.
.a.bbbbbbb.a.
.aabbbbbbbbaa
..bbbbbbbbbb.
.bccbcccbccb.
.bbbbbcbbbbb.
.bbcbbcbbcbb.
..bbbbbbbbb..
...bbbbbbb...
....aaaaa....
...aaaaaaa...
aaaaaaaaaaa..""", crack=["r6.3", "c6.2"], aha="Masterwork, two cracks on one hub: row 7's gold ? and column 7's gold ? cross at the centre of the glaze band. The umber rim, handles and foot settle first; the coral body then walls the band in. Row 7's ? is boxed by coral at columns 5 and 9 (3), and that hub cell starts column 7's gold run, which the coral in row 10 stops: 3 again, rows 7-9.")
upd("brass-telescope", art="""
......###
....####.
..#####..
######...
#..#.....
...#.....
..###....
.#.#.#...
##.#.##..""", mech=["chain", "overlap"], aha="One way in, then a long chain (no new rule): at the start only rows 3-4 (5 and 6 in nine) and column 4's 7 in nine overlap. Column 4 becomes the mount; that pins row 6's lone 1 and crosses out the rest of row 6, which caps the tube's columns — each line hands the next one its cell, from the tube down to the tripod's feet.")
