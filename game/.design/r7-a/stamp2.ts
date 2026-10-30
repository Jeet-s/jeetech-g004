// flips (depth 1, or 2 within REG) making the plain board stuck; then two stamps, each needed. args: file idx minLooks maxPasses depth
import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
(async () => {
  const [file, idxS, minL, maxP, depS] = process.argv.slice(2);
  const mod = await import(path.resolve(file));
  const s0 = (Object.values(mod).flat() as any[])[+idxS];
  const plain = s0.art.replace(/,/g, ".").replace(/@/g, "#").replace(/[A-F]/g, (c: string) => c.toLowerCase());
  const rows0: string[] = plain.trim().split("\n").map((l: string) => l.trim());
  const H = rows0.length, W = rows0[0].length;
  const colours = s0.palette.length > 1 ? [".", ..."abcdef".slice(0, s0.palette.length)] : [".", "#"];
  const reg = (y: number, x: number) => !process.env.REG || process.env.REG.split(";").some((q) => { const [a, b, c, d] = q.split(",").map(Number); return y + 1 >= a && y + 1 <= b && x + 1 >= c && x + 1 <= d; });
  const st = (ch: string) => ch === "." ? "," : ch === "#" ? "@" : ch.toUpperCase();
  const out: string[] = [];
  const tryArt = (g: string[][], d: string) => {
    const art = g.map((r) => r.join("")).join("\n");
    let p; try { p = buildPuzzle({ ...s0, art }); } catch { return; }
    const base = logicSolve(p); if (base.unique) return;
    const unk: number[] = []; base.masks.forEach((m, i) => { if (m & (m - 1)) unk.push(i); });
    if (unk.length > 30) return;
    const single = new Set<number>();
    for (const i of unk) { const g2 = g.map((r) => r.slice()); g2[Math.floor(i / W)][i % W] = st(g2[Math.floor(i / W)][i % W]); if (logicSolve(buildPuzzle({ ...s0, art: g2.map((r) => r.join("")).join("\n") })).unique) single.add(i); }
    for (let a = 0; a < unk.length; a++) for (let b = a + 1; b < unk.length; b++) {
      const i = unk[a], j = unk[b]; if (single.has(i) || single.has(j)) continue;
      const g2 = g.map((r) => r.slice()); g2[Math.floor(i / W)][i % W] = st(g2[Math.floor(i / W)][i % W]); g2[Math.floor(j / W)][j % W] = st(g2[Math.floor(j / W)][j % W]);
      const r = logicSolve(buildPuzzle({ ...s0, art: g2.map((r) => r.join("")).join("\n") }));
      if (r.unique && r.steps >= +minL && r.passes <= +maxP) out.push(`${r.steps} ${d} stamps r${Math.floor(i / W) + 1}c${(i % W) + 1}${g2[Math.floor(i / W)][i % W]} r${Math.floor(j / W) + 1}c${(j % W) + 1}${g2[Math.floor(j / W)][j % W]} looks ${r.steps} passes ${r.passes} open ${r.firstOpen} (unk ${unk.length})`);
    }
  };
  const g = rows0.map((r) => r.split(""));
  tryArt(g, "base");
  const cells: [number, number][] = []; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (g[y][x] !== "~" && reg(y, x)) cells.push([y, x]);
  for (let i = 0; i < cells.length; i++) {
    const [y, x] = cells[i]; const o = g[y][x];
    for (const a of colours.filter((k) => k !== o)) {
      g[y][x] = a; tryArt(g, `r${y + 1}c${x + 1}=${a}`);
      if (+(depS ?? 1) >= 2) for (let j = i + 1; j < cells.length; j++) { const [y2, x2] = cells[j]; const o2 = g[y2][x2]; for (const b of colours.filter((k) => k !== o2)) { g[y2][x2] = b; tryArt(g, `r${y + 1}c${x + 1}=${a} r${y2 + 1}c${x2 + 1}=${b}`); } g[y2][x2] = o2; }
      g[y][x] = o;
    }
  }
  out.sort((a, b) => parseInt(b) - parseInt(a));
  console.log(out.slice(0, 30).join("\n")); console.log(out.length, "found");
})();
