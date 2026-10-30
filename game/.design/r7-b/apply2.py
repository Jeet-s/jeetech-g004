def rep(path, id_, body):
    s = open(path).read()
    i = s.index('id: "%s"' % id_)
    start = s.rindex('  {', 0, i)
    end = s.index('`,\n  },', i) + len('`,\n  },')
    s = s[:start] + body.strip("\n") + s[end:]
    open(path, 'w').write(s)
    print("ok", id_)
I = "src/game/islands/"
rep(I+"isl06.ts", "lily-frog", r'''
  {
    id: "lily-frog", title: "Bumblebee", palette: [GOLD, INKC, SKY], role: "breather", mechanics: ["color-cross"],
    aha: "A breather: the stripes drop straight down. Columns 2, 4 and 6 hold no ink at all (gold 5) and columns 3, 5 and 7 no gold (ink 6, into the legs), so every ink 1 in the body rows can only sit in an odd column. The ink head is the only other thing, with row 5's paper eye in column 8.",
    art: `
...cc.cc.
..cccccc.
.ababab..
.abababbb
bababab.b
.abababbb
.ababab..
..b.b.b..`,
  },''')
rep(I+"isl07.ts", "festival-candle", r'''
  {
    id: "festival-candle", title: "Rabbit Lantern", palette: ["#E3A83B", "#D9694F", "#8A5A3C"], role: "breather", mechanics: ["smudged", "color"], smudge: ["r3"],
    aha: "A breather: the rabbit's eye hides in smudged row 4, and one column hands it over. Column 2 reads coral 2 (the ears), gold 1, coral 1, gold 3, coral 1 (a wheel), filling all eight cells, so the coral eye is row 4. Row 5's gold 8 and column 7's umber 4, gold 3, coral 1 (the carrying stick) fill whole.",
    art: `
.b.b..cc
.b.b..c.
aaaa..c.
abaaaaca
aaaaaaaa
aaaaaaab
.aaaaaa.
.bb..bb.`,
  },''')
rep(I+"isl07.ts", "paper-boat", r'''
  {
    id: "paper-boat", title: "Lantern Boat", palette: ["#D9694F", "#E3A83B", "#8A5A3C"], role: "twist", mechanics: ["smudged", "color"],
    smudge: ["r2", "r3"],
    aha: "Twist: rows 3 and 4 are both smudged, so every column must carry itself across two hidden rows. The hull is the anchor: row 8's umber 12 fixes the foot of every column, so column 3 (umber 1, coral 2, umber 3) climbs from the hull past readable row 5: the lantern is rows 4-5 and its arm row 3. The sail's coral stripe steps down one row per column and enters the hidden rows only at row 4, column 8.",
    art: `
......c.....
......cb....
.cc...cbb...
.ca...cabb..
.ca...cbabb.
.c....cbbab.
.c....cbbbab
cccccccccccc
.ccbccbccbc.
..cccccccc..`,
  },''')
rep(I+"isl07.ts", "lantern-pinwheel", r'''
  {
    id: "lantern-pinwheel", title: "Pinwheel", palette: ["#D9694F", "#E3A83B", "#8A5A3C"], role: "combine", mechanics: ["smudged", "color"],
    smudge: ["c5"],
    aha: "The stick splits every row in two. Column 5's umber 12 runs top to bottom, so each row's runs fall either side of it, and smudged column 6 is read from the short right halves: rows 1-4 start their gold right after the stick, row 6's coral 4 fills columns 6-9 (the lower vane's top edge), and row 7's gold 1, coral 3 fills them too, so the gold fold sits against the stick in row 7.",
    art: `
a...cbbbb
aa..cbbb.
aaa.cbb..
aaaacb...
....c....
...bcaaaa
..bacbaaa
.bbbc..aa
bbbbc...a
....c....
....c....
..ccccc..`,
  },''')
rep(I+"isl08.ts", "kiln-heart-mug", r'''
  {
    id: "kiln-heart-mug", title: "Rice Bowl", palette: [TEAL], role: "teach", mechanics: ["cracked"], crack: ["r7.0"],
    aha: "One cracked number, measured by the columns. The bowl's foot (row 8) is a single run of hidden length: columns 1 and 8 are only the rim's 2 (rows 4-5), so the foot reaches neither edge, while columns 2 and 7 both end in a 1 at the bottom, so it spans columns 2-7: 6. Row 4's 8 (the rim) and column 5's 1 6 start you.",
    art: `
.#..#...
..#..#..
.#..#...
########
#.#.#.##
.######.
..####..
.######.`,
  },''')
