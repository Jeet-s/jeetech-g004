import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
// compact eval: OK, looks/passes/open, each tally needed individually, each smudge/crack effect, stamp needed
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  for (const s of Object.values(mod).flat() as any[]) {
    let r; try { r = logicSolve(buildPuzzle(s)); } catch (e) { console.log(s.id, "ERR", (e as Error).message); continue; }
    const bits: string[] = [];
    for (const t of s.tally ?? []) { const q = logicSolve(buildPuzzle({ ...s, tally: s.tally.filter((x: string) => x !== t), smudge: [...(s.smudge ?? []), t] })); bits.push(`${t}:${q.unique ? "deco" : "need" + q.unknown}`); }
    if (/[,@A-F]/.test(s.art)) { const q = logicSolve(buildPuzzle({ ...s, art: s.art.replace(/,/g, ".").replace(/@/g, "#").replace(/[A-F]/g, (c: string) => c.toLowerCase()) })); bits.push(`stamp:${q.unique ? "DECO" : "need" + q.unknown}`); }
    console.log(`${s.id} ${r.unique ? "OK" : "BAD" + r.unknown} looks ${r.steps} passes ${r.passes} open ${r.firstOpen} ${bits.join(" ")}`);
  }
})();
