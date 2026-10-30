import re, json
W='src/game/islands/'
def rep(fn, id, title=None, aha=None, art=None, crack=None):
    s=open(W+fn).read()
    i=s.index('id: "%s"'%id)
    j=s.index('`,', s.index('art: `', i))+2
    blk=s[i:j]
    if title: blk=re.sub(r'title: "[^"]*"', 'title: "%s"'%title, blk, count=1)
    if crack is not None: blk=re.sub(r'crack: \[[^\]]*\]', 'crack: '+json.dumps(crack).replace('", "','", "'), blk, count=1)
    if aha: blk=re.sub(r'aha: "(?:[^"\\]|\\.)*"', lambda m: 'aha: '+json.dumps(aha, ensure_ascii=False), blk, count=1)
    if art: blk=re.sub(r'art: `[^`]*`', lambda m: 'art: `\n'+art.strip()+'`', blk, count=1)
    s=s[:i]+blk+s[j:]
    open(W+fn,'w').write(s)

rep('isl04.ts','marble-bust', aha="The eyes hide behind a spare cell, so row 4 must find them. Columns 4 and 7 now read 2 4 2 in eleven cells (one to spare) and can't place the eyes; but the face columns ink row 4 at columns 2, 5-6 and 9, which completes its 1 2 1, so columns 3-4 and 7-8 are the eyes. The mouth (row 7, columns 5-6) still drops straight out of columns 5-6's exact 6 4.", art="""
~~~.##.~~~
~.######.~
~########~
~#..##..#~
.########.
.########.
~.##..##.~
~~.####.~~
~~~.##.~~~
.########.
##########""")

rep('isl05.ts','mosaic-seahorse', title="Dragonfly", aha="The tail's flick decides which forewing meets the body. Columns 5 and 7 both read 1 1 1, and rows 3 and 12 could trade those cells (wing root left and tail curled right, or the reverse) with every clue unchanged. The stamped tail tip at row 12, column 7 is column 7's last 1, so row 3's middle 2 sits at columns 5-6.", art="""
....#.#....
.....#.....
.##.##..##.
####.#.####
.#########.
..##.#.##..
.###.#.###.
####.#.####
.##..#..##.
.....#.....
.....#.....
......@....""")

rep('isl05.ts','mosaic-rooster', aha="Boss: two stamps untie two knots the clues leave open, one at each end of the bird. The stamped umber tip at row 1, column 8 is column 8's first 1, so rows 2-3 of that column are paper and the tail feathers curl to its right. The stamped coral toe at row 12, column 8 settles the back leg: rows 10 and 12 could otherwise trade columns 8 and 9.", art="""
...bb..A....
..bbbb...aa.
..aaaa..a..a
bbaa.a.a..a.
..aaaa.a.a.a
..baaaa..a.a
..baaaaaaa..
...aaaaaaaa.
....aaaaaa..
.....b..b...
.....b..b...
....bb.B....""")

rep('isl06.ts','watering-can', aha="A colour can only sit where both its lines hold it. Only columns 3-5 hold coral, so row 7's coral 3 is exactly columns 3-5 and the painted flower grows from it; only columns 11 and 12 hold sky, so the drops of rows 3-7 fall at the spout's tip, never under the can.", art="""
..aaaa......
.a....a...aa
.a....a..aab
aaaaaaaa.a.b
aaaaaaaaaa.b
aaacaaaaa.b.
aacccaaa..b.
aaacaaaa....
aaaaaaaa....
.aaaaaa.....""")

rep('isl08.ts','kiln-teapot', aha="A cracked '?' is measured by the walls around it. Row 7 shows one run of hidden length; the spout columns 1-2 (a 1 each) and the handle columns 10-11 (1 1 and 4) are used up by rows 3-6, so the run spans columns 3-9: 7. Row 3's 1 9 fills all eleven and columns 4-8 overlap to start you.")

rep('isl08.ts','kiln-heart-mug', aha="The mug's walls bound its cracked foot. Row 9's run is hidden, but columns 1 and 7 (6 each) run rows 3-8 and stop, and the handle columns 8-9 end at row 7, so the foot fits between the walls: columns 2-6, a 5. Rows 4 (2 1 4) and 7 (3 5) fill exactly as footholds.")

rep('isl08.ts','kiln-tall-vase', title="Banded Vase", aha="A cracked width is read from the short edge columns. Rows 8 (3 5) and 9 (9) fill exactly, so columns 1, 2 and 9 (2, 3, 3) are used up below row 6 and row 6's teal ? can't reach them; columns 3 and 8 (5 each) climb from row 9 to row 5, so the ? spans columns 3-8: 6.", art="""
....bb...
....aa...
...aaaa..
...abba..
..aaaaaa.
..aaaaaa.
.aabaabaa
aaa.aaaaa
aaaaaaaaa
...bbbb..""")

rep('isl08.ts','kiln-glazed-tile', title="Flower Tile", crack=["r4.2"], aha="Twist: the cracked number is the flower's cream heart, and the columns size it. Row 5 reads coral 3, cream ?, coral 3, and only columns 5-8 hold cream; columns 5 and 8 hold a single cream between two coral 2s, and once those petals settle (rows 3-4 and 6-7) it lands in row 5, so the heart is columns 5-8: 4.", art="""
aaaaaaaaaaaa
a....bb....a
a..bbbbbb..a
a.bbbccbbb.a
abbbccccbbba
a.bbbccbbb.a
a..bbbbbb..a
a....bb....a
a....a.....a
aaaaaaaaaaaa""")

rep('isl08.ts','kiln-tea-bowl', crack=["r9.0"], aha="A calm one: the foot's hidden width is set by the bowl tapering above it. Rows 4 and 6 (11) and row 5's umber 1, teal 9, umber 1 fill at once; columns 5-7 end in umber 3s that reach row 10, while columns 4 and 8 end in a 2 held at rows 8-9, so the cracked foot is columns 5-7: 3.", art="""
...b...b...
..b...b....
...b...b...
aaaaaaaaaaa
abbbbbbbbba
aaaaaaaaaaa
.aabbbbbaa.
..aaaaaaa..
...aaaaa...
....aaa....""")
