import { buildPuzzle, logicSolve, clueOf } from "../../src/game/nonogram";
import { INK } from "../../src/game/types";
import { trace } from "./tt";
for (const a of process.argv.slice(2)) {
  const art = "\n" + a.split("/").join("\n");
  const s: any = { id: "g", title: "g", palette: [INK], art };
  const p = buildPuzzle(s); const r = logicSolve(p);
  const names = [...Array.from({ length: p.h }, (_, i) => "r" + i), ...Array.from({ length: p.w }, (_, i) => "c" + i)];
  const out: string[] = [];
  for (const L of names) {
    const sm = logicSolve(buildPuzzle({ ...s, smudge: [L] }));
    if (sm.unique) continue;
    const t = logicSolve(buildPuzzle({ ...s, tally: [L] }));
    const li = Number(L.slice(1)) + (L[0] === "c" ? p.h : 0);
    out.push(`${L[0]}${Number(L.slice(1)) + 1}(${clueOf(p, li).blocks.map((b: any) => b.len).join(" ")})${t.unique ? " TALLY-OK P" + t.passes + " O" + t.firstOpen + "\n" + trace({ ...s, tally: [L] }) : " sm" + sm.unknown + "/t" + t.unknown}`);
  }
  console.log(`${a} plain ${r.unique ? "OK" : "BAD" + r.unknown} P${r.passes} O${r.firstOpen}\n  ess: ${out.join(" | ")}`);
}
