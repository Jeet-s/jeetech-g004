exec(open(".design/agB/apply.py").read().split("P7 =")[0])
P7 = "src/game/islands/isl07.ts"; P8 = "src/game/islands/isl08.ts"
L = {}
L[(P7,"firefly-jar")] = '''  {
    id: "firefly-jar", title: "Firefly Jar", palette: ["#2B3A67", "#E3A83B", "#8A5A3C"], role: "combine", mechanics: ["smudged", "color", "exact-fit"], smudge: ["c1"],
    aha: "Column 2 is smudged; two rows hand it over. Row 7 (night 5, gold 1, night 4) and row 8 (1 1 6 1 1) fill all ten cells exactly, colours touching, so column 2 is night in row 7 and holds a firefly in row 8. The rest of it is won from the shoulder (row 5's 8) and the base rows 9-10, where the jar narrows again and the fireflies sit at different heights.",
    art: `
b.........
...cccc..b
...cccc...
..aaaaaa..
.aaaaaaaa.
.abaaaaaa.
aaaaabaaaa
abaaaaaaba
.aaabaaaa.
.aaaaaaba.
..aaaaaa..`,
  },
'''
L[(P7,"paper-boat")] = '''  {
    id: "paper-boat", title: "Lantern Boat", palette: ["#D9694F", "#E3A83B", "#8A5A3C"], role: "twist", mechanics: ["smudged", "color"],
    smudge: ["r3", "r4"],
    aha: "Twist: two rows are smudged at once — rows 4 and 5, through the sail, the mast and the bow lantern — so each column must carry itself through both. A coral stripe crosses the sail: columns 9-12 each read gold 2, coral 1, and that coral steps down a row per column (rows 4, 5, 6, 7), crossing the hidden rows in columns 9 and 10. Column 2's umber 7 is the bow post (rows 4-10); column 3's umber 1, coral 2 hangs the lantern from its arm in row 4.",
    art: `
.......c......
.......cb.....
.......cbb....
.cc....cabb...
.ca....cbabb..
.ca....cbbabb.
.c.....cbbbab.
.c.....c......
cccccccccccccc
.cccbccbcccbc.
..cccccccccc..
b...bb...bb..b`,
  },
'''
L[(P7,"lantern-pinwheel")] = '''  {
    id: "lantern-pinwheel", title: "Pinwheel", palette: ["#D9694F", "#E3A83B", "#8A5A3C"], role: "combine", mechanics: ["smudged", "color"],
    smudge: ["c2"],
    aha: "Column 3 is smudged and cuts through two folded vanes, each creased in the other colour. Column 1's coral 4 pins the top-left vane to the edge, so row 2's gold crease (after coral 2) lands in column 3 and rows 3-4 put coral there; the bottom-left gold vane ends against column 5's umber stick, so rows 7-9 give column 3 coral, gold, gold.",
    art: `
ab...bbbb
aab..bba.
aaa..ba..
aaaa.b...
....c....
...bcaaaa
..abc.aaa
.abbc..ba
babbc...b
....c....
....c....
...ccc...`,
  },
'''
L[(P8,"kiln-willow-plate")] = '''  {
    id: "kiln-willow-plate", title: "Blue Fish Plate", palette: [CREAM, NIGHT], role: "practise", mechanics: ["cracked", "color"], crack: ["r4.1"],
    aha: "Bound the ? between the rim and the fish: row 5's cream ? starts after the rim (column 1's night 4 runs rows 5-8) and stops at the fish's back, which begins in column 5 — columns 6-8's night 3s are the body in rows 5-7 — so it is 3. The fish faces left (nose in column 4, eye hole in column 5, forked tail in column 11), with a bubble above and a weed sprig below, so nothing mirrors.",
    art: `
....bbbbb....
..bbaaaaabb..
.baaaaaaaaab.
.baabaaaaaab.
baaabbbbaabab
baababbbbbbab
baaabbbbaabab
baabaaaaaaaab
.babbaaaaaab.
.baabaaaaaab.
..bbaaaaabb..
....bbbbb....`,
  },
'''
L[(P8,"kiln-glazed-tile")] = '''  {
    id: "kiln-glazed-tile", title: "Koi Tile", palette: [TEAL, CORAL, CREAM], role: "twist", mechanics: ["cracked", "color"], crack: ["r5.1"],
    aha: "Twist: the cracked number is a cream spot, and its length comes from the columns. Row 6 reads coral 5, cream ?, coral 2; cream appears only in columns 4, 6, 8 and 9, one cell each, and column 7 (coral 5) and column 10 (coral 2) carry none, so the spot after the coral 5 can only fill columns 8-9: 2.",
    art: `
aaaaaaaaaaaa
a..c.......a
......bb....
....bbbbb.b.
..b.bcbbbbb.
..bbbbbccbb.
....bbbbb.b.
.......b....
a..aa..aa..a
aa..aaaa..aa`,
  },
'''
for (p,i),t in L.items(): rep(p,i,t)
