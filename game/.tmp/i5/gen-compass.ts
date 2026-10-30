const N = 13, c = 6; const out: string[] = [];
for (let y = 0; y < N; y++) { let s = "";
  for (let x = 0; x < N; x++) { const dx = x - c, dy = y - c; let ch = ".";
    const d = Math.hypot(dx, dy);
    if (d > 4.5 && d < 5.5) ch = "a";
    // main points
    const along = Math.max(Math.abs(dx), Math.abs(dy)), across = Math.min(Math.abs(dx), Math.abs(dy));
    if ((dx === 0 || dy === 0 || across <= (6 - along) / 3) && along <= 6 && (Math.abs(dx) === 0 || Math.abs(dy) === 0 || across <= (6 - along) / 3)) {
      if (across <= (6 - along) / 2.5) { ch = (dx === 0 || dy === 0) ? "a" : "b"; }
    }
    // diagonal points
    const u = (dx + dy) / Math.SQRT2, v = (dx - dy) / Math.SQRT2;
    const al = Math.max(Math.abs(u), Math.abs(v)), ac = Math.min(Math.abs(u), Math.abs(v));
    if (al <= 4.3 && ac <= (4.3 - al) / 3 && ch === ".") ch = "b";
    s += ch; }
  out.push(s); }
console.log(out.join("\n"));
