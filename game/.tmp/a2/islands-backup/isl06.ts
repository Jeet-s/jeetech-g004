import { type LevelSpec } from "../types";

const SAGE = "#8DB48E", CORAL = "#D9694F", UMBER = "#8A5A3C", GOLD = "#E3A83B", TEAL = "#2E8C8A";
const PLUM = "#8C6BB1", SKY = "#6FA8DC", NIGHT = "#2B3A67", INKC = "#1F2A3A";

/** Island 6 — Conservatory. Three-colour pictures: a cell can only take a colour both its lines contain. */
export const ISL06: LevelSpec[] = [
  {
    id: "potted-tulip", title: "Potted Tulip", palette: [CORAL, SAGE, UMBER], role: "teach", mechanics: ["color-cross"],
    aha: "Row 3's coral 8 overlaps on six middle cells; columns 5 and 6 then read coral, sage, umber top to bottom.",
    art: `
.a.a..a.a.
.aaa..aaa.
.aaaaaaaa.
..aaaaaa..
b..aaaa..b
bb..bb..bb
.bb.bb.bb.
..bbbbbb..
..cccccc..
...cccc...`,
  },
  {
    id: "flowering-cactus", title: "Flowering Cactus", palette: [SAGE, GOLD, UMBER], role: "teach", mechanics: ["color-cross"],
    aha: "Row 11's umber 12 fills the pot rim, and columns 1 and 12 hold only that umber cell, so the rest is paper.",
    art: `
.....bbb....
......aa....
..b...aa....
.aa...aa..b.
.aa...aa.aa.
.aa...aa.aa.
.aaa..aa.aa.
..aaaaaaaaa.
...aaaaaaa..
......aa....
cccccccccccc
.cccccccccc.`,
  },
  {
    id: "sunflower-head", title: "Sunflower", palette: [GOLD, UMBER, SAGE], role: "practise", mechanics: ["color-cross", "exact-fit"],
    aha: "Rows 4 and 6 hand column 1 both its gold 1s, so its other ten cells are paper: petal tips, not a rim.",
    art: `
...a.aa.a...
..aaaaaaaa..
.aaabbbbaaa.
aaabbbbbbaaa
.aabbbbbbaa.
aaabbbbbbaaa
.aaabbbbaaa.
..aaaaaaaa..
...a.cc.a...
.cc..cc.....
..ccccc..cc.
.....ccccccc`,
  },
  {
    id: "hummingbird-sip", title: "Hummingbird", palette: [TEAL, CORAL, INKC], role: "practise", mechanics: ["color-cross", "overlap"],
    aha: "Column 9's teal 7 overlaps on two cells; row 6's coral 2 2 then teal 3 can never reach the last two cells.",
    art: `
.........aaa.
........aaaa.
.......aaaa..
bb...aaaaa...
bbbccacaa....
bb...bbaaa...
.a....bbaaa..
.a.....aaaaa.
.a.......aaa.
.a........aa.
.aa........aa
..a.........a`,
  },
  {
    id: "garden-rose", title: "Garden Rose", palette: [CORAL, SAGE, NIGHT], role: "twist", mechanics: ["color-cross", "exact-fit"],
    aha: "Row 13's sage 3 must cover the stem cell column 6 gives it, so it can't reach past columns 4-8.",
    art: `
...aaaaaa...
..aacccaaa..
.aacaaacaaa.
.acaacaacaa.
aacacaacaaa.
aacaacaacaa.
.aacccaaaa..
..aaaaaaaa..
bb..aaaa...b
.bbb.b...bbb
..bbbb..bbb.
.....b.bbb..
.....bbb....`,
  },
  {
    id: "bonsai-pine", title: "Bonsai", palette: [SAGE, UMBER, CORAL], role: "boss", mechanics: ["color-cross", "overlap"],
    aha: "Row 3's sage 7 and 4 leave only two spare cells; column 9's umber 3s then start to bend the trunk into place.",
    art: `
.....aaaa.....
..aaa.aaaaa...
.aaaaaaa.aaaa.
...aa..bb.aa..
.......b......
.aa.a..bb.....
aaaaaabbb.....
..aaa...bb....
.........b.aa.
........bbaa.a
.......bb..aa.
..cccbbcbccc..
...cccccccc...
....c....c....`,
  },
  {
    id: "lily-frog", title: "Frog on a Lily Pad", palette: [SAGE, TEAL, INKC], role: "breather", mechanics: ["color-cross", "exact-fit"],
    aha: "Row 9's teal 6 and 5 plus one gap fill all twelve: the gap is the lily pad's notch, at column 7.",
    art: `
.aaa....aaa.
.aca....aca.
.aaaaaaaaaa.
aaaaaaaaaaaa
aaccccccccaa
aaaaaaaaaaaa
.aaaaaaaaaa.
aa.aaaaaa.aa
bbbbbb.bbbbb
bbbbbbbbbbbb
.bbbbbbbbbb.
...bbbbbb...`,
  },
  {
    id: "leaf-ladybird", title: "Ladybird on a Leaf", palette: [CORAL, INKC, SAGE], role: "practise", mechanics: ["color-cross", "void", "exact-fit"],
    aha: "Voids leave row 2 nine cells for sage 3, ink 1, ink 1, sage 3; the ink dots need a gap, so it fits exactly.",
    art: `
~~~~ccccc~~~~
~~cccb.bccc~~
~ccc.bbb.ccc~
ccc.bbbbb.ccc
cc.aaabaaa.cc
c.abaabaaba.c
c.aaaabaaaa.c
c.abbababba.c
c.aaaabaaaa.c
cc.abababa.cc
~cc.aabaa.cc~
~~ccc...ccc~~
~~~~ccccc~~~~`,
  },
  {
    id: "watering-can", title: "Watering Can", palette: [TEAL, SKY, CORAL], role: "combine", mechanics: ["color-cross", "overlap"],
    aha: "Row 4's teal 9 and 3 leave one spare cell; column 10's lone teal 2 then crosses off the rest of the column.",
    art: `
..aaaaa.......
.a.....a......
.a.....a....aa
aaaaaaaaa..aaa
aaaaaaaaa.aa.b
aaaaaaaaaaa..b
aaaaaaaaaa.b..
aaaaaaaaa....b
aaaaaaaaa..b..
.aaaaaaa..c.cb
..........ccc.
...........a..`,
  },
  {
    id: "monstera-leaf", title: "Monstera Leaf", palette: [SAGE, TEAL, UMBER], role: "twist", mechanics: ["color-cross", "stamp", "exact-fit"],
    aha: "Column 8's sage 1, teal 12, umber 1 fill all 14 cells; the stamped hole in row 7 marks the first leaf slit.",
    art: `
.....aaaa.....
...aaaabaaaa..
..aa.aabaa.aa.
.aaa.aabaa.aaa
aa..aaabaaa..a
aaa..aabaa.aaa
..aa,aabaa.aa.
aaa.aaabaaa..a
.aaa.aabaa.aa.
..aa.aabaa.a..
...aaaabaaaa..
.....aabaa....
.......b.a....
.......c......`,
  },
  {
    id: "moth-orchid", title: "Orchid", palette: [PLUM, GOLD, SAGE], role: "combine", mechanics: ["color-cross", "exact-fit"],
    aha: "Row 13's sage 12 covers 11 of 13 cells on its own; row 4's 5 1 5 then fits with the lip centred.",
    art: `
....aaaaa....
...aaaaaaa...
.aa.aaaaa.aa.
aaaaa.a.aaaaa
aaaaabbbaaaaa
.aaabbabbaaa.
..aaabbbaaa..
...aaabaaa...
..aaa...aaa..
.aaa..c..aaa.
...a..c......
cc....c....cc
.cccccccccccc`,
  },
  {
    id: "glasshouse", title: "Glasshouse", palette: [SAGE, CORAL, NIGHT], role: "finale", mechanics: ["color-cross", "void", "stamp"],
    aha: "The stamp gives column 6 its only sage cell, so everything between it and the bench row is paper.",
    art: `
~~~~~~ccc~~~~~~
~~~~cc...cc~~~~
~~~c..aaa..c~~~
~~c.aAaaaaa.c~~
~c..a..a..a..c~
~c.....a.b.bac~
c..bb..a.bbb..c
c.bbb..a..b.a.c
c.aa..aaa.a.aac
c.aaa......a..c
c..a..b.b..a..c
c.bbb.bbb.bbb.c
ccccccccccccccc
c.c.........c.c
ccccccccccccccc`,
  },
];
