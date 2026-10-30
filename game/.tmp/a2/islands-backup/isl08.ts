import type { LevelSpec } from "../types";

const TEAL = "#2E8C8A", GOLD = "#E3A83B", CORAL = "#D9694F", UMBER = "#8A5A3C", CREAM = "#C9B8A0", SKY = "#6FA8DC", NIGHT = "#2B3A67";

/** Island 8 — Kiln Room. Teaches: cracked clue numbers ("?" keeps its colour, hides its length). */
export const ISL08: LevelSpec[] = [
  {
    id: "kiln-teapot", title: "Teapot", palette: [TEAL, GOLD], role: "teach", mechanics: ["cracked", "exact-fit", "color"],
    aha: "Row 11's gold ? is read from above: columns 3-10 each end in a gold 1 there, so the hidden run is 8.", crack: ["r10.0"],
    art: `
.....bb.....
....aaaa....
..bbbbbbbb..
a.aaaaaaaaaa
aaaaaaaaaa.a
.aaaaaaaaa.a
..aaaaaaaaaa
..bbbbbbbb..
..aaaaaaaa..
...aaaaaa...
..bbbbbbbb..`,
  },
  {
    id: "kiln-heart-mug", title: "Heart Mug", palette: [SKY, NIGHT], role: "teach", mechanics: ["cracked", "fill", "exact-fit", "color"],
    aha: "Row 5's navy ? is the handle top: columns 11 and 13 both ink row 5, so one run bridges them - it's 3.", crack: ["r4.1"],
    art: `
...a...a.....
....a...a....
...a...a.....
.bbbbbbbbb...
.aaaaaaaaabbb
.aaaaaaaaa..b
.aabbabbaa..b
.aabbbbbaa..b
.aaabbbaaa.b.
.aaaabaaaabb.
..aaaaaaa....
...aaaaa.....
bbbbbbbbbbbbb`,
  },
  {
    id: "kiln-tall-vase", title: "Tall Vase", palette: [TEAL, GOLD], role: "practise", mechanics: ["cracked", "exact-fit", "color"],
    aha: "Row 10's ? is the widest belly: every column inks row 10, the 2s in columns 1 and 13 last, so it's 13.", crack: ["r9.0"],
    art: `
...bbbbbbb...
....aaaaa....
.....aaa.....
.....aaa.....
....aaaaa....
...aaaaaaa...
..aaaaaaaaa..
.bbbbbbbbbbb.
.abababababa.
aaaaaaaaaaaaa
aabaaabaaabaa
.aaaaaaaaaaa.
..aaaaaaaaa..
...aaaaaaa...
....bbbbb....`,
  },
  {
    id: "kiln-willow-plate", title: "Patterned Plate", palette: [CREAM, NIGHT], role: "practise", mechanics: ["cracked", "exact-fit", "color"],
    aha: "Two ?s: columns 6-9 end on row 14, so its rim is 4; column 4's 8 then shows row 5's middle ? is 3.", crack: ["r13.0", "r4.2"],
    art: `
.....aaaa.....
...aabbbbaa...
..abbaaaabba..
.abaaaaaaaaba.
.abaaabbaaaba.
abaaaabbaaaaba
abaabbaabbaaba
abaabbaabbaaba
abaaaabbaaaaba
.abaaabbaaaba.
.abaaaaaaaaba.
..abbaaaabba..
...aabbbbaa...
.....aaaa.....`,
  },
  {
    id: "kiln-glazed-tile", title: "Glazed Tile", palette: [TEAL, GOLD, CORAL], role: "twist", mechanics: ["cracked", "fill", "exact-fit", "color"],
    aha: "Row 6's coral ? hides mid-line: column 5 inks its left cell and column 4's gold border stops it - it's 2.", crack: ["r5.3"],
    art: `
aaaaaaaaaaaaaa
abb...aa...bba
ab...abba...ba
a...abccba...a
a..abccccba..a
a.abccbbccba.a
aabccbaabccbaa
aabccbaabccbaa
a.abccbbccba.a
a..abccccba..a
a...abccba...a
ab...abba...ba
abb...aa...bba
aaaaaaaaaaaaaa`,
  },
  {
    id: "kiln-pitcher", title: "Dotted Pitcher", palette: [SKY, NIGHT], role: "boss", mechanics: ["cracked", "exact-fit", "overlap", "color"],
    aha: "Column 4's ? is 11 or 12 until row 13's 6 takes the last cell; row 6's handle ? spans columns 12-14.", crack: ["c3.1", "r5.1"],
    art: `
bbbbbbbbbb....
.aaaaaaaaabbbb
..aaaaaaa....b
..aaaaaaa....b
.aaaaaaaaa...b
aaaaaaaaaaabbb
aaaaaaaaaaaa..
abaabaabaaba..
aabaabaabaab..
aaaaaaaaaaaa..
.aaaaaaaaaa...
..aaaaaaaa....
...aaaaaa.....
..bbbbbbbb....`,
  },
  {
    id: "kiln-tea-bowl", title: "Tea Bowl", palette: [UMBER, TEAL], role: "breather", mechanics: ["cracked", "fill", "overlap", "color"],
    aha: "Row 5's umber ? sits between two teal 1s; columns 7 and 11 place them, leaving exactly 3 cells for it.", crack: ["r4.2"],
    art: `
bbbbbbbbbbbbb
.bbbbbbbbbbb.
.bbabbbbabbb.
.abababbabab.
.aaaaabaaaba.
..aaaaaaaaa..
..aaaaaaaaa..
...aaaaaaa...
....aaaaa....
...aaaaaaa...`,
  },
  {
    id: "kiln-honey-jar", title: "Honey Jar", palette: [GOLD, UMBER, CORAL], role: "practise", mechanics: ["cracked", "fill", "exact-fit", "color"],
    aha: "Column 6's umber ? starts on the label's top edge; row 9 extends it a cell and row 10's gap ends it: 2.", crack: ["c5.4"],
    art: `
....bbbbbb....
..cccccccccc..
.cccccccccccc.
cccccccccccccc
c.c.bbbbbb.c.c
...aaaaaaaa...
..aaaaaaaaaa..
..aabbbbbbaa..
..ab.b..b.ba..
..ab..bb..ba..
..aabbbbbbaa..
..aaaaaaaaaa..
..aaaaaaaaaa..
...aaaaaaaa...`,
  },
  {
    id: "kiln-brick-dome", title: "The Kiln", palette: [UMBER, CORAL, GOLD], role: "combine", mechanics: ["cracked", "smudged", "void", "color"],
    aha: "Smudged column 4 is painted by its rows; column 7's coral ? must bridge rows 6 and 8, so it's 3.", crack: ["c6.1", "r9.2"], smudge: ["c3"],
    art: `
~~~~aa.aaa~~~~
~~~a.aaa.aa~~~
~~aaa.aaa.aa~~
~a.aaa.aaa.aa~
aaa.aa..aa.aaa
a.aaa.b..aa.aa
aa.a..b.b.a.aa
a.aa.bb.bbaa.a
aa.a.bcbb.a.aa
a.aabbccbbaa.a
aa.abccccba.aa
a.aabbccbbaa.a
aa.abbbbbba.aa
aaaaaaaaaaaaaa`,
  },
  {
    id: "kiln-lucky-cat", title: "Lucky Cat", palette: [CREAM, CORAL, GOLD], role: "twist", mechanics: ["cracked", "smudged", "overlap", "color"],
    aha: "Row 8's cream ? is the tail's base: columns 11 and 12 ink it, column 13's 6 stops short - it's 2.", crack: ["r7.3"], smudge: ["c3"],
    art: `
.a......a.....
.ba....ab..aa.
aaaaaaaaaa.aaa
aaaaaaaaaa.aaa
aa.aaaa.aa.aa.
aaaabbaaaa.aa.
aaaaaaaaaaaaa.
.bbbccbbb.aa..
.aaaccaaaaa...
acccaaaaaaa...
accccaaaaaa...
acccaaaaaaa...
aaaaaaaaaaa...
.bbbbbbbbb....`,
  },
  {
    id: "kiln-noodle-bowl", title: "Noodle Bowl", palette: [NIGHT, GOLD, UMBER], role: "combine", mechanics: ["cracked", "smudged", "overlap", "color"],
    aha: "Row 7's navy ? sits between gold 2s: columns 4-5 pin it to 2, then the row paints smudged column 1.", crack: ["r6.2"], smudge: ["c0"],
    art: `
...........cc.
..........cc..
..b..b...cc...
...b..b.cc....
.bbbbbbccbbbb.
aaaaaaaaaaaaaa
abbaabbaabbaab
.aaaaaaaaaaaa.
.aabaabaabaaa.
..aaaaaaaaaa..
...aaaaaaaa...
.....aaaa.....
....aaaaaa....`,
  },
  {
    id: "kiln-fire-masterwork", title: "Kiln Fire", palette: [UMBER, CORAL, TEAL, GOLD], role: "finale", mechanics: ["cracked", "smudged", "overlap", "color"],
    aha: "Column 11's coral ? is one flame tip: row 4's 7 inks it, rows 3 and 5 gap it; smudged row 14 fills last.", crack: ["c10.1"], smudge: ["r13"],
    art: `
....aaaaaaa....
..aaa.....aaa..
.aa..b.b.b..aa.
.a..bbbbbbb..a.
a.cc.bbbbb.dd.a
acccc.ddd.dddda
a.cc..ddd..dd.a
aaaaaaaaaaaaaaa
.a...........a.
.a.dd..c..dd.a.
.adddd.cc.dddda
.a.dd.ccc.dd.a.
.a.dd.ccc.dd.a.
aaaaaaaaaaaaaaa
.a...........a.`,
  },
];
