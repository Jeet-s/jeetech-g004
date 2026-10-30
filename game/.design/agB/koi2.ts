const TEAL = "#2E8C8A", CORAL = "#D9694F", CREAM = "#C9B8A0";
const mk=(title:string,crack:string[],art:string)=>({id:"kiln-glazed-tile",title,palette:[TEAL,CORAL,CREAM],role:"twist",mechanics:["cracked","color"],crack,aha:"",art});
const body=`
......bb....
....bbbbb.b.
..b.bcbbbbb.
..bbbbbccbb.
....bbbbb.b.
.......b....`;
export const A=[mk("k8",["r5.1"],`
aaaaaaaaaaaa
a..c.......a`+body+`
a..aa..aa..a
aa..aaaa..aa`),mk("k9",["r5.1"],`
aaaaaaaaaaaa
a..c.......a`+body+`
aa.aa..aa.aa
a..aaaaa...a`)];
