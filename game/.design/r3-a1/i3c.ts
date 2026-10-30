const S = (id: string, art: string, palette = ["#E3A83B", "#2E8C8A"]) => ({ id, title: id, palette, role: "practise", mechanics: ["color"], aha: "", art });
export const A = [
S("pe4", `
....b...
.bb.b...
..bbaa..
...aaa..
..aaaaa.
..a.aaa.
.aaaaaaa
aa.aaaaa
aaaaaaa.
.aaaaa..`),
S("pe5", `
....b...
.bb.b...
..bbaa..
...aaa..
..aaaaa.
..aaaaa.
.aa.aaaa
aa.aaaaa
aaaaaaa.
.aaaaa..`),
S("pe6", `
.....b..
..bb.b..
...bbaa.
....aaa.
...aaaa.
..aa.aa.
.aaaaaaa
aa.aaaaa
aaaaaaa.
.aaaaaa.`),
];
