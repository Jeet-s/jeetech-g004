import sys; sys.path.insert(0, ".tmp/a2")
from rep import replace, obj
F = "src/game/islands/isl09.ts"
replace(F, "night-balloon", obj("night-balloon", "Crescent Moon", "[INK]", "teach", ["deep-chain", "overlap"],
 "Only column 2's 6 overlaps at the start; it frees row 5, row 5 frees column 7, and column 7 frees rows 6 and 8 — every answer is the next line's clue, a chain that walks round the moon and both stars.",
"""
..###...
.##...#.
##...###
##....#.
##......
##....#.
.##..###
..###.#."""))
replace(F, "ringed-planet", obj("ringed-planet", "Ringed Planet", "[INK]", "boss", ["deep-chain", "overlap"],
 "Columns 7-10 read planet-ring-planet: their overlaps pin the top and bottom caps long before the ring, which then chains out to both tips one pass at a time.",
"""
..#............
.###..#####....
..#..#######...
....#########..
...########..##
...#####...##..
...###..###..#.
...#..###..###.
....##...#####.
..##..#######..
###..#######...
......#####...."""))
replace(F, "moon-rover", obj("moon-rover", "Moon Rover", "[INK]", "breather", ["deep-chain", "exact-fit"],
 "Full row 6 and row 4's 10 come free; column 4's lone 3 then empties the rest of its column, and row 5's six 1s comb into the solar panel — the drill and wheels follow.",
"""
##.......###
#.#.......#.
.#........#.
.##########.
.#.#.#.#.#.#
############
.#..#.##..#.
###.#..####.
#.#.#..#.#.#
###.#..####.
.....##....."""))
replace(F, "astronaut-helmet", obj("astronaut-helmet", "Astronaut", "[INK]", "practise", ["deep-chain", "exact-fit"],
 "Rows 12 and 13 — the suit — fit all thirteen cells exactly; columns 2 and 12's 7 3 then climb the helmet's sides, row 10's 9 seals the neck ring, and the visor's glint closes last.",
"""
....#####....
..#########..
.###.....###.
.##.##....##.
##.##......##
##.#.......##
##.........##
.##.......##.
.###.....###.
..#########..
.###.###.###.
##.#.#.#.#.##
##.#.###.#.##"""))
