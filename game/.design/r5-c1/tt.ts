import * as path from "path";
import { buildPuzzle, clueOf, startMasks, lineCount, lineOpen, applyLine, lineIndices } from "../../src/game/nonogram";
// tt.ts file [id] : for each tally firing print pass, line, before -> after
function nsol(lens: number[], m: number[]): number {
  const n = m.length; let c = 0;
  const rec = (k: number, pos: number) => {
    if (k === lens.length) { for (let i = pos; i < n; i++) if (!(m[i] & 1)) return; c++; return; }
    for (let s = pos; s + lens[k] <= n; s++) {
      let ok = true; for (let i = pos; i < s; i++) if (!(m[i] & 1)) { ok = false; break; }
      if (!ok) break;
      for (let i = s; i < s + lens[k]; i++) if (!(m[i] & 2)) { ok = false; break; }
      if (ok && s + lens[k] < n && !(m[s + lens[k]] & 1)) ok = false;
      if (ok) rec(k + 1, s + lens[k] + (s + lens[k] < n ? 1 : 0));
    }
  };
  rec(0, 0); return c;
}
export function trace(s: any) {
  const p = buildPuzzle(s); const known = (m: number) => (m & (m - 1)) === 0;
  const ch = (m: number) => known(m) ? (m === 1 ? "." : "#") : "?";
  let masks = startMasks(p); const out: string[] = [];
  for (let pass = 1; pass < 40; pass++) {
    const start = masks; let cur = masks; let any = false;
    for (let l = 0; l < lineCount(p); l++) {
      if (!lineOpen(p, start, l)) continue;
      const nx = applyLine(p, start, l); if (!nx || nx === start) continue; any = true;
      const nxt = cur.slice(); const idx = lineIndices(p.w, p.h, l);
      for (const i of idx) if (nx[i] !== start[i]) nxt[i] &= nx[i];
      cur = nxt;
      if (clueOf(p, l).tally) {
        const cnt = clueOf(p, l).blocks.reduce((a: number, b: any) => a + b.len, 0);
        const cross: string[] = [];
        for (const i of idx) if (nx[i] !== start[i]) {
          const cl = l < p.h ? p.h + (i % p.w) : Math.floor(i / p.w);
          if (clueOf(p, cl).tally) continue;
          const ci = lineIndices(p.w, p.h, cl); const lens = clueOf(p, cl).blocks.map((b: any) => b.len);
          const after = start.slice(); for (const j of idx) after[j] = nx[j];
          const a = nsol(lens, ci.map((j) => start[j])), b = nsol(lens, ci.map((j) => after[j]));
          if (a !== b) cross.push(`${cl < p.h ? "r" + (cl + 1) : "c" + (cl - p.h + 1)}:${a}->${b}`);
        }
        out.push(`  p${pass} ${l < p.h ? "r" + (l + 1) : "c" + (l - p.h + 1)}=${cnt}: ${idx.map((i) => ch(start[i])).join("")} -> ${idx.map((i) => ch(nx[i])).join("")}  ${cross.join(" ")}`);
      }
    }
    if (!any) break; masks = cur;
  }
  return out.join("\n");
}
if (require.main === module) (async () => {
  const mod = await import(path.resolve(process.argv[2]));
  for (const s of Object.values(mod).flat() as any[]) { if (process.argv[3] && s.id !== process.argv[3]) continue; if (!s.tally?.length) continue; console.log(s.id); console.log(trace(s)); }
})();
