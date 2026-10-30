# Art direction — Nonogram Atelier

Target: .agf/art/target.png (vs big-studio games Sudoku.com +3, Woodoku +2, Microsoft Solitaire Collection +2 → net +2.3 (need ≥ 0)). Every screen must look like it.

## Style
Handmade gouache-and-ink atelier rendered with a premium mobile polish. The base is warm cream cold-press paper with visible fibre grain and soft deckled edges. Forms are drawn with confident sumi-ink outlines of varied weight, roughly 2–3 px at 1080 wide, with slightly rounded ends. They are filled with layered watercolor washes that have soft pigment blooms and gentle edge darkening. Lighting is a warm late-afternoon window glow from the upper left. It gives a soft top-left highlight, a subtle drop shadow below and to the right, and a faint ambient occlusion where objects meet paper. Materials read clearly: matte paper, glossy ink, brushed gold leaf with fine crackle and a small specular glint, warm oak, and teal ceramic tile. Depth comes from 3–4 layers: a far wash, a mid-ground cutaway, and a crisp foreground. Overlaps are soft, and objects have slight bevels instead of hard gradients. Mood is calm, cozy and honest, with no neon and no harsh contrast. Saturation is restrained, with gold and coral kept for rewards and a single teal for interactive focus. Shapes are chunky and friendly, and characters are simple, rounded and expressive. Everything stays legible on small screens, with generous negative space, so the nonogram grid is always the clearest object on screen.

## Palette
#F6EEDC #1F2A3A #2E8C8A #E3A83B #D9694F #8DB48E

UI kit tokens (src/ui/theme.ts): {"primary":"#2E8C8A","primaryDark":"#1F6867","secondary":"#E3A83B","secondaryDark":"#B6801F","accent":"#D9694F","accentDark":"#A84A34","bgTop":"#FBF5E6","bgBottom":"#EBDDBF","ink":"#1F2A3A"}

## Screen spec
- **background**: Warm cream watercolor paper with fibre grain. A faint teal-to-sand wash drifts from top to bottom. A soft vignette and a few pale ink-splatter and leaf motifs sit only at the edges, at about 8% opacity, so nothing competes with the board.
- **board**: A square grid on a slightly lighter paper card with a thin warm-oak frame and a 3 px inner bevel. The card has a soft shadow below and a gold-leaf hairline corner detail. Grid lines are 1 px warm grey-brown, with heavier ink lines every 5 cells. Clue gutters sit on a tinted parchment strip, with the row and column under the finger highlighted in pale teal. Sticky clues stay visible while panning.
- **pieces**: Filled cells are ink-navy squares with slightly rounded corners and a tiny glossy highlight, and an ink-bloom animation plays on fill. X cells are thin hand-drawn terracotta pencil crosses. Dot marks are small warm-grey dots. Completed clues fade to 35% grey. Colour puzzles use gouache swatches with soft edges. Revealed picture cells blend into a watercolor wash.
- **hud**: A slim top bar on translucent cream paper has a round back button on the left, centred puzzle name and size with a three-star row beneath it, and a settings button on the right. A Pigments counter chip with a gold droplet icon sits beside the stars. The live run counter shows as a small teal pill reading +7 above the finger. There are no timers or hearts by default.
- **buttons**: Chunky pill buttons with a 3D plate look: a flat saturated fill, a darker 4 px bottom edge, a soft top highlight and a gentle drop shadow. Primary buttons are teal and rewards or hints are gold. Tool toggles (Fill, X, Dot) are a segmented cream tray with a sliding teal thumb that shows the active state. Undo and redo are round cream buttons with ink icons. The Hint Brush button carries a count badge in coral.
- **typography**: Titles use a rounded humanist serif with calligraphic warmth, in ink navy. Numbers and clues use a clean rounded sans with tabular figures in ink or grey. Button labels are bold rounded sans in white or ink, with a very subtle 1 px shadow. Clue numbers are at least 12 sp, and high-contrast mode is supported.
- **popups**: Cream paper cards with deckled edges and a thin gold-leaf border, 24 px corner radius, and a soft dim scrim behind. A ribbon header sits on top. Mina the cat peeks over the card corner. The complete popup shows the framed painting at centre, three stars, Pigments earned, and one large teal Next button with a small ghost Gallery button. Nothing blocks the next puzzle.
- **fx**: An ink bloom spreads on each fill. A soft brush swish follows the drag, with a pitch-rising tick. Completed lines get a quick teal sweep and the clue fades. On completion a watercolor wash blooms outward over the picture and gold-leaf shimmer runs across the frame. Pigment droplets arc to the counter, and a few warm sparkles appear. Particles are few and soft.
- **motion**: Easing is soft with a slight overshoot at 180–260 ms. Buttons squash 4% on press. Cells pop 1.0→1.08→1.0 in 120 ms. The reveal takes about 1.6 s. Parallax in the hub is 3 layers. The zoom and pan have inertia. Reduce-motion mode cuts the effects to simple fades.

## Assets (assets/art, indexed in src/art.ts)
- `bg_paper_main` (background, 1080x1920): Puzzle and menu background
- `bg_atelier_hub` (background, 1080x1920): Atelier hub, tall scroll
- `bg_island_map` (background, 1080x1920): Island map screen
- `hero_mina_easel` (character, 512x507): Title screen hero key art
- `board_frame` (ui, 512x510): Board frame and card
- `cell_filled` (sprite, 511x512): Filled cell
- `cell_x_mark` (sprite, 510x512): X cell mark
- `cell_dot_mark` (sprite, 512x492): Dot mark
- `cell_color_swatch` (sprite, 512x505): Colour puzzle cell
- `hud_panel` (ui, 512x269): Top HUD bar
- `btn_primary_teal` (ui, 512x224): Primary button plate
- `btn_secondary_gold` (ui, 512x207): Secondary and hint button plate
- `icon_pigment` (ui, 356x512): Pigment currency icon
- `icon_hint_brush` (ui, 486x512): Hint Brush icon
- `icon_framed_art` (ui, 510x512): Reward artwork icon
- `fx_ink_bloom` (fx, 512x505): Fill and reveal effect
- `logo` (ui, 900x474): the game logo — title/home screen and anywhere the name appears
