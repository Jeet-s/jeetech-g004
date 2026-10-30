const NIGHT = "#2B3A67", GOLD = "#E3A83B", SKY = "#6FA8DC";
const S = (id: string, art: string, t: string[] = ["r3"]) => ({ id, title: "Astronaut", palette: [NIGHT, SKY, GOLD], role: "practise", mechanics: ["color-tally"], aha: "", tally: t, art });
export const A = [
S("astronaut-helmet", `
....aaaa....
..caaaaaaa..
.aa......aa.
.a.bbbbbc.a.
aa.bbbbbb.aa
aa.bbbbbb.aa
.a..bbbb..a.
.aa......aa.
..aaaaaaaa..
.aaaacaaaaa.
aaaacccaaaaa
aaaaacaaaaaa`)];
