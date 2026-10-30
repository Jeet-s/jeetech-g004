const C="#D9694F",G="#E3A83B",U="#8A5A3C";
const mk=(title:string,smudge:string[],art:string)=>({id:"paper-boat",title,palette:[C,G,U],role:"twist",mechanics:["smudged","color"],smudge,aha:"",art});
const top=`
.......c......
.......cb.....
.......cbb....
.cc....cabb...
.ca....cbabb..
.ca....cbbabb.
.c.....cbbbab.
.c.....c......`;
export const A=[
mk("x1",["r3","r4"],top+`
cccccccccccccc
.ccbccbccbccc.
..cccccccccc..
.bb...bb...bb.`),
mk("x2",["r3","r4"],top+`
cccccccccccccc
.ccbccbccbccc.
..cccccccccc..
b..bb....bb..b`),
mk("x3",["r3","r4"],top+`
cccccccccccccc
.ccbccbccbccc.
..cccccccccc..
bb...bbb...bb.`),
mk("x4",["r3","r4"],top+`
cccccccccccccc
.cccbccbcccbc.
..cccccccccc..
b...bb...bb..b`),
mk("x5",["r3","r4"],top+`
cccccccccccccc
.ccbcccccbccc.
..cccccccccc..
b...bb...bb..b`),
];
