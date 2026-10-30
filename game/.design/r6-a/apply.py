import re
def setlvl(path, lid, aha=None, art=None, role=None, mech=None):
    t = open(path).read()
    m = re.search(r'\{\s*id: "%s".*?\n  \},' % re.escape(lid), t, re.S)
    assert m, lid
    blk = m.group(0)
    if aha is not None:
        blk2 = re.sub(r'aha: ".*?",\n', lambda _: 'aha: ' + __import__('json').dumps(aha, ensure_ascii=False) + ',\n', blk, count=1, flags=re.S)
        assert blk2 != blk, lid+" aha"; blk = blk2
    if art is not None:
        blk2 = re.sub(r'art: `.*?`', lambda _: 'art: `\n' + art.strip('\n') + '`', blk, count=1, flags=re.S)
        assert blk2 != blk, lid+" art"; blk = blk2
    t = t[:m.start()] + blk + t[m.end():]
    open(path, 'w').write(t)

I1 = 'src/game/islands/isl01.ts'; I6 = 'src/game/islands/isl06.ts'
setlvl(I1, "lighthouse",
  aha="One X can turn a loose clue into an exact fit. Row 10's 3 5 fills all nine cells, and its paper at column 4 leaves column 4's 2 1 2 1 exactly rows 1-9 (2+1+1+1+2+1+1 = 9): lamp, lantern light and the tower's hollows. Row 7's 2 then ends at column 4, so the right wall has a window the left wall (column 3's 9) lacks, and the beam fans out to the right alone.",
  art="""
...#.....
..###..##
..#.#.###
.#####..#
..#.#....
..###....
..##.....
..#.#....
.#####...
###.#####""")
setlvl(I1, "sand-bucket",
  aha="The sun is read from the side, not the top. Column 9's 2 2 3 uses all nine cells (2+1+2+1+3), so its first 2 puts the sun in rows 1-2, and column 10's 2 1 2 squares it off. Row 2's 2 2 is the one line that waits for its crossings: one 2 is that sun, the other the canopy's crown at columns 5-6, where column 6's 8 begins.",
  art="""
........##
....##..##
..######..
.########.
##.####.##
.....#....
.....#..#.
.###.#.###
##########""")
setlvl(I1, "sandcastle",
  aha="A clue is used up once every run has its cell. Row 4's 1 1 1 1 already holds four separate inks from crossings: the walls in columns 1 and 5 (7 in eight), column 3's 4 1, and the parasol pole, column 9's full 8. Four 1s, four cells, so its other eight cells are X. Row 5's 5 1 empties the same way, and those X's cut the parasol's canopy off from the bucket and the sand.",
  art="""
.......###..
#.#.#.#####.
#####.#.#.#.
#.#.#...#...
#####...#...
##.##...#.##
##.##...#.##
############""")
setlvl(I1, "crab",
  aha="Boss: one exact fit hides in a crowd of overlaps, and it is the big claw. Row 7's 12 is full and rows 6 and 8 (10 in twelve) overlap columns 3-10, but only column 9's 3 6 uses all ten cells (3+1+6 = 10): claw in rows 1-3, paper at row 4, arm and body in rows 5-10. Row 3's 3 5 still covers columns 8-9, and the thin rows' X's pin the small claw and the eye stalks.")
setlvl(I1, "whale",
  aha="Finale: the waterline decides which number is the whale and which the wave. Row 10's 3 3 3 1 fills all 13 cells, with paper at columns 4, 8 and 12. In column 8 (4 1) that paper falls between the two runs, so the 1 is the wave in row 11 and the 4 is the body in rows 6-9; columns 4 and 12 drop their last 1 below the line the same way. Row 7's 11 overlaps the body; spout, gull and tail come last.")
setlvl(I6, "flowering-cactus",
  aha="One flower row needs a cross-check. Row 1 reads gold 1, gold 1: column 5 (gold 1, sage 6, umber 3) fills all ten cells, so one is the crown, but the other could be either arm's bloom. Column 2 settles it: its gold 1 needs a row that holds gold, and row 4's gold comes after its sage 5, too far right. So column 2's bloom is in row 1, and the right arm's flower drops to row 4.",
  art="""
.b..b....
.a.aaa...
.a.aaa...
.aaaaa.b.
...aaa.a.
...aaaaa.
...aaa...
ccccccccc
.ccccccc.
..ccccc..""")
setlvl(I6, "moth-orchid",
  aha="Start from the stamp. Rows 5 and 6 (plum 5, gold 2, plum 5 / plum 4, gold 4, plum 4) fill all twelve cells, so column 12's plum 2 is rows 5-6 and its row 4 is paper. The stamped plum in row 4, column 11 is then the left cell of row 4's last plum 2, columns 10-11: the right petal's top. The left petal, tip and all, is read by colour-cross from the full rows.")
