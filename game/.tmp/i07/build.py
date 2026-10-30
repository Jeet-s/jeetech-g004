import json
A=lambda f: open(f).read().strip()
L=[
 dict(id="paper-lantern",title="Paper Lantern",pal='["#D9694F", "#E3A83B"]',role="teach",mech='["smudged"]',sm='["r5"]',art=A("paper-lantern.art")),
 dict(id="festival-kite",title="Festival Kite",pal='["#6FA8DC", "#D9694F"]',role="teach",mech='["smudged", "color"]',sm='["r2"]',art=A("festival-kite.art")),
 dict(id="festival-drum",title="Festival Drum",pal='["#D9694F", "#E3A83B", "#8A5A3C"]',role="practise",mech='["smudged", "color"]',sm='["r5"]',art=A("festival-drum.art")),
 dict(id="koi-fish",title="Koi Fish",pal='["#D9694F", "#E3A83B"]',role="practise",mech='["smudged", "color", "overlap"]',sm='["r7"]',art=A("koi-fish.art")),
 dict(id="fireworks-burst",title="Fireworks Burst",pal='["#E3A83B", "#D9694F", "#8C6BB1"]',role="twist",mech='["smudged", "color"]',sm='["c6"]',art=A("fireworks-burst.art")),
 dict(id="moon-lantern",title="Moon and Lantern",pal='["#2B3A67", "#E3A83B", "#D9694F"]',role="boss",mech='["smudged", "void", "color"]',sm='["c7"]',art=A("moonF.art")),
 dict(id="festival-candle",title="Candle",pal='["#E3A83B", "#D9694F"]',role="breather",mech='["smudged", "color"]',sm='["r7"]',art=A("festival-candle.art")),
 dict(id="festival-parasol",title="Parasol",pal='["#D9694F", "#E3A83B", "#8A5A3C"]',role="practise",mech='["smudged", "color"]',sm='["c9"]',art=A("festival-parasol.art")),
 dict(id="firefly-jar",title="Firefly Jar",pal='["#6FA8DC", "#E3A83B", "#8A5A3C", "#2B3A67"]',role="combine",mech='["smudged", "stamp", "color"]',sm='["r6", "c3"]',art=A("jarF.art")),
 dict(id="paper-boat",title="Paper Boat",pal='[INK]',role="twist",mech='["smudged", "overlap"]',sm='["r7"]',art=A("pb_B2.art")),
 dict(id="dragon-kite",title="Dragon Kite",pal='["#D9694F", "#E3A83B", "#2B3A67", "#6FA8DC"]',role="combine",mech='["smudged", "stamp", "color"]',sm='["r4", "c0"]',art=A("dragonF.art")),
 dict(id="lantern-festival",title="Lantern Festival",pal='["#2B3A67", "#E3A83B", "#D9694F", "#8A5A3C"]',role="finale",mech='["smudged", "stamp", "color"]',sm='["r7", "c8"]',art=A("finF.art")),
]
aha={}
try: aha=json.load(open("aha.json"))
except: pass
out=['import { INK, type LevelSpec } from "../types";','','/** Island 7 — Lantern Gallery. Festival night. Teaches: smudged clue lines, painted from their crossings. */','export const ISL07: LevelSpec[] = [']
for l in L:
    out.append("  {")
    out.append(f'    id: "{l["id"]}", title: "{l["title"]}", palette: {l["pal"]}, role: "{l["role"]}", mechanics: {l["mech"]},')
    out.append(f'    smudge: {l["sm"]}, aha: {json.dumps(aha.get(l["id"],"x"), ensure_ascii=False)},')
    out.append("    art: `\n"+l["art"]+"`,")
    out.append("  },")
out.append("];")
open("../../src/game/islands/isl07.ts","w").write("\n".join(out)+"\n")
