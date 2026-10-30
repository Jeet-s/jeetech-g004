import { sim, setTemptation } from "../src/game/sim";
import { LEVELS } from "../src/game/levels";
import { winRate } from "../scripts/bots";
for (const th of [0, 0.2, 0.5]) {
  for (const l of LEVELS) setTemptation(l.spec.id, th);
  const t=Date.now(); const out:string[]=[];
  for (let l=0;l<sim.levelCount;l++) { const c = winRate(sim, sim.start(l), "casual", 150).rate; const s = winRate(sim, sim.start(l), "skilled", 150).rate; out.push(`${c.toFixed(2)}/${s.toFixed(2)}`); }
  console.log(th, "ms", Date.now()-t, out.join(" "));
}
