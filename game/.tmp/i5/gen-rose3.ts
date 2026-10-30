const N = Number(process.argv[2] ?? 13), c = (N - 1) / 2, tw = Number(process.argv[3] ?? 0.25), sp = Number(process.argv[4] ?? 8), wd = Number(process.argv[5] ?? 0.42);
const out: string[] = [];
for (let y = 0; y < N; y++) { let s = "";
  for (let x = 0; x < N; x++) { const dx = x - c, dy = y - c; const d = Math.hypot(dx, dy); const ang = Math.atan2(dy, dx);
    let ch = "~";
    if (d <= c + 0.6) { ch = ".";
      if (d > c - 0.5) ch = "#";
      else if (d < 1.0) ch = "#";
      else if (d < 1.6) ch = ".";
      else if (d < 2.5) ch = "#";
      else { const t = (ang - tw * (d - 2.5)) / (2 * Math.PI / sp); const f = Math.abs(t - Math.round(t)); if (f < wd / 2 * (1 / (d * 0.5))) ch = "#"; }
    }
    s += ch; }
  out.push(s); }
console.log(out.join("\n"));
