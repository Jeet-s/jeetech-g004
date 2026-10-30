import { C } from "./draw";
const W = 25, H = 25;
const c = new C(W, H);
// lamps
c.put(5, 0, "eee"); c.put(6, 1, "e"); c.put(17, 0, "eee"); c.put(18, 1, "e");
// frame rows 2..19, cols 1..23, thickness 2
c.rect(1, 2, 23, 19, "a");
c.rect(3, 4, 21, 17, ".");
// ornaments: umber studs along frame middle line
for (let x = 3; x <= 21; x += 3) { c.set(x, 2, "b"); c.set(x, 19, "b"); }
for (let y = 5; y <= 17; y += 3) { c.set(1, y, "b"); c.set(23, y, "b"); }
c.set(2, 3, "b"); c.set(22, 3, "b"); c.set(2, 18, "b"); c.set(22, 18, "b");
// painting: sun
c.ell(18, 6.5, 1.6, 1.6, "a");
// hills
for (let x = 3; x <= 21; x++) {
  const h1 = Math.round(14.5 + 1.6 * Math.cos((x - 5) / 3.2));
  for (let y = h1; y <= 17; y++) c.set(x, y, "f");
}
// tree canopy
c.ell(10, 8.5, 5.2, 3.8, "c");
for (const [x, y] of [[8,6],[11,6],[6,8],[9,9],[12,8],[14,9],[7,10],[11,11],[10,5]]) c.set(x, y, "d");
c.rect(9, 12, 10, 15, "b"); c.set(8, 15, "b"); c.set(11, 15, "b");
// birds

// rope + posts
for (const x of [2, 12, 22]) { c.rect(x, 20, x, 23, "e"); c.set(x - 1, 23, "e"); c.set(x + 1, 23, "e"); }
c.rect(3,21,11,21,"d"); c.rect(13,21,21,21,"d"); c.rect(6,22,8,22,"d"); c.rect(16,22,18,22,"d");
// floor
c.rect(0, 24, 24, 24, "b");
console.log("N:grand\n" + c.str());
