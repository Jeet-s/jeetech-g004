# Brief: design one island of 12 nonogram levels for "Nonogram Atelier"

Workspace (cwd for every command): /Users/jagjeetsingh/ai-game-factory/.workspaces/d7bebc6d-5835-4075-b86d-b7e325900918
You write ONE file only: src/game/islands/islNN.ts (your island). Do not edit or create any other file
(except scratch files under .tmp/), do not run npm install / playtest / tune / git. Never touch anything outside the workspace.

## The game
Premium cozy nonogram (Picross) app, quality bar = Nonogram.com / Picross S. Each level is a hand-drawn
pixel PICTURE that the player reveals by solving clues. Players must recognise the picture at the end, so draw
real, charming, readable pixel art — silhouettes with clear features, no noise, no random speckles.
Study src/game/islands/isl01.ts (island 1, done) for the exact format and tone. Engine: src/game/nonogram.ts.

## Format (TypeScript)
```ts
import { INK, type LevelSpec } from "../types";
export const ISLNN: LevelSpec[] = [
  { id: "sleeping-fox", title: "Sleeping Fox", palette: [INK], role: "teach", mechanics: ["overlap"],
    aha: "...", art: `
....##....
...` },
  ...12 entries...
];
```
- `id`: unique kebab-case, prefix-free, must not collide with other islands (use specific names, e.g. "kiln-teapot").
- `art`: rows of equal width, no spaces. `.` paper; `#` ink (1-colour pictures); `a`..`f` = palette colours 1..6
  (multi-colour pictures use letters, not #). UPPERCASE `A`..`F` / `@` = a STAMPED (given) cell of that colour,
  `,` = stamped paper cell, `~` = VOID cell outside a shaped canvas (always paper, not playable).
- `palette`: hex colours, index 0 = colour a. Use these (calm watercolor atelier palette):
  ink "#1F2A3A" (= INK), teal "#2E8C8A", gold "#E3A83B", coral "#D9694F", sage "#8DB48E", plum "#8C6BB1",
  sky "#6FA8DC", peach "#F2B35E", rose "#E98F7A", umber "#8A5A3C", cream-grey "#C9B8A0", night "#2B3A67".
  Pick colours that make the picture read (strawberry = coral body + sage leaves). In multi-colour pictures make
  colours differ in lightness too (colour-blind players), never rely on a red/green pair alone.
- `smudge: ["r3"]` hides the clue of row 3 (0-based; "c5" = column 5). `crack: ["r4.1"]` shows "?" for clue
  number 1 (0-based, counting runs left→right / top→bottom) of row 4: the run's colour is shown, its length is hidden.
- `role`: follow the slot pattern below exactly. `mechanics`: tags from this list only:
  fill, x-marks, exact-fit, overlap, reach, color, void, stamp, color-cross, smudged, cracked, deep-chain.
  List the 1-4 techniques/twists genuinely in play on that board (your island's tag on nearly every level).
- `aha`: ONE sentence, ≤ 110 characters, specific and TRUE for this board: the insight the player must find
  (name the clue/line: "The 8 in row 3 overlaps on six cells…", "Row 5's smudged clue is painted from its columns…").
  Never generic ("solve the puzzle", "use logic"), never copy-paste between levels. Use `--explain` (below) to see the
  real first deductions so your aha is accurate.

## Slot pattern (role per slot, all islands)
1 teach (new mechanic ALONE on a small friendly board) · 2 teach · 3 practise · 4 practise (with an earlier technique) ·
5 twist (mechanic used surprisingly) · 6 boss (hardest so far in the island) · 7 breather (calm comfort picture, smaller/easier,
still a real idea) · 8 practise · 9 combine · 10 twist · 11 combine · 12 finale (Masterwork: biggest, toughest of the island,
the island's signature picture).

## Hard rules (the checker enforces most)
1. Every picture must be solvable by LINE LOGIC ALONE to exactly the drawn picture (unique, no guessing):
   `npx tsx scripts/art-check.ts NN` must end with "12/12 pictures solve by logic alone".
2. No empty rows or columns (a line with clue 0) — the checker prints "EMPTY LINES". Crop the picture to its content
   (a fully-void line on a shaped canvas is fine). Use the whole board: no big blank margins.
3. No duplicate art; no subject repeated from other islands (subject list below is yours).
4. Board sizes: stay within your island's size range below (the review tool can only show ~60k characters for all
   120 levels, so oversize boards push later levels out of review). w and h may differ (e.g. 12x14 portrait).
5. Content rating Everyone: no weapons, alcohol, scary/horror, religious symbols, real brands, trademarked characters.
6. Difficulty shape inside the island, read from the checker's `search` number (expected line reads per deduction) and
   `steps`: slots 1-2 lowest, rising through 6 (boss), slot 7 clearly lower than 6, then rising to 12 (finale = highest of
   the island). Fewer `open0` (lines yielding at the start) and more `passes` = harder. If a boss/finale is too easy,
   make it harder by drawing with more short runs / fewer long runs / thinner shapes; if a teach level is hard, simplify it.

## Tools
- `npx tsx scripts/art-check.ts NN` — status per level: OK or STUCK (unknown cells shown as '?'), steps, passes, search,
  open0, min productive lines, aha length, empty lines.
- `npx tsx scripts/art-check.ts NN --explain` — prints the first 8 best-first deductions per level (line, clue, result).
- `npx tsx scripts/art-check.ts NN --repair` (or `--stamp` on stamp levels) — for STUCK pictures, proposes ≤10 single-cell
  edits (or added stamps) that make it uniquely solvable. Review them: keep the picture clean and recognisable; often a
  better fix is to redraw the ambiguous area yourself (ambiguity usually comes from 2x2 "checkerboard swaps" — two
  cells that could trade places — break the symmetry or fill/empty one of them).
- `npx tsx scripts/try-art.ts K < file.txt` — quick check of loose art blocks (blank-line separated) with K colours.

## Deliverable
Write the 12 levels into src/game/islands/islNN.ts, iterate until the checker shows 12/12 OK with the difficulty shape
above, all ahas ≤110 chars and accurate. Then reply with: the checker's final output lines (one per level), and for
each level one line "slot · role · title (WxH, colours) · aha". Keep the reply compact.
