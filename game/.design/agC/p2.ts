const NIGHT = "#2B3A67", GOLD = "#E3A83B", CREAM = "#C9B8A0";
export const arts: Record<string,string> = {
pd: `
...aaaa...
..aaaaaa..
..a.aa.a..
..aabbaa..
.aaaccaaa.
aaaccccaaa
a.acccca.a
..acccca..
..aaccaa..
..bb..bb..`,
pe: `
...aaaa...
..aaaaaa..
..a.aa.a..
..aabbaa..
..aaccaa..
.aaccccaa.
aaacccca.a
a.acccca..
..accccaa.
..aaccaa..
..bb..bb..`,
pf: `
...aaaa...
..aaaaaa..
.aa.aa.aa.
.aaabbaaa.
.aacccc.a.
aaacccca.a
a.acccca..
..accccaa.
..acccca..
..aaccaa..
.bbb..bbb.`,
};
const out: any[] = [];
for (const [k, art0] of Object.entries(arts)) {
  const rows = art0.trim().split("\n");
  out.push({ id: `${k}-plain`, title: k, palette: [NIGHT, GOLD, CREAM], role: "twist", mechanics: [], aha: "", art: art0 });
  for (let r = 0; r < rows.length; r++) for (let c = 0; c < rows[0].length; c++) {
    const ch = rows[r][c]; const st = ch === "." ? "," : ch.toUpperCase();
    const rr = rows.slice(); rr[r] = rr[r].slice(0, c) + st + rr[r].slice(c + 1);
    out.push({ id: `${k}-r${r}c${c}`, title: k, palette: [NIGHT, GOLD, CREAM], role: "twist", mechanics: ["smudged","stamp","color"], aha: "", art: "\n" + rr.join("\n"), smudge: [`r${r}`, `c${c}`] });
  }
}
export const A = out;
