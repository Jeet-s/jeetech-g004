import { INK, type LevelSpec } from "../types";

/** Island 7 — Lantern Gallery. Festival night. Teaches: smudged clue lines, painted from their crossings. */
export const ISL07: LevelSpec[] = [
  {
    id: "paper-lantern", title: "Paper Lantern", palette: ["#D9694F", "#E3A83B"], role: "teach", mechanics: ["smudged"],
    smudge: ["r5"], aha: "Row 6 is smudged, but every column reads coral–gold–coral: each column's single gold paints the band.",
    art: `
....bb....
..bbbbbb..
.aaaaaaaa.
aaaaaaaaaa
aaaaaaaaaa
bbbbbbbbbb
aaaaaaaaaa
aaaaaaaaaa
.aaaaaaaa.
..bbbbbb..
...b..b...
...b..b...`,
  },
  {
    id: "festival-kite", title: "Festival Kite", palette: ["#6FA8DC", "#D9694F"], role: "teach", mechanics: ["smudged", "color"],
    smudge: ["r2"], aha: "Row 3 is smudged; the blue runs of columns 3 to 11 climb from the cross bar and fill it in for you.",
    art: `
......b......
....aabaa....
..aaaabaaaa..
bbbbbbbbbbbbb
.aaaaabaaaaa.
..aaaabaaaa..
...aaabaaa...
....aabaa....
.....aba.....
......b......
.....aba.....
.....b.......
....aba......`,
  },
  {
    id: "festival-drum", title: "Festival Drum", palette: ["#D9694F", "#E3A83B", "#8A5A3C"], role: "practise", mechanics: ["smudged", "color"],
    smudge: ["r5"], aha: "Row 6 is smudged: the gold rim runs of the columns above and below reach into it and place each stud.",
    art: `
.cc........cc.
cc..........cc
.cc........cc.
..bbbbbbbbbb..
.bbbbbbbbbbbb.
.abaabaabaaba.
aaaaaaaaaaaaaa
aaaaabbbbaaaaa
aaaabaaaabaaaa
aaaaabbbbaaaaa
.abaabaabaaba.
.bbbbbbbbbbbb.
..c........c..
.cc........cc.`,
  },
  {
    id: "koi-fish", title: "Koi Fish", palette: ["#D9694F", "#E3A83B"], role: "practise", mechanics: ["smudged", "color", "overlap"],
    smudge: ["r7"], aha: "Row 8 is smudged, but column 4's 5b 2a 2b 2a spans the fish and pins the coral spot sitting in it.",
    art: `
....aa.......
....aaaa.....
...bbbbbb..aa
..bbbaabbb.aa
.b.baaaabbbaa
bbbbbaabbbbba
bbbbbbbbbbbba
bbbaabbbbbbaa
.bbaaabbbb.aa
..bbbbbbb..aa
...bbbbb.....
..aaa..aaa...
..aa....aa...`,
  },
  {
    id: "fireworks-burst", title: "Fireworks Burst", palette: ["#E3A83B", "#D9694F", "#8C6BB1"], role: "twist", mechanics: ["smudged", "color"],
    smudge: ["c6"], aha: "Column 7 is smudged: X out the side columns' empty cells and each row's lone gold has only the centre left.",
    art: `
cc....a....bb
cc...aaa...bb
......a......
......a......
....c.a.c....
.a...bbb...a.
aaaaabcbaaaaa
.a...bbb...a.
....c.a.c....
......a......
......a......
bb...aaa...cc
bb....a....cc`,
  },
  {
    id: "moon-lantern", title: "Moon and Lantern", palette: ["#2B3A67", "#E3A83B", "#D9694F"], role: "boss", mechanics: ["smudged", "void", "color"],
    smudge: ["c7"], aha: "Column 8 is smudged; row 8's 5c 4b must touch, so the lantern's foot and the moon's tip meet inside it.",
    art: `
~~~~~a....~~~~~
~~~..a...bbb~~~
~~..aaa...bbb~~
~..ccccc...bbb~
~..cbcbc...bbb~
...cbcbc.b.bbb.
...cbcbc..bbb..
...cccccbbbb...
....aaa........
ab...b........a
~a..bbb.aa...a~
~aa...aaabaaaa~
~~aaaaaaaaaaa~~
~~~aaaaaaaaa~~~
~~~~~aaaaa~~~~~`,
  },
  {
    id: "festival-candle", title: "Candle", palette: ["#E3A83B", "#D9694F"], role: "breather", mechanics: ["smudged", "color"],
    smudge: ["r7"], aha: "Row 8 is smudged: column 7's 5a 7b 1a runs from flame to dish, and the side columns finish the wax.",
    art: `
......a......
..a..aa...a..
.....aaa.....
....aaaaa....
.....aaa.....
......b......
....bbbbb....
....bbbbbb...
....bbbbbb...
....bbbbb....
....bbbbb....
aaaabbbbbaaaa
.aaaaaaaaaaa.`,
  },
  {
    id: "festival-parasol", title: "Parasol", palette: ["#D9694F", "#E3A83B", "#8A5A3C"], role: "practise", mechanics: ["smudged", "color"],
    smudge: ["c9"], aha: "Column 10 is smudged, but rows 5 and 6 fill edge to edge, so their gold ribs land in it without its clue.",
    art: `
......cc......
....aaaaaa....
..aaaabbaaaa..
.aaababbabaaa.
aabaaabbaaabaa
abaaaabbaaaaba
aa.aa.cc.aa.aa
......cc......
......cc......
......cc......
......cc......
......cc......
......cc..cc..
.......cccc...`,
  },
  {
    id: "firefly-jar", title: "Firefly Jar", palette: ["#6FA8DC", "#E3A83B", "#8A5A3C", "#2B3A67"], role: "combine", mechanics: ["smudged", "stamp", "color"],
    smudge: ["r6", "c3"], aha: "Row 7 and column 4 are smudged; their crossing is stamped, and the full-width jar rows paint the rest.",
    art: `
..cccccccccc..
..cccccccccc..
...aaaaaaaa...
..adddddbdda..
.addbddddddda.
adddddddddbdda
adbDddddddddda
addddddbddddda
adddbdddddddda
addddddddddbda
adddddddbdddda
addbddddddddda
.addddbddddda.
..aaaaaaaaaa..`,
  },
  {
    id: "paper-boat", title: "Paper Boat", palette: [INK], role: "twist", mechanics: ["smudged", "overlap"],
    smudge: ["r7"], aha: "Row 8 is smudged, yet every column's run crosses the hull there, so its full deck comes from the columns.",
    art: `
......#......
.....###.....
....#####....
...#######...
..#########..
#.#########.#
##.........##
#############
.###########.
..#########..
.###...###...
#...###...###`,
  },
  {
    id: "dragon-kite", title: "Dragon Kite", palette: ["#D9694F", "#E3A83B", "#2B3A67", "#6FA8DC"], role: "combine", mechanics: ["smudged", "stamp", "color"],
    smudge: ["r4", "c0"], aha: "Row 5 and column 1 are smudged; their corner is stamped, and row 4's 13a 1b overlaps across the head.",
    art: `
.b....b........
.bb..bb...b....
.aaaaaa..aaab..
aaaaaaaaaaaaab.
Acaaaacaaa.aaab
aaaaaaaa....aaa
aabbbbaa....aaa
.aaaaaa....baaa
...c.......aaa.
...c......baaa.
...c......aaa..
...c.....baa...
...c.....aaa...
...c...ddd.....
...c..d.d.d....`,
  },
  {
    id: "lantern-festival", title: "Lantern Festival", palette: ["#2B3A67", "#E3A83B", "#D9694F", "#8A5A3C"], role: "finale", mechanics: ["smudged", "stamp", "color"],
    smudge: ["r7", "c8"], aha: "Row 8 and column 9 cut through the big lantern; its stamped heart and striped rows 6, 7, 9 frame them.",
    art: `
aaa............aaa
..aaaa......aaaa..
.a....aaaaaa....a.
.aaa....aa....aaa.
ccccc..cccc..ccccc
cdcdc.ccddcc.cdcdc
cdbdc.cdbbdc.cdbdc
cdcdc.cbBbbc.cdcdc
ccccc.cbbbbc.ccccc
.aaa..cdbbdc..aaa.
..b...ccddcc...b..
.bbb...cccc...bbb.
........aa........
........bb........
.......bbbb.......
bb...aaaa.aaa...bb
.aaa..bb..bb..aaa.
aa..aaaaaaaaaa..aa`,
  },
];
