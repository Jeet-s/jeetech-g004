const P3 = ["#1", "#2", "#3"];
const art = `
.b....b........
.bb..bb...b....
.aaaaaa..aaab..
aaaaaaaaaaaaab.
Acaaaacaaa.aaab
aaaaaaaa....aaa
aabbbbaa....aaa
.aaaaaa....baaa
...c.......aaa.
...c......baaa.
...c......aaa..
...c.....baa...
...c.....aaa...
...c...ddd.....
...c..d.d.d....`;
export const S = [
{ id: "dk-b", title: "d", palette: P3, smudge: ["r4", "c0"], art: art.replace(/d/g, "b") },
{ id: "dk-c", title: "d", palette: P3, smudge: ["r4", "c0"], art: art.replace(/d/g, "c") },
{ id: "dk-a", title: "d", palette: P3, smudge: ["r4", "c0"], art: art.replace(/d/g, "a") },
];
