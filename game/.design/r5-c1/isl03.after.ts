import { type LevelSpec } from "../types";

export const ISL03: LevelSpec[] = [
  {id: "market-strawberry", title: "Strawberry", palette: ["#D9694F", "#2E8C8A"], role: "teach", mechanics: ["color"], aha: "Different colours may touch; the same colour needs a gap. Row 3's red 2, green 3, red 2 fits seven cells only because nothing separates the colours, so the calyx sits straight between the red shoulders and the row fills. Column 4's green 3, red 1, red 3 shows the other half: its two reds need paper between them.", art: `
...b...
.bbbbb.
aabbbaa
aaaaaa.
.aa.aaa
.aaaaa.
..aaa..
...a...`,
  },
  {id: "twin-cherries", title: "Twin Cherries", palette: ["#D9694F", "#2E8C8A"], role: "practise", mechanics: ["color"], aha: "A different colour can stand in for the gap. Column 8's green 1, green 5, red 3 is exactly ten: paper only between the two greens, none where the stem meets the cherry. So the stem drops into the right cherry, and row 7 reads red 1, green 1, red 1 with no paper at all: the stem splits the cherry top. Row 5 does the same for the left cherry.", art: `
.....bbb..
..bbbbb...
..b....b..
..b....b..
.aba...b..
aaaaa..b..
aaaaa.aba.
aaaaa.aaaa
.aaa..aaaa
.......aa.`,
  },
  {id: "bunch-carrot", title: "Radish", palette: ["#D9694F", "#2E8C8A"], role: "practise", mechanics: ["color"], aha: "One spare cell, two columns, opposite answers. Columns 4 (green 3, red 8) and 5 (green 4, red 7) both fill eleven of twelve, so each is sure green in rows 2-3 and red in rows 6-11 before any row helps. Row 5's red 5 overlaps column 5, which puts that column's spare at the foot: its leaf reaches row 1. Column 4's spare goes the other way, so its red runs down to the tail tip in row 12.", art: `
....b..b.
...bb.bbb
...bbbbb.
...bbbb..
..aaaaa..
.aaaaaaa.
aaaaaaaa.
aaaaaaaa.
.aaaaaa..
...aaa...
..aaa....
...a.....`,
  },
  {id: "watermelon-slice", title: "Watermelon Slice", palette: ["#D9694F", "#2E8C8A"], role: "practise", mechanics: ["color"], aha: "Touching colours make the long straight rows fit. Row 1's teal 1, red 9, teal 1 is eleven only because rind and flesh touch. Row 2's red 2, 3, 2 needs a gap between each pair of reds (the seeds): 1+2+1+3+1+2+1 = 11, so it fills too. Column 1's teal 3 is then rows 1-3, and the rind steps inward down the curve to row 8's teal 3.", art: `
baaaaaaaaab
baa.aaa.aab
baaaaa.aaab
.baa.aaaab.
.baaaa.aab.
..baaaaab..
...baaab...
....bbb....`,
  },
  {id: "ripe-pear", title: "Ripe Pear", palette: ["#E3A83B", "#2E8C8A"], role: "practise", mechanics: ["color"], aha: "A gap between two golds is a shine. Row 8's gold 2, gold 5 fits its eight cells only with the gap, so the first shine is column 3. Column 4's green 1, gold 3, gold 3 needs a gap between its golds too, and once row 8's gold is in, that gap is row 7: the second shine. Column 5's green 2, gold 8 is ten in ten, so the stalk sits on the pear.", art: `
....b...
.bb.b...
..bbaa..
...aaa..
..aaaaa.
..aaaaa.
.aa.aaaa
aa.aaaaa
aaaaaaa.
.aaaaa..`,
  },
  {id: "plum-jam-jar", title: "Jam Jar", palette: ["#8C6BB1", "#E3A83B"], role: "boss", mechanics: ["color", "overlap"], aha: "Boss: the label has one spare cell, and only the glass can place it. Row 5 reads purple 1, gold 7, purple 1: nine in ten, so the label is sure on columns 3-8 but could hug either wall. Column 9 (gold 1, purple 1, gold 1, purple 3) must fit its second gold between the rim and the jam, and rows 4 and 6-8 are paper there: the label runs to the right wall.", art: `
.bbbbbbbb.
..bbbbbb..
.aa....aa.
a........a
a.bbbbbbba
a.bb.abb.a
a.b.aa.b.a
a.bbbbbb.a
aa..aaaaaa
a..aaaaaaa
.aaaaaaaa.`,
  },
  {id: "sunny-lemon", title: "Hot-Air Balloon", palette: ["#D9694F", "#E3A83B"], role: "breather", mechanics: ["color"], aha: "A colour missing from a column rules it out. Columns 3 and 6 (red 8, gold 2) fill all ten cells, so both ropes run straight into the basket. Row 8's red 1, red 1, gold 1 puts its sandbag right of the right rope, and column 8 holds only red, so the bag hangs at column 7, touching the rope. The basket's off-centre weave hole (row 10's gold 1, 2) follows.", art: `
..abba..
.aabbaa.
aaabbaaa
aaabbaaa
.aabbaa.
..abba..
..a..a..
..a..ab.
..bbbb..
..b.bb..`,
  },
  {id: "sprout-flowerpot", title: "Sweetcorn", palette: ["#E3A83B", "#2E8C8A"], role: "practise", mechanics: ["color"], aha: "Colours may touch, but here they don't, and only a crossing line says so. Rows 3 and 4 read green 1, gold 4, green 1, which fits with or without gaps. Columns 3 and 8 read gold 3, green 2: row 7 pins that gold to rows 5-7, so rows 1-4 of those columns are paper, and the husk stands apart from the cob.", art: `
....aa....
.b.aaaa...
.b.aaaa.b.
.b.aaaa.b.
.baaaaaab.
.baaaaaab.
bbaaaaaabb
.bbaaaabb.
..bbaabb..
...bbbb...
....bb....
.....b....`,
  },
  {id: "striped-awning", title: "Produce Stall", palette: ["#D9694F", "#C9B8A0"], role: "combine", mechanics: ["color", "exact-fit"], aha: "The awning stripe cannot drop to the counter. Column 6 reads red 3, cream 2, and red may touch cream, so alone the stripe could hang down to row 5. But row 2 (red and cream 2s, all touching) fits ten exactly and puts red at row 2 of column 6, so the 3 is rows 1-3 or 2-4: row 5 there is paper, the aisle between apples and loaves.", art: `
.aabbaabb.
aabbaabbaa
a.b.aa.b.a
.b.a....b.
.baaa.bbb.
bbbbbbbbbb
.b.bbbb.b.
.b......b.`,
  },
  {id: "ice-cream-cone", title: "Ice-Cream Cone", palette: ["#E98F7A", "#8A5A3C"], role: "twist", mechanics: ["color"], aha: "Twist: the drips are placed by elimination, not overlap. Column 9 reads pink 1, 1, 1, 1: four drops in twelve, nothing overlaps. But rows 5, 7, 9 and 11 each end in a pink 1 after the cone, and column 8 holds a single pink (the scoop, row 3), so every drop must land in column 9. Columns 4 and 5 (pink 5, brown 3, brown 3 = twelve) stand the scoop and waffle first.", art: `
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
  {id: "apple-basket", title: "Apple Basket", palette: ["#D9694F", "#8A5A3C"], role: "combine", mechanics: ["color", "exact-fit"], aha: "One apple is counted from the basket up. Row 5's red 4, red 4, brown 1 fills ten exactly, with paper at column 5 between the apples. Column 5 reads brown 1, red 1, brown 1, brown 3: the rim (row 6) and the basket body (rows 8-10) use the last two browns, so its red 1 sits above that paper. It is the left apple's bulge at row 4, which makes that apple three wide.", art: `
...bbbb...
..b...bb..
.baa..aab.
.baaa.aaab
aaaa.aaaab
bbbbbbbbbb
b.bb.bb.bb
.bbbbbbbb.
.b.bb.bb..
..bbbbbb..`,
  },
  {id: "market-stall", title: "Market Stall", palette: ["#D9694F", "#C9B8A0"], role: "finale", mechanics: ["color", "overlap"], aha: "Finale: the awning's spare cell is placed by the post. Row 3 reads red 2, cream 2, red 2, cream 2, red 2, cream 1: eleven in twelve, so the stripes could shift. Column 12, the right post, reads red 1, cream 8; its creams all sit below its red, so row 3 cannot end in cream there. The spare is column 12, the awning locks, and the counter (row 8, cream 12) and left post do the rest.", art: `
...aabbaa...
.aabbaabbaa.
aabbaabbaab.
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
