import { execSync } from "child_process";
const out = execSync("npx tsx scripts/levels-report.ts", { maxBuffer: 1 << 26 }).toString().trim().split("\n").at(-1)!;
const { levels } = JSON.parse(out);
let total = 0; const per: number[] = [];
const table = levels.map((l: any) => {
  const t = `L${l.n} — intent: ${l.intent}\n  mechanics: ${l.mechanics.join(", ") || "-"} | optimal moves: ${l.optimal ?? "> search cap"} | choices at start: ${l.branching} | trap rate: ${l.trap ?? "?"} | win casual 45% / skilled 90%\n` + l.grid.split("\n").map((r: string) => `    ${r}`).join("\n");
  per.push(t.length); return t; }).join("\n");
total = table.length;
console.log("levels", levels.length, "table chars", total, "cutoff at 60000 → last fully visible level:", (() => { let c = 0; for (let i = 0; i < per.length; i++) { c += per[i] + 1; if (c > 60000) return i; } return per.length; })());
console.log("legend chars", levels[0].legend.length);
const nulls = levels.filter((l: any) => l.optimal === null).map((l: any) => l.n);
console.log("optimal null:", nulls.join(",") || "none", " trap>0:", levels.filter((l: any) => l.trap > 0).map((l: any) => `${l.n}:${l.trap}`).join(" "));
