const [a, b] = process.argv.slice(2).map(Number); const o: string[] = [];
for (let y = 0; y < 15; y++) { let s = ""; for (let x = 0; x < 15; x++) { const d = Math.hypot(x - 7, y - 7); s += d >= a && d < b ? "b" : "."; } o.push(s); }
console.log(o.join("\n"));
