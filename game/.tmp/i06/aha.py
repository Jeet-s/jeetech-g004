import re
A={
"potted-tulip":"Row 3's coral 8 overlaps on six middle cells; columns 5 and 6 then read coral, sage, umber top to bottom.",
"flowering-cactus":"Row 11's umber 12 fills the pot rim, and columns 1 and 12 hold only that umber cell, so the rest is paper.",
"sunflower-head":"Row 4's gold 3, umber 6, gold 3 total twelve: different colours need no gap, so the row fills edge to edge.",
"hummingbird-sip":"Column 9's teal 7 overlaps on two cells; row 6's coral 2 2 then teal 3 can never reach the last two cells.",
"garden-rose":"Column 6's eight coral, night and sage runs total exactly 13 with no gaps needed, so the spine is fixed.",
"bonsai-pine":"Row 3's sage 7 and 4 leave only two spare cells; column 9's umber 3s then start to bend the trunk into place.",
"lily-frog":"Row 5's sage 2, ink 8, sage 2 add up to exactly twelve: colour changes need no gap, so the smile is set.",
"leaf-ladybird":"Voids leave row 2 nine cells for sage 3, ink 1, ink 1, sage 3; the ink dots need a gap, so it fits exactly.",
"watering-can":"Row 4's teal 9 and 3 leave one spare cell; column 10's lone teal 2 then crosses off the rest of the column.",
"monstera-leaf":"Column 8's sage 1, teal 12, umber 1 fill all 14 cells; the stamped hole in row 7 marks the first leaf slit.",
"moth-orchid":"Row 4's plum 5 1 5 needs two gaps and fits 13 exactly, while row 5's plum, gold, plum needs none at all.",
"glasshouse":"The stamp gives column 6 its only sage cell, so everything between it and the bench row is paper.",
}
M={"leaf-ladybird":'["color-cross", "void", "exact-fit"]',"watering-can":'["color-cross", "overlap"]',
   "lily-frog":'["color-cross", "exact-fit"]',"sunflower-head":'["color-cross", "exact-fit"]',"bonsai-pine":'["color-cross", "overlap"]',
   "hummingbird-sip":'["color-cross", "overlap"]',"monstera-leaf":'["color-cross", "stamp", "exact-fit"]'}
p='src/game/islands/isl06.ts'; s=open(p).read()
for k,v in A.items():
    assert len(v)<=110,(k,len(v))
    i=s.index('id: "%s"'%k); j=s.index('aha: "TODO"',i)
    s=s[:j]+'aha: '+repr(v).replace("'",'"') if False else s[:j]+'aha: "%s"'%v+s[j+len('aha: "TODO"'):]
    if k in M:
        i=s.index('id: "%s"'%k); m=re.compile(r'mechanics: \[[^\]]*\]').search(s,i)
        s=s[:m.start()]+'mechanics: '+M[k]+s[m.end():]
open(p,'w').write(s)
for k,v in A.items(): print(len(v),k)
