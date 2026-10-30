import { LEVELS } from "../../src/game/levels";
export const A = LEVELS.map((l: any) => ({ ...l.spec, tally: [] }));
