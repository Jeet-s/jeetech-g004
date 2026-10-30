import { ISL09 } from "../../src/game/islands/isl09";
import { ISL10 } from "../../src/game/islands/isl10";
const want = ["brass-telescope","stargazer-hat","tailed-comet","astronaut-helmet","brass-orrery","exhibit-carousel-horse","exhibit-penguin"];
export const A = [...ISL09, ...ISL10].filter(s => want.includes(s.id));
