import { A as H } from "./h1"; import { A as M } from "./m1"; import { A as AS } from "./a1"; import { A as C } from "./c1";
import { A as P2 } from "./p2";
const re = (arr: any[], id: string, pick?: string[]) => arr.filter(s => !pick || pick.includes(s.id)).map(s => ({ ...s, title: s.id, id }));
export const A = [
 ...re(H, "stargazer-hat"), ...re(M, "tailed-comet"), ...re(AS, "astronaut-helmet"), ...re(C, "exhibit-carousel-horse", ["car7"]),
 ...re(P2, "exhibit-penguin", ["pe-r3c4","pe-r6c6","pe-r7c6","pf-r3c4","pf-r5c3","pf-r8c7","pf-r9c7"]),
];
