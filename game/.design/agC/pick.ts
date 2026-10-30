import * as path from "path";
// usage: SRC=<file> IDX=<n> npx tsx .design/rate.ts .design/agC/pick.ts
const mod = require(path.resolve(process.env.SRC!));
const all = (Object.values(mod).flat() as any[]);
export const A = [all[Number(process.env.IDX)]];
