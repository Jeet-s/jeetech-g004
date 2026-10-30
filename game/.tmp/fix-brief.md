# Fix pass brief — Nonogram Atelier level redesign (QA failed the level-design review 6/10, bar 8)

Workspace (cwd for every command): /Users/jagjeetsingh/ai-game-factory/.workspaces/d7bebc6d-5835-4075-b86d-b7e325900918

READ FIRST: `.tmp/agent-brief.md` (format of src/game/islands/islNN.ts, palette, slot pattern, tools
`scripts/art-check.ts` / `scripts/try-art.ts`, hard rules). Everything there still applies, except:
- You edit ONLY the island file(s) named in your task (plus scratch files under .tmp/<your-dir>/). Never edit any
  other file, never run npm install / npm run playtest / tune-levels / git / adb / builds. Never touch anything outside the workspace.
- The word "TODO", "FIXME", "x" or any placeholder must never appear in an aha (QA greps for TODO in the islands).

## How a lead level designer (the QA reviewer) reads each level
It sees, per level: the solution picture as ASCII, the intent line
`<Island> <slot>/12 <role>, "<title>" WxH [K colours] [smudged ..; cracked ..]: <aha> (solver L looks/P passes/O lines open)`
and the mechanics tags. It rates every level 1-10 and fails anything < 6. What it punishes:
- placeholder / generic / false ahas; an aha that names a mechanic that is not on the board (e.g. "stamp" tag with no
  stamped cell — stamped cells are UPPERCASE letters / '@' / ',' in the art; smudged/cracked need `smudge:`/`crack:` fields);
- noisy pictures: scattered single pixels, blobs, subjects you can't name at a glance. Draw clean silhouettes with
  clear features; it's a premium nonogram app (Picross S / Nonogram.com quality);
- boards that STALL: only 2-5 lines yield at the start of a big board (open < 6) = a guess-hunt, not a puzzle;
- boards that are huge but SHALLOW: e.g. 20x20 solved in 3-4 passes with 40 lines open = busywork, not a finale;
- GRINDS: 20+ passes = tedious; keep big-board passes ~7-14;
- size jumps without teaching; teach levels that are bigger/harder than the practise ones after them;
- repeats: the same insight as the stated hook on many levels (e.g. "different colours need no gap" stated a dozen times).
  Each aha must name a DIFFERENT, specific insight on that board (a named line + why it resolves).
Use `npx tsx scripts/art-check.ts NN --explain` to see the real first deductions so each aha is TRUE.

## Difficulty knobs (what makes nonograms hard by logic, not guessing)
fewer open lines at the start (but ≥ 6 on big boards), more passes (rows must wait for columns), more short runs,
thinner shapes, more colours = EASIER (colour boundaries give info), smudged lines (remove info), cracked numbers
(remove a length), stamps (ADD info: use them to give a foothold on otherwise-stalled boards, or to split a line).

When you finish, reply compactly: the final art-check lines for your island(s) and per changed level
"slot · role · title (WxH, colours, twists) · aha".
