import sys; sys.path.insert(0, ".tmp/a2")
from rep import replace, obj
F = "src/game/islands/isl06.ts"
replace(F, "flowering-cactus", obj("flowering-cactus", "Flowering Cactus", "[SAGE, GOLD, UMBER]", "teach", ["color-cross", "exact-fit"],
 "Columns 4 and 5 read gold 1, sage 5, umber 2 — all eight cells, an exact fit; row 1 holds only gold, so the blossom sits on those two columns and the rest of the row is paper.",
"""
...bb...
b..aa...
a..aab.b
aa.aaaaa
.aaaa...
...aa...
cccccccc
.cccccc."""))
replace(F, "hummingbird-sip", obj("hummingbird-sip", "Hummingbird", "[TEAL, CORAL, INKC]", "practise", ["color-cross", "overlap"],
 "Row 7's coral 3, coral 2 and teal 4 need ten of twelve cells, pinning the flower and the tail; column 3 holds only an ink 1 and a coral 1 — the beak and the bloom — so the rest of it is paper.",
"""
..........aa
.........aaa
........aaa.
....aa.aaa..
cccacaaaa...
...bbaaaaa..
bbb.bbaaaa..
.b....aaaaa.
.a.......aa.
aa........aa"""))
replace(F, "bonsai-pine", obj("bonsai-pine", "Bonsai", "[SAGE, UMBER, CORAL]", "boss", ["color-cross", "exact-fit", "overlap"],
 "Column 7's sage 3, umber 7 and coral 2 fill all twelve cells — the trunk in one look; row 5's lone umber is that trunk cell, and each branch row must bend its umber out from it, one row at a time.",
"""
....aaaa....
..aaaaaaaa..
.aaaa.aaaaa.
..aa.bb.aa..
......b.....
.aaa..bb....
aaaaabbb.aa.
..aa..bbaaaa
......b..aa.
.....bb.....
.cccccccccc.
..cccccccc.."""))
replace(F, "watering-can", obj("watering-can", "Watering Can", "[TEAL, SKY, CORAL]", "combine", ["color-cross", "stamp", "exact-fit"],
 "The stamped coral rose sits in row 4's twelfth cell, so the teal 1 beside it is the spout and the teal 9 fills columns 1-9 exactly; the sky stripes then fit between the can's walls.",
"""
..aaaaa......
.a.....a.....
.a.....a...cc
aaaaaaaaa.aC.
abbbbbbba.a.b
aaaaaaaaaa..b
aaaaaaaaa....
abbbbbbba..b.
aaaaaaaaa....
.aaaaaaa....."""))
