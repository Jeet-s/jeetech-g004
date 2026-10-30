import { C } from "./draw";
const c = new C(25, 25);
// chandelier
c.put(12, 0, "e"); c.put(7, 1, "d    e    d"); c.put(7, 2, "a   aaa   a"); c.put(7, 3, "aaaaaaaaaaa"); c.put(10, 4, "aaaaa");
// frames
const frame = (x0: number, y0: number, x1: number, y1: number) => { c.rect(x0, y0, x1, y0, "a"); c.rect(x0, y1, x1, y1, "a"); c.rect(x0, y0, x0, y1, "a"); c.rect(x1, y0, x1, y1, "a"); };
frame(0, 6, 6, 13); frame(8, 5, 16, 14); frame(18, 6, 24, 13);
c.put(1, 7, "f...f\nfffff\nfefef\nffdff\n.fff.\n.ccc.");
c.put(9, 6, ".dd....\n.dd.e.e\n.....e.\n.......\n..c....\n.ccc..c\nccccccc\ncecccce");
c.put(19, 7, ".ddd.\n.dad.\n..c..\nc.c.c\n.eee.\n.eee.");
// Mina from behind
c.put(2, 15, "f...f\nfffff\nfffff\nccccc");
c.put(1, 19, "fffffff\nfffffff\nfffffff\nfffffff\nfffffff");
c.put(8, 21, "f\nf");
// Ostrava from behind
c.put(20, 14, "e"); c.put(18, 15, "eeeee\nfffff\nfffff\n fff ");
c.put(17, 19, "ddddddd\nddddddd\nddddddd\nddddddd\nddddddd"); c.put(24, 20, "a\na");
// bench
c.put(9, 20, "bbbbbbb\nb.....b\nb.....b\nb.....b");
c.rect(0, 24, 24, 24, "b");
console.log("N:grand\n" + c.str());
