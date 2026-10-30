import sys; sys.path.insert(0, ".tmp/a2")
from rep import replace, obj
F = "src/game/islands/isl10.ts"
replace(F, "exhibit-balloons", obj("exhibit-balloons", "Hot-Air Balloons", "[CORAL, GOLD, UMBER]", "teach", ["stamp", "cracked", "color", "exact-fit"],
 "Row 14's umber 6 and gold 8 fill the whole field, and columns 10 and 14 hold only that gold, so they're bare to the sky. Row 8's umber ? is the small balloon's basket: column 12's rope-and-basket 2 and its neighbours' 1s make it 3, while the stamped rope in row 9 hangs the big basket.",
"""
..aaaaa.......
.aabbbaa...b..
aabbbbbaa.bbb.
aaaaaaaaa.aaa.
abbbbbbba.bbb.
aaaaaaaaa..b..
.aabbbaa...c..
..aaaaa...ccc.
...C...c......
....c.c.......
....ccc.......
....ccc.....b.
cc.......bbbbb
ccccccbbbbbbbb""", crack=["r7.1"]))
