import * as path from "path";
const m = require(path.resolve(process.env.SPEC!));
const all = Object.values(m).flat() as any[];
export const A = [all[Number(process.env.I)]];
