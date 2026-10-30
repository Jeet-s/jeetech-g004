import { buildPuzzle, logicSolve } from "../../src/game/nonogram";
import { INK } from "../../src/game/types";
const art = "\n...#.#.#...\n.#.#.#.#.#.\n.#.#.#.#.#.\n.#########.\n########.##\n###########\n.########..\n..##...##..";
const s: any = { id: "g", title: "g", palette: [INK], art, tally: ["r0", "r1"] };
const p = buildPuzzle(s); console.log(logicSolve(p).unique, p.rows.length, p.rows.some((r: any) => !r.blocks.length));
