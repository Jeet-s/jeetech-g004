import { type LevelSpec } from "../types";

export const ISL03: LevelSpec[] = [
  {id: "market-strawberry", title: "Strawberry", palette: ["#D9694F", "#2E8C8A"], role: "teach", mechanics: ["color"], aha: "Different colours may touch; the same colour needs a gap. Row 3's red 2, green 3, red 2 fills all seven cells only because nothing parts the colours. Row 6's red 3, red 1 can still slide, so cross-check it: column 5's red 2 is rows 4-5, its red 1 needs paper first, and that paper is row 6's seed.", art: `
...b...
.bbbbb.
aabbbaa
aaaaaa.
.aa.aaa
.aaa.a.
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
  {id: "watermelon-slice", title: "Watermelon Slice", palette: ["#D9694F", "#2E8C8A"], role: "practise", mechanics: ["color"], aha: "Gaps are owed only between like colours, so here the seed row is the one that fits. Row 1 reads teal 1, red 2, red 3, red 3, teal 1: rind may touch flesh, but each pair of reds needs a seed between them, so 1+2+1+3+1+3+1 = 12. The plain row 2 (teal 1, red 8, teal 1) has two spare cells until columns 1 and 12, whose only teal is row 1's rind, cut it to ten.", art: `
baa.aaa.aaab
.baaaaaaaab.
.baaa.aaaab.
..baaaaaab..
..baa.aaab..
...baaaab...
....bbbb....`,
  },
  {id: "ripe-pear", title: "Ripe Pear", palette: ["#E3A83B", "#2E8C8A"], role: "practise", mechanics: ["color"], aha: "One column, both rules. Column 6 reads green 2, gold 2, gold 5 in ten rows: the stalk may sit right on the pear, but the two golds must part, so 2+2+1+5 = 10 fills it and its paper in row 5 is the shine. Row 5 (green 2, gold 2, gold 2) mixes the rules the same way across: the leaf touches the pear, the shine splits it.", art: `
.....b...
....bb...
.bb.aaa..
bbbaaaaa.
.bbaa.aa.
..aaaaaa.
.aaaaaaaa
.aaaaaaaa
..aaaaaa.
...aaaa..`,
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
  {
    id: "sunny-lemon", title: "Hot-Air Balloon", palette: ["#D9694F", "#E3A83B"], role: "breather", mechanics: ["color"],
    aha: "A breather: different colours owe no gap. Column 6 reads red 2, gold 2, red 2, gold 2: eight cells, the whole column, so the right rope runs straight down into the gold sandbag at row 7. Row 7 (red 1, red 1, gold 1) then sets both ropes one column left of row 6's: the basket swings left as the balloon leans.",
    art: `
..aaaa..
.aabbaa.
aabbbbaa
aabbbbaa
.aabbaa.
...a.a..
..a.ab..
..bbbb..`,
  },
  {id: "sprout-flowerpot", title: "Sweetcorn", palette: ["#E3A83B", "#2E8C8A"], role: "practise", mechanics: ["color"], aha: "The husk may touch the cob but doesn't, and the columns say where. Column 3's gold 3, green 2 already has gold in rows 5-7, where the cob's widest rows overlap it, so rows 1-4 of column 3 are paper: the left husk stands apart. On the right, column 9's green 4 can only be rows 5-8, so row 4's last green must jump out to column 10.", art: `
....aa....
.b.aaaa...
.b.aaaaa..
.b.aaaaa.b
.baaaaaab.
.baaaaaab.
bbaaaaaab.
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
  {id: "apple-basket", title: "Apple Basket", palette: ["#D9694F", "#8A5A3C"], role: "combine", mechanics: ["color", "exact-fit"], aha: "The apples differ by a cell, so the gap between them steps. Column 1's brown 2 can only be the rim (rows 6-7), which leaves rows 4 and 5 nine cells each: brown 1, red 2, red 4, brown 1 and brown 1, red 3, red 3, brown 1 both fit exactly, with paper only between the reds. The gap is column 5 in row 4, column 6 in row 5.", art: `
..bbbbb...
.b.....b..
.b....aab.
.baa.aaaab
.baaa.aaab
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
