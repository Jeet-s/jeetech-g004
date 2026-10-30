import re, sys
def rep(path, lid, new):
    s = open(path).read()
    start = s.index('id: "%s"' % lid)
    ob = s.rindex("  {\n", 0, start)
    end = s.index("`,\n  },\n", start) + len("`,\n  },\n")
    s = s[:ob] + new + s[end:]
    open(path, "w").write(s)
P7 = "src/game/islands/isl07.ts"; P8 = "src/game/islands/isl08.ts"
L = {}
L[(P7,"paper-lantern")] = '''  {
    id: "paper-lantern", title: "Paper Lantern", palette: [INK], role: "teach", mechanics: ["smudged"],
    smudge: ["r3"],
    aha: "One new idea: row 4 is smudged, so read it from the columns. Rows 3 and 5 (2 1 2) fill all seven exactly, column 4's 8 fills top to bottom and columns 2 and 6's 5s overlap. Then columns 1 and 7 (3) must run rows 3-5 and column 3's 1 1 1 1 needs rows 2, 4, 6 and 8 — every column inks row 4, so the hidden row is a full 7.",
    art: `
...#...
.#####.
##.#.##
#######
##.#.##
.#####.
...#...
..###..`,
  },
'''
L[(P7,"firefly-jar")] = '''  {
    id: "firefly-jar", title: "Firefly Jar", palette: ["#2B3A67", "#E3A83B", "#8A5A3C"], role: "combine", mechanics: ["smudged", "color", "exact-fit"], smudge: ["c1"],
    aha: "Column 2 is smudged, but the jar's four widest rows hand it over: rows 6-9 (night 2 gold 1 night 7; 5 1 4; 1 1 6 1 1; 4 1 5) each fill all ten cells exactly, colours touching, so they write column 2's rows 6-9 at once — the firefly in row 8 included. The shoulder (rows 4-5) and base (rows 10-11) then close the glass under the umber lid.",
    art: `
b.........
...cccc..b
...cccc...
..aaaaaa..
.aaaaaaaa.
aabaaaaaaa
aaaaabaaaa
abaaaaaaba
aaaabaaaaa
.aaaaaaaa.
..aaaaaa..`,
  },
'''
L[(P7,"paper-boat")] = '''  {
    id: "paper-boat", title: "Lantern Boat", palette: ["#D9694F", "#E3A83B", "#8A5A3C"], role: "twist", mechanics: ["smudged", "color"],
    smudge: ["r3", "r4"],
    aha: "Twist: two rows are smudged at once — rows 4 and 5, through the sail, the mast and the bow lantern — so each column must carry itself through both. The sail columns 8-12 hold gold 5, 4, 3, 2, 1 that all end on row 6 above the deck, stacking into a clean triangle; column 2's umber 6 is the bow post (rows 4-9), and column 3's umber 1, coral 2 hangs the lantern from its arm in row 4.",
    art: `
......c......
......cb.....
......cbb....
.cc...cbbb...
.ca...cbbbb..
.ca...cbbbbb.
.c....c......
ccccccccccccc
.ccccccccccc.
..b.b.b.b.b..`,
  },
'''
L[(P7,"lantern-pinwheel")] = '''  {
    id: "lantern-pinwheel", title: "Pinwheel", palette: ["#D9694F", "#E3A83B", "#8A5A3C"], role: "combine", mechanics: ["smudged", "color"],
    smudge: ["c2"],
    aha: "Column 3 is smudged and crosses two vanes. Each vane is a 1-2-3-4 staircase pinned to something: column 1's coral 4 holds the top-left vane to the edge in rows 1-4, so it reaches column 3 in rows 3-4; column 5's umber 8 (the stick, rows 5-12) stops the bottom-left gold vane, whose rows 6-9 (gold 1, 2, 3, 4) end against it, so column 3 is gold in rows 7-9.",
    art: `
a....bbbb
aa...bbb.
aaa..bb..
aaaa.b...
....c....
...bcaaaa
..bbc.aaa
.bbbc..aa
bbbbc...a
....c....
....c....
...ccc...`,
  },
'''
L[(P8,"kiln-teapot")] = '''  {
    id: "kiln-teapot", title: "Teapot", palette: [TEAL], role: "teach", mechanics: ["cracked"], crack: ["r6.0"],
    aha: "New idea: row 7's number is cracked — one run, length hidden. Footholds first: row 3's 1 9 fills all eleven exactly, row 6's 9 and columns 4-8 (7, 7, 8, 7, 7) overlap. Then the wall: the spout columns 1-2 (a 1 each) and the handle columns 10-11 (1 1 and 4) are used up by rows 3-6, so the ? can't reach them — it spans columns 3-9: 7.",
    art: `
.....#.....
...#####...
#.#########
.########.#
..#######.#
..#########
..#######..
...#####...`,
  },
'''
L[(P8,"kiln-heart-mug")] = '''  {
    id: "kiln-heart-mug", title: "Heart Mug", palette: [TEAL], role: "teach", mechanics: ["cracked"], crack: ["r8.0"],
    aha: "Row 9, the mug's foot, is cracked. Rows 4 (2 1 4) and 7 (3 5) fill all nine exactly and rows 3 and 8's 7s overlap — plenty of footholds around the heart cut-out. Columns 1 and 7 are the mug's walls: their 6s run rows 3-8 and stop, and the handle columns 8-9 end at row 7, so the foot sits between the walls: columns 2-6, a 5.",
    art: `
.#..#....
..#..#...
#######..
##.#.####
#.....#.#
##...##.#
###.#####
#######..
.#####...`,
  },
'''
L[(P8,"kiln-willow-plate")] = '''  {
    id: "kiln-willow-plate", title: "Blue Fish Plate", palette: [CREAM, NIGHT], role: "practise", mechanics: ["cracked", "color"], crack: ["r3.1"],
    aha: "Bound the ? with the rim: columns 1 and 11 are night 5s (rows 4-8), the plate's sides, so row 4's cream ? runs between them — columns 2-10: 9. The fish in rows 5-7 is lopsided (pointed nose in column 3, eye hole in column 5, forked tail in column 9), so the left and right halves of the plate can't be copied.",
    art: `
...bbbbb...
.bbaaaaabb.
.baaaaaaab.
baaaaaaaaab
baabbbaabab
babbabbbbab
baabbbaabab
baaaaaaaaab
.baaaaaaab.
.bbaaaaabb.
...bbbbb...`,
  },
'''
L[(P8,"kiln-glazed-tile")] = '''  {
    id: "kiln-glazed-tile", title: "Koi Tile", palette: [TEAL, CORAL, CREAM], role: "twist", mechanics: ["cracked", "color"], crack: ["r5.1"],
    aha: "Twist: row 6's coral ? can't be placed from its own row — the columns place it. Column 2 is bare water inside the teal frame (1 1), so the koi's body starts in column 3; column 4's single coral sits in row 6 (row 5 there is the eye hole), and the cream spot in columns 8-9 stops the run: 5.",
    art: `
aaaaaaaaaaaa
a.c........a
a.....bb...a
a...bbbbb.ba
a.b.bcbbbbba
a.bbbbbccbba
a...bbbbb.ba
a......b...a
aaaaaaaaaaaa`,
  },
'''
L[(P8,"kiln-noodle-bowl")] = '''  {
    id: "kiln-noodle-bowl", title: "Noodle Bowl", palette: [NIGHT, GOLD, UMBER, CREAM], role: "combine", mechanics: ["cracked", "color"], crack: ["r6.0", "r3.0"],
    aha: "Row 8's night 11 rim fills exactly. Two cracked numbers, each walled by an edge column: column 11 holds no umber, so row 4's chopstick ? runs from column 1 (its umber 1) to column 10: 10; columns 1 and 11 hold no gold, so row 7's noodle ? runs columns 2-10: 9. Three gold strands hang from the chopstick into the heap under curls of steam.",
    art: `
..d...d...d
.d...d...d.
..d...d...d
cccccccccc.
..b.b.b....
..b.b.b....
.bbbbbbbbb.
aaaaaaaaaaa
.aacaacaaa.
..aaaaaaa..
...aaaaa...`,
  },
'''
for (p,i),t in L.items(): rep(p,i,t)
