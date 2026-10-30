import { type LevelSpec } from "../types";

export const ISL03: LevelSpec[] = [
  {id: "market-strawberry", title: "Strawberry", palette: ["#D9694F", "#2E8C8A"], role: "teach", mechanics: ["color"], aha: "Different colours may touch, same colours need a gap. Row 3's red 2, green 3, red 2 fills all seven cells; row 2's green 3, green 2 needs a gap, leaving one spare.", art: `
....b..
bbb.bb.
aabbbaa
aaaaaaa
a.aaa.a
.aaaaa.
..aa...`,
  },
  {id: "twin-cherries", title: "Twin Cherries", palette: ["#D9694F", "#2E8C8A"], role: "teach", mechanics: ["color"], aha: "Rows 6 and 7 read red 5, red 3: same colours need a gap, so 5+1+3 fills all nine. The contrast is row 5 — red 3, green 1, green 1: the left stem's green touches its red cherry with no gap, because different colours may touch.", art: `
..bb.b...
.bbbbbbb.
...b...b.
..b....b.
.aaab..b.
aaaaa.aaa
aaaaa.aaa
.aaa.aaaa
.....aaaa
......aa.`,
  },
  {id: "bunch-carrot", title: "Carrot", palette: ["#F2B35E", "#2E8C8A"], role: "practise", mechanics: ["color"], aha: "Count no gap between different colours: column 4 reads green 4, orange 5 — nine cells in ten, one spare. Wherever it sits, rows 2-4 are green and rows 6-9 orange, and row 5 is ink either way; row 5 holds only orange, so it is orange — the leaves sit straight on the root.", art: `
b..bb..
.b.b.bb
.bbbb..
..bbb..
.aaaaa.
.a.aaa.
..aaaa.
..aaa..
..aa...
..a....`,
  },
  {id: "watermelon-slice", title: "Watermelon Slice", palette: ["#D9694F", "#2E8C8A"], role: "practise", mechanics: ["color"], aha: "Read the rind from the columns: column 4's red 1, red 4, teal 1 and column 5's red 6, teal 1 place the flesh down to the rind first. Row 3 no longer fits exactly (red 4, red 3 in eleven), so each rind cell in rows 2-5 is the teal edge its column ends on — column 1's teal 3 and column 11's teal 2 hold the two sides.", art: `
aaaaaaaa...
baa.aaaaa..
baaaa.aaa.b
b.aaaaa.aab
.baaa.aaab.
..baaaaab..
...bbbbb...`,
  },
  {id: "ripe-pear", title: "Ripe Pear", palette: ["#E3A83B", "#2E8C8A"], role: "practise", mechanics: ["color"], aha: "Practise: the shine is a forced gap. Row 8's gold 1, gold 6 needs one (1+1+6 = 8), so it fills the row with the shine at column 2, and row 7's gold 2, gold 4 has one spare cell. Column 4's green 3, gold 7 touch (3+7 = 10): the stalk sits straight on the pear; the leaves either side are read from columns 3 and 5-7.", art: `
...b....
..bb..b.
...bbb..
..aaa...
..aaaaa.
.aaaaaaa
aa.aaaa.
a.aaaaaa
aaaaaaa.
.aaaaa..`,
  },
  {id: "plum-jam-jar", title: "Jam Jar", palette: ["#8C6BB1", "#E3A83B"], role: "boss", mechanics: ["color"], aha: "Two anchors: row 2's lid ribs 1 1 2 1 1 and row 8's purple 1 6 1 fill ten exactly with their gaps; the 8s of rows 1 and 9 then pin their middle six.", art: `
.bbbbbbbb.
b.b.bb.b.b
.a......a.
a.aa..aa.a
a.b.bb...a
ab.b..b.ba
a.b.bbab.a
a.aaaaaa.a
.aaaaaaaa.`,
  },
  {id: "sunny-lemon", title: "Hot-Air Balloon", palette: ["#D9694F", "#E3A83B"], role: "breather", mechanics: ["color"], aha: "A breather: row 4's red 1, gold 2, red 3, gold 3, red 1 — colours touch — fills all ten at once. The envelope is thin, and the basket's gold band (red 3, gold 1, red 2) is decided by the same rule in one look. Four passes.", art: `
...aaaa...
..abbbaa..
.abbaabba.
abbaaabbba
.ab.a.bba.
..ab.bba..
...a..a...
...a..a...
..aaabaa..
...aaaa...`,
  },
  {id: "sprout-flowerpot", title: "Flowerpot", palette: ["#D9694F", "#2E8C8A"], role: "practise", mechanics: ["color"], aha: "A full pot: row 9's red 10 is the rim, row 6's leaves (green 3, 4, 1: 3+1+4+1+1 = 10) fill exactly, and column 3 (red 1, 1, green 5, red 1, green 1, red 2) fills its twelve with one same-colour gap. The band needs no gaps at all: once columns 1 and 10 X its ends, row 10's eight touching red and green 1s fill the cells between.", art: `
.aaa......
aa.aa..aa.
.aaa..a.aa
..b...aaa.
.bb.b..b..
bbb.bbbb.b
.bbbbbbbb.
..bbbbbb..
aaaaaaaaaa
.abababab.
.aaaaaaaa.
..aaaaaa..`,
  },
  {id: "striped-awning", title: "Striped Awning", palette: ["#D9694F", "#C9B8A0"], role: "combine", mechanics: ["color"], aha: "Row 2's red 3, cream 3, red 3, cream 1 fills all ten — colours touch. The stripes are not mirrored: row 3's right red stripe is cut short (red 1 after a gap), a partial row only the columns can place; row 9's cream 10 is the counter and columns 2 and 9 stand the posts.", art: `
aaabbbaaa.
aaabbbaaab
.aabbb.ab.
.a..b..a..
.b......b.
.b......b.
.b.aaaa.b.
.b.a..a.b.
bbbbbbbbbb
.b......b.`,
  },
  {id: "ice-cream-cone", title: "Ice-Cream Cone", palette: ["#E98F7A", "#8A5A3C"], role: "twist", mechanics: ["color"], aha: "Twist — the drip line. Column 9 reads pink 1, 1, 1, 1: four drops in twelve, nothing overlaps. But rows 5, 7, 9 and 11 each end in a pink 1 after the cone, and column 8 holds a single pink (the scoop, row 3) — so every drop must land in column 9. Columns 4 and 5 (pink 5, brown 3, brown 3 = twelve) stand the scoop and waffle first.", art: `
...aaa...
.aaaaaa..
aaaaaaaa.
aaaaaaa..
.aaaaa..a
bbbbbbb..
.b.bb.b.a
.bbbbbb..
..b..b..a
..bbbb...
...bb...a
...bb....`,
  },
  {id: "apple-basket", title: "Apple Basket", palette: ["#D9694F", "#8A5A3C"], role: "combine", mechanics: ["color"], aha: "Start from the basket: row 6's brown 10 rim and row 7's weave 1 2 2 2 fill outright and settle column 1. The apples are no longer one exact row (row 5 reads red 2, red 3, red 2 with a spare cell), so each apple is placed by its own column — red only where that column's clue still holds red.", art: `
...bbbb...
..b...bb..
.b.aa.a.b.
.baaaaaab.
.aa.aaa.aa
bbbbbbbbbb
b.bb.bb.bb
.bbbbbbbb.
.b.bb.bb..
..bbbbbb..`,
  },
  {id: "market-stall", title: "Market Stall", palette: ["#D9694F", "#C9B8A0"], role: "finale", mechanics: ["color"], aha: "Three anchors cross: the awning row 3 (red and cream 2s touching) fills exactly, the cream counter row 8 fills, and column 1's red 2, cream 8 pins the left post.", art: `
...aabbaa...
.aabbaabbaa.
aabbaabbaabb
a.bb.aa.bb.a
b..........b
b.a..a..aa.b
b.aa.aa.a..b
bbbbbbbbbbbb
b.b.b..b.b.b
b..b.bb.b..b
b.b.b..b.b.b
bb........bb`,
  },
];
