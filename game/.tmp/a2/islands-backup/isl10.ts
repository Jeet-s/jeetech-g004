import type { LevelSpec } from "../types";

const TEAL = "#2E8C8A", GOLD = "#E3A83B", CORAL = "#D9694F", PLUM = "#8C6BB1", SKY = "#6FA8DC";
const PEACH = "#F2B35E", UMBER = "#8A5A3C", CREAM = "#C9B8A0", NIGHT = "#2B3A67";

/** Island 10 — Grand Exhibit. Combines: every level mixes two or three earlier twists (void, stamps, smudged, cracked). */
export const ISL10: LevelSpec[] = [
  {
    id: "exhibit-fruit-bowl", title: "Still Life with Fruit Bowl", palette: [CORAL, UMBER], role: "teach", mechanics: ["void", "smudged", "color"],
    aha: "Smudged row 7 is the rim: row 12's 5 fixes the bowl foot, and columns 6-8's six umber climb exactly to row 7.", smudge: ["r6"],
    art: `
~~~..b......~
~~.aab..b...~
~.aaaaa.ab..~
.aaaaaaaaaa..
.aaaaaaaaaaa.
..aaa.aaaaaa.
bbbbbbbbbbbbb
.bbabbbbbabb.
..bbbbbbbbb..
~..bbbbbbb..~
~~...bbb...~~
~~..bbbbb..~~`,
  },
  {
    id: "exhibit-balloons", title: "Hot-Air Balloons", palette: [CORAL, GOLD, UMBER], role: "teach", mechanics: ["stamp", "cracked", "color"],
    aha: "The stamped rope in row 9 anchors column 4; row 11's ? is the basket - columns 5-7 run through it, so it's 3.", crack: ["r10.0"],
    art: `
..aaaaa.....
.aabbbaa....
aabbbbbaa...
aaaaaaaaa.b.
abbbbbbbabbb
aaaaaaaaabab
.aabbbaa.bbb
..aaaaa...b.
...C...c..c.
....c.c..ccc
....ccc.....
....ccc.....`,
  },
  {
    id: "exhibit-flower-vase", title: "Flower Vase", palette: [PLUM, TEAL, GOLD], role: "practise", mechanics: ["color-cross", "cracked", "overlap"],
    aha: "Row 8's teal ? is boxed in: columns 5 and 9 hold no teal at all, while 6-8 all stem through it - it's 3.", crack: ["r7.1"],
    art: `
.a.a..aaa..a.a
.aaa.aacaa.aaa
.aaa.acccaaaaa
..b..aacaa.aa.
..b...aaa...b.
bbb....b....b.
.bb....b.bb.b.
..b..bbb.bbb.b
..b...bb...b..
..b....b..b...
..cccccccccc..
...cccccccc...
...ccaccaccc..
..ccccccccccc.
...ccccccccc..`,
  },
  {
    id: "exhibit-carousel-horse", title: "Carousel Horse", palette: [SKY, GOLD, CORAL], role: "practise", mechanics: ["color-cross", "cracked", "overlap"],
    aha: "Row 9's ? is the neck: columns 5 and 6 carry long sky runs through it and column 7's coral mane caps it - 2.", crack: ["r8.0"],
    art: `
.......b.......
......bbb......
.......b.......
...a.c.b.......
..aaaccb.......
.aaaaacb.......
aa.aaacb.......
a...aacb.......
....aacbaaaa...
....aaabcccaaac
....aaabaaaaacc
....aa.b..aa..c
...a..ab..a.a..
...a...b..a.a..
.......b.......
bbbbbbbbbbbbbbb`,
  },
  {
    id: "exhibit-sunset-ship", title: "Ship at Sunset", palette: [UMBER, CORAL, CREAM], role: "twist", mechanics: ["void", "smudged", "color"],
    aha: "Smudged column 8 is the sail's edge: every sail row puts its cream 2 right beside the mast, painting it in.", smudge: ["c7"],
    art: `
~~~~~c....c~~~~~
~~~..a....a..~~~
~~.ccacc.cac..~~
~..ccacc.cac...~
~....a....a....~
.ccccacc.cac....
.ccccacc.cac.bb.
.ccccacc..a.bbbb
.....a....a.bbbb
aaaaaaaaaaaaaa..
..aaaaaaaaaaa...
~...aaaaaaa....~
~.aa...aa...aa.~
~~..aa...aa...~~
~~~.aa...aa.~~~~
~~~~~..aa..~~~~~`,
  },
  {
    id: "exhibit-peacock", title: "Peacock", palette: [TEAL, GOLD, NIGHT], role: "boss", mechanics: ["color-cross", "smudged", "cracked"],
    aha: "Smudged row 3 closes the top eyes (columns 5, 9, 13 read gold-navy-gold); column 11's ? runs rows 7-12: 6.", smudge: ["r2"], crack: ["c10.1"],
    art: `
....b...b...b....
...bcb.bcb.bcb...
....b...b...b....
.ba..a..a..a..ab.
bcb..b..a..b..bcb
.baabcb.c.bcbaab.
...a.ba.c.ab.a...
...a..acc.a..a...
.b..a.a.c.a.a..b.
bcb..aaacaaa..bcb
.baa..accca..aab.
....aaacccaaa....
......ccccc......
......ccccc......
......ccccc......
.......ccc.......
.......c.c.......`,
  },
  {
    id: "exhibit-mina-portrait", title: "Mina the Curator", palette: [UMBER, PEACH, TEAL], role: "breather", mechanics: ["stamp", "smudged", "color"],
    aha: "Row 7's stamped eyes are free footholds; smudged column 2 is hair, as rows 5-11 fit exactly edge to edge.", smudge: ["c1"],
    art: `
....cccc....
..cccccccc..
.ccccccccccc
.aaaaaaaaaa.
aaabbbbbbaaa
aabbbbbbbbaa
aabAabbaAbaa
aabbbbbbbbaa
aabbbbabbbaa
aabbaaaabbaa
aaabbbbbbaaa
aaaa.bb.aaaa
aa.cccccc.aa
..cccccccc..`,
  },
  {
    id: "exhibit-old-painter", title: "The Old Painter", palette: [NIGHT, PEACH, CREAM], role: "practise", mechanics: ["color-cross", "cracked"],
    aha: "Row 14's ? is 3 (columns 5-7 cream, 4 and 8 bare); smudged column 3 is painted by rows 5-10 and 15-18.", smudge: ["c2"], crack: ["r13.0"],
    art: `
......aaaaaa......
....aaaaaaaaaa....
...aaaaaaaaaaaa.b.
...cbbbbbbbbbbc.b.
..ccbbbbbbbbbbcca.
..cbcccbbbbcccbca.
..cbbabbbbbbabbca.
..cbbbbbbbbbbbbca.
..ccbbbbbbbbbbcca.
..cccccc..cccccca.
...cc.cccccc.cc.a.
...ccc.cccc.ccc.a.
....cc.cccc.cc.bbb
....ccc.cc.ccc.bbb
aaaa.cc.cc.cc.aaa.
aaaaa.c.cc.c.aaaaa
aaaaaa.c..c.aaaaaa
aaaaaaaa..aaaaaaaa`,
  },
  {
    id: "exhibit-monarch", title: "Monarch Butterfly", palette: [CORAL, NIGHT], role: "combine", mechanics: ["color-cross", "smudged", "cracked"],
    aha: "Smudged column 7 aside, row 4's ? is the coral between the body's navy 2 and column 15's vein: 4.", smudge: ["c6"], crack: ["r3.5"],
    art: `
......b....b......
..bbbbbb..bbbbbb..
.baaaaabbbbaaaaab.
baabaaaabbaaaabaab
baaabaaabbaaabaaab
baaaabaabbaabaaaab
babaaababbabaaabab
.babaaabbbbaaabab.
..babab.bb.babab..
...baaabbbbaaab...
..babaaabbaaabab..
..baabaabbaabaab..
..bbaababbabaabb..
...baaabbbbaaab...
....bbb.bb.bbb....`,
  },
  {
    id: "exhibit-alpine-lake", title: "Alpine Lake", palette: [NIGHT, SKY], role: "twist", mechanics: ["smudged", "cracked", "deep-chain"],
    aha: "Row 11 has no blank; 11 navy + 4 sky + ? fill all 20, so ? = 5; smudged row 17's ripple gap is from columns.",  smudge: ["r16"], crack: ["r10.2"],
    art: `
.....a..............
....a.a.............
...a...a............
..aa.a.aa........a..
.aaaaaaaaa......a.a.
aaaaaaaaaaa....a.a.a
aaaaaaaaaaaa..aaaaaa
..a....a....a....a..
.aaa..aaa..aaa..aaa.
aaaaaaaaaaaabbaaaaaa
aaaaaaaaaaabbbbaaaaa
baaaaaaaaabbbbbbaa.b
b..aaaaaabbbbbbbbabb
bbbaaaaabb..bbbbbbbb
bbbbaaabbbbbbbbbbbbb
bbbbbabbbbbbbbbbbbbb
bbbbbbbbbbbbb..bbbbb
bbb...bbbbbbbbbbbbbb
bbbbbbbbb..bbbbbb..b
bbbbbbbbbbbbbbbbbbbb`,
  },
  {
    id: "exhibit-gallery-hall", title: "Gallery Hall", palette: [UMBER, GOLD, TEAL], role: "combine", mechanics: ["void", "smudged", "cracked"],
    aha: "Column 1's ?: void above row 5, gold floor under row 17, so 13; smudged column 14 is the frame's right edge.", smudge: ["c13"], crack: ["c0.0"],
    art: `
~~~~~aaaaaaaaaa~~~~~
~~~aa..........aa~~~
~~a...bbbbbbbb...a~~
~a....b......b....a~
a.....b....b.b.....a
a.bbb.b..c...b.bbb.a
a.bcb.b.ccc..b.bcb.a
a.bcb.bccccccb.bcb.a
a.bbb.bccccccb.bbb.a
a.....bbbbbbbb.....a
a...a..............a
a..aaa.............a
a..aaa..........a..a
a..aaa.bbbbbb..aaa.a
a...a..b....b..aaa.a
a..a.a.b....b..a.a.a
aaaaaaaaaaaaaaaaaaaa
bbb.bbb.bbb.bbb.bbbb
b.bbb.bbb.bbb.bbb.bb
bb.bbb.bbb.bbb.bbb.b`,
  },
  {
    id: "exhibit-grand-masterwork", title: "Masterwork: The Grand Easel", palette: [UMBER, SKY, CORAL], role: "finale", mechanics: ["stamp", "color-cross", "deep-chain"],
    aha: "Row 15's stamped crest sets the wave rhythm; stamped leg cells in rows 20 and 23 pin each splayed easel leg.",
    art: `
..........aa..........
..........aa..........
.aaaaaaaaaaaaaaaaaaaa.
.a.............cc...a.
.a....a.......cccc..a.
.a....ab......cccc..a.
.a....abb......cc...a.
.a....abbb..........a.
.a....abbbb.........a.
.a....abbbbb........a.
.a....abbbbbb.......a.
.a....a.............a.
.a.cccccccccccc.....a.
.a..cccccccccc......a.
.a.B...bb....bb...b.a.
.a..bbb..bbbb..bbb..a.
.aaaaaaaaaaaaaaaaaaaa.
aaaaaaaaaaaaaaaaaaaaaa
....a.....aa..c.ca....
...A......aa..a.a.A...
..a..aaa..aa.bbbb..a..
..a.acaaa.aa.bbbb..a..
.A..aaaba.aa.bbbb...A.
a....aca..aa.bbbb....a`,
  },
];
