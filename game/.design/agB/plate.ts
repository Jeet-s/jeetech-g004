const CREAM = "#C9B8A0", NIGHT = "#2B3A67";
const mk=(title:string,crack:string[],art:string)=>({id:"kiln-willow-plate",title,palette:[CREAM,NIGHT],role:"practise",mechanics:["cracked","color"],crack,aha:"",art});
const art=`
....bbbbb....
..bbaaaaabb..
.baaaaaaaaab.
.baabaaaaaab.
baaabbbbaabab
baababbbbbbab
baaabbbbaabab
baabaaaaaaaab
.babbaaaaaab.
.baabaaaaaab.
..bbaaaaabb..
....bbbbb....`;
export const A=[mk("q-r2",["r2.1"],art),mk("q-r4",["r4.1"],art),mk("q-r7",["r7.3"],art),mk("q-r10",["r10.1"],art)];
