import { INK } from "../../src/game/types";
const S = (art: string, t: string[], n = "") => ({ id: "acorn" + n, title: "Swallow", palette: [INK], role: "breather", mechanics: ["tally"], aha: "", tally: t, art: "\n" + art.split("/").join("\n") });
export const A = [
  S("...###.../..##.##../..#####../.###.###./.#.....#./.##...##./..#####../.#######./...#.#.../...#.#...", ["c1"], "a"),
];
