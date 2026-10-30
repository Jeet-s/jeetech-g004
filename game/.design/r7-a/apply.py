import re, json
W = "src/game/islands/"
def block(id_, title, palette, role, mech, aha, art, extra=""):
    return ('{\n    id: "%s", title: "%s", palette: %s, role: "%s", mechanics: %s,%s\n    aha: %s,\n    art: `\n%s`,\n  }'
            % (id_, title, palette, role, json.dumps(mech).replace('","', '", "'), extra, json.dumps(aha), art.strip("\n")))
def put(fn, id_, new):
    s = open(W + fn).read()
    i = s.index('id: "%s"' % id_)
    st = s.rindex("{", 0, i)
    a = s.index("art: `", i)
    e = s.index("`", a + 6)
    end = s.index("}", e) + 1
    s = s[:st] + new + s[end:]
    open(W + fn, "w").write(s)
L = {}
L["sand-bucket"] = ("isl01.ts", block("sand-bucket", "Ice Lolly", "[INK]", "breather", ["fill", "exact-fit"],
 "A breather: the lolly is built from full lines. Row 5's 7 and column 4's 7 (the stick runs right up through the ice) fill at once, and row 4's 2 4 fits seven exactly (2+1+4), so the shine's paper at column 3 is placed too. The bite out of the top right is simply where rows 1-3 stop short.",
 """
.###...
####...
#.####.
##.####
#######
######.
...#..."""))
L["acorn"] = ("isl02.ts", block("acorn", "Field Mouse", "[INK]", "breather", ["tally", "overlap"],
 "A breather: one count cuts the tail loose. Row 5's 7 in eight cells covers columns 2-7, so column 7's only ink is the rump at row 5; its ringed 1 is met, the rest of column 7 is paper, and column 8's 5 stands apart as the raised tail. Column 3's full 7 and column 2's 2 2 1 (an exact fit) build the head first.",
 """
.##.....
###....#
#.###..#
#####..#
.#######
..#.#..#
.##.##..""", ' tally: ["c6"],'))
L["red-squirrel"] = ("isl02.ts", block("red-squirrel", "Red Squirrel", "[INK]", "twist", ["tally", "exact-fit"],
 "Twist: a ringed count can hide a gap. Row 6's ringed 10 fits its eleven cells as one block or as two, and the count alone cannot say which. Column 6's 5 2 fits its eight cells exactly (5+1+2), so its paper falls on row 6: the ten cells left are all ink, in two blocks of five, the back and the foot of the curled tail.",
 """
.#...#####.
##...#....#
#.##.#.##.#
####.#.#..#
.###.#...#.
#####.#####
.###.#.###.
.#.#.#.##..""", ' tally: ["r5"],'))
L["sunny-lemon"] = ("isl03.ts", block("sunny-lemon", "Hot-Air Balloon", '["#D9694F", "#E3A83B"]', "breather", ["color"],
 "A breather: different colours owe no gap. Column 6 reads red 2, gold 2, red 2, gold 2: eight cells, the whole column, so the right rope runs straight down into the gold sandbag at row 7. Row 7 (red 1, red 1, gold 1) then sets both ropes one column left of row 6's: the basket swings left as the balloon leans.",
 """
..aaaa..
.aabbaa.
aabbbbaa
aabbbbaa
.aabbaa.
...a.a..
..a.ab..
..bbbb.."""))
L["lidded-urn"] = ("isl04.ts", block("lidded-urn", "Stone Shrine", "[INK]", "breather", ["void"],
 "A breather: the roof (row 3) and the base (row 9) are full 9s, so the shrine stands up at once. Its one void, the window at row 5, column 4, cuts column 4 into two pockets: the four cells below it take column 4's 4 whole, and its 3 sits above, under the roof.",
 """
....#....
..#####..
#########
..#####..
..#~###..
..#####..
...###...
..#####..
#########"""))
L["mosaic-cat-face"] = ("isl05.ts", block("mosaic-cat-face", "Puppy", "[INK]", "breather", ["stamp"],
 "A breather: one stamp says which ear stands up. Columns 2 and 7 are both 7 in nine, so row 1's single 1 could be the tip over either. The stamped tip at row 1, column 2 puts column 2's 7 in rows 1-7 and column 7's in rows 2-8. Row 4's full 9 is the brow, and the floppy right ear (column 9's 4) hangs below it.",
 """
.@.......
.##.###..
.######..
#########
##.##.#.#
#######.#
.###.##.#
..#####..
...##...."""))
L["mosaic-compass-rose"] = ("isl05.ts", block("mosaic-compass-rose", "Compass Rose", "[NIGHT, GOLD]", "combine", ["stamp", "color"],
 "The diagonal points could run NE-SW or NW-SE: rows 4 and 10 and columns 3 and 9 all read gold 2, navy 1, navy 1, gold 2 either way. The stamped navy tip at row 4, column 9 settles the whole rose. Column 9 needs it next: that tip is its first navy, so its gold 2 is rows 2-3 and rows 5-6 are paper, and row 4's ring closes at columns 10-11.",
 """
.....a......
..bbbabbb...
.bb..a..bb..
bb...a..Abb.
b...aaaa..b.
b...aaa...b.
b.aaababaaaa
b...aaa...b.
b..aaaa...b.
bba..a...bb.
.bb..a..bb..
..bbbbbbb..."""))
L["mosaic-dolphin-medallion"] = ("isl05.ts", block("mosaic-dolphin-medallion", "Masterwork: Dolphin Medallion", "[SKY, NIGHT]", "finale", ["stamp", "color", "overlap"],
 "Finale: two stamps on opposite sides of the ring, each untying a knot the clues leave open. The paper stamp at row 8, column 3 keeps row 8's sky 3 off the ring, so it must cover column 6. Across the ring, the paper stamp at row 10, column 13 pins row 10's navy 2 to columns 14-15 and its sky 3 over columns 10-11. Without either, the fin or the tail could shift a cell.",
 """
.....bbbbb.....
...bbbbbbbbb...
..bb.......bb..
.bb.....a...bb.
.ba....aaa...b.
bb...aaaaaa..bb
bb..aaaaaaaa.bb
bb,aaa...aaaabb
bb.aa....a.aabb
bbaa.....aaa,bb
.baa......aa.b.
.ba.a......a.b.
..bbb.bbb.bbb..
...bbbbbbbbb...
.....bbbbb....."""))
for id_, (fn, new) in L.items(): put(fn, id_, new)
print("ok")
