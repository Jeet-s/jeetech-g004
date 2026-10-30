import { type LevelSpec } from "../types";

export const ISL03: LevelSpec[] = [
  {id: "market-strawberry", title: "Strawberry", palette: ["#D9694F", "#2E8C8A"], role: "teach", mechanics: ["color"], aha: "Same colours need a gap, different colours don't: row 3's green 2 4 2 must keep its two gaps, so 2+1+4+1+2 fills all ten exactly — while row 4's red 3, green 2, red 3 may touch and has two spare cells.", art: `
....bb....
.bbb.bbbb.
bb.bbbb.bb
.aaabbaaa.
aaaaaaa.aa
aa.aaaaaaa
aaaaa.aaaa
.aaaaaa.a.
..aaaaaa..
...aaaa...`,
  },
  {id: "twin-cherries", title: "Twin Cherries", palette: ["#D9694F", "#8A5A3C"], role: "teach", mechanics: ["color"], aha: "A stem may touch its cherry: column 9's brown 2 and red 5 need no gap, so they take seven of eight cells — slack one pins the stem's lower cell and the cherry's middle four.", art: `
....bbb...
..bbbbbbb.
..b.....b.
.aaa...aaa
aaaaa.aaaa
aa.aa.a.aa
aaaaa.aaaa
.aaa...aaa`,
  },
  {id: "bunch-carrot", title: "Carrot", palette: ["#F2B35E", "#2E8C8A"], role: "practise", mechanics: ["color"], aha: "Row 2's green 1 4 1 needs gaps between the greens: 1+1+4+1+1 is all 8 cells, so the fronds draw first.", art: `
.bb..bb.
b.bbbb.b
..bbbb..
.aaaaaa.
.aaa.aa.
..aaaa..
..aa.a..
...aa...`,
  },
  {id: "watermelon-slice", title: "Watermelon Slice", palette: ["#D9694F", "#2E8C8A"], role: "practise", mechanics: ["color", "exact-fit"], aha: "Row 5's green 1, red 6, green 1 spans 8 of 10 cells: slack 2 pins the red's middle four before the rind.", art: `
aaaaaaaaaa
aa.aaaa.aa
baaaaaaaab
.baa.aaab.
.baaaaaab.
..baaaab..
...bbbb...`,
  },
  {id: "ripe-pear", title: "Ripe Pear", palette: ["#E3A83B", "#8A5A3C"], role: "twist", mechanics: ["color", "overlap"], aha: "Row 7's 2 and 5 plus one gap fill all eight cells: the paper at cell 3 is the bite out of the pear.", art: `
....b.bb
....bbb.
...ab...
..aaaa..
..a.aa..
.aaaaaa.
aa.aaaaa
aaaaaaaa
.aaaaaa.`,
  },
  {id: "plum-jam-jar", title: "Jam Jar", palette: ["#8C6BB1", "#E3A83B"], role: "boss", mechanics: ["color", "overlap", "reach"], aha: "Row 2's lid ribs 1 1 2 1 1 fit exactly; the lid and base 8s only pin their middles until columns close in.", art: `
.bbbbbbbb.
b.b.bb.b.b
.bbbbbbbb.
.a......a.
a.aa..aa.a
a.b.bb.b.a
ab.b..b.ba
a.b.bb.b.a
a.aa..aa.a
.aaaaaaaa.`,
  },
  {id: "sunny-lemon", title: "Lemon", palette: ["#E3A83B", "#2E8C8A"], role: "breather", mechanics: ["color"], aha: "Row 5's 8 fills the belly, and column 8's lone 1 must be that cell: the rest of the right edge is paper.", art: `
...bb...
..bbbb..
...bb...
.aaaaaa.
aaaaaaaa
aaaaaaa.
.aaaaa..
..aa....`,
  },
  {id: "sprout-flowerpot", title: "Flowerpot", palette: ["#D9694F", "#2E8C8A"], role: "practise", mechanics: ["color", "overlap"], aha: "Row 7's 9 hands columns 1 and 9 their only cell; row 4's green 2 1 2 then fits the seven left exactly.", art: `
...aaa...
..aa.aa..
...aaa...
.bb.b.bb.
..bbbbb..
....b....
aaaaaaaaa
.aaaaaaa.
..aaaaa..`,
  },
  {id: "striped-awning", title: "Striped Awning", palette: ["#D9694F", "#C9B8A0"], role: "combine", mechanics: ["color", "exact-fit", "overlap"], aha: "Row 9's cream 10 is the counter: it completes column 1's red 3, cream 1, so rows 4-8 and 10 there are paper.", art: `
aaabbbaaab
aaabbbaaab
aaabbbaaab
.a..b..a..
.b......b.
.b......b.
.b.aaaa.b.
.b.aaaa.b.
bbbbbbbbbb
.b......b.`,
  },
  {id: "ice-cream-cone", title: "Ice-Cream Cone", palette: ["#E98F7A", "#8A5A3C"], role: "twist", mechanics: ["color", "reach"], aha: "Row 5's pink 1 5 1 fits nine exactly: drips hang at both edges, so columns 1 and 9 are done at once.", art: `
...aaa...
..aaaaa..
.aaaaaaa.
.aaaaaaa.
a.aaaaa.a
bbbbbbbbb
.b.b.b.b.
.bbbbbbb.
..b.b.b..
...bbb...
....b....`,
  },
  {id: "apple-basket", title: "Apple Basket", palette: ["#D9694F", "#8A5A3C"], role: "combine", mechanics: ["color", "overlap", "reach"], aha: "Row 5's red 3 3 2 needs a gap between same colours: 3+1+3+1+2 is exactly 10, so the apples set first.", art: `
...bbbb...
..b...bb..
.b.aa.a.b.
.baaaaaab.
aaa.aaa.aa
bbbbbbbbbb
b.bb.bb.bb
.bbbbbbbb.
.b.bb.bb..
..bbbbbb..`,
  },
  {id: "market-stall", title: "Market Stall", palette: ["#D9694F", "#C9B8A0"], role: "finale", mechanics: ["color", "overlap", "reach"], aha: "Column 1's red 2 and cream 8 span ten of twelve: the post is sure from row 5 to 10; row 5's 1 1 hugs posts.", art: `
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
