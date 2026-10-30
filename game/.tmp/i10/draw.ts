export class C {
  g: string[][];
  constructor(public w: number, public h: number, bg = ".") { this.g = Array.from({ length: h }, () => Array(w).fill(bg)); }
  set(x: number, y: number, ch: string) { if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.g[y][x] = ch; }
  get(x: number, y: number) { return this.g[y]?.[x]; }
  ell(cx: number, cy: number, rx: number, ry: number, ch: string, only?: string) {
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) {
      const dx = (x - cx) / rx, dy = (y - cy) / ry;
      if (dx * dx + dy * dy <= 1.0001 && (!only || only.includes(this.g[y][x]))) this.g[y][x] = ch;
    }
    return this;
  }
  rect(x0: number, y0: number, x1: number, y1: number, ch: string) { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) this.set(x, y, ch); return this; }
  put(x: number, y: number, rows: string) { rows.split("\n").forEach((r, dy) => [...r].forEach((ch, dx) => { if (ch !== " ") this.set(x + dx, y + dy, ch); })); return this; }
  replace(from: string, to: string) { for (const r of this.g) for (let x = 0; x < r.length; x++) if (r[x] === from) r[x] = to; return this; }
  str() { return this.g.map((r) => r.join("")).join("\n"); }
}
