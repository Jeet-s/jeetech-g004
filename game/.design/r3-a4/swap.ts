// list 2x2 swaps that keep every clue (=> no-stamp ambiguous), for art in a spec file
import * as path from "path";
import { buildPuzzle } from "../../src/game/nonogram";
(async () => {
  const mod = await import(path.resolve(process.argv[2]));
  const specs = (Object.values(mod).flat() as any[]).filter((s) => !process.argv[3] || s.id === process.argv[3]);
  for (const s of specs) {
    const art = s.art.replace(/,/g, ".").replace(/@/g, "#").replace(/[A-F]/g, (c: string) => c.toLowerCase());
    const g = art.split("\n").map((l: string) => l.trim()).filter((l: string) => l.length).map((l: string) => l.split(""));
    const key = (gg: string[][]) => { const p = buildPuzzle({ ...s, art: gg.map((r) => r.join("")).join("\n"), smudge: [], crack: [], tally: [] }); return JSON.stringify([p.rows, p.cols]); };
    const k0 = key(g); const H = g.length, W = g[0].length; const out: string[] = [];
    for (let a = 0; a < H; a++) for (let b = a + 1; b < H; b++) for (let c = 0; c < W; c++) for (let d = c + 1; d < W; d++) {
      const x = g[a][c], y = g[a][d], z = g[b][c], w = g[b][d];
      if ([x, y, z, w].includes("~")) continue;
      if (x === w && y === z && x !== y) {
        const h = g.map((r) => r.slice()); h[a][c] = y; h[a][d] = x; h[b][c] = w; h[b][d] = z;
        if (key(h) === k0) out.push(`r${a + 1}/r${b + 1} x c${c + 1}/c${d + 1}`);
      }
    }
    console.log(s.id, out.join("  ") || "none");
  }
})();
