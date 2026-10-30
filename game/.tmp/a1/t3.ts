import { chk, trace } from "./chk";
const s = (id: string, art: string, palette: string[]) => ({ id, title: id, palette, art });
const R = "#D9694F", G = "#2E8C8A", B = "#8A5A3C";
for (const sp of [
s("cherryC", `
.....bbb..
..bbbbb.b.
..b.....b.
..b.....b.
.aaa...aaa
aaaaa.aaaaa
aa.aa.a.aaa
aaaaa.aaaaa
.aaa...aaa.`.split("\n").map(l=>l.slice(0,10)).join("\n"), [R, B]),
s("cherryD", `
......bb..
.....bbbb.
..bbbbb...
..b....b..
..b....b..
.aaa..aaa.
aaaaaaaaaa
a.aaaa.aaa
aaaaaaaaaa
.aaa..aaa.`, [R, B]),
s("cherryE", `
......bb..
.....bbbb.
..bbbbb...
..b....b..
.aaa...b..
aaaaa.aaa.
a.aaaaaaaa
aaaaaaa.aa
.aaa.aaaaa
......aaa.`, [R, B]),
]) { try { chk(sp as any); trace(sp as any, 2); } catch (e) { console.log(sp.id, String(e)); } }
