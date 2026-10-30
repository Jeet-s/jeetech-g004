const S = (id: string, art: string, palette = ["#D9694F", "#2E8C8A"]) => ({ id, title: id, palette, role: "practise", mechanics: ["color"], aha: "", art });
export const A = [
S("wm1", `
baaaaaaaaab
baa.aaa.aab
baaaaa.aaab
.baa.aaaab.
.baaaa.aab.
..baaaaab..
...baaab...
....bbb....`),
S("wm2", `
aaaaaaaaaaa
baa.aaaa.ab
baaaa.aaaab
.ba.aaaa.b.
.baaaa.aab.
..baaaaab..
...baa.b...
....bbb....`),
];
