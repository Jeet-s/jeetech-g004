import sys; sys.path.insert(0, ".tmp/a2")
from rep import replace, obj
F = "src/game/islands/isl08.ts"
replace(F, "kiln-tall-vase", obj("kiln-tall-vase", "Tall Vase", "[TEAL, GOLD]", "practise", ["cracked", "exact-fit", "color"],
 "Columns 4-7 fill all twelve cells top to bottom, and every column inks row 8 — so row 8's teal ? is the full 10, the vase's widest band.",
"""
..bbbbbb..
...aaaa...
....aa....
...aaaa...
..aaaaaa..
.aaaaaaaa.
.bbbbbbbb.
aaaaaaaaaa
abaabbaaba
.aaaaaaaa.
..aaaaaa..
...bbbb...""", crack=["r7.0"]))
replace(F, "kiln-willow-plate", obj("kiln-willow-plate", "Patterned Plate", "[CREAM, NIGHT]", "practise", ["cracked", "exact-fit", "color"],
 "Rows 5-8 fill all twelve cells; columns 5-8 are the only ones that reach row 12, so its cream ? — the plate's foot — is 4, and column 5's ? sits between two navy 1s: it's 2.",
"""
....aaaa....
..aabbbbaa..
.abbaaaabba.
.abaabbaaba.
abaabaabaaba
abababbababa
abababbababa
abaabaabaaba
.abaabbaaba.
.abbaaaabba.
..aabbbbaa..
....aaaa....""", crack=["r11.0", "c4.2"]))
replace(F, "kiln-pitcher", obj("kiln-pitcher", "Dotted Pitcher", "[SKY, NIGHT]", "boss", ["cracked", "exact-fit", "color"],
 "Columns 3, 4, 6 and 7 fill all twelve cells; column 11's navy ? is the handle — rows 2 and 6 both put navy in it, so one run spans rows 2-6: 5. Column 1's sky ? is then boxed between the rim and the base: 4.",
"""
bbbbbbbb...
.aaaaaaabbb
..aaaaa...b
..aaaaa...b
.aaaaaaa..b
aaaaaaaaabb
aaaaaaaaaa.
abaabaabaa.
aaaaaaaaaa.
.aaaaaaaa..
..aaaaaa...
.bbbbbbbb..""", crack=["c10.0", "c0.1"]))
replace(F, "kiln-tea-bowl", obj("kiln-tea-bowl", "Tea Bowl", "[UMBER, TEAL]", "breather", ["cracked", "fill", "color"],
 "Row 5's umber 10 is the bowl's rim; every column then shows teal right above it, so row 4's teal ? is the full 10 — and the steam's 1s curl up columns 3-4 and 7-8.",
"""
..b...b...
...b...b..
..b...b...
bbbbbbbbbb
aaaaaaaaaa
abaabaabaa
.aaaaaaaa.
..aaaaaa..
...aaaa...""", crack=["r3.0"]))
s = open(F).read()
s = s.replace('''id: "kiln-brick-dome", title: "The Kiln", palette: [UMBER, CORAL, GOLD], role: "combine", mechanics: ["cracked", "smudged", "void", "color"],
    aha: "Smudged column 4 is painted by its rows; column 7's coral ? must bridge rows 6 and 8, so it's 3.", crack: ["c6.1", "r9.2"], smudge: ["c3"],''',
'''id: "kiln-brick-dome", title: "The Kiln", palette: [UMBER, CORAL, GOLD], role: "combine", mechanics: ["cracked", "void", "color", "exact-fit"],
    aha: "Rows 11-14 fill the kiln's base edge to edge inside the shaped canvas; column 7's coral ? must bridge rows 6 and 8, so it's 3, and row 10's ? is the coral 2 beside the gold fire.", crack: ["c6.1", "r9.2"],''')
open(F, "w").write(s)
