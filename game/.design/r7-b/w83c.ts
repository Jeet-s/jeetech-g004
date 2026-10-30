const m = (art: string, smudge = ["c2"]) => ({ id: "lantern-pinwheel", title: "Pinwheel", palette: ["#D9694F", "#E3A83B", "#8A5A3C"], role: "combine", mechanics: ["smudged", "color"], smudge, aha: "", art });
const P = `
a...cbbbb
aa..cbbb.
aaa.cbb..
aaaacb...
....c....
...bcaaaa
..bacbaaa
.bbbc..aa
bbbbc...a
....c....
....c....
..ccccc..`;
export const A = [m(P, ["c3"]), m(P, ["c5"]), m(P, ["r6"]), m(P, ["r2"]), m(P, ["c1"])];
