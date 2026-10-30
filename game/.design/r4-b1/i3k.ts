const s = (id: string, art: string, palette = ["#D9694F", "#8A5A3C"]) => ({ id, title: "x", palette, role: "combine", mechanics: ["color"], aha: "", art });
const base = `
bbbbbbbbbb
b.bb.bb.bb
.bbbbbbbb.
.b.bb.bb..
..bbbbbb..`;
const H = ["...bbbb...\n..b...bb.."];
const AP = [".b.aa.aab.\n.baaa.aaab\naaaa.aaa.b", ".baa..aab.\n.baaa.aaab\naaaa.aaaab", ".b.aa..ab.\n.baaa.aaa.\naaaaa.aaaa", ".b.aa.aab.\n.baaaaaab.\naaa.aaa.aa", ".baa..a.b.\naaaa.aaab.\naaaa.aaaa.", ".b.aa.a.b.\n.baaa.aab.\naaaaa.aaaa", ".b.aa.a.b.\n.baaa.aab.\n.aaaa.aaa."];
export const A = H.flatMap((h, i) => AP.map((a, j) => s(`h${i}a${j}`, "\n" + h + "\n" + a + base)));
