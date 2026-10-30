const NIGHT = "#2B3A67", GOLD = "#E3A83B";
const b = (id: string, title: string, art: string, palette = [NIGHT, GOLD]) => ({ id, title, palette, role: "practise", mechanics: ["color-tally"], tally: [], aha: "", art });
export const A = [
b("globe", "Celestial Globe", `
....aaa....
..aabaaaa..
.aaaaaabaa.
.abaaaaaaa.
aaaaabaaaba
aaaaaaaaaaa
.aabaaabaa.
.aaaaaaaaa.
..aaaabaa..
....aaa....
.....a.....
...aaaaa...`),
];
