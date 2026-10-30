const N = 13, c = 6; const out: string[] = [];
for (let y = 0; y < N; y++) { let s = "";
  for (let x = 0; x < N; x++) { const dx = x - c, dy = y - c; const d = Math.hypot(dx, dy); const ang = Math.atan2(dy, dx);
    let ch = ".";
    if (d <= 6.5) {
      if (d > 5.4) ch = "a";
      else if (d < 1.2) ch = "b";
      else if (d < 2.2) ch = "a";
      else { const k = ((ang / (Math.PI / 4)) % 1 + 1) % 1; const sp = Math.abs(k - 0.5) ; // 0 at petal centre
        const width = (Math.min(Math.abs(dx),Math.abs(dy))===0 || Math.abs(Math.abs(dx)-Math.abs(dy))===0);
        ch = width ? "a" : (d < 4.6 ? "b" : ".");
      }
    }
    s += ch; }
  out.push(s); }
console.log(out.join("\n"));
