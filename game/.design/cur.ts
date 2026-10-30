import { LEVELS } from "../src/game/levels";
const ids = process.argv.slice(2).map(Number).map((n) => LEVELS[n - 1].spec);
export const A = ids;
