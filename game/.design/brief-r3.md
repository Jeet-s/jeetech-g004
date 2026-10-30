# Round 3 brief addendum (read .design/brief-levels.md FIRST, then this)

The level-design review (QA) still scored the set 6.6/10. Its set-level complaints:
1. Mid-game practise levels repeat one deduction in a new silhouette. The worst repeats:
   "full row, then the lone 1 is the pole/shaft, so X the rest" (L9, 11, 15, 21, 98) and
   "full-width row, then reach" (L13-19). A level whose aha is one of these is now BANNED (L9 may keep a lone-1
   step only as a minor step, never as its aha).
2. Cosmetic mechanic tags: 'reach' and 'chain' add no rule (they are being REMOVED from the game). L102 was tagged
   color-cross with only two colours (color-cross needs ≥ 3 colours to mean anything).
3. Some pictures are cluttered / unreadable.
So this round adds a REAL new rule to the engine: the TALLY clue.

## NEW MECHANIC: tally (already implemented in src/game/nonogram.ts — tallySolve / clueSolve)
Spec field: `tally: ["r2", "c0"]` (0-based like smudge). A tally line shows ONE ringed number per colour:
how many cells of that colour the line holds IN TOTAL — not how many runs, not their order, not their lengths.
E.g. a row whose picture is `#.##..#` shows a ringed 4 (instead of "1 2 1").
Line logic on a tally line: once the cells certain to be ink reach the count, the rest of the line is paper;
once only that many cells can still be ink, they all are. In colour: per colour, same rule (and paper = n − Σ counts).
Tally lines are therefore read from their CROSSINGS plus counting — a real new deduction ("count to close").
Mechanic tags: "tally" (single-colour) and "color-tally" (a coloured tally: counts per colour, in no order).

Checker additions (`npx tsx .design/try.ts <file>`): tally lines print as `TALLY:`; the line
`tally-as-smudge: STILL UNIQUE (… decorative)` means the counts are never needed — BAD, a tally must matter;
`tally count NEEDED` is what you want for at least one tally line on the board (ideally every tally line is used).
`plain clues:` shows the same board with normal clues for comparison.

Tally design rules:
- A tally level's aha must be a COUNTING insight, concrete: "row 5's tally says 6; columns 2-7 already put 6 ink
  there, so the ends are paper" or "column 3's tally 5 has exactly five cells its rows still allow — all ink".
- Teach levels: 1 tally line (maybe 2) on a small, friendly board with ≥ 3 footholds; the tally line must be
  NEEDED (checker) and its count step must be the obvious last step, not a long chain.
- Practise: 2-3 tally lines; twist: a tally used surprisingly (a tally of 0 or full is NOT a twist — it's a gift;
  avoid giving full-line or zero tallies); e.g. two crossing tally lines, a tally that resolves a split the runs
  clue could not, a tally on the symmetry axis; boss/finale: several tally lines whose counts interlock.
- Never put a tally on a line that its crossings alone already settle completely (decorative). Check per line:
  if you remove that one line's tally (make it a normal clue) the board should get EASIER, and if you smudge it
  the board should still be unique only because of the count.
- Keep the pictures CLEAN and readable: bold silhouette, 1-2 interior details, no noise.

## Common rules for everyone
- Keep every level `id` UNCHANGED. Edit ONLY the island files named in your task (whole-island rewrites allowed
  for islands you own). Every level: checker OK (unique by line logic), no DUP, intent (aha) TRUE to the checker
  output, 1-based numbers, ≤ ~420 chars, role honest.
- No 'reach' or 'chain' tags anywhere in your levels (use overlap / exact-fit / x-marks / fill / edge
  techniques in the aha text if needed, but tags only from: fill, x-marks, exact-fit, overlap, tally, color,
  void, stamp, color-cross (≥3 colours only), smudged, cracked, color-tally, combine).
- "edge" is fine as a word in the aha ("the run touching the floor must grow up from it"), not as a tag.
- Each level's aha must be DIFFERENT from its island neighbours' (not the same trick in a new silhouette).
- Do not run playtest / levels / tune / review / validate — only the checker and `npx tsc --noEmit`.
- Final message: per level: number, id, title, size, role, mechanics, the checker OK line, a one-line aha.

## Round 4 (review 7.5/10 — see .design/review13.log and .design/verdicts-r13.txt for the full verdict)
Set-level asks that apply to everyone:
- "Intents are almost all 'chain of fills', so the clever levels don't stand out": EVERY aha you touch must START with
  its insight in one short sentence (e.g. "The stamp settles which way the beak shifts." / "A count used up closes
  the row."), then 1-2 sentences of the concrete clue facts. No step-by-step fill chains.
- No repeated SUBJECTS across the game (seahorse L5/L51, koi L76/L89 were flagged). Check titles with
  `grep -ho 'title: "[^"]*"' src/game/islands/*.ts | sort | uniq -c | sort -rn | head`.
- A boss must be clearly harder (more passes / fewer footholds) than the level before it; teach levels shallow.
- A 3-colour board needs a 3-colour intro before it: islands 1-5 stay ≤ 2 colours except where a level explicitly
  introduces a third colour as its aha (colour-cross is island 6's rule).

## Round 5 (review 7.4/10 — full text in .design/review14.log, per-level verdicts in .design/verdicts-r14.txt)
- Within a chapter, no two levels may share the same insight sentence-type. Tally chapter: vary between "count met →
  rest paper", "count = cells left → all ink", two crossing counts sharing a cell, a count that decides WHICH of two
  run placements is right, a count that splits a line into two runs, etc. Crack chapter: vary what bounds the "?"
  (an edge on one side only, a colour cross-check, a stamp, a crossing run), not always "the walls either side".
- Colour order: islands 1-5 use at most 2 colours (3+ colours are taught at L61). Island 6+ may use 3.
- Breaking mirror symmetry is good: a near-symmetric picture lets players copy across; make the two halves differ.
- Win rates are tuned separately by the lead (a pacing knob), BUT a board with almost no dead-end lines cannot be made
  harder: a practise board solved by nearly every line at every step (e.g. old L87: 96% casual whatever the knob)
  needs real depth — ≥4 passes and moments where only a few lines yield. Breathers stay ≤3-4 passes.
