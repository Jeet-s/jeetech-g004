import { ISL10 } from "../../src/game/islands/isl10";
const [n, ...cs] = process.argv.slice(2).map(Number); const rows = ISL10[n - 1].art.trim().split("\n");
for (const c of cs) console.log("col" + c, rows.map((r) => r[c - 1]).join(""));
