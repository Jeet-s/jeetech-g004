// tsx pairflip.ts file id depth(0|1) maxPasses k(=2|3)  -- flips + sets of k tally lines (all individually needed)
import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[]).find((x) => x.id === process.argv[3]);
  const depth = +(process.argv[4] ?? 1), maxP = +(process.argv[5] ?? 5), K = +(process.argv[6] ?? 2), lim = +(process.argv[7] ?? 30);
  const lock: string[] | null = s.lock ? s.lock.trim().split("\n") : null;
  const base = s.art.trim().split("\n"); const H = base.length, W = base[0].length;
  const syms = ["."].concat("abcdef".slice(0, s.palette.length).split(""));
  const fixed: string[] = s.tally ?? [];
  const found: string[] = [];
  const nm = (k: string) => k[0] + (+k.slice(1) + 1);
  const test = (rows: string[], tag: string) => {
    const art = "\n" + rows.join("\n");
    let r; try { r = logicSolve(buildPuzzle({ ...s, art, tally: fixed })); } catch { return; }
    if (!r.unique) return;
    const cand: string[] = [];
    for (let l = 0; l < H + W; l++) {
      const k = l < H ? "r" + l : "c" + (l - H);
      if (fixed.includes(k) || (s.smudge ?? []).includes(k)) continue;
      if (process.env.LINES && !process.env.LINES.split(",").includes(nm(k))) continue;
      const line = l < H ? rows[l].split("") : rows.map((q) => q[l - H]);
      const cnt = new Set(line.filter((c) => !".~,".includes(c)).map((c) => c.toLowerCase()));
      const ink = line.filter((c) => !".~,".includes(c)).length;
      if (cnt.size < 2 || ink === line.length) continue;
      // must keep OK alone
      const a = logicSolve(buildPuzzle({ ...s, art, tally: [...fixed, k] })); if (!a.unique) continue;
      cand.push(k);
    }
    const sets: string[][] = [];
    const rec = (st: number, cur: string[]) => { if (cur.length === K - fixed.length) { sets.push(cur.slice()); return; } for (let i = st; i < cand.length; i++) { cur.push(cand[i]); rec(i + 1, cur); cur.pop(); } };
    rec(0, []);
    for (const add of sets) {
      const T = [...fixed, ...add];
      const a = logicSolve(buildPuzzle({ ...s, art, tally: T })); if (!a.unique || a.passes > maxP) continue;
      let ok = true;
      for (const t of T) { const c = logicSolve(buildPuzzle({ ...s, art, tally: T.filter((x) => x !== t), smudge: [...(s.smudge ?? []), t] })); if (c.unique) { ok = false; break; } }
      if (!ok) continue;
      found.push(`${tag} T=${T.map(nm).join("+")} passes ${a.passes} looks ${a.steps} open ${a.firstOpen}\n${rows.join("\n")}\n`);
    }
  };
  const flip = (rows: string[], y: number, x: number, v: string) => { const n = rows.slice(); n[y] = n[y].slice(0, x) + v + n[y].slice(x + 1); return n; };
  test(base, "base");
  if (depth >= 1) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (lock && lock[y][x] === "X") continue; if ("~,ABCDEF@".includes(base[y][x])) continue; for (const v of syms) if (v !== base[y][x]) test(flip(base, y, x, v), `flip(${y + 1},${x + 1})=${v}`); }
  console.log(found.slice(0, lim).join("\n")); console.log("found", found.length);
})();
