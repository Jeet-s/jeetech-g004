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
mk("v1",["r3","r4"],top+`
cccccccccccccc
.ccbccbccbccc.
..cccccccccc..`),
mk("v2",["r3","r4"],top+`
cccccccccccccc
.cccccccccccc.
..cccccccccc..
b...bb...bb..b`),
mk("v3",["r3","r4"],top+`
cccccccccccccc
.ccbccbccbccc.
..cccccccccc..
.bb...bb...bb.`),
mk("v4",["r3","r4"],top+`
cccccccccccccc
.cccbcccbcccc.
..cccccccccc..
b...bb...bb..b`),
mk("v5",["r3","r5"],top+`
cccccccccccccc
.ccbccbccbccc.
..cccccccccc..
b...bb...bb..b`),
];
