import json
A = {
"mosaic-songbird": "Column 3's 5 could slide down, but the stamped tile in row 1 pins it to rows 1-5.",
"mosaic-snail": "Row 1's 5 can't fit in the three cells left of the stamped gap, so it fills columns 5-9 exactly.",
"mosaic-seahorse": "Column 1's lone 1 is the stamped snout tile, so its ten other cells are paper and row 3's 4 starts there.",
"mosaic-pomegranate": "Row 4's stamped sage stem in column 10 is its lone 1b: the coral 7 lies left of it, the edge stays paper.",
"mosaic-elephant": "Row 8's stamped gap in column 4 strands the 1 on the trunk; \"2 3 3\" fills the ten cells right of it.",
"mosaic-rooster": "Column 5's 7 must reach the stamped tile in row 4, squeezing the coral comb's 2: row 2 is coral.",
"mosaic-cat-face": "Row 7's two 4s can't share a side of the stamped nose gap: one sits each side, the left one exactly.",
"mosaic-toucan": "Row 3's black 2 and 4 need seven cells before the gold 4, so the beak starts exactly at the stamped tile.",
"mosaic-compass-rose": "Row 4 has eleven cells between voids; its stamped tip in column 4 pins the first 1, so 2b fills columns 2-3.",
"mosaic-octopus": "Column 4's paper stamp on top leaves twelve cells for runs needing eleven: slack one, six cells fill.",
"mosaic-black-swan": "Row 1's 3 spans the stamped tile in column 3 and column 5's head cell, so it is exactly columns 3-5.",
"mosaic-dolphin-medallion": "Column 2's 9 must cover the stamped ring tile in row 4: rows 4-9 are ring, its bottom three paper.",
}
p='src/game/islands/isl05.ts'; s=open(p).read()
for k,v in A.items():
    i=s.index('id: "%s"'%k); a=s.index('aha: ',i); b=s.index('\n',a)
    s=s[:a]+'aha: '+json.dumps(v)+','+s[b:]
    print(len(v),k)
open(p,'w').write(s)
