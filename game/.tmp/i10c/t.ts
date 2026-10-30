/** usage: npx tsx .tmp/i10c/t.ts file [--opt] ; file blocks: header "= K smudge=r3,c5 crack=r4.1" then art */
import { readFileSync } from "fs";
import { buildPuzzle, logicSolve, isKnown } from "../../src/game/nonogram";
const [file, ...fl] = process.argv.slice(2);
const opt = fl.includes("--opt");
const only = fl.find((f) => /^\d+$/.test(f));
const blocks = readFileSync(file, "utf8").split(/^=/m).filter((s) => s.trim());
function spec(K: number, art: string, smudge: string[], crack: string[]) {
  return { id: "t", title: "t", palette: Array(K).fill("#000"), art, smudge, crack } as any;
}
function run(s: any) {
  try { const p = buildPuzzle(s); const r = logicSolve(p); return { p, r }; } catch (e) { return null; }
}
blocks.forEach((b, bi) => {
  if (only && Number(only) !== bi) return;
  const [head, ...rest] = b.split("\n");
  const art = rest.join("\n");
  const K = Number(head.trim().split(/\s+/)[0]);
  const sm = (head.match(/smudge=(\S+)/)?.[1] ?? "").split(",").filter(Boolean);
  const cr = (head.match(/crack=(\S+)/)?.[1] ?? "").split(",").filter(Boolean);
  const x = run(spec(K, art, sm, cr));
  if (!x) { console.log(`#${bi} BUILD ERROR`); return; }
  const { p, r } = x;
  const rows = art.split("\n").map((l) => l.trim()).filter(Boolean);
  // empty lines
  const empty: string[] = [];
  p.rows.forEach((c: any, i: number) => { if (!c.blocks.length && !rows[i].split("").every((ch) => ch === "~")) empty.push("r" + i); });
  p.cols.forEach((c: any, i: number) => { if (!c.blocks.length && !rows.every((row) => row[i] === "~")) empty.push("c" + i); });
  console.log(`#${bi} ${head.trim()} ${p.w}x${p.h} ${r.unique ? "OK" : "STUCK " + r.unknown} steps ${r.steps} passes ${r.passes} search ${r.search.toFixed(1)} open0 ${r.firstOpen}${empty.length ? " EMPTY " + empty.join(",") : ""}`);
  if (!r.unique) console.log(rows.map((row, y) => [...row].map((ch, xx) => (isKnown(r.masks[y * p.w + xx]) ? ch : "?")).join("")).join("\n"));
  if (opt) {
    const res: string[] = [];
    const lines = [...p.rows.map((c: any, i: number) => ["r" + i, c]), ...p.cols.map((c: any, i: number) => ["c" + i, c])] as [string, any][];
    for (const [nm, c] of lines) {
      if (!sm.includes(nm)) { const y = run(spec(K, art, [...sm, nm], cr)); if (y && y.r.unique) res.push(`${y.r.passes}p o${y.r.firstOpen} smudge ${nm}`); }
      c.blocks.forEach((_: any, k: number) => {
        const key = `${nm}.${k}`; if (cr.includes(key)) return;
        const y = run(spec(K, art, sm, [...cr, key])); if (y && y.r.unique) res.push(`${y.r.passes}p o${y.r.firstOpen} crack ${key}(${c.blocks[k].len})`);
      });
    }
    res.sort((a, b) => parseInt(b) - parseInt(a));
    console.log(res.slice(0, 25).join(" | "));
  }
});
// --stamp: greedy stamps on stuck boards
if (fl.includes("--stamp")) {
  const UP: Record<string, string> = { ".": ",", "#": "@", a: "A", b: "B", c: "C", d: "D", e: "E", f: "F" };
  blocks.forEach((b, bi) => {
    if (only && Number(only) !== bi) return;
    const [head, ...rest] = b.split("\n");
    const K = Number(head.trim().split(/\s+/)[0]);
    const sm = (head.match(/smudge=(\S+)/)?.[1] ?? "").split(",").filter(Boolean);
    const cr = (head.match(/crack=(\S+)/)?.[1] ?? "").split(",").filter(Boolean);
    let rows = rest.map((l) => l.trim()).filter(Boolean);
    for (let round = 0; round < 8; round++) {
      const x = run(spec(K, "\n" + rows.join("\n"), sm, cr))!;
      if (x.r.unique) { console.log(`#${bi} stamped OK passes ${x.r.passes} open0 ${x.r.firstOpen}\n${rows.join("\n")}`); return; }
      let best: string[] | null = null, bu = x.r.unknown, bp = 0;
      x.r.masks.forEach((m: number, i: number) => {
        if (isKnown(m)) return;
        const y = Math.floor(i / x.p.w), c = i % x.p.w;
        const nr = rows.slice(); nr[y] = nr[y].slice(0, c) + UP[nr[y][c]] + nr[y].slice(c + 1);
        const z = run(spec(K, "\n" + nr.join("\n"), sm, cr)); if (!z) return;
        const u = z.r.unique ? 0 : z.r.unknown;
        if (u < bu || (u === bu && u === 0 && z.r.passes > bp)) { bu = u; best = nr; bp = z.r.passes; }
      });
      if (!best) { console.log(`#${bi} no stamp helps`); return; }
      rows = best;
    }
    console.log(`#${bi} still stuck`);
  });
}
if (fl.includes("--edit")) {
  blocks.forEach((b, bi) => {
    if (only && Number(only) !== bi) return;
    const [head, ...rest] = b.split("\n");
    const K = Number(head.trim().split(/\s+/)[0]);
    const sm = (head.match(/smudge=(\S+)/)?.[1] ?? "").split(",").filter(Boolean);
    const cr = (head.match(/crack=(\S+)/)?.[1] ?? "").split(",").filter(Boolean);
    let rows = rest.map((l) => l.trim()).filter(Boolean);
    const orig = rows.slice();
    for (let round = 0; round < 10; round++) {
      const x = run(spec(K, "\n" + rows.join("\n"), sm, cr))!;
      if (x.r.unique) {
        const d: string[] = []; rows.forEach((r, y) => [...r].forEach((ch, c) => { if (ch !== orig[y][c]) d.push(`(${y},${c})${orig[y][c]}>${ch}`); }));
        console.log(`#${bi} edited OK passes ${x.r.passes} open0 ${x.r.firstOpen} ${d.join(" ")}\n${rows.join("\n")}`); return;
      }
      const w = x.p.w, h = x.p.h; const cand = new Set<number>();
      x.r.masks.forEach((m: number, i: number) => { if (isKnown(m)) return; const y = Math.floor(i / w), c = i % w;
        for (let dy = -1; dy <= 1; dy++) for (let dc = -1; dc <= 1; dc++) { const a = y + dy, bb = c + dc; if (a >= 0 && a < h && bb >= 0 && bb < w) cand.add(a * w + bb); } });
      let best: string[] | null = null, bu = x.r.unknown, bp = 0;
      const chars = K === 1 ? [".", "#"] : [".", ..."abcdef".slice(0, K)];
      for (const i of cand) {
        const y = Math.floor(i / w), c = i % w; const ch = rows[y][c];
        if (!chars.includes(ch)) continue;
        for (const o of chars) { if (o === ch) continue;
          const nr = rows.slice(); nr[y] = nr[y].slice(0, c) + o + nr[y].slice(c + 1);
          const z = run(spec(K, "\n" + nr.join("\n"), sm, cr)); if (!z || z.r.contradiction) continue;
          const u = z.r.unique ? 0 : z.r.unknown;
          if (u < bu || (u === 0 && bu === 0 && z.r.passes > bp)) { bu = u; best = nr; bp = z.r.passes; }
        }
      }
      if (!best) { console.log(`#${bi} no edit helps`); return; }
      rows = best;
    }
    console.log(`#${bi} still stuck`);
  });
}
