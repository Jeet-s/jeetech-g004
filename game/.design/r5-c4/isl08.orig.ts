import type { LevelSpec } from "../types";

const TEAL = "#2E8C8A", GOLD = "#E3A83B", CORAL = "#D9694F", UMBER = "#8A5A3C", CREAM = "#C9B8A0", SKY = "#6FA8DC", NIGHT = "#2B3A67";

/** Island 8 — Kiln Room. Teaches: cracked clue numbers ("?" keeps its colour, hides its length). */
export const ISL08: LevelSpec[] = [
  {
    id: "kiln-teapot", title: "Teapot", palette: [TEAL], role: "teach", mechanics: ["cracked"], crack: ["r6.0"],
    aha: "A cracked '?' is measured by the walls around it. Row 7 shows one run of hidden length; the spout columns 1-2 (a 1 each) and the handle columns 10-11 (1 1 and 4) are used up by rows 3-6, so the run spans columns 3-9: 7. Row 3's 1 9 fills all eleven and columns 4-8 overlap to start you.",
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
  {
    id: "kiln-heart-mug", title: "Heart Mug", palette: [TEAL], role: "teach", mechanics: ["cracked"], crack: ["r8.0"],
    aha: "The mug's walls bound its cracked foot. Row 9's run is hidden, but columns 1 and 7 (6 each) run rows 3-8 and stop, and the handle columns 8-9 end at row 7, so the foot fits between the walls: columns 2-6, a 5. Rows 4 (2 1 4) and 7 (3 5) fill exactly as footholds.",
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
  {
    id: "kiln-tall-vase", title: "Banded Vase", palette: [TEAL, GOLD], role: "practise", mechanics: ["cracked", "color"], crack: ["r5.0"],
    aha: "A cracked width is read from the short edge columns. Rows 8 (3 5) and 9 (9) fill exactly, so columns 1, 2 and 9 (2, 3, 3) are used up below row 6 and row 6's teal ? can't reach them; columns 3 and 8 (5 each) climb from row 9 to row 5, so the ? spans columns 3-8: 6.",
    art: `
....bb...
....aa...
...aaaa..
...abba..
..aaaaaa.
..aaaaaa.
.aabaabaa
aaa.aaaaa
aaaaaaaaa
...bbbb..`,
  },
  {
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
  {
    id: "kiln-glazed-tile", title: "Flower Tile", palette: [TEAL, CORAL, CREAM], role: "twist", mechanics: ["cracked", "color"], crack: ["r4.2"],
    aha: "Twist: the cracked number is the flower's cream heart, and the columns size it. Row 5 reads coral 3, cream ?, coral 3, and only columns 5-8 hold cream; columns 5 and 8 hold a single cream between two coral 2s, and once those petals settle (rows 3-4 and 6-7) it lands in row 5, so the heart is columns 5-8: 4.",
    art: `
aaaaaaaaaaaa
a....bb....a
a..bbbbbb..a
a.bbbccbbb.a
abbbccccbbba
a.bbbccbbb.a
a..bbbbbb..a
a....bb....a
a....a.....a
aaaaaaaaaaaa`,
  },
  {
    id: "kiln-pitcher", title: "Dotted Pitcher", palette: [SKY, NIGHT], role: "boss", mechanics: ["cracked", "color"], crack: ["c10.0", "r7.0"],
    aha: "Columns 4-7 fit exactly. Column 11's navy ? is the handle: rows 3 and 6 turn navy, so one run joins them: 6; row 8's sky ? waits on column 1's last 1: 9.",
    art: `
.bbbbbbb...
bb.aaaaa...
..aaaaaabbb
..aaaaaa..b
.aaaaaaaa.b
.abaabaab.b
.aaaaaaaa.b
aaaaaaaaabb
.baabaab...
.aaaaaaa...
..aaaaa....
.bbbbbbb...`,
  },
  {
    id: "kiln-tea-bowl", title: "Tea Bowl", palette: [UMBER, TEAL], role: "breather", mechanics: ["cracked", "color"], crack: ["r9.0"],
    aha: "A calm one: the foot's hidden width is set by the bowl tapering above it. Rows 4 and 6 (11) and row 5's umber 1, teal 9, umber 1 fill at once; columns 5-7 end in umber 3s that reach row 10, while columns 4 and 8 end in a 2 held at rows 8-9, so the cracked foot is columns 5-7: 3.",
    art: `
...b...b...
..b...b....
...b...b...
aaaaaaaaaaa
abbbbbbbbba
aaaaaaaaaaa
.aabbbbbaa.
..aaaaaaa..
...aaaaa...
....aaa....`,
  },
  {
    id: "kiln-honey-jar", title: "Honey Jar", palette: [GOLD, UMBER, CORAL], role: "practise", mechanics: ["cracked", "color"], crack: ["r1.0"],
    aha: "Bound the ? from both sides: row 2's coral ? sits on row 3's full cloth, but columns 1 and 10's coral is just a 2 (rows 3-4), so it can't touch an edge: 8.",
    art: `
..bbbbb...
.cccccccc.
cccccccccc
c.cbbbbc.c
.aaaaaaaa.
aabbbb.baa
aab.bb.baa
aabbbbbbaa
.aaaaaaaa.
..aaaaaa..`,
  },
  {
    id: "kiln-brick-dome", title: "The Kiln", palette: [UMBER, CORAL, GOLD], role: "combine", mechanics: ["cracked", "color"], crack: ["c6.1", "r7.4"],
    aha: "Rows 10-14 fill and seat the flames; column 7's coral ? reaches the gold core in row 9 but not row 5's bricks: 3. Row 8's ? is squeezed by the flame: 2.",
    art: `
....aa.aaa....
...a.aaa.aa...
..aaa.aaa.aa..
.a.aaa.aaa.aa.
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
    id: "kiln-lucky-cat", title: "Lucky Cat", palette: [CREAM, CORAL, GOLD], role: "twist", mechanics: ["cracked", "color"], crack: ["r9.1", "c9.0"],
    aha: "Column 8's 1-4-1-4-1 fits exactly. Column 10's ? is the raised paw, rows 2-6: 5; row 10's cream ? runs from the gold coin to column 11's 3: 8.",
    art: `
..a....a...
..ba..ab.aa
..aaaaaa.aa
.aa.aa.a.aa
.aaaabbaaaa
..aaaaaa.a.
..bbbcbbbb.
...aacaaaa.
..aaaaaaaaa
cccaaaaaaaa
.ccaaa.aaaa
..bbbbbbbbb`,
  },
  {
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
  {
    id: "kiln-fire-masterwork", title: "Glazed Amphora", palette: [UMBER, CORAL, GOLD], role: "finale", mechanics: ["cracked", "color"], crack: ["r6.3", "c6.2"],
    aha: "Masterwork, two cracks on one hub: row 7's gold ? and column 7's gold ? cross at the centre of the glaze band. The umber rim, handles and foot settle first; the coral body then walls the band in. Row 7's ? is boxed by coral at columns 5 and 9 (3), and that hub cell starts column 7's gold run, which the coral in row 10 stops: 3 again, rows 7-9.",
    art: `
..aaaaaaaaa..
.aa.aaaaa.aa.
.a..bbbbb..a.
.a.bbbbbbb.a.
.aabbbbbbbbaa
..bbbbbbbbbb.
.bccbcccbccb.
.bbbbbcbbbbb.
.bbcbbcbbcbb.
..bbbbbbbbb..
...bbbbbbb...
....aaaaa....
...aaaaaaa...
aaaaaaaaaaa..`,
  },
];
