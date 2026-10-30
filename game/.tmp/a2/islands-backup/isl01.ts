import { INK, type LevelSpec } from "../types";

/** Island 1 — Sketchbook Shore. Ink only. Teaches: ink & full lines, X marks, exact fits, first overlaps. */
export const ISL01: LevelSpec[] = [
  {
    id: "teacup", title: "Teacup", palette: [INK], role: "teach", mechanics: ["fill"],
    aha: "A 5 in a 5-wide row fills it completely — two full rows and two full columns ink themselves.",
    art: `
####.
#####
#####
####.
.##..`,
  },
  {
    id: "fish", title: "Little Fish", palette: [INK], role: "teach", mechanics: ["fill", "x-marks"],
    aha: "Row 2's \"1 3 1\" fits seven exactly, so its gaps are certain X's — the eye and the notch where the tail meets the body; once a line shows all its ink, the rest of it is X.",
    art: `
.###..#
#.###.#
######.
#####.#
.###..#`,
  },
  {
    id: "cottage", title: "Cottage", palette: [INK], role: "teach", mechanics: ["fill", "x-marks", "exact-fit"],
    aha: "\"2 2\" in five cells fits one way only — two, gap, two — so the door rows need no other line.",
    art: `
..#..
.###.
#####
##.##
##.##`,
  },
  {
    id: "sailboat", title: "Sailboat", palette: [INK], role: "practise", mechanics: ["fill", "x-marks", "exact-fit"],
    aha: "Row 4's \"4 2\" plus its gap is exactly 7 wide: sails and mast gap are certain before the hull.",
    art: `
...#...
..##.#.
.###.##
####.##
...#...
#######
.#####.`,
  },
  {
    id: "scallop", title: "Scallop Shell", palette: [INK], role: "practise", mechanics: ["exact-fit", "x-marks"],
    aha: "\"1 1 1 1\" in seven cells is an exact fit — the shell's ribs are a stripe you can ink before anything else.",
    art: `
..###..
.#####.
#.#.#.#
#.#.#.#
.#.#.#.
..###..
...#...`,
  },
  {
    id: "crab", title: "Beach Crab", palette: [INK], role: "boss", mechanics: ["exact-fit", "overlap", "x-marks"],
    aha: "The full 8 body row first; the 6 above overlaps on four middle cells, and the claws close in from the edges.",
    art: `
#.#..#.#
.##..##.
..#..#..
..####..
.######.
########
.#.##.#.
#..##..#`,
  },
  {
    id: "sand-bucket", title: "Sand Bucket", palette: [INK], role: "breather", mechanics: ["overlap", "fill"],
    aha: "Each 5 in a 7-wide row covers the middle three wherever it slides — the bucket appears before its edges.",
    art: `
.#####.
#.....#
#######
.#####.
.#####.
.#####.
..###..`,
  },
  {
    id: "lighthouse", title: "Lighthouse", palette: [INK], role: "twist", mechanics: ["fill", "overlap", "x-marks"],
    aha: "Row 2's beams \"2 1 1 2\" fit exactly in nine; columns 4 and 6 are full 9s that stand the tower up.",
    art: `
...###...
##.#.#.##
..#####..
...#.#...
...###...
...#.#...
..#####..
..##.##..
#########`,
  },
  {
    id: "anchor", title: "Anchor", palette: [INK], role: "practise", mechanics: ["overlap", "exact-fit", "x-marks"],
    aha: "Row 7's \"2 2 2\" is an exact fit that hooks both arms; the shaft columns' \"1 6\" then read top to bottom.",
    art: `
...##...
..#..#..
..####..
.######.
#..##..#
#..##..#
##.##.##
.######.`,
  },
  {
    id: "turtle", title: "Sea Turtle", palette: [INK], role: "combine", mechanics: ["overlap", "exact-fit", "x-marks"],
    aha: "Flipper rows \"1 5 1\" fit exactly in nine; the shell's \"2 1 2\" rows then follow from the columns.",
    art: `
...###...
#.#####.#
.#######.
.##.#.##.
.#######.
.##.#.##.
.#######.
#.#####.#
....#....`,
  },
  {
    id: "sandcastle", title: "Sandcastle", palette: [INK], role: "practise", mechanics: ["overlap", "x-marks", "fill"],
    aha: "Row 5's \"1 6 1\" fits ten exactly, setting both tower windows; column 5's \"6 1\" raises the flagpole.",
    art: `
....##....
....#.....
#.#.#..#.#
###.#..###
#.######.#
##########
####..####
##########`,
  },
  {
    id: "whale", title: "Harbour Whale", palette: [INK], role: "finale", mechanics: ["overlap", "exact-fit", "x-marks"],
    aha: "Masterwork: tail row 6's \"7 2\" fits exactly, row 9's 8 overlaps, then column 10's \"3 1\" lifts the tail.",
    art: `
..#.#.....
.#.#.#....
...#......
...#.....#
.#####..##
#######.##
#.#######.
##########
.########.
...#..#...`,
  },
];
