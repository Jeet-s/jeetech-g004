import sys; sys.path.insert(0, ".tmp/a2")
from rep import replace, obj
F = "src/game/islands/isl07.ts"
replace(F, "koi-fish", obj("koi-fish", "Koi Fish", '["#D9694F", "#E3A83B", "#2B3A67"]', "practise", ["smudged", "color", "exact-fit"],
 "Row 4 is smudged, but row 5's gold 2, coral 2, gold 7, coral 2 fills all thirteen cells; every column's runs then cross the hidden row and paint it — the koi's spots and its forked tail.",
"""
....aaa......
..bbbbaab....
.bcbbbaaabb.a
bbbbbbbbaabaa
bbaabbbbbbbaa
.bbaabbbbb.aa
..bbbbbbb...a
...a...a.....""", smudge=["r3"]))
replace(F, "moon-lantern", obj("moon-lantern", "Moon and Lantern", '["#2B3A67", "#E3A83B", "#D9694F"]', "boss", ["smudged", "color", "overlap"],
 "Column 9 is smudged, but column 10's navy 3, coral 2, gold 3, coral 2, navy 3 fills all thirteen cells — string, lantern and tassel; the lantern rows then read the hidden column, and the crescent's 8 overlaps down the left edge.",
"""
..bbbb...a...
.bbb.....a...
bbb.....aaa..
bb.....ccccc.
bb....ccccccc
bb....cbcbcbc
bb....cbcbcbc
bbb...cbcbcbc
.bbb..ccccccc
..bbb..ccccc.
........aaa..
.........a...
.........a..b""", smudge=["c8"]))
replace(F, "festival-candle", obj("festival-candle", "Candle", '["#E3A83B", "#D9694F"]', "breather", ["smudged", "color", "exact-fit"],
 "Row 8 is smudged, but column 5's gold 5, coral 5, gold 2 fills all twelve cells — flame, wax and dish — and the wax columns beside it run straight through the hidden row.",
"""
....a.....
...aa.....
...aaa....
..aaaa....
...aa.....
....b.....
..bbbbb...
..bbbbbb..
..bbbbbb..
..bbbbb...
aaaaaaaaaa
.aaaaaaaa.""", smudge=["r7"]))
replace(F, "firefly-jar", obj("firefly-jar", "Firefly Jar", '["#2B3A67", "#E3A83B", "#8A5A3C"]', "combine", ["smudged", "stamp", "color"],
 "Columns 3 and 4 are smudged, but the stamped firefly sits in column 3 and columns 5-7's umber 2 and night 10 fill all twelve cells; the jar rows then paint across the hidden columns.",
"""
b..cccc...
..cccccc.b
...aaaa...
..aaaaaa..
.aabaaaaa.
.aaaaaaba.
aaBaaaaaaa
aaaaabaaaa
abaaaaaaba
.aaaaaaaa.
.aaaabaaa.
..aaaaaa..""", smudge=["c2", "c3"]))
replace(F, "lantern-festival", obj("lantern-festival", "Lantern Festival", '["#2B3A67", "#E3A83B", "#D9694F"]', "finale", ["smudged", "stamp", "color", "exact-fit"],
 "Masterwork: rows 2 and 13 — the string and the river — are smudged, but rows 5-8 fill all fourteen cells across the three lanterns; the stamped gold heart splits the centre lantern, and the columns paint both hidden rows.",
"""
..b.......b...
aaaaaaaaaaaaaa
.a....aa....a.
ccc..cccc..ccc
cbc.ccbbcc.cbc
ccc.cbccbc.ccc
cbc.cbCcbc.cbc
ccc.cbccbc.ccc
.b..ccbbcc..b.
.....cccc.....
......bb......
.....b..b.....
aaaaaabbaaaaaa
.aaaa.bb.aaaa.""", smudge=["r1", "r12"]))
s = open(F).read()
i = s.index('id: "dragon-kite"'); j = s.index("},", i)
blk = s[i:j]
nb = blk.replace('["#D9694F", "#E3A83B", "#2B3A67", "#6FA8DC"]', '["#D9694F", "#E3A83B", "#2B3A67"]')
a = nb.index("art: `"); nb = nb[:a] + nb[a:].replace("d", "b")
s = s[:i] + nb + s[j:]
open(F, "w").write(s)
