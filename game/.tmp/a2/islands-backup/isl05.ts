import { INK, type LevelSpec } from "../types";

const CORAL = "#D9694F", SAGE = "#8DB48E", UMBER = "#8A5A3C", GOLD = "#E3A83B";
const PLUM = "#8C6BB1", SKY = "#6FA8DC", NIGHT = "#2B3A67";

/** Island 5 — Mosaic Hall. Stamped tiles are given at the start: UPPERCASE / '@' = given colour, ',' = given paper. */
export const ISL05: LevelSpec[] = [
  {
    id: "mosaic-songbird", title: "Songbird", palette: [INK], role: "teach", mechanics: ["stamp", "overlap"],
    aha: "Column 3's 5 could slide down, but the stamped tile in row 1 pins it to rows 1-5.",
    art: `
..@##....
.##.##...
#######..
..######.
..#######
...###.##
....#...#
...###...`,
  },
  {
    id: "mosaic-snail", title: "Garden Snail", palette: [INK], role: "teach", mechanics: ["stamp", "exact-fit"],
    aha: "Row 1's 5 can't fit in the three cells left of the stamped gap, so it fills columns 5-9 exactly.",
    art: `
...,#####
#.#.#...#
.#.##.#.#
.#.#..#.#
##.#.##.#
##.#....#
###.####.
#########`,
  },
  {
    id: "mosaic-seahorse", title: "Seahorse", palette: [INK], role: "practise", mechanics: ["stamp", "x-marks", "overlap"],
    aha: "Column 1's lone 1 is the stamped snout tile, so its ten other cells are paper and row 3's 4 starts there.",
    art: `
...####...
..##.###..
@###.###..
.....###.#
....####.#
...####.##
...#####..
....####..
..#..###..
..##..#...
...####...`,
  },
  {
    id: "mosaic-pomegranate", title: "Pomegranate", palette: [CORAL, SAGE], role: "practise", mechanics: ["stamp", "color"],
    aha: "Row 4's stamped sage stem in column 10 is its lone 1b: the coral 7 lies left of it, the edge stays paper.",
    art: `
...a.a.a....
...aaaaa..bb
....aaa..bbb
..aaaaaaaB..
.aaaaaaaaaa.
aa.aaaaaaaaa
a.aaaaaaaaaa
a.aaaaaaaaaa
aaaaaaaaaaa.
.aaaaaaaaaa.
..aaaaaaaa..
....aaaa....`,
  },
  {
    id: "mosaic-elephant", title: "Elephant", palette: [INK], role: "twist", mechanics: ["stamp", "exact-fit"],
    aha: "Row 8's stamped gap in column 4 strands the 1 on the trunk; \"2 3 3\" fills the ten cells right of it.",
    art: `
...####.......
..######.####.
.#.###########
##.###########
#..###########
#..###########
#...##########
#..,##.###.###
.#..##.##..##.
....##.##..##.`,
  },
  {
    id: "mosaic-rooster", title: "Rooster", palette: [UMBER, CORAL], role: "boss", mechanics: ["stamp", "color", "deep-chain"],
    aha: "Column 5's coral comb touches the umber body with no gap: 2+7+1 plus one gap is eleven of twelve, so the body is pinned; the stamped tile in column 4 then anchors its 6 and the chain runs out to the tail.",
    art: `
..b.b.......
..bbb.....a.
.aaaa....aa.
aa.aa...aa.a
.aaAa..aa.aa
..baa.aa.aa.
..baaaaaaaa.
...aaaaaaa..
....aaaaa...
.....a..a...
.....a..a...
....aa.aa...`,
  },
  {
    id: "mosaic-cat-face", title: "Cat Face", palette: [INK], role: "breather", mechanics: ["stamp", "fill", "exact-fit"],
    aha: "A calm one: row 6's stamped nose gap leaves exactly three cells on its left — the first 3 fills them — and the full 8s of rows 3 and 5 frame the eyes.",
    art: `
#......#
##....##
########
#.####.#
########
###,.###
.######.
..####..`,
  },
  {
    id: "mosaic-toucan", title: "Toucan", palette: [INK, GOLD], role: "practise", mechanics: ["stamp", "color", "exact-fit"],
    aha: "Row 3's black 2 and 4 need seven cells before the gold 4, so the beak starts exactly at the stamped tile; column 1's 7 must cover its stamped tile in row 5, so the tail can't reach the bottom rows.",
    art: `
..aaaa.......
.aaaaaa......
aa.aaaaBbbb..
aaaaaaabbbbbb
A...aaabbbbbb
a...aaa.bbbbb
a...aaaa..bbb
a...aaaaa...B
aa..aaaaa....
.Aa.aaaaa....
..aaaaaaa....
...aaaaa.....
....aaa......
....aa.......`,
  },
  {
    id: "mosaic-compass-rose", title: "Compass Rose", palette: [NIGHT, GOLD], role: "combine", mechanics: ["stamp", "void", "color"],
    aha: "Row 4 has eleven cells between voids; its stamped tip in column 4 pins the first 1, so 2b fills columns 2-3.",
    art: `
~~~~..a..~~~~
~~.bbbabbb.~~
~.bb..a..bb.~
~bbA..a..abb~
.b..Aaaaa..b.
.b..aabaa..b.
aaaaababaaaaa
.b..aabaa..b.
.b..aaaaa..b.
~bba..a..abb~
~.bb..a..bb.~
~~.bbbabbb.~~
~~~~..a..~~~~`,
  },
  {
    id: "mosaic-octopus", title: "Octopus", palette: [PLUM, INK], role: "twist", mechanics: ["stamp", "color", "overlap"],
    aha: "Column 4's paper stamp on top leaves twelve cells for runs needing eleven: slack one, six cells fill.",
    art: `
...,aaaaa....
...aaaaaaa...
..aaaaaaaaa..
..aaaaaaaaa..
..abbaaabba..
..abbaaabba..
..aaaaaaaaa..
..aaaaaaaaa..
.aa.aa.aa.aa.
aa..a...a..aa
a..aa...aa..a
aa.a.....a.aa
.aaa.....aaa.`,
  },
  {
    id: "mosaic-black-swan", title: "Black Swan", palette: [INK, CORAL], role: "combine", mechanics: ["stamp", "color", "reach"],
    aha: "Row 2's coral beak touches the stamped head tile — different colours need no gap — so 2 then 3 from the left edge settles the whole row; the S of the neck then reaches down to the body.",
    art: `
..aaa......
bbAaa......
....aa.....
....aa.....
...aa......
...aa...a.a
...aa..aa.a
..aaa.aaaaa
aaaaaaaaaa.
.aaaaaaaa..`,
  },
  {
    id: "mosaic-dolphin-medallion", title: "Masterwork: Dolphin Medallion", palette: [SKY, NIGHT], role: "finale", mechanics: ["stamp", "color", "reach", "deep-chain"],
    aha: "Column 2's 9 must cover the stamped ring tile in row 4: rows 4-9 are ring, its bottom three paper.",
    art: `
.....bbbbb.....
...bbbbbbbbb...
..bb.......bb..
.Bb.....A...bb.
.b.....aa....b.
bb...aaaaaa..bb
bb..aaaaaaaa.bb
bb.aaa...aaaabb
bb.aa....a.aabb
bbaa.....aaa.bb
.baa......aa.b.
.ba.a......a.b.
..bbb.bbb.bbb..
...bbbbbbbbb...
.....bbbbb.....`,
  },
];
