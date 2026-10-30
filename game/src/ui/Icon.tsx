import { memo } from "react";
import { Image, View } from "react-native";
import { FILL, STROKE, WEIGHTS } from "./glyphs";
import { FILL_ICONS, STROKE_ICONS } from "./iconAssets";
import { palette } from "./theme";

export type IconName = keyof typeof STROKE | keyof typeof FILL;

const snap = (w: number) => WEIGHTS.reduce((a, b) => (Math.abs(b - w) < Math.abs(a - w) ? b : a));

/**
 * A UI glyph: a PNG baked from src/ui/glyphs.ts (scripts/bake-icons.ts) and shipped in the bundle, tinted at draw time.
 * A packaged image draws in the screen's first frame — no runtime raster or base64 decode, so a freshly mounted screen
 * never shows empty circle buttons (QA 2026-10-29).
 */
export const Icon = memo(function Icon({ name, size = 24, color = palette.ink, weight = 2.3 }: { name: IconName; size?: number; color?: string; weight?: number }) {
  const src = name in STROKE_ICONS ? STROKE_ICONS[name][String(snap(weight)).replace(".", "_")] : FILL_ICONS[name];
  if (src == null) return <View style={{ width: size, height: size }} />;
  return <Image source={src} style={{ width: size, height: size, tintColor: color }} fadeDuration={0} />;
});
