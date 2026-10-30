import { A as P } from "./p1";
const seen = new Set<string>();
export const B = P.filter((s: any) => { const k = s.title; if (seen.has(k)) return false; seen.add(k); return true; }).map((s: any) => ({ ...s, id: s.title + "-plain", smudge: [], art: s.art.replace(/,/g, ".").replace(/[A-F]/g, (c: string) => c.toLowerCase()) }));
