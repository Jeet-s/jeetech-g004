// usage: tsx auto.ts file id iters maxPasses restarts  -- mutates art; T = spec.tally (fixed) or, if spec.tally is "auto", the best single line
import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[]).find((x) => x.id === process.argv[3]);
  const iters = +(process.argv[4] ?? 1000), maxP = +(process.argv[5] ?? 99), restarts = +(process.argv[6] ?? 3);
  const lock: string[] = s.lock ? s.lock.trim().split("\n") : null;
  const base = s.art.trim().split("\n");
  const H = base.length, W = base[0].length;
  const syms = ["."].concat("abcdef".slice(0, s.palette.length).split(""));
  const auto = s.tally === "auto";
  const lines = [...Array(H).keys()].map((i) => "r" + i).concat([...Array(W).keys()].map((i) => "c" + i));
  const evalT = (art: string, T: string[]) => {
    const r = logicSolve(buildPuzzle({ ...s, art, tally: T }));
    let sc = r.unknown * 10; if (r.passes > maxP) sc += 3 * (r.passes - maxP);
    for (const t of T) { const b = logicSolve(buildPuzzle({ ...s, art, tally: T.filter((x) => x !== t), smudge: [...(s.smudge ?? []), t] })); if (b.unique) sc += 15; else sc += Math.max(0, 6 - b.unknown); }
    return sc;
  };
  const score = (rows: string[]): [number, string] => {
    const art = "\n" + rows.join("\n");
    let d = 0; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (rows[y][x] !== base[y][x]) d++;
    try {
      if (!auto) return [evalT(art, s.tally ?? []) + d * 2, ""];
      let best = 1e9, bl = "";
      for (const l of lines) { const cells = l[0]==="r" ? rows[+l.slice(1)].split("") : rows.map((r) => r[+l.slice(1)]); const nc = new Set(cells.filter((c) => c !== "." && c !== "~")).size; if (nc < (s.minColors ?? 1)) continue; const v = evalT(art, [...(s.extra ?? []), l]); if (v < best) { best = v; bl = l; } if (best === 0) break; }
      return [best + d * 2, bl];
    } catch { return [1e9, ""]; }
  };
  const seen = new Map<string, [number, string]>();
  for (let rs = 0; rs < restarts; rs++) {
    let cur = base.slice(), cs = score(cur)[0];
    for (let it = 0; it < iters; it++) {
      const y = Math.floor(Math.random() * H), x = Math.floor(Math.random() * W);
      if ("~,ABCDEF@".includes(cur[y][x])) continue;
      if (lock && lock[y][x] === "X") continue;
      const v = syms[Math.floor(Math.random() * syms.length)]; if (v === cur[y][x]) continue;
      const nx = cur.slice(); nx[y] = nx[y].slice(0, x) + v + nx[y].slice(x + 1);
      const k = nx.join("/"); let ns = seen.get(k); if (!ns) { ns = score(nx); seen.set(k, ns); }
      if (ns[0] <= cs || Math.random() < 0.03) { cur = nx; cs = ns[0]; }
    }
  }
  const all = [...seen.entries()].sort((a, b) => a[1][0] - b[1][0]).slice(0, +(process.argv[7] ?? 4));
  for (const [k, v] of all) { console.log("score", v[0], v[1]); console.log(k.split("/").join("\n")); console.log(); }
})();
