import { INK, type LevelSpec } from "../types";

/** Island 1 — Sketchbook Shore. Ink only. Teaches: ink & full lines, X marks, exact fits, first overlaps. */
export const ISL01: LevelSpec[] = [
  {
    id: "teacup", title: "Teacup", palette: [INK], role: "teach", mechanics: ["fill", "x-marks"],
    aha: "Row 6's 8 is the saucer and columns 3 and 5 are full 6s. Column 1's 1 is then done, so its X's leave row 3's 5 1 exactly seven cells: cup and handle.",
    art: `
..#.#...
.######.
.#####.#
.######.
..###...
########`,
  },
  {
    id: "little-sailboat", title: "Little Sailboat", palette: [INK], role: "teach", mechanics: ["exact-fit", "x-marks", "fill"],
    aha: "No full line now: row 4's 4 3 is the only exact fit (4+1+3 = 8). It spends the lone 1s of columns 1 and 8, so their X's leave row 6's 6 exactly six cells; column 5's 3 3 (3+1+3 = 7) stands the mast, with the boom's gap at row 4.",
    art: `
....#...
...##...
..###.#.
####.###
....#...
.######.
..####..`,
  },
  {
    id: "jellyfish", title: "Jellyfish", palette: [INK], role: "teach", mechanics: ["overlap", "fill", "x-marks"],
    aha: "Overlap, and no line is full: rows 2 and 4 (5 in seven) always cover columns 3-5, and columns 2 and 6 (4 in seven) always cover row 4 — so row 4's 5 is the whole rim of the bell. Column 4's 2 3 must then hang its 3 from row 4 (rows 4-6, the middle tentacle), with its 2 above the spot.",
    art: `
..###..
.#####.
.##.##.
.#####.
.#.#.#.
#..#..#
#...#.#`,
  },
  {
    id: "lighthouse", title: "Lighthouse", palette: [INK], role: "practise", mechanics: ["x-marks", "exact-fit", "overlap"],
    aha: "No full line: column 6's 8 1 fits exactly (8+1+1 = 10) — the tower's right wall from the lamp to the rocks — and row 10's 4 4 (4+1+4 = 9) fits too: rocks either side of the landing. Column 4's 6 1 then overlaps beside the wall, and the gull (top left) and the light beam (row 3, right) are read last from rows 1-3.",
    art: `
#.#..#...
.#..###..
...#.#.##
..#####..
...#.#...
...###...
...#.#...
..#####..
.##.#.##.
####.####`,
  },
  {
    id: "starfish", title: "Starfish", palette: [INK], role: "practise", mechanics: ["overlap", "x-marks"],
    aha: "Practise: overlap on a lopsided starfish — the top arm leans, one arm waves and one leg is thin and bent, so no half can be copied from the other. Column 4's 7 in nine covers rows 3-7 and column 6's 6 covers rows 4-6 — the body either side of the eye — and row 6's 5 covers column 5. Row 5's 3 3 then X's the eye at column 5; the legs' rows (2 2, 1 2, 1 2) overlap nothing and are read from the columns last.",
    art: `
...##....
...###...
...###.##
##.#####.
.###.###.
..#####..
..##.##..
..#...##.
.#.....##`,
  },
  {
    id: "crab", title: "Beach Crab", palette: [INK], role: "boss", mechanics: ["fill", "overlap", "x-marks"],
    aha: "Boss, no full line: rows 6-7 overlap, column 8's 9 climbs into the big claw, and row 8's X's cap column 3's 6 at row 7 — X's chain up into each claw.",
    art: `
##......###
#.#....#..#
.##....##.#
..#.#.####.
..#######..
.#########.
##########.
.#.#####.##
#..#...#..#
.#..#..#.#.`,
  },
  {
    id: "sand-bucket", title: "Beach Umbrella", palette: [INK], role: "breather", mechanics: ["exact-fit", "fill", "overlap"],
    aha: "A calm breather with a new silhouette: column 6's 8 is the pole, tip to sand. Row 4's 2 4 2 fits exactly (2+1+4+1+2 = 10) — the scalloped edge of the canopy — and rows 3 and 8 (8 and 9 in ten) overlap almost everywhere; the bucket and the sandcastle on the beach close it. Four short passes.",
    art: `
....##....
..######..
.########.
##.####.##
.....#....
.....#..#.
.###.#.###
#########.`,
  },
  {
    id: "regatta", title: "Regatta", palette: [INK], role: "twist", mechanics: ["overlap", "x-marks"],
    aha: "Twist: split clues overlap too. Row 5's 4 4 \u2014 a lone 4 in ten shows nothing, but 4+1+4 is nine, one spare cell, so each sail is sure on three cells.",
    art: `
..#.......
.##...#...
.###..##..
####..###.
####..####
..#...#...
#####.###.
.###..##..
.#.#.#.#.#`,
  },
  {
    id: "anchor", title: "Anchor", palette: [INK], role: "practise", mechanics: ["overlap", "x-marks"],
    aha: "A quiet start — no line fits exactly. Column 5's 1 7 in ten has one spare cell, so the shaft's rows 4-9 are sure but neither end; row 5's 7 in nine (the stock) overlaps columns 3-7. Row 6's lone 1 is then the shaft cell, so its other eight are X. The ring hangs one column right of the shaft: column 7's 5 3 (one spare) is its thick right side.",
    art: `
....###..
...#..##.
...#..##.
....###..
.#######.
....#....
#...#...#
##..#.###
.##.#.##.
..#####..`,
  },
  {
    id: "turtle", title: "Sea Turtle", palette: [INK], role: "combine", mechanics: ["exact-fit", "overlap", "x-marks"],
    aha: "Two exact fits cross: row 4's 3 3 3 (3+1+3+1+3 = 11) spreads the front flippers either side of the neck, and column 6's 1 9 (1+1+9 = 11) runs from the head to the tail. Columns 3 and 9's 8 overlap the shell's sides (rows 4-8), and the X's from both fits ring the hex scute in rows 6-8.",
    art: `
....###....
....#.#....
##...#...##
###.###.###
..#######..
..##.#.##..
..#.###.#..
..##.#.##..
..#######..
..#.###.#..
.##..#..##.`,
  },
  {
    id: "sandcastle", title: "Castle and Parasol", palette: [INK], role: "twist", mechanics: ["x-marks", "fill", "overlap"],
    aha: "Row 8's 6 2 leaves one spare cell, so the sand doesn't settle column 4 by itself: its 6 still covers columns 2-6, so column 4's lone 1 is the sand and the rest of column 4 is X — a wall you deduce, not read. The castle's 3s fit left of it, the parasol right.",
    art: `
......#...
#.#..###..
###.####..
###...#...
#.#...#.##
###...#.##
###..###..
######.##.`,
  },
  {
    id: "whale", title: "Harbour Whale", palette: [INK], role: "finale", mechanics: ["overlap", "exact-fit", "x-marks"],
    aha: "Masterwork on island 1's tools. The sea fits exactly: row 10's 3 3 3 1 is 3+1+3+1+3+1+1 = 13, so the waves go in at once with paper at columns 4, 8 and 12. Row 7's 11 in thirteen overlaps columns 3-11, the long body. The wave X's split each column's last run from the whale above it: column 8's 4 1 must put its 1 in row 11 and its 4 in the body (rows 6-9). The spout, the gull and the raised tail are read last from rows 1-4.",
    art: `
.#.#......#.#
..#.#.#...###
..#..#.....#.
.####......#.
#######...##.
##.######.#..
###########..
#.#########..
.#########...
###.###.###.#
#..#...#...##`,
  },
];
