const UMBER = "#8A5A3C", CORAL = "#D9694F", SKY = "#6FA8DC";
const mk = (id: string, art: string, tally = ["r5", "c3"]) => ({ id, title: "Paint Palette", palette: [UMBER, CORAL, SKY], role: "combine", mechanics: ["void", "color-tally"], aha: "", art, tally });
export const A = [
mk("q1", `
~~~~aaaaaa~~~
~~aaa....aaa~
~aa.bb.cc...a
aa..bb.cc...a
a..aa.......a
a.a~~a..bb..a
a..aa...bb.aa
aa........aa~
~aa.......a~~
~~aaaaaaaa~~~`),
mk("q2", `
~~~~aaaaaa~~~
~~aaa....aaa~
~aa..bb.cc..a
aa...bb.cc..a
a..aa.......a
a.a~~a..bb..a
a..aa...bb.aa
aa........aa~
~aa.......a~~
~~aaaaaaaa~~~`),
mk("q3", `
~~~~aaaaaa~~~
~~aaa....aaa~
~aa.bb..cc..a
aa..bb..cc..a
a..aa.......a
a.a~~a.bb...a
a..aa..bb..aa
aa........aa~
~aa.......a~~
~~aaaaaaaa~~~`),
mk("q4", `
~~~~aaaaaa~~~
~~aaa....aaa~
~aa..bb..cc.a
aa...bb..cc.a
a..aa.......a
a.a~~a.bb...a
a..aa..bb..aa
aa........aa~
~aa.......a~~
~~aaaaaaaa~~~`),
mk("q5", `
~~~~aaaaaa~~~
~~aaa....aaa~
~aa.bb.cc...a
aa..bb.cc...a
a..aa.......a
a.a~~a..bb..a
a..aa...bb.aa
aa........aa~
~aa.......a~~
~~aaaaaaaa~~~`, ["r5", "c4"]),
];
export const B = [{ ...A[0], id: "q1a", tally: ["c3", "c5"] }, { ...A[0], id: "q1b", tally: ["c2", "c4"] }];
