import { readFileSync } from "fs";
import { buildPuzzle, logicSolve, isKnown } from "../../../src/game/nonogram";
const parts = readFileSync(0, "utf8").split(/\n\s*\n/).filter((s) => s.trim());
const run = (rows: string[]) => { const art = rows.join("\n"); const p = buildPuzzle({ id: "t", title: "t", palette: ["#000"], art } as any); return { p, r: logicSolve(p) }; };
for (const part of parts) {
  const rows = part.split("\n").map((l) => l.trim()).filter(Boolean);
  const { p, r } = run(rows);
  const empt = (rs: string[]) => { const e: string[] = []; rs.forEach((row, y) => { if (!row.includes("#")) e.push("r" + y); }); for (let x = 0; x < rs[0].length; x++) if (!rs.some((row) => row[x] === "#")) e.push("c" + x); return e.join(","); };
  console.log(`${p.w}x${p.h} ${r.unique ? "OK" : "STUCK " + r.unknown} steps ${r.steps} passes ${r.passes} search ${r.search.toFixed(1)} open0 ${r.firstOpen} ${empt(rows) ? "EMPTY " + empt(rows) : ""}`);
  if (r.unique) continue;
  console.log(rows.map((row, y) => [...row].map((ch, x) => (isKnown(r.masks[y * p.w + x]) ? ch : "?")).join("")).join("\n"));
  const fixes: [number, string][] = [];
  for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) {
    if (isKnown(r.masks[y * p.w + x])) continue;
    const rr = rows.map((s) => s.split(""));
    rr[y][x] = rr[y][x] === "#" ? "." : "#";
    const t = run(rr.map((a) => a.join("")));
    if (t.r.unique) fixes.push([t.r.search, `(${x},${y}) ${rows[y][x]}->${rr[y][x]} search ${t.r.search.toFixed(1)} passes ${t.r.passes}`]);
    else fixes.push([1e6 + t.r.unknown, `(${x},${y}) -> unk ${t.r.unknown}`]);
  }
  fixes.sort((a, b) => a[0] - b[0]); console.log(fixes.slice(0, 8).map((f) => f[1]).join("\n"));
}
