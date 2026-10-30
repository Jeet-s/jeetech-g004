import { chk } from "./chk";
const s = (id: string, v: string[]) => ({ id, title: id, palette: ["#D9694F", "#2E8C8A"], art: "\n" + v.join("\n") });
const vars: Record<string,string[]> = {
 S0: ["....bb....",".bbb.bbbb.","bb.bbbb.bb",".aaabbaaa.","aaaaaaa.aa","aa.aaaaaaa","aaaaa.aaaa",".aaaaaa.a.","..aaaaaa..","...aaaa..."],
 S1: ["....bb....",".bbb.bbbb.","bb.bbbb.bb",".aaabbaaa.","aaaaaaa.aa","aa.aaaaaaa","aaaaa.aaaa",".aaaaaaaa.","..aaaaaa..","...aaaa..."],
 S2: ["...bb...",".bb.bbb.","b.bbbb.b",".aabbaa.","aaaaa.aa","a.aaaaaa","aaaa.aaa",".aaaaaa.","..aaaa.."],
 S3: ["....b....",".bb.b.bb.","b.bbbbb.b",".aabbbaa.","aaaaaa.aa","a.aaaaaaa","aaaa.aaaa",".aaaaaaa.","..aaaaa..","...aaa..."],
};
for (const [k, v] of Object.entries(vars)) { try { chk(s(k, v) as any); } catch (e) { console.log(k, String(e)); } }
