import { INK } from "../../src/game/types";
const P3 = ["#D9694F", "#E3A83B"];
const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC";
export const A = [
{ id: "sand-bucket", title: "Ice Lolly", palette: [INK], role: "breather", mechanics: ["fill", "exact-fit"], aha: "", art: `
.###...
####...
#.####.
##.####
#######
######.
...#...` },
{ id: "acorn", title: "Field Mouse", palette: [INK], role: "breather", mechanics: ["tally", "overlap"], tally: ["c6"], aha: "", art: `
.##.....
###....#
#.###..#
#####..#
.#######
..#.#..#
.##.##..` },
{ id: "red-squirrel", title: "Red Squirrel", palette: [INK], role: "twist", mechanics: ["tally", "exact-fit"], tally: ["r5"], aha: "", art: `
.#...#####.
##...#....#
#.##.#.##.#
####.#.#..#
.###.#...#.
#####.#####
.###.#.###.
.#.#.#.##..` },
{ id: "sunny-lemon", title: "Hot-Air Balloon", palette: P3, role: "breather", mechanics: ["color"], aha: "", art: `
..aaaa..
.aabbaa.
aabbbbaa
aabbbbaa
.aabbaa.
...a.a..
..a.ab..
..bbbb..` },
{ id: "lidded-urn", title: "Stone Lantern", palette: [INK], role: "breather", mechanics: ["void"], aha: "", art: `
....#....
..#####..
#########
..#####..
..#~###..
..#####..
...###...
..#####..
#########` },
{ id: "mosaic-cat-face", title: "Puppy", palette: [INK], role: "breather", mechanics: ["stamp"], aha: "", art: `
.@.......
.##.###..
.######..
#########
##.##.#.#
#######.#
.###.##.#
..#####..
...##....` },
{ id: "mosaic-compass-rose", title: "Compass Rose", palette: [NIGHT, GOLD], role: "combine", mechanics: ["stamp", "color"], aha: "", art: `
.....a......
..bbbabbb...
.bb..a..bb..
bb...a..Abb.
b...aaaa..b.
b...aaa...b.
b.aaababaaaa
b...aaa...b.
b..aaaa...b.
bba..a...bb.
.bb..a..bb..
..bbbbbbb...` },
{ id: "mosaic-dolphin-medallion", title: "Masterwork: Dolphin Medallion", palette: [SKY, NIGHT], role: "finale", mechanics: ["stamp", "color", "overlap"], aha: "", art: `
.....bbbbb.....
...bbbbbbbbb...
..bb.......bb..
.bb.....a...bb.
.ba....aaa...b.
bb...aaaaaa..bb
bb..aaaaaaaa.bb
bb,aaa...aaaabb
bb.aa....a.aabb
bbaa.....aaa,bb
.baa......aa.b.
.ba.a......a.b.
..bbb.bbb.bbb..
...bbbbbbbbb...
.....bbbbb.....` },
];
