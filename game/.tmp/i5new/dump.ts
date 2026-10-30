import { writeFileSync } from "fs";
import { ISL05 } from "../../src/game/islands/isl05";
ISL05.forEach((l, i) => {
  const a = l.art.trim();
  writeFileSync(`.tmp/i5new/lv${i + 1}.txt`, a + "\n");
  writeFileSync(`.tmp/i5new/lv${i + 1}b.txt`, a.replace(/[A-F]/g, (c) => c.toLowerCase()).replace(/@/g, "#").replace(/,/g, ".") + "\n");
});
