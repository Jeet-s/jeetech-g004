# Round 6 brief (read .design/brief-levels.md, then .design/brief-r3.md incl. rounds 4-5, then this)

Latest review: 7.6/10 (bar 8). Full verdicts: .design/verdicts-r15.txt and .design/review15.log.
Bot win rates are tuned by the lead afterwards with a pacing knob (src/game/pacing.json, by level id) — but the knob can
only make a board EASIER than its depth allows up to a limit, and it can't create tension on a board with none. So:
- a practise board the reviewer calls a spike (too hard) needs LESS depth: more open lines at the start (>= 4),
  <= 4 passes, an extra foothold (an exact-fit line) — the knob cannot fix it alone;
- a breather/teach with "no tension" (100% casual) needs ONE line that is not open at the start and must be
  cross-checked (a 2-run clue whose gap position comes from a crossing), still <= 3-4 passes.
Set-level asks from the review that apply to everyone:
1. Intents (aha) must not all be "exact fit, then X's, then chain". Lead with ONE distinct insight per level, and in late
   worlds prefer insight TYPES the set lacks: parity/counting ("only one spare cell, so ..."), a contradiction check
   ("if the 3 sat left, column 4 would need 4 in 3 rows — so it sits right"), two-line interplay (two crossing lines that
   only settle together), a run that must straddle a stamp/void. Only say "exact fit" when the level is a teach of it.
2. Stamps are a CELL THE PLAYER USES, never described as a uniqueness patch. Never write "without the stamp ... ambiguous",
   "could trade ... every clue reads the same", "untie knots the clues leave open". Write: "Start from the stamp: the
   stamped tile in row 4 is column 11's last gold, so the underside ends there and the ridge is columns 6-10." The board
   must still need the stamp (checker: no-stamp NOT unique) — that part is fine; only the wording changes, plus fix
   boards where the stamp is used only as a final tie-break at the end (make it the opening foothold or a mid-board key).
3. Breaking mirror symmetry: near-symmetric pictures were marked down (copy-work). Make the halves differ in a way the
   player must deduce.
4. Pictures must read at a glance as the title; no empty column/row that does nothing.
Keep ids unchanged; no duplicate titles/subjects across the game (grep titles before choosing a new subject).
Checker: `npx tsx .design/try.ts <file>` from the workspace. tsc: `npx tsc --noEmit`. Nothing heavier.
