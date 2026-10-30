const UMBER = "#8A5A3C", TEAL = "#2E8C8A";
const b = (id: string, art: string, crack: string[]) => ({ id, title: "Tea Bowl", palette: [UMBER, TEAL], role: "breather", mechanics: ["cracked", "color"], crack, aha: "", art });
const a1 = `
...b...b...
..b...b....
...b...b...
aaaaaaaaaaa
abbbbbbbbba
aaaaaaaaaaa
.aabbbbbaa.
..aaaaaaa..
...aaaaa...
....aaa....`;
const a2 = `
...b....b..
..b....b...
...b....b..
aaaaaaaaaaa
abbbbbbbbba
.aaaaaaaaa.
.abbabbabba
..aaaaaaa..
...aaaaa...
...aaaaa...`;
const a3 = `
...b...b...
..b...b....
...b...b...
aaaaaaaaaaa
abbbbbbbbba
.aaaaaaaaa.
.aababbabaa
..aaaaaaa..
...aaaaa...
....aaa....`;
export const A = [b("a1", a1, ["r9.0"]), b("a1b", a1, ["r4.1"]), b("a3", a3, ["r9.0"]), b("a3b", a3, ["r4.1"]), b("a3c", a3, ["r7.0"])];
