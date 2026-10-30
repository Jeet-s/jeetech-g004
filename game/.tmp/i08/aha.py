import re
A={
'kiln-teapot':(["cracked","exact-fit","color"],"Row 11's gold ? is read from above: columns 3-10 each end in a gold 1 there, so the hidden run is 8."),
'kiln-heart-mug':(["cracked","fill","exact-fit","color"],"Row 5's navy ? is the handle top: columns 11 and 13 both ink row 5, so one run bridges them - it's 3."),
'kiln-tall-vase':(["cracked","exact-fit","color"],"Row 10's ? is the widest belly: every column inks row 10, the 2s in columns 1 and 13 last, so it's 13."),
'kiln-willow-plate':(["cracked","exact-fit","color"],"Two ?s: columns 6-9 end on row 14, so its rim is 4; column 4's 8 then shows row 5's middle ? is 3."),
'kiln-glazed-tile':(["cracked","fill","exact-fit","color"],"Row 6's coral ? hides mid-line: column 5 inks its left cell and column 4's gold border stops it - it's 2."),
'kiln-pitcher':(["cracked","exact-fit","overlap","color"],"Column 4's ? is 11 or 12 until row 13's 6 takes the last cell; row 6's handle ? spans columns 12-14."),
'kiln-tea-bowl':(["cracked","fill","overlap","color"],"Row 5's umber ? sits between two teal 1s; columns 7 and 11 place them, leaving exactly 3 cells for it."),
'kiln-honey-jar':(["cracked","fill","exact-fit","color"],"Column 6's umber ? starts on the label's top edge; row 9 extends it a cell and row 10's gap ends it: 2."),
'kiln-brick-dome':(["cracked","smudged","void","color"],"Smudged column 4 is painted by its rows; column 7's coral ? must bridge rows 6 and 8, so it's 3."),
'kiln-lucky-cat':(["cracked","smudged","overlap","color"],"Row 8's cream ? is the tail's base: columns 11 and 12 ink it, column 13's 6 stops short - it's 2."),
'kiln-noodle-bowl':(["cracked","smudged","overlap","color"],"Row 7's navy ? sits between gold 2s: columns 4-5 pin it to 2, then the row paints smudged column 1."),
'kiln-fire-masterwork':(["cracked","smudged","overlap","color"],"Column 11's coral ? is one flame tip: row 4's 7 inks it, rows 3 and 5 gap it; smudged row 14 fills last."),
}
p='src/game/islands/isl08.ts'; s=open(p).read()
for k,(m,a) in A.items():
  assert len(a)<=110,(k,len(a))
  s,n=re.subn(r'(id: "%s".*?mechanics: )\[[^\]]*\](,\n    aha: )"x"'%k, lambda mm: mm.group(1)+'['+', '.join('"%s"'%x for x in m)+']'+mm.group(2)+'"'+a.replace('"','\\"')+'"', s, flags=re.S)
  assert n==1,k
  print(len(a),k)
open(p,'w').write(s)
