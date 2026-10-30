import { ISL10 } from "../../src/game/islands/isl10";
import { buildPuzzle } from "../../src/game/nonogram";
const n = Number(process.argv[2]); const s = ISL10[n - 1]; const p: any = buildPuzzle(s);
const f = (c: any) => c.blocks.map((b: any) => b.len + "?abcdef"[b.color ?? 0] + (b.hidden ? "?" : "")).join(" ");
const rows = s.art.trim().split("\n");
console.log(s.title, s.smudge, s.crack);
rows.forEach((r, i) => console.log(String(i + 1).padStart(2), r, f(p.rows[i])));
p.cols.forEach((c: any, i: number) => console.log("c" + (i + 1), f(c)));
