// tsx flip.ts file id depth maxPasses [minColors]  -- exhaustive 0/1/2-cell flips; reports (art, line) where a single tally line is OK + needed
import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const s = (Object.values(mod).flat() as any[]).find((x) => x.id === process.argv[3]);
  const depth = +(process.argv[4] ?? 1), maxP = +(process.argv[5] ?? 5), minC = +(process.argv[6] ?? 2);
  const lock: string[] | null = s.lock ? s.lock.trim().split("\n") : null;
  const base = s.art.trim().split("\n"); const H = base.length, W = base[0].length;
  const syms = process.env.STARS ? process.env.STARS.split("") : ["."].concat("abcdef".slice(0, s.palette.length).split(""));
  const extra: string[] = s.tally ?? [];
  const cells: [number, number][] = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (!(lock && lock[y][x] === "X") && !"~,ABCDEF@".includes(base[y][x]) && (!process.env.STARS || base[y][x] === ".")) cells.push([y, x]);
  const found: string[] = [];
  const test = (rows: string[], tag: string) => {
    const art = "\n" + rows.join("\n");
    let r; try { r = logicSolve(buildPuzzle({ ...s, art, tally: extra })); } catch { return; }
    if (!r.unique) return;
    if (process.env.ONLY) {
      if (r.passes > maxP) return;
      for (const t of extra) { const c = logicSolve(buildPuzzle({ ...s, art, tally: extra.filter((x) => x !== t), smudge: [...(s.smudge ?? []), t] })); if (c.unique) return; }
      found.push(`${tag} set passes ${r.passes} looks ${r.steps} open ${r.firstOpen}\n${rows.join("\n")}\n`); return;
    }
    for (let l = 0; l < H + W; l++) {
      const k = l < H ? "r" + l : "c" + (l - H);
      if (extra.includes(k) || (s.smudge ?? []).includes(k)) continue;
      if (process.env.LINES && !process.env.LINES.split(",").includes(l < H ? "r" + (l + 1) : "c" + (l - H + 1))) continue;
      const line = l < H ? rows[l].split("") : rows.map((q) => q[l - H]);
      const cnt: Record<string, number> = {}; for (const c of line) if (c !== "." && c !== "~" && c !== ",") cnt[c.toLowerCase()] = (cnt[c.toLowerCase()] ?? 0) + 1;
      const nc = Object.keys(cnt).length; if (nc < minC) continue;
      const tot = Object.values(cnt).reduce((a, b) => a + b, 0); if (tot === line.length) continue;
      const a = logicSolve(buildPuzzle({ ...s, art, tally: [...extra, k] })); if (!a.unique || a.passes > maxP) continue;
      const b = logicSolve(buildPuzzle({ ...s, art, tally: extra, smudge: [...(s.smudge ?? []), k] })); if (b.unique) continue;
      // every earlier tally still needed?
      let allNeed = true;
      for (const t of extra) { const c = logicSolve(buildPuzzle({ ...s, art, tally: [...extra.filter((x) => x !== t), k], smudge: [...(s.smudge ?? []), t] })); if (c.unique) allNeed = false; }
      found.push(`${tag} line ${l < H ? "r" + (l + 1) : "c" + (l - H + 1)} ${JSON.stringify(cnt)} passes ${a.passes} looks ${a.steps} open ${a.firstOpen}${allNeed ? "" : " (an earlier tally decorative)"}\n${rows.join("\n")}\n`);
    }
  };
  const flip = (rows: string[], y: number, x: number, v: string) => { const n = rows.slice(); n[y] = n[y].slice(0, x) + v + n[y].slice(x + 1); return n; };
  test(base, "base");
  if (depth >= 1) for (const [y, x] of cells) for (const v of syms) if (v !== base[y][x]) {
    const r1 = flip(base, y, x, v); test(r1, `flip(${y + 1},${x + 1})=${v}`);
  }
  if (depth >= 2) for (let i = 0; i < cells.length; i++) for (let j = i + 1; j < cells.length; j++) for (const v of syms) for (const u of syms) {
    const [y, x] = cells[i], [y2, x2] = cells[j]; if (v === base[y][x] || u === base[y2][x2]) continue;
    test(flip(flip(base, y, x, v), y2, x2, u), `flip(${y + 1},${x + 1})=${v} (${y2 + 1},${x2 + 1})=${u}`);
  }
  console.log(found.slice(0, +(process.argv[7] ?? 40)).join("\n")); console.log("found", found.length);
})();
