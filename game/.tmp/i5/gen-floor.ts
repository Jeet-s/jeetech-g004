const N = 15, c = 7; const g: string[] = [];
for (let y = 0; y < N; y++) { let s = "";
  for (let x = 0; x < N; x++) { const dx = x - c, dy = y - c; const ax = Math.abs(dx), ay = Math.abs(dy);
    let ch = ".";
    const cheb = Math.max(ax, ay), man = ax + ay;
    if (cheb === 7) ch = ((x + y) % 2 === 0) ? "a" : "b";      // border checker
    else if (cheb === 6) ch = ".";
    else {
      const inSq = cheb <= 4, inDia = man <= 5;               // eight-point star
      if (inSq || inDia) ch = "a";
      if (cheb <= 2 && man <= 3) ch = "b";                    // octagon core
      if (cheb <= 0) ch = "a";
      if ((inSq !== inDia)) ch = "a";
      if (cheb === 4 && man === 8) ch = ".";
    }
    // corner rosettes
    if (cheb <= 6 && cheb >= 5 && ax >= 5 && ay >= 5) ch = "b";
    s += ch; }
  g.push(s); }
console.log(g.join("\n"));
