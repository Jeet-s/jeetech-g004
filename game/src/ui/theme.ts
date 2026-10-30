/**
 * Design tokens — Nonogram Atelier (docs/ART_DIRECTION.md). Warm cream paper, sumi-ink navy, one teal for
 * interactive focus, gold and coral kept for rewards. Every screen uses these — never raw colours or system fonts.
 */
export const palette = {
  // Brand (ui_palette in assets/art/manifest.json)
  primary: "#2E8C8A",
  primaryDark: "#1F6867",
  primaryLight: "#4FB0AC",
  secondary: "#E3A83B",
  secondaryDark: "#B6801F",
  accent: "#E3A83B",
  accentDark: "#B6801F",
  coral: "#D9694F",
  coralDark: "#A84A34",
  danger: "#D9694F",
  dangerDark: "#A84A34",
  sage: "#8DB48E",
  // Surfaces
  bgTop: "#FBF5E6",
  bgBottom: "#EBDDBF",
  surface: "#FFF8E8",
  surfaceAlt: "#F3E8CF",
  surfaceDark: "#1E2340",
  paper: "#FBF6EA",
  parchment: "#EFE3C6",
  oak: "#9A6A3A",
  oakDark: "#6E4824",
  line: "#D7C6A6",
  lineHeavy: "#7A6650",
  ink: "#1F2A3A",
  inkSoft: "#5E5A66",
  inkFaint: "rgba(31,42,58,0.32)",
  onPrimary: "#FFFFFF",
  // Night studio (dark mode)
  night: "#1E2340",
  nightDeep: "#141830",
  lamp: "#F2B35E",
  // Game feedback
  star: "#E3A83B",
  coin: "#E3A83B",
  success: "#2E8C8A",
  highlight: "rgba(46,140,138,0.16)",
};

export const fonts = {
  display: "Fredoka_700Bold",
  displayMedium: "Fredoka_600SemiBold",
  body: "Nunito_700Bold",
  bodyRegular: "Nunito_600SemiBold",
};

export const radius = { sm: 12, md: 18, lg: 24, xl: 28, pill: 999 };
export const space = { xs: 4, sm: 8, md: 14, lg: 20, xl: 28, xxl: 40 };

export const type = {
  hero: { fontFamily: fonts.display, fontSize: 40, letterSpacing: 0.3, color: palette.ink },
  title: { fontFamily: fonts.display, fontSize: 28, color: palette.ink },
  heading: { fontFamily: fonts.displayMedium, fontSize: 21, color: palette.ink },
  body: { fontFamily: fonts.body, fontSize: 16, color: palette.ink },
  caption: { fontFamily: fonts.bodyRegular, fontSize: 13, color: palette.inkSoft },
  button: { fontFamily: fonts.display, fontSize: 20, letterSpacing: 0.4 },
};

/** Soft warm drop shadow used on cards and buttons (iOS + Android). */
export const shadow = {
  shadowColor: "#4A3416",
  shadowOpacity: 0.22,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 6 },
  elevation: 6,
};

export const softShadow = {
  shadowColor: "#4A3416",
  shadowOpacity: 0.16,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 3 },
  elevation: 3,
};

/** Spring presets — soft with a slight overshoot (180–260 ms feel). */
export const springs = {
  press: { damping: 15, stiffness: 340, mass: 0.6 },
  pop: { damping: 11, stiffness: 220, mass: 0.7 },
  gentle: { damping: 18, stiffness: 140, mass: 1 },
};
