const N = 13, c = 6; const out: string[] = [];
for (let y = 0; y < N; y++) { let s = "";
  for (let x = 0; x < N; x++) { const dx = x - c, dy = y - c; const d = Math.hypot(dx, dy); const ang = Math.atan2(dy, dx);
    let ch = "~";
    if (d <= 6.6) {
      ch = ".";
      if (d > 5.5) ch = "#";
      else if (d < 1.1) ch = ".";
      else if (d < 2.3) ch = "#";
      else { const spoke = (Math.min(Math.abs(dx),Math.abs(dy))===0 || Math.abs(Math.abs(dx)-Math.abs(dy))===0);
        const k = ((ang / (Math.PI / 4)) % 1 + 1) % 1; const mid = Math.abs(k - 0.5) < 0.17;
        if (spoke && d < 4.3) ch = "#"; else if (mid && d > 3.2 && d < 4.8) ch = "#"; }
    }
    s += ch; }
  out.push(s); }
console.log(out.join("\n"));
