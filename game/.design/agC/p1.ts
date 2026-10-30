const NIGHT = "#2B3A67", GOLD = "#E3A83B";
const arts: Record<string,string> = {
pa: `
...aaaa...
..aaaaaa..
..a.aa.a..
..aabbaa..
.aa....aa.
aaa....aaa
a.a....a.a
..a....a..
..aaaaaa..
..bb..bb..`,
pb: `
...aaaa...
..aaaaaa..
.aa.aa.aa.
.aaabbaaa.
.aa....aa.
aaa....aaa
aa......aa
.a......a.
.aa....aa.
..aaaaaa..
.bbb..bbb.`,
pc: `
...aaaa....
..aaaaaa...
..a.aaaabb.
..aaaaaa...
..aa..aaa..
.aa....aa..
aaa....aaa.
.aa....aa..
..aa..aa...
...aaaa....
..bb..bb...`,
};
const out: any[] = [];
for (const [k, art0] of Object.entries(arts)) {
  const rows = art0.trim().split("\n");
  for (let r = 0; r < rows.length; r++) for (let c = 0; c < rows[0].length; c++) {
    const ch = rows[r][c]; const st = ch === "." ? "," : ch.toUpperCase();
    const rr = rows.slice(); rr[r] = rr[r].slice(0, c) + st + rr[r].slice(c + 1);
    out.push({ id: `${k}-r${r}c${c}`, title: k, palette: [NIGHT, GOLD], role: "twist", mechanics: ["smudged","stamp","color"], aha: "", art: "\n" + rr.join("\n"), smudge: [`r${r}`, `c${c}`] });
  }
}
export const A = out;
