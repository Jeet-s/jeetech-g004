import { INK, type LevelSpec } from "../types";

/** Island 1 — Sketchbook Shore. Ink only. Teaches: ink & full lines, X marks, exact fits, first overlaps. */
export const ISL01: LevelSpec[] = [
  {
    id: "teacup", title: "Teacup", palette: [INK], role: "teach", mechanics: ["fill", "x-marks"],
    aha: "A full line hands you its cells for free. Row 6's 8 is the saucer and columns 3 and 5 are full 6s. Column 1's 1 is then done, so its X's leave row 3's 5 1 exactly seven cells: cup and handle.",
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
    aha: "With no full line, look for the exact fit. Row 4's 4 3 is 4+1+3 = 8, the whole row. It spends the lone 1s of columns 1 and 8, so their X's leave row 6's 6 exactly six cells; column 5's 3 3 (3+1+3 = 7) stands the mast, with the boom's gap at row 4.",
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
    aha: "Overlap: a long run in a short line always covers its middle. Rows 2 and 4 (5 in seven) cover columns 3-5, and columns 2 and 6 (4 in seven) cover row 4, so row 4's 5 is the rim of the bell. Column 4's 2 3 then hangs its 3 from row 4 (rows 4-6, the middle tentacle).",
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
    id: "lighthouse", title: "Lighthouse", palette: [INK], role: "practise", mechanics: ["exact-fit", "x-marks", "overlap"],
    aha: "One X can turn a loose clue into an exact fit. Row 10's 3 5 fills all nine cells, and its paper at column 4 leaves column 4's 2 1 2 1 exactly rows 1-9 (2+1+1+1+2+1+1 = 9): lamp, lantern light and the tower's hollows. Row 7's 2 then ends at column 4, so the right wall has a window the left wall (column 3's 9) lacks, and the beam fans out to the right alone.",
    art: `
...#.....
..###..##
..#.#.###
.#####..#
..#.#....
..###....
..##.....
..#.#....
.#####...
###.#####`,
  },
  {
    id: "starfish", title: "Seahorse", palette: [INK], role: "practise", mechanics: ["overlap", "fill", "x-marks"],
    aha: "Split clues overlap too: count the gaps as cells. Columns 5 (2 6 1) and 7 (3 7) each need 11 of twelve cells, one spare, so every part shows at once: column 7's rows 2-3 and 6-11, column 5's rows 2 and 5-9. Column 6's 12 is the spine between them, and the snout and tail curl are read from the rows.",
    art: `
....###.
...#####
####.##.
....##..
...#####
..######
..######
...#####
....####
.....##.
..#..##.
..####..`,
  },
  {
    id: "crab", title: "Fiddler Crab", palette: [INK], role: "boss", mechanics: ["fill", "x-marks", "exact-fit", "overlap"],
    aha: "Boss: one exact fit hides in a crowd of overlaps, and it is the big claw. Row 7's 12 is full and rows 6 and 8 (10 in twelve) overlap columns 3-10, but only column 9's 3 6 uses all ten cells (3+1+6 = 10): claw in rows 1-3, paper at row 4, arm and body in rows 5-10. Row 3's 3 5 still covers columns 8-9, and the thin rows' X's pin the small claw and the eye stalks.",
    art: `
........###.
.#.#...##..#
.###...#####
..#.#.#..##.
..#.#.#.##..
.##########.
############
.##########.
.#.#....#.#.
#..#....#..#`,
  },
  {
    id: "sand-bucket", title: "Ice Lolly", palette: [INK], role: "breather", mechanics: ["fill", "exact-fit"],
    aha: "A breather built from full lines: column 4's 8 is the stick running right up through the ice, row 5's 7 fills whole, and row 4's 1 5 fits seven exactly (1+1+5), so the shine's paper in column 2 is placed. Column 2's 2 2 then carries the shine up into row 3, and the bite out of the top right is simply where rows 1-3 stop short.",
    art: `
.###...
######.
#.####.
#.#####
#######
.#####.
...#...
...#...`,
  },
  {
    id: "regatta", title: "Regatta", palette: [INK], role: "twist", mechanics: ["overlap", "x-marks"],
    aha: "Twist: a gap can be wider than one cell. Row 5's 4 4 has one spare cell, and you expect it at an end. But both masts reach row 5: column 1's 7 in nine covers rows 3-7, and column 10's 6 1 (one spare) covers rows 2-6. Both sails touch the edges, so the spare falls between them: open water at columns 5 and 6.",
    art: `
#.........
##.......#
###.....##
####...###
####..####
#........#
#####..###
.###...##.
.#.#.#.#.#`,
  },
  {
    id: "anchor", title: "Anchor", palette: [INK], role: "practise", mechanics: ["overlap", "x-marks"],
    aha: "Spare cells find the ring. Row 6's stock (7 in nine, two spare) covers columns 3-7, and column 5's 1 7 (two spare) covers the shaft's rows 5-9. Columns 4 and 6 read 5 1. Their 5 overlaps only row 5 at first, but it must hold the stock cell at row 6 and cannot reach row 7, whose only ink is the shaft. So it runs rows 2-6: the two sides of the ring, which meet at row 1 in column 5's 1.",
    art: `
....#....
...#.#...
...#.#...
...#.#...
...###...
.#######.
....#....
#...#...#
##..#..##
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
    id: "sandcastle", title: "Castle and Parasol", palette: [INK], role: "practise", mechanics: ["overlap", "x-marks"],
    aha: "A clue is used up once every run has its cell. Row 4's 1 1 1 1 already holds four separate inks from crossings: the walls in columns 1 and 5 (7 in eight), column 3's 4 1, and the parasol pole, column 9's full 8. Four 1s, four cells, so its other eight cells are X. Row 5's 5 1 empties the same way, and those X's cut the parasol's canopy off from the bucket and the sand.",
    art: `
.......###..
#.#.#.#####.
#####.#.#.#.
#.#.#...#...
#####...#...
##.##...#.##
##.##...#.##
############`,
  },
  {
    id: "whale", title: "Harbour Whale", palette: [INK], role: "finale", mechanics: ["overlap", "exact-fit", "x-marks"],
    aha: "Finale: the waterline decides which number is the whale and which the wave. Row 10's 3 3 3 1 fills all 13 cells, with paper at columns 4, 8 and 12. In column 8 (4 1) that paper falls between the two runs, so the 1 is the wave in row 11 and the 4 is the body in rows 6-9; columns 4 and 12 drop their last 1 below the line the same way. Row 7's 11 overlaps the body; spout, gull and tail come last.",
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
