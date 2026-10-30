const N = 15, c = 7;
const star = (x: number, y: number, s: number, d: number) => { const ax = Math.abs(x - c), ay = Math.abs(y - c); return (ax <= s && ay <= s) || ax + ay <= d; };
const edge = (x: number, y: number, s: number, d: number) => star(x, y, s, d) && [[1,0],[-1,0],[0,1],[0,-1]].some(([u, v]) => !star(x + u, y + v, s, d));
const variant = process.argv[2];
const out: string[] = [];
for (let y = 0; y < N; y++) { let s = "";
  for (let x = 0; x < N; x++) {
    const ax = Math.abs(x - c), ay = Math.abs(y - c);
    let ch = ".";
    if (edge(x, y, 4, 7)) ch = "a";
    else if (variant.includes("1") && edge(x, y, 2, 4)) ch = "b";
    else if (variant.includes("2") && star(x,y,2,4) && !edge(x,y,2,4)) ch = ax+ay===0 ? "a" : "b";
    else if (variant.includes("3") && star(x,y,4,7) && !star(x,y,2,4) && (ax===ay)) ch = "b";
    else if (variant.includes("4") && star(x,y,4,7) && !star(x,y,2,4) && (ax===0||ay===0)) ch = "b";
    else if (variant.includes("5") && star(x,y,1,1)) ch = "a";
    s += ch; }
  out.push(s); }
console.log(out.join("\n") + "\n");
