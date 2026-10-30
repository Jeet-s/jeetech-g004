import { ISL09 } from "../../src/game/islands/isl09";
import { ISL10 } from "../../src/game/islands/isl10";
import { ISL07 } from "../../src/game/islands/isl07";
export const A = [ISL07.find(l=>l.id==="koi-fish")!, ...ISL09, ...ISL10];
