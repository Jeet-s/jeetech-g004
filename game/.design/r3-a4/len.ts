import { ISL04 } from "../../src/game/islands/isl04"; import { ISL05 } from "../../src/game/islands/isl05"; import { ISL10 } from "../../src/game/islands/isl10";
for (const l of [...ISL04, ...ISL05, ...ISL10]) if (["marble-bust","mosaic-toucan","mosaic-black-swan","exhibit-old-painter","grand-paint-palette","exhibit-grand-masterwork"].includes(l.id)) console.log(l.id, l.aha.length);
