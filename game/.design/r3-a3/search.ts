// usage: tsx search.ts file id iters maxPasses [lockRows e.g. "0,1"] 
import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[]).find((x) => x.id === process.argv[3]);
  const iters = +(process.argv[4] ?? 3000), maxP = +(process.argv[5] ?? 99);
  const base = s.art.trim().split("\n");
  const H = base.length, W = base[0].length;
  const syms = ["."].concat("abcdef".slice(0, s.palette.length).split(""));
  const T: string[] = s.tally ?? [];
  const score = (rows: string[]) => {
    const art = "\n" + rows.join("\n");
    let pz; try { pz = buildPuzzle({ ...s, art }); } catch { return 1e9; }
    const r = logicSolve(pz);
    let sc = r.unknown * 10;
    for (const t of T) { const b = logicSolve(buildPuzzle({ ...s, art, tally: T.filter((x) => x !== t), smudge: [...(s.smudge ?? []), t] })); if (b.unique) sc += 15; }
    if (r.passes > maxP) sc += 3 * (r.passes - maxP);
    let d = 0; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (rows[y][x] !== base[y][x]) d++;
    return sc + d * 2;
  };
  const seen = new Map<string, number>();
  const results: [number, string[]][] = [];
  for (let rs = 0; rs < +(process.argv[6] ?? 6); rs++) {
    let cur = base.slice(), cs = score(cur);
    for (let it = 0; it < iters; it++) {
      const y = Math.floor(Math.random() * H), x = Math.floor(Math.random() * W);
      if ("~,ABCDEF@".includes(cur[y][x])) continue;
      const v = syms[Math.floor(Math.random() * syms.length)]; if (v === cur[y][x]) continue;
      const nx = cur.slice(); nx[y] = nx[y].slice(0, x) + v + nx[y].slice(x + 1);
      const k = nx.join("/"); let ns = seen.get(k); if (ns === undefined) { ns = score(nx); seen.set(k, ns); }
      if (ns <= cs || Math.random() < 0.02) { cur = nx; cs = ns; }
      if (cs < 1e8 && cs % 1 === 0) {}
    }
    results.push([cs, cur]);
  }
  // also report best seen overall
  const all = [...seen.entries()].sort((a, b) => a[1] - b[1]).slice(0, 4);
  for (const [k, v] of all) { console.log("score", v); console.log(k.split("/").join("\n")); console.log(); }
})();
