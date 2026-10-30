// single flips that make the plain board stuck; print the unknown cells
import * as path from "path";
import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
(async () => {
  const [file, idxS, maxU] = process.argv.slice(2);
  const mod = await import(path.resolve(file));
  const s0 = (Object.values(mod).flat() as any[])[+idxS];
  const plain = s0.art.replace(/,/g, ".").replace(/@/g, "#").replace(/[A-F]/g, (c: string) => c.toLowerCase());
  const g: string[][] = plain.trim().split("\n").map((l: string) => l.trim().split(""));
  const H = g.length, W = g[0].length;
  const colours = s0.palette.length > 1 ? [".", ..."abcdef".slice(0, s0.palette.length)] : [".", "#"];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const o = g[y][x]; if (o === "~") continue; for (const a of colours.filter((k) => k !== o)) {
    g[y][x] = a; const art = g.map((r) => r.join("")).join("\n");
    const b = logicSolve(buildPuzzle({ ...s0, art }));
    if (!b.unique && b.unknown <= +maxU) { const u: string[] = []; b.masks.forEach((m, i) => { if (m & (m - 1)) u.push(`${Math.floor(i / W) + 1},${(i % W) + 1}`); }); console.log(`r${y + 1}c${x + 1}=${a} unk ${b.unknown}: ${u.join(" ")}`); }
  } g[y][x] = o; }
})();
