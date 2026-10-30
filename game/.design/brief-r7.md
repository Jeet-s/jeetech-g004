# Round 7 brief (read .design/brief-levels.md first, then this). Lead: the main session.

The level-design reviewer is noisy run to run. Two complaints have repeated in EVERY run, so this round fixes those:

## 1. Breathers must FEEL like a rest (slot 7 of each island = the level right after the boss)
The breathers today are 9x7..11x10 boards with 14-20 looks; they win 91% casual but "feel like a re-run, not a rest",
"too dense", "a lot of empty paper / clutter", "the same symmetric template". Redesign each breather as a
**quick, charming win that is a different KIND of experience from its neighbours**:
- SMALL: islands 1-3: 7x7 .. 8x8; islands 4-10: 8x8 .. 9x9. Every row/column does something; no empty margins.
- SHORT: about half the looks of the boss before it (target ~8-14 looks, <= 3 passes, >= 5 lines open at the start).
- ONE use of the island's mechanic, done in a cute way; ONE clear aha sentence, not a list of clues.
- Picture: bold, instantly readable, filling the canvas, NOT a mirror-symmetric template (break symmetry with a
  detail the clues decide — a tilt, one ear, a handle, a wink). No subject already used anywhere in the game
  (grep every island's titles first).
- Role "breather"; aha starts with what makes it restful, e.g. "A breather: ..." then the one insight.

## 2. Named weak levels (latest review verdicts — do what the arrow says, judged against the board)
(These are listed in your task.)

## Rules recap
- Keep ids. Keep island theme + mechanic. Stamps/smudges/cracks/tallies/voids only where the island has them.
- Every board OK in `npx tsx .design/try.ts <file>` (unique by line logic, not DUP). If the level has a stamp, the
  checker's no-stamp line must NOT say "STILL UNIQUE".
- Then check bot range: `npx tsx .design/rate.ts <file>` (each spec reuses an existing id). A breather must reach
  >= 0.85 casual at some knob and its looks must be clearly below its neighbours'. A practise/combine board must be
  able to land 0.60-0.70 casual with skilled >= 0.88 at that knob. A boss/finale must reach ~0.52-0.55 with skilled >= 0.85.
- The aha text must be TRUE for the final board (1-based rows/cols, check `first[...]` and the printed clues).
- Edit ONLY your own island files. Do not run npm run playtest/levels/validate, tune-levels.ts or level-review.ts
  (the lead does). `npx tsc --noEmit` must pass at the end.
- When done, write a 1-line-per-level summary (id, size, looks, what changed) to .design/r7-<agent>/DONE.md
