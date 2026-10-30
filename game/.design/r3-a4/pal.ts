const UMBER = "#8A5A3C", CORAL = "#D9694F", SKY = "#6FA8DC", GOLD = "#E3A83B";
const mk = (id: string, art: string, pal = [UMBER, CORAL, SKY, GOLD]) => ({ id, title: "Paint Palette", palette: pal, role: "combine", mechanics: ["void", "color-tally"], aha: "", art });
export const A = [
mk("p2", `
~~~~aaaaaa~~~
~~aaa....aaa~
~aa.bb.cc...a
aa..bb.cc...a
a..aa.......a
a.a~~a..dd..a
a..aa...dd.aa
aa........aa~
~aa.......a~~
~~aaaaaaaa~~~`),
mk("p3", `
~~~~aaaaaa~~~
~~aaa....aaa~
~aa.bb.cc...a
aa..bb.cc...a
a..aa.......a
a.a~~a..bb..a
a..aa...bb.aa
aa........aa~
~aa.......a~~
~~aaaaaaaa~~~`, [UMBER, CORAL, SKY]),
];
export const B = [{ ...A[1], id: "p3t", tally: ["r5", "c3"] }, { ...A[1], id: "p3u", tally: ["r5", "c4"] }];
