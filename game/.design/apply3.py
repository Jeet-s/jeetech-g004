exec(open('.design/apply2.py').read().split('import json\nupd("lighthouse"')[0])
import json
upd("mosaic-seahorse", art="""
....##...
####.##..
...####..
...#####.
..####.##
..@####..
...####..
....##...
.##.#....
#.##.....""")
upd("toadstools", art="""
.###......
#####.....
..#....###
..#...####
..#.....#.
..#.###.#.
..#..#..#.
..#..#..#.
##########""", aha="Runs grow from the floor: row 9's 10 is the forest floor. Column 6's 4 must touch it, so it can only be rows 6-9 — the little toadstool in the middle — and rows 1-5 above it are paper. Column 9's 7 grows up the same way (rows 3-9) under the right-hand cap, and column 3's 9 is the tall one's stem.")
upd("sand-bucket", title="Beach Umbrella", art="""
....##....
..######..
.########.
##.####.##
.....#....
.....#..#.
.###.#.###
#########.""", aha="A calm breather with a new silhouette: column 6's 8 is the pole, tip to sand. Row 4's 2 4 2 fits exactly (2+1+4+1+2 = 10) — the scalloped edge of the canopy — and rows 3 and 8 (8 and 9 in ten) overlap almost everywhere; the bucket and the sandcastle on the beach close it. Four short passes.")
upd("kiln-heart-mug", title="Heart Mug", art="""
.#..#....
..#..#...
#######..
#.#.#.###
##.#.##.#
#.....#.#
##...##.#
###.####.
.######..""", crack=["r3.3"], aha="A heart is cut out of the mug, so no body row is full. Row 4's last number is cracked — the handle's top. Row 4's dotted band (1 1 1) ends at column 5; column 9's 4 climbs from row 7 to row 4 and column 7's 7 covers row 4 too, so the ? spans columns 7-9: 3. Without it the handle can't be placed — the crack costs two extra passes.")
upd("stargazer-hat", art="""
.......a.
......ab.
.....aa..
....abaa.
...aaaaa.
..aabaaa.
..bbbbbb.
aaa.aaaa.
aaaaaaaaa""", aha="Practise with colour: the gold band (row 7's 6) and the brim (row 9's 9) are the footholds. Each gold star on the cone splits its row and column into navy runs (row 4 reads navy 1, gold 1, navy 2; row 6 navy 2, gold 1, navy 3), so the cone is read star by star up to the curled tip.")
f,s,a,b=block("striped-awning")
t=s[a:b]
old=""".a..b..a..
.b......b.
.b......b.
.b.aaaa.b."""
new=""".a..b..a..
.b..aa..b.
.b.abba.b.
.b.aaaa.b."""
assert old in t
t=t.replace(old,new)
s=s[:a]+t+s[b:]; open(f,'w').write(s)
upd("striped-awning", aha="Row 2's red 3, cream 3, red 3, cream 1 fills all ten — colours touch. The stripes are not mirrored: row 3's right red stripe is cut short (red 1 after a gap), a partial row only the columns can place. Under the awning a crate of goods fills the stall: row 6's red 1, cream 2, red 1 touches on both sides, so its cream middle sits only where columns 5-6 allow; row 9's cream 10 is the counter and columns 2 and 9 stand the posts.")
