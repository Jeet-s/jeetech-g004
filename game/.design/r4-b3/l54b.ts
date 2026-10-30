const UMBER = "#8A5A3C", CORAL = "#D9694F";
const b = (id: string, art: string) => ({ id, title: "Rooster", palette: [UMBER, CORAL], role: "boss", mechanics: ["stamp", "color"], aha: "", art });
const base = `
...bb..a....
..bbbb...aa.
..aaaa..a..a
bbaa.a.a..a.
..aaaa.a.a.a
..baaaa..a.a
..baaaaaaa..
...aaaaaaaa.
....aaaaaa..
.....b..b...
.....b..b...
....bb.b....`;
const st = (art: string, list: [number, number][]) => { const rs = art.trim().split("\n"); for (const [r, c] of list) { const ch = rs[r - 1][c - 1]; rs[r - 1] = rs[r - 1].slice(0, c - 1) + (ch === "." ? "," : ch.toUpperCase()) + rs[r - 1].slice(c); } return "\n" + rs.join("\n"); };
export const A = [
b("s0", base),
b("s1", st(base, [[1, 8]])),
b("s2", st(base, [[1, 8], [12, 8]])),
b("s3", st(base, [[1, 8], [10, 9]])),
b("s4", st(base, [[1, 8], [12, 9]])),
b("s5", st(base, [[2, 10], [12, 8]])),
b("s6", st(base, [[12, 8]])),
];
