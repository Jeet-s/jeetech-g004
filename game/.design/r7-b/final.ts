import { LEVELS } from "../../src/game/levels";
const ids = ["lily-frog","festival-candle","paper-boat","lantern-pinwheel","kiln-heart-mug","kiln-tea-bowl","ringed-planet","moon-rover","exhibit-carousel-horse","exhibit-mina-portrait"];
export const X = ids.map((id) => ({ ...LEVELS.find((l) => l.spec.id === id)!.spec }));
