import sys
sys.path.insert(0, '.design/r4-b4')
from apply import set_field, remove_field
A9 = {
"brass-telescope": "A colour whose count is used up cannot appear again in that line. Column 3 counts navy 4, gold 1, in no order: rows 4-6 (navy 9, the lights, navy 9) give it two navy and its one gold light, so gold is spent and rows 1-3 there are X — the star cannot sit above the saucer there. The last navy is the leg's bend in row 8.",
"weather-vane": "When only that many cells are left, a count fills them all. Row 6 counts navy 6, gold 1: column 5, the pole (exact in nine), puts the gold hub there, and columns 1 and 9 hold no navy at all. That leaves seven cells for six navy and the hub, so the whole crossbar is ink.",
"stargazer-hat": "Each column's single gold is already spent on the brim. Columns 5 and 6 count navy 6, gold 1 and navy 7, gold 1; row 9's full gold brim takes that gold, so neither column's top cell can be a star. Row 1 (gold 1 1, navy 1, gold 1) must then put its first two stars in columns 1 and 3.",
"tailed-comet": "Two spent counts squeeze the gap into a third line. Rows 2 and 6 each count sky 3, gold 5; columns 2-4 (sky 1 1 1 each) give both rows their three sky cells, so sky is used up and column 5 is X there. Column 5's sky 1 1 must then sit in rows 3 and 5, leaving the gap in row 4.",
"lunar-lander": "A count can open a row before any run is placed. Row 3 counts navy 2, sky 3, and only columns 5, 6 and 7 carry any sky at all, so those three cells are the window at once. Row 1 (gold 1, navy 1) closes later: column 2's star and column 6's antenna tip spend both counts and its other nine cells are X.",
"ringed-planet": "Boss: three tallies interlock — one placed in full closes its column, one half-found points to its other end. Column 9 counts sky 2, gold 2, coral 1, stacked in rows 3-7 with no gaps, so rows 1, 2, 8 and 9 there are X. Row 5 counts gold 2, coral 9: column 1 gives one ring tip and column 12 leaves a gap, so the second gold is the far tip in column 13.",
"moon-rover": "One count, spent at once, empties a column. Column 9 shows only navy 2, sky 1, and the body (row 4), the window (row 5) and the chassis (row 6) use them all, so the rest of column 9 is X — the star in row 1 cannot sit there and drops into column 8 (gold 1 on top). The full chassis and the wheel overlaps do the rest.",
"astronaut-helmet": "Spend the easy colours first, then count what is left of the visor. Row 4 counts navy 2, sky 5, gold 1: the helmet walls (columns 2 and 11) spend the navy and column 9's glint is the gold. Four visor cells are known, and column 3 holds no sky at all, so the fifth sky cell must be column 4.",
"brass-orrery": "The stamp tells two identical moons apart. Without it the coral moons in rows 1-2 could swap corners; with the stamped moon as column 4's coral, the arm (row 8) as its navy and the base (row 12) as its gold, all three counts are spent, so rows 2-4 there are X and the sun stops at column 5. Column 10 (navy 1, gold 1) closes the right edge the same way.",
"star-rocket": "A tally's gold need not be the gold you expect. Column 1 counts coral 2, gold 1, and row 3 (gold 1, navy 5) puts a star in column 1, so with the fins' coral the count is spent and the flame cannot spread there (rows 10-13 X). Columns 3 and 7 count navy 6, gold 1: the hull and row 11's flame spend them.",
"obs-satellite": "The same count, read in two columns, gives opposite answers. Row 1 is smudged; columns 2 and 14 both count gold 2, sky 3. In column 14 rows 2 and 12 already hold both golds, so its row-1 cell is X; in column 2 only row 12 holds gold and the panel takes the sky, so the second gold must be the row-1 star.",
"night-observatory": "Finale: a smudged row is read through the counts that cross it. Column 6 (navy 4, coral 4) is spent by dome and tower, so its row-1 cell is X; row 2's gold 2 puts the telescope tip in columns 12-13, and column 12's gold 5 then has one gold left — the smudged row's star. Row 6 (navy 7, gold 1) closes the dome once the slit's gold is found.",
}
A10 = {
"exhibit-snow-globe": "Voided corners shrink rows into exact fits. Rows 1, 9 and 10 fit their clues exactly once the void is cut away, and smudged column 6, the trunk, is then painted entirely by its rows.",
"exhibit-pocket-watch": "Each cracked hand must run through the stamped pivot. Row 7's ? and column 6's ? both contain the stamp at row 7, column 6, and the gold rim caps their far ends, so the minute hand is 5 and the hour hand 4.",
"exhibit-flower-vase": "A cracked run with no gap is measured from its two ends. Column 6's teal ? starts right under its gold bloom and runs unbroken into the vase: 8. Column 3's gold 3, teal 2 1 4 fills its twelve cells exactly and anchors the stems.",
"exhibit-carousel-horse": "A cracked pole is bounded by what it touches at each end. Column 6's gold ? starts right under the belly's sky 1 in row 8 and must reach the gold floor in row 12, so it is rows 9-12: 4. Rows 1 and 12 (gold 11) and row 8's sky 8, coral 1 are the first footholds.",
"exhibit-penguin": "Twist: where two smudged lines cross, only the stamp speaks. Row 8 and column 7 are both smudged and their crossing is a stamped cream belly cell, the one cell no readable line passes through. Row 7 (navy 3, cream 4, navy 1, navy 1) and column 4 fit exactly; the two smudged lines are then painted from their crossings.",
"exhibit-peacock": "Boss: an eye is navy only where its row and its column both hold navy. Rows 4 and 5 fill all fifteen cells in three colours, and smudged column 3 is then read entirely from its rows.",
"exhibit-mina-portrait": "The beret's notch is a hidden gap, and the stalk's column finds it. Row 3's teal 5 2 in nine has one spare cell; column 6 (teal 3, umber 1, peach 4, umber 1) fits exactly, so its teal runs from the stalk through the band, the 5 must reach column 6, the notch is column 7 and the 2 ends at the edge. Rows 5-7 fit exactly and column 5 puts the gap in the smile.",
"exhibit-old-painter": "Where a tally row meets a smudged column, only counting reaches the cell. Row 4 counts navy 3, peach 6, cream 2; the other columns settle it except columns 1, 2 and 10, leaving it one peach and two creams short. Columns 1 and 10 (cream 3, navy 2) cannot be peach, so column 2 is the peach and both ends are cream.",
"exhibit-monarch": "The wings no longer mirror, so each line must be read on its own; the cracked gold patch is sized by its columns. Row 4's gold ? is the right forewing's patch: columns 9 and 10 each hold a gold 2 that starts in row 3, so both reach row 4, and the coral in column 8 and the navy rim in column 11 stop it at 2. Elsewhere a cell is coral or gold only where its row and column agree.",
"exhibit-alpine-lake": "Twist: six exact rows do the work of a smudged column. Rows 5-10 all fill exactly (mountain foot, pines, shore, mirrored peaks), so smudged column 9 paints itself; column 12's cracked sky ? is then what is left of the lake: rows 10-12, 3.",
"grand-paint-palette": "A void steals a cell from a column's count. Columns 4 and 6, beside the cut-out thumb hole, show only counts. Column 6 says umber 3, coral 2: rim (rows 1, 10), ring (row 6) and the coral blob (rows 3-4) meet it, so rows 2, 5 and 7-9 are X. Column 4 says umber 4 and the void takes row 6, so after rows 2 and 10 only rows 5 and 7 can be umber: both are ink.",
"exhibit-grand-masterwork": "Finale: one count is met at once, the other leaves no choice. Column 16's tally 2 is met by the tray (row 12) and the stamped foot, so the rest is X, its smudged row-13 cell too. Column 15's tally 12 has exactly twelve cells once rows 1 and 14 are clear, so all are ink — that ends row 2's cracked bar at column 15 (? = 14).",
}
for path, D in [("src/game/islands/isl09.ts", A9), ("src/game/islands/isl10.ts", A10)]:
    s = open(path).read()
    for k, v in D.items():
        assert len(v) <= 440, (k, len(v))
        s = set_field(s, k, "aha", v)
    open(path, "w").write(s)
