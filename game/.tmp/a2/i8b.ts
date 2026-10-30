const P2 = ["#1", "#2"];
const P3 = ["#1", "#2", "#3"];
const dome = `
~~~~aa.aaa~~~~
~~~a.aaa.aa~~~
~~aaa.aaa.aa~~
~a.aaa.aaa.aa~
aaa.aa..aa.aaa
a.aaa.b..aa.aa
aa.a..b.b.a.aa
a.aa.bb.bbaa.a
aa.a.bcbb.a.aa
a.aabbccbbaa.a
aa.abccccba.aa
a.aabbccbbaa.a
aa.abbbbbba.aa
aaaaaaaaaaaaaa`;
export const S = [
{ id: "dome0", title: "d", palette: P3, crack: ["c6.1", "r9.2"], art: dome },
{ id: "dome1", title: "d", palette: P3, crack: ["c6.1"], art: dome },
{ id: "plate", title: "p", palette: P2, crack: ["r11.0", "c4.2"], art: `
....aaaa....
..aabbbbaa..
.abbaaaabba.
.abaabbaaba.
abaabaabaaba
abababbababa
abababbababa
abaabaabaaba
.abaabbaaba.
.abbaaaabba.
..aabbbbaa..
....aaaa....` },
{ id: "pitcher", title: "p", palette: P2, crack: ["c10.0", "c0.1"], art: `
bbbbbbbb...
.aaaaaaabbb
..aaaaa...b
..aaaaa...b
.aaaaaaa..b
aaaaaaaaabb
aaaaaaaaaa.
abaabaabaa.
aaaaaaaaaa.
.aaaaaaaa..
..aaaaaa...
.bbbbbbbb..` },
];
