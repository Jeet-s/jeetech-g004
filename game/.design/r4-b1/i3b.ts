const s = (id: string, art: string, palette = ["#D9694F", "#2E8C8A"]) => ({ id, title: "x", palette, role: "practise", mechanics: ["color"], aha: "", art });
const body = `
...aaa...
.aaaaaaa.
aaaaaaaaa
aaaaaaaaa
.aaaaaaa.
..aaaaa..
...aaa...
....a....`;
const L = ["bb.....bb\n.bb.b.bb.\n..bbbbb..\n....b....", ".bb...bb.\n..bb.bb..\n...bbb...\n....b....", "b.......b\nbb..b..bb\n.bbbbbbb.\n....b....", ".b.....b.\nbbb.b.bbb\n..bbbbb..\n....b....", "bbb...bb.\n..bb.bb..\n...bbb...\n....b...."];
export const A = L.map((l, i) => s("rad" + i, "\n" + l + body));
