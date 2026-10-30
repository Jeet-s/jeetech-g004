// random k-flip variants (k=1..K) of each spec; TALLYALL: try each line as the single tally
import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
(async () => {
  const [file, NS, KS, mlS, mpS, moS] = process.argv.slice(2);
  const mod = await import(path.resolve(file));
  let seed = 12345; const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const seen = new Set<string>();
  for (const s of Object.values(mod).flat() as any[]) {
    const rows: string[] = s.art.trim().split("\n").map((l: string) => l.trim());
    const H = rows.length, W = rows[0].length;
    const lines = [...Array(H).keys()].map((k) => "r" + k).concat([...Array(W).keys()].map((k) => "c" + k));
    const res: string[] = [];
    for (let n = 0; n < +NS; n++) {
      const g = rows.map((r) => r.split(""));
      const k = 1 + Math.floor(rnd() * +KS);
      for (let j = 0; j < k; j++) { const y = Math.floor(rnd() * H), x = Math.floor(rnd() * W); g[y][x] = g[y][x] === "#" ? "." : "#"; }
      const art = g.map((r) => r.join("")).join("\n");
      if (seen.has(art)) continue; seen.add(art);
      let p0; try { p0 = logicSolve(buildPuzzle({ ...s, art, tally: [] })); } catch { continue; }
      if (!p0.unique) continue;
      for (const t of lines) {
        let r; try { r = logicSolve(buildPuzzle({ ...s, art, tally: [t] })); } catch { continue; }
        if (!r.unique || r.steps > +mlS || r.passes > +mpS || r.firstOpen < +moS) continue;
        if (logicSolve(buildPuzzle({ ...s, art, tally: [], smudge: [t] })).unique) continue;
        res.push(`${s.title} tally ${t} looks ${r.steps} passes ${r.passes} open ${r.firstOpen}\n${art}`);
      }
    }
    console.log(res.slice(0, 6).join("\n--\n")); console.log(s.title, res.length, "found");
  }
})();