rep(I+"isl08.ts", "kiln-tea-bowl", r'''
  {
    id: "kiln-tea-bowl", title: "Piggy Bank", palette: [CORAL, UMBER, GOLD], role: "breather", mechanics: ["cracked", "color"], crack: ["r4.1"],
    aha: "A breather: the pig's belly is cracked, and the snout and the tail measure it. Row 5 reads umber 2, coral ?, umber 1: columns 1 and 2 put the snout in rows 5-6 at the left edge and column 9's lone umber is the curly tail in row 5, so the ? runs columns 3-8: 6. A gold coin drops into the slot above.",
    art: `
....cc...
..a.cc.a.
.aaaaaaa.
aaa.aaaa.
bbaaaaaab
bbaaaaaa.
.aaaaaaa.
.bb...bb.`,
  },''')
rep(I+"isl09.ts", "ringed-planet", r'''
  {
    id: "ringed-planet", title: "Ringed Planet", palette: [CORAL, GOLD, SKY], role: "boss", mechanics: ["color-cross", "color-tally"], tally: ["c8", "r4"],
    aha: "Boss: a count that is met closes its line, and the ring meets two of them. Column 9 counts sky 2, gold 2, coral 1, and the bands and ring stack all five in rows 3-7 with no gaps, so rows 1, 2, 8 and 9 there are X. Row 5 counts gold 2, coral 9: column 1 gives one ring tip and column 12 leaves a gap, so the second gold is the far tip in column 13.",
    art: `
.........acc.
..bc.aaa....c
...aaccccc..c
.bbbbbbbbbbcc
b.aaaaaaaaa.b
.bbbbbbbbbbb.
b..accccca...
.....aaa.....
.c........c..`,
  },''')
rep(I+"isl09.ts", "moon-rover", r'''
  {
    id: "moon-rover", title: "Moon Rover", palette: [NIGHT, SKY, GOLD], role: "breather", mechanics: ["color-tally"], tally: ["c4"],
    aha: "A breather: one count is spent at once. Column 5 only counts navy 3, and the rover's body rows 4-6 (navy 7, the windows row, navy 9) put all three there, so its top three cells are X: row 1's star must be in column 6, and row 2's gold 2 pennant flies at columns 8-9 on the right mast.",
    art: `
.bbb.c...
.bbb...cc
..a...ba.
.aaaaaaa.
.abbaabba
aaaaaaaaa
ccc...ccc
c.c...c.c
ccc...ccc`,
  },''')
rep(I+"isl10.ts", "exhibit-carousel-horse", r'''
  {
    id: "exhibit-carousel-horse", title: "Carousel Horse", palette: [SKY, GOLD, CORAL], role: "practise", mechanics: ["color-cross", "cracked"], crack: ["r5.1"],
    aha: "The saddle is a cracked coral run, and its neighbours' colours size it. Row 6 reads sky 2, coral ?, coral 2. Column 5's coral 3 is the mane above its sky neck, so the saddle starts at column 6; column 11's coral 2 puts the tail in columns 10-11, and two coral runs need a gap, so the saddle stops at column 8: 3. Rows 1 and 12 (gold 11) frame the carousel.",
    art: `
bbbbbbbbbbb
..a..b...c.
.aaacb..cc.
.a.acb..c..
aaaacb..cc.
...aaccc.cc
...aaaaaaac
...aaaaaaa.
...a.b..a..
..a..b...a.
.....b.....
bbbbbbbbbbb`,
  },''')
rep(I+"isl10.ts", "exhibit-mina-portrait", r'''
  {
    id: "exhibit-mina-portrait", title: "Mina the Curator", palette: [UMBER, PEACH, TEAL], role: "breather", mechanics: ["color"],
    aha: "A breather with one question: where is the notch in Mina's beret? Row 2's teal 4 2 has one spare cell in eight. Columns 1 and 6 hold no teal at all, so the brim is columns 2-5, the notch column 6 and the tip columns 7-8; everything else fills whole.",
    art: `
....c...
.cccc.cc
aaaaaaaa
abbbbbba
ab.bb.ba
abbbbbba
.ab..ba.
..bbbb..`,
  },''')
