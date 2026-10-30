import { buildPuzzle, logicSolve, clueOf } from "../../src/game/nonogram";
import { INK } from "../../src/game/types";
for (const a of process.argv.slice(2)) {
  const art = a.trim().split(/[\n\/ ]+/).join("\n");
  const s: any = { id: "g", title: "g", palette: [INK], art: "\n" + art };
  const p = buildPuzzle(s); const h = p.h, w = p.w; const pl = logicSolve(p);
  const names = [...Array.from({ length: h }, (_, i) => "r" + i), ...Array.from({ length: w }, (_, i) => "c" + i)];
  const out: string[] = [];
  for (const L of names) {
    const sm = logicSolve(buildPuzzle({ ...s, smudge: [L] })); if (sm.unique) continue;
    const t = logicSolve(buildPuzzle({ ...s, tally: [L] }));
    const li = Number(L.slice(1)) + (L[0] === "c" ? h : 0);
    out.push(`${L[0]}${Number(L.slice(1)) + 1}=${clueOf(p, li).blocks.map((q: any) => q.len).join(" ")} sm-U${sm.unknown} tally:${t.unique ? `OK L${t.steps} P${t.passes} O${t.firstOpen}` : "BAD" + t.unknown}`);
  }
  console.log(`${w}x${h} plain ${pl.unique ? "OK" : "BAD"} L${pl.steps} P${pl.passes} O${pl.firstOpen} :: ${out.join(" | ")}`);
}
