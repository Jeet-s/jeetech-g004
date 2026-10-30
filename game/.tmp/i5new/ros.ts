const N = 15, c = 7; const out: string[] = [];
const inStar = (x: number, y: number) => { const ax = Math.abs(x - c), ay = Math.abs(y - c); return (ax <= 4 && ay <= 4) || ax + ay <= 7; };
for (let y = 0; y < N; y++) { let s = "";
  for (let x = 0; x < N; x++) {
    const ax = Math.abs(x - c), ay = Math.abs(y - c);
    let ch = ".";
    if (inStar(x, y)) {
      const edge = [[1,0],[-1,0],[0,1],[0,-1]].some(([u, v]) => !inStar(x + u, y + v));
      if (edge) ch = "a";
      else if (ax + ay <= 2) ch = ax + ay === 0 ? "b" : "a";
      else if (Math.max(ax, ay) === 3 && ax+ay<=4 ) ch = "a";
      else ch = "b";
    }
    s += ch; }
  out.push(s); }
console.log(out.join("\n"));
