const s = (id: string, art: string, palette = ["#D9694F", "#C9B8A0"]) => ({ id, title: "x", palette, role: "finale", mechanics: ["color"], aha: "", art });
const rest = `
a.bb.aa.bb.a
b..........b
b.a..a..aa.b
b.aa.aa.a..b
bbbbbbbbbbbb
b.b.b..b.b.b
b..b.bb.b..b
b.b.b..b.b.b
bb........bb`;
const R3 = ["aabbaabbaabb", ".abbaabbaabb", "aabbaabbaab.", "aabbaabbaa.b", "aabb.abbaabb", "aabbaabb.abb", "a.bbaabbaabb"];
export const A = R3.map((r, i) => s("ms" + i, "\n...aabbaa...\n.aabbaabbaa.\n" + r + rest));
