import { C } from "./draw";
const W = 20, H = 20;
const c = new C(W, H);
// sun
c.ell(16, 2.5, 2.6, 2.4, "e");
// peaks: big at x=7 top y=1, small at x=14 top y=5; slope 1
for (let y = 0; y < 12; y++) for (let x = 0; x < W; x++) {
  const p1 = y >= 1 && Math.abs(x - 7) <= (y - 1);
  const p2 = y >= 5 && Math.abs(x - 14) <= (y - 5);
  if (p1 || p2) c.g[y][x] = "a";
}
// snow caps
for (let y = 1; y <= 3; y++) for (let x = 0; x < W; x++) if (c.g[y][x] === "a" && Math.abs(x - 7) <= y - 1) c.g[y][x] = "b";
c.put(5, 4, "b   b"); c.put(6,4,"a"); c.put(8,4,"a");
for (let y = 5; y <= 6; y++) for (let x = 12; x <= 16; x++) if (c.g[y][x] === "a" && Math.abs(x - 14) <= y - 5) c.g[y][x] = "b";
c.put(13, 7, "b b");
// pine trees on meadow
const pine = "  c  \n ccc \nccccc\n  f  ";
for (const [x, y] of [[0,8],[3,9],[15,8],[17,9]]) c.put(x - 2 + 2, y, pine);
// meadow strip
c.rect(0, 12, W - 1, 12, "c");
// lake
for (let y = 13; y < H; y++) for (let x = 0; x < W; x++) c.g[y][x] = "d";
// reflection of peak (inverted) in a, sparse
for (let y = 13; y < 18; y++) for (let x = 0; x < W; x++) if (Math.abs(x - 7) <= 17 - y && (y + x) % 1 === 0) c.g[y][x] = "a";
c.put(0, 18, "..dd....dddd....dd..");
c.put(0, 19, "dd..dddd....dddd..dd");
console.log("N:alpine\n" + c.str());
