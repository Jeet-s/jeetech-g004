import { INK, type LevelSpec } from "../types";

/** Island 2 — Inkwell Woods. Ink only. Teaches: overlap (long runs cover their middle), then reach (edge anchoring). */
export const ISL02: LevelSpec[] = [
  {
    id: "spotted-mushroom", title: "Spotted Mushroom", palette: [INK], role: "teach", mechanics: ["overlap", "x-marks"],
    aha: "Count the slack: row 3's \"4 2\" needs seven of eight cells, so each run can shift by one — the 4 is sure on three cells, the 2 on one. Any run longer than the slack overlaps, even in a line with several runs.",
    art: `
..####..
.####.#.
####.##.
##.#####
.######.
...##...
...##...
..####..`,
  },
  {
    id: "sleeping-fox", title: "Fox Face", palette: [INK], role: "teach", mechanics: ["reach", "exact-fit"],
    aha: "Reach: once rows 3-5 ink the cheek cells of column 1, its 5 must cover them — it can't reach rows 8-9, so those are paper. A run can only live where it can reach a known cell.",
    art: `
#.......#
##.....##
#.#####.#
#########
##.###.##
.#######.
..#####..
...###...
....#....`,
  },
  {
    id: "barn-owl", title: "Barn Owl", palette: [INK], role: "practise", mechanics: ["overlap", "x-marks"],
    aha: "Row 4's \"1 1 2 1 1\" fits exactly; column 2's \"3 5\" and row 2's 8 then overlap to ring the owl's eyes.",
    art: `
##......##
.########.
##..##..##
#.#.##.#.#
##..##..##
.###..###.
.##.##.##.
.#.####.#.
.########.
..#.##.#..`,
  },
  {
    id: "hedgehog", title: "Hedgehog", palette: [INK], role: "practise", mechanics: ["reach", "exact-fit"],
    aha: "The 10 belly row inks the bottom of column 10's lone 2: the 2 must cover that cell, so the seven cells above it are out of reach and paper — the snout has only two places to sit.",
    art: `
..#.#.#...
.#.#.#.#..
#.#####.#.
.######.#.
#########.
.#########
##########
.########.
..#....#..
..##...##.`,
  },
  {
    id: "pine-tree", title: "Pine Tree", palette: [INK], role: "twist", mechanics: ["reach", "overlap"],
    aha: "Column 5's 10 is the trunk; row 2's 3 must cover it, so the two cells each side it can't reach are paper.",
    art: `
....#....
...###...
..#.#.#..
.#.###.#.
...###...
..#####..
.#.###.#.
#.#####.#
.#######.
....#....`,
  },
  {
    id: "forest-deer", title: "Forest Deer", palette: [INK], role: "boss", mechanics: ["reach", "overlap", "exact-fit"],
    aha: "Row 6's \"3 4 3\" fills all twelve exactly; the 7s of columns 6 and 7 then drop from brow to nose.",
    art: `
..#.#..#.#..
#.#.#..#.#.#
.###....###.
...##..##...
....#..#....
###.####.###
.###.##.###.
....####....
...#.##.#...
...######...
....####....
.....##.....`,
  },
  {
    id: "acorn", title: "Acorn", palette: [INK], role: "breather", mechanics: ["overlap", "fill"],
    aha: "A calm one: the 9-wide cap and its \"1 1 1 1 1\" texture row fit exactly; column 5's 9 drops the stem.",
    art: `
...##....
....#....
.#######.
#########
#.#.#.#.#
.#######.
.#######.
..#####..
...###...`,
  },
  {
    id: "meadow-rabbit", title: "Meadow Rabbit", palette: [INK], role: "practise", mechanics: ["reach", "exact-fit"],
    aha: "Row 11's grass 1s fit exactly; each tuft anchors its column to the floor, so column 5's 8 grows straight up.",
    art: `
..##.##....
..##.##....
..##.##....
.######....
##.####....
######.....
.#####.###.
..########.
..#########
...######..
#.#.#.#.#.#`,
  },
  {
    id: "wandering-bear", title: "Wandering Bear", palette: [INK], role: "combine", mechanics: ["reach", "exact-fit", "x-marks"],
    aha: "Row 4's \"9 2\" fills twelve exactly; the snout pins column 12's 2, so its other cells are out of reach.",
    art: `
..####......
.######..#..
#########.#.
#########.##
############
#########...
.########...
.##..#.##...
.##..#.##...
###.##.###..`,
  },
  {
    id: "red-squirrel", title: "Red Squirrel", palette: [INK], role: "twist", mechanics: ["reach", "overlap"],
    aha: "Row 12's \"4 4\" inks the floor under both feet, so columns 4 and 9 anchor their 6s there and grow up.",
    art: `
..####.....
.######....
###..###...
##....##.#.
##.....####
###....#.##
.###..#####
..###.####.
...######..
...#######.
..########.
.####.####.`,
  },
  {
    id: "fern-frond", title: "Fern Frond", palette: [INK], role: "combine", mechanics: ["reach", "overlap", "exact-fit"],
    aha: "Column 6's 11 stands the stem in twelve cells; each leaflet row's middle 1 must be that stem cell, so the runs either side are boxed into their own half — and column 4's 8 overlaps to pin the left fronds.",
    art: `
.....#.....
....###....
..##.#.#...
...#.#.##..
.###.#.#...
..##.#.###.
####.#.##..
.###.#.####
..##.#.###.
...#.#..##.
.....##....
......##...`,
  },
  {
    id: "inkwell-pond", title: "Inkwell Pond", palette: [INK], role: "finale", mechanics: ["reach", "overlap", "x-marks"],
    aha: "Masterwork: column 3's 11 is the heron's neck and leg; the ripple row's \"1 1 1 2 2\" then anchors the pond.",
    art: `
.##......#..
###...#.###.
..#...#.###.
..#..#..###.
.##..#...#.#
####.#...#.#
#####.#..#.#
.####...#..#
..#....###.#
..#...#####.
#.#.#.##.##.
.#.#.#..#.#.`,
  },
];
