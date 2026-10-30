const N = 13, c = 6; const out: string[] = [];
const [r1, r2, vr] = process.argv.slice(2).map(Number);
for (let y = 0; y < N; y++) { let s = "";
  for (let x = 0; x < N; x++) {
    const dx = x - c, dy = y - c, d = Math.hypot(dx, dy), ax = Math.abs(dx), ay = Math.abs(dy);
    let ch = ".";
    if (d > vr) ch = "~";
    else if ((ax === 0 && ay <= 6) || (ay === 0 && ax <= 6) || (ax + ay <= Number(process.env.D ?? 3)) ) ch = (process.env.G && ax+ay<=1 && ax+ay>0) ? "b" : "a";
    else if (ax === ay && ax <= 3) ch = "a";
    else if (d >= r1 && d < r2) ch = "b";
    s += ch; }
  out.push(s); }
console.log(out.join("\n"));
