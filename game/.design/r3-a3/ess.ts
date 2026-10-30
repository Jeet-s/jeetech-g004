// tsx ess.ts file id iters maxPasses -- hill-climb: plain OK; find line whose smudge leaves unknowns and whose tally solves (needed)
import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[]).find((x) => x.id === process.argv[3]);
  const iters = +(process.argv[4] ?? 400), maxP = +(process.argv[5] ?? 6);
  const lock: string[] | null = s.lock ? s.lock.trim().split("\n") : null;
  let base = s.art.trim().split("\n"); const H = base.length, W = base[0].length;
  const syms = process.env.STARS ? process.env.STARS.split("") : ["."].concat("abcdef".slice(0, s.palette.length).split(""));
  let fixed: string[] = (s.tally ?? []).slice();
  const want = process.env.LINES ? process.env.LINES.split(",") : null;
  const evalArt = (rows: string[]): [number, string] => {
    const art = "\n" + rows.join("\n");
    let d = 0; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (rows[y][x] !== base[y][x]) d++;
    let r; try { r = logicSolve(buildPuzzle({ ...s, art, tally: fixed })); } catch { return [1e9, ""]; }
    if (!r.unique) return [1000 + r.unknown * 10 + d * 3, ""];
    let best = 0, bl = "";
    for (let l = 0; l < H + W; l++) {
      const k = l < H ? "r" + l : "c" + (l - H); const n1 = l < H ? "r" + (l + 1) : "c" + (l - H + 1);
      if (fixed.includes(k) || (want && !want.includes(n1))) continue;
      const line = l < H ? rows[l].split("") : rows.map((q) => q[l - H]);
      const cs = new Set(line.filter((c) => !".~,".includes(c))); const ink = line.filter((c) => !".~,".includes(c)).length;
      if (cs.size < 2 || ink === line.length) continue;
      const sm = logicSolve(buildPuzzle({ ...s, art, tally: fixed, smudge: [...(s.smudge ?? []), k] }));
      if (sm.unique) continue;
      let v = Math.min(sm.unknown, 20);
      const t = logicSolve(buildPuzzle({ ...s, art, tally: [...fixed, k] }));
      if (t.unique) {
        let allNeed = true; for (const f of fixed) { const c = logicSolve(buildPuzzle({ ...s, art, tally: [...fixed.filter((x) => x !== f), k], smudge: [...(s.smudge ?? []), f] })); if (c.unique) allNeed = false; }
        v = allNeed ? (t.passes <= maxP ? 100 : 60 - t.passes) : 30;
      }
      if (v > best) { best = v; bl = n1; }
    }
    return [-best + d * 3, bl];
  };
  const K = +(process.env.K ?? 1);
  for (let round = 0; round < K; round++) {
  const seen = new Map<string, [number, string]>();
  let cur = base.slice(), cs = evalArt(cur)[0]; seen.set(cur.join("/"), evalArt(cur));
  for (let it = 0; it < iters; it++) {
    const y = Math.floor(Math.random() * H), x = Math.floor(Math.random() * W);
    if ("~,ABCDEF@".includes(cur[y][x]) || (lock && lock[y][x] === "X")) continue;
    if (process.env.STARS && base[y][x] !== ".") continue;
    const v = syms[Math.floor(Math.random() * syms.length)]; if (v === cur[y][x]) continue;
    const nx = cur.slice(); nx[y] = nx[y].slice(0, x) + v + nx[y].slice(x + 1);
    const k = nx.join("/"); let ns = seen.get(k); if (!ns) { ns = evalArt(nx); seen.set(k, ns); }
    if (ns[0] <= cs || Math.random() < 0.05) { cur = nx; cs = ns[0]; }
  }
  const all = [...seen.entries()].sort((a, b) => a[1][0] - b[1][0]).slice(0, +(process.env.TOP ?? 3));
  console.log("ROUND", round + 1, "fixed", fixed.join(","));
  for (const [k, v] of all) { console.log("score", v[0], v[1]); console.log(k.split("/").join("\n")); console.log(); }
  const [bk, bv] = all[0];
  const sc = bv[0]; let d = 0; const br = bk.split("/"); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (br[y][x] !== base[y][x]) d++;
  if (sc - d * 3 > -100) { console.log("no full success this round"); break; }
  base = br; const ln = bv[1]; fixed.push((ln[0]) + (+ln.slice(1) - 1));
  console.log("ACCEPT", ln, "tally0", JSON.stringify(fixed)); console.log(base.join("\n"));
  }
})();
