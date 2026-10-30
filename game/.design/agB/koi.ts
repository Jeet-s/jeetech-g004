const TEAL = "#2E8C8A", CORAL = "#D9694F", CREAM = "#C9B8A0";
const mk=(title:string,crack:string[],art:string)=>({id:"kiln-glazed-tile",title,palette:[TEAL,CORAL,CREAM],role:"twist",mechanics:["cracked","color"],crack,aha:"",art});
const body=`
......bb....
....bbbbb.b.
..b.bcbbbbb.
..bbbbbccbb.
....bbbbb.b.
.......b....`;
const k4=`
aaa......aaa
a..c.......a`+body+`
a.aa....aa.a
aaaaaaaaaaaa`;
const k5=`
aaa......aaa
a..c.......a`+body+`
a..........a
aaa......aaa`;
const k6=`
aaaaaaaaaaaa
a..c.......a`+body+`
a.aa....aa.a
aa..aaaa..aa`;
const k7=`
aa........aa
a..c.......a`+body+`
a..aa..aa..a
aaaaaaaaaaaa`;
export const A=[mk("k4",["r5.1"],k4),mk("k5",["r5.1"],k5),mk("k6",["r5.1"],k6),mk("k7",["r5.1"],k7)];