# boards
s = open("src/game/islands/isl09.ts").read()
s = set_field(s, "brass-telescope", "art", """
.b.........
....bbb....
...bb.bb...
.aaaaaaaaa.
aabaabaabaa
.aaaaaaaaa.
...a...a...
..a.....a..
.aa.....aa.""")
s = s.replace('id: "brass-telescope", title: "Brass Telescope", palette: [GOLD, NIGHT], role: "teach", mechanics: ["color-tally"], tally: ["c3"]',
              'id: "brass-telescope", title: "Flying Saucer", palette: [NIGHT, GOLD], role: "teach", mechanics: ["color-tally"], tally: ["c2"]')
s = set_field(s, "moon-rover", "art", """
.bbbb..c....
.bbbb....cc.
...a.....a..
..aaaaaaaaa.
.aabbaaabbaa
aaaaaaaaaaaa
ccc.ccc..ccc
c.c.c.c..c.c
ccc.ccc..ccc""")
s = s.replace('id: "moon-rover", title: "Moon Rover", palette: [NIGHT, SKY, GOLD], role: "breather", mechanics: ["color", "exact-fit"],',
              'id: "moon-rover", title: "Moon Rover", palette: [NIGHT, SKY, GOLD], role: "breather", mechanics: ["color-tally"], tally: ["c8"],')
open("src/game/islands/isl09.ts", "w").write(s)
s = open("src/game/islands/isl10.ts").read()
s = set_field(s, "exhibit-mina-portrait", "art", """
.....c...
..ccccc..
.ccccc.cc
.aaaaaaa.
abbbbbbba
ab.bbb.ba
abbbbbbba
.abb.bba.
..aaaaa..""")
s = set_field(s, "exhibit-monarch", "art", """
bbb.b.b....
bacabb..bbb
baaabb.bccb
bacabbbaccb
.bbabbbaab.
.baabbbaab.
..bcbbbacab
...bbb.baab
........bb.""")
s = s.replace('crack: ["r8.1"]', 'crack: ["r3.6"]')
open("src/game/islands/isl10.ts", "w").write(s)
s = open("src/game/islands/isl07.ts").read()
s = set_field(s, "koi-fish", "aha", "A smudged row can be painted entirely from the lines that cross it. Row 5 is smudged, but row 4's gold 8, coral 2, gold 1, coral 2 fills all thirteen cells, and columns 4 and 7 then run through the hidden row and paint the koi's spots.")
open("src/game/islands/isl07.ts", "w").write(s)
print("done")
