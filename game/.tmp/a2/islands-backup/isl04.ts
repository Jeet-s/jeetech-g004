import { INK, type LevelSpec } from "../types";

const MARBLE = "#C9B8A0";
const UMBER = "#8A5A3C";
const TEAL = "#2E8C8A";

/** Island 4 — Sculpture Hall. Shaped canvases: '~' cells lie outside the frame and act like walls. */
export const ISL04: LevelSpec[] = [
  {
    id: "hall-amphora", title: "Amphora", palette: [INK], role: "teach", mechanics: ["void", "fill"],
    aha: "Row 6's 10 fills it; column 3's 7 has only eight cells between its voids, so six of them are ink.",
    art: `
~~~####~~~
~~#.##.#~~
~.#.##.#.~
~.######.~
.########.
##########
.########.
~.######.~
~~..##..~~
~~~####~~~`,
  },
  {
    id: "hall-bronze-bell", title: "Bronze Bell", palette: [INK], role: "teach", mechanics: ["void", "exact-fit"],
    aha: "The frame leaves columns 3 and 6 just eight cells each, so their 8s fill completely — voids turn a loose clue into a certainty before anything else is inked.",
    art: `
~~~##~~~
~~#..#~~
~~####~~
~.####.~
~######~
.######.
.##.###.
########
~.####.~
~~~##~~~`,
  },
  {
    id: "marble-bust", title: "Marble Bust", palette: [INK], role: "practise", mechanics: ["void", "exact-fit"],
    aha: "Columns 4 to 7 run head, neck and plinth in one exact fit; the voided plinth corners leave rows 11 and 12 only four and six cells, so the base fills itself and the shoulders grow from it.",
    art: `
~~.####.~~
~.######.~
~##.##.##~
~########~
~.##..##.~
~.######.~
~..####..~
~...##...~
~.######.~
##########
~~~####~~~
~~######~~`,
  },
  {
    id: "ionic-capital", title: "Column Capital", palette: [INK], role: "practise", mechanics: ["void", "exact-fit", "x-marks"],
    aha: "Row 3's 11 and columns 3 and 9's \"3 7\" are exact fits; the voided shaft corners narrow the rows below.",
    art: `
~#########~
###########
####...####
#..#.#.#..#
#.##...##.#
####...####
~.#######.~
~.#.#.#.#.~
~.#.#.#.#.~
~.#.#.#.#.~
~#########~`,
  },
  {
    id: "laurel-wreath", title: "Laurel Wreath", palette: [INK], role: "twist", mechanics: ["void", "exact-fit"],
    aha: "Column 3's 9 fits exactly between two void corners; the void heart then splits row 3 in two halves.",
    art: `
~~~#...#~~~
~~##...##~~
~##.#~#.##~
.##.~~~.##.
###~~~~~###
.##~~~~~##.
###~~~~~###
.###~~~###.
~.###~###.~
~~#.###.#~~
~~~##.##~~~`,
  },
  {
    id: "horse-statue", title: "Horse Statue", palette: [INK], role: "boss", mechanics: ["void", "overlap", "reach"],
    aha: "Row 12 and column 6's \"4 7\" are exact; column 10's void top leaves eleven cells for its 8.",
    art: `
~~.#.#....~~
~.#####....~
.##.####....
###..####...
##....####..
....######..
...########.
...#######.#
...#.#.#.#.#
...#.#.#.#..
..########..
############`,
  },
  {
    id: "lidded-urn", title: "Lidded Urn", palette: [INK], role: "breather", mechanics: ["void", "fill"],
    aha: "Rows 6 and 7's \"2 4 2\" fill all ten cells exactly: both handles ink before the urn's body.",
    art: `
~~~.##.~~~
~~.####.~~
~.######.~
~..####..~
.########.
##.####.##
##.####.##
~.######.~
~~..##..~~
~~.####.~~`,
  },
  {
    id: "open-hand", title: "Open Hand", palette: [INK], role: "practise", mechanics: ["void", "overlap", "reach"],
    aha: "Row 6's \"2 1 1 1 2\" fits exactly; its gaps leave columns 5, 7 and 9 just six cells below for their 6s.",
    art: `
~~~..#..~~~
~~.#.#.#.~~
~..#.#.#.#~
...#.#.#.#.
#..#.#.#.#.
##.#.#.#.##
.##########
..#########
..########.
~..######.~
~~..#####~~
~~..#####~~`,
  },
  {
    id: "marble-knight", title: "Chess Knight", palette: [MARBLE, INK], role: "combine", mechanics: ["void", "color", "exact-fit", "overlap"],
    aha: "Voids cut column 11 into pockets of 2, 2, 1 and 1 cells: the mane's ink 2 2 1 1 fills each pocket.",
    art: `
~~~~a.a.~~~
~~~aaaa.b~~
~~aaaaaa.b~
~aabaaaaa.b
aaaaaaaaa.b
aaaaaaaaab~
a..aaaaaa.b
....aaaaa.b
~...aaaaab~
~..aaaaaa.b
~.aaaaaaaa~
~bbbbbbbbb~
bbbbbbbbbbb`,
  },
  {
    id: "temple-harp", title: "Harp", palette: [UMBER, "#E3A83B"], role: "twist", mechanics: ["void", "color", "exact-fit"],
    aha: "Column 2's 12 is free; row 3's void end leaves eleven cells, so its \"1 5 2\" has one cell of slack.",
    art: `
.aa......aa.
aaaaa..aaaaa
.a.aaaaa.aa~
.a.b.b.baa~~
.a.b.b.aa~~~
.a.b.baa~~~~
.a.b.aa~~~~~
.a.baa~~~~~~
.a.aa~~~~~~~
.aaa~~~~~~~~
.aa~~~~~~~~~
aaa~~~~~~~~~`,
  },
  {
    id: "bronze-mina", title: "Bronze Mina", palette: [UMBER, TEAL], role: "combine", mechanics: ["void", "color", "overlap", "reach"],
    aha: "Column 3's brown 5 and 4 leave row 6 as paper, as does column 8: row 6's 4 is boxed in and fills at once.",
    art: `
~.a....a.~~
~.aa..aa.~~
..aaaaaa..~
..abaaba...
..aaaaaa...
...aaaa....
..aaaaaa...
.aaaaaaaa..
.aaaaaaaa.a
.aaaaaaaaaa
bbbbbbbbbb.
bbbbbbbbbb~`,
  },
  {
    id: "winged-statue", title: "Masterwork: Winged Statue", palette: [MARBLE, UMBER], role: "finale", mechanics: ["void", "color", "overlap", "reach"],
    aha: "Rows 4 and 5 fill all fourteen cells exactly; then columns 7 and 8's \"11 3\" run from head to plinth.",
    art: `
~~~a.aaaa.a~~~
~~aa.aaaa.aa~~
~aa...aa...aa~
aaa.aaaaaa.aaa
aa.aaaaaaaa.aa
.aa.aaaaaa.aa.
..a.a.aa.a.a..
...a..aa..a...
.....aaaa.....
....aaaaaa....
...aaaaaaaa...
..bbbbbbbbbb..
...bbbbbbbb...
.bbbbbbbbbbbb.`,
  },
];
