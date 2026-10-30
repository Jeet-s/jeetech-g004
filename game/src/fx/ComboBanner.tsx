import { useEffect } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withSequence, withSpring, withTiming } from "react-native-reanimated";
import { fonts, palette } from "../ui/theme";

/** How long a banner stays on screen (ms) — the caller clears it after this. */
export const COMBO_BANNER_MS = 1250;
/** Height of the callout lane the banner lives in (GameScreen reserves it between the HUD and the board). */
export const CALLOUT_LANE = 40;

/** Display text with a real ink outline (8 offset copies behind the fill) — reads on paper, board or scrim. */
function Outlined({ text, size, color, outline, stroke }: { text: string; size: number; color: string; outline: string; stroke: number }) {
  const offs = [[-1, 0], [1, 0], [0, -1], [0, 1], [-0.7, -0.7], [0.7, -0.7], [-0.7, 0.7], [0.7, 0.7]];
  const base = { fontFamily: fonts.display, fontSize: size, lineHeight: size * 1.15, includeFontPadding: false, textAlign: "center" as const };
  return (
    <View>
      {offs.map(([dx, dy], k) => (
        <Text key={k} numberOfLines={1} style={[base, styles.abs, { color: outline, transform: [{ translateX: dx * stroke }, { translateY: dy * stroke }] }]}>{text}</Text>
      ))}
      <Text numberOfLines={1} style={[base, { color, textShadowColor: "rgba(0,0,0,0.25)", textShadowRadius: 2, textShadowOffset: { width: 0, height: 2 } }]}>{text}</Text>
    </View>
  );
}

/**
 * Multi-line / combo celebration: a big outlined word that slams in with an overshoot, holds ~1 s and lifts away,
 * with a gold "×N" chip beside it on a combo. It lives in its own callout lane between the HUD and the board — the
 * puzzle title above and the clues below are never covered or faded. Re-key to replay.
 */
export function ComboBanner({ text, chip, color = palette.secondary }: { text: string; chip?: string; color?: string }) {
  const { width } = useWindowDimensions();
  const t = useSharedValue(0);
  const out = useSharedValue(0);
  const s2 = useSharedValue(0);
  useEffect(() => {
    t.value = withSequence(withTiming(1.22, { duration: 160, easing: Easing.out(Easing.back(2)) }), withSpring(1, { damping: 8, stiffness: 260 }));
    s2.value = withDelay(120, withSpring(1, { damping: 7, stiffness: 260 }));
    out.value = withDelay(COMBO_BANNER_MS - 240, withTiming(1, { duration: 220, easing: Easing.in(Easing.quad) }));
  }, [t, out, s2]);
  const st = useAnimatedStyle(() => ({
    opacity: Math.min(1, t.value * 3) * (1 - out.value),
    transform: [{ translateY: -8 * out.value }, { scale: 0.3 + 0.7 * t.value }, { rotate: `${(1 - Math.min(1, t.value)) * -8}deg` }],
  }));
  const chipSt = useAnimatedStyle(() => ({ opacity: Math.min(1, s2.value * 2) * (1 - out.value), transform: [{ scale: 0.4 + 0.6 * s2.value }, { rotate: `${(1 - s2.value) * 20}deg` }] }));
  // Always one line inside the lane: the size shrinks for long words on narrow phones.
  const size = Math.max(20, Math.min(28, (width - 120) / Math.max(6, text.length * 0.6)));
  return (
    <View pointerEvents="none" style={styles.wrap}>
      <Animated.View style={st}>
        <Outlined text={text} size={size} color={color} outline={palette.ink} stroke={Math.max(1.5, size * 0.075)} />
      </Animated.View>
      {chip ? (
        <Animated.View style={[styles.chip, chipSt]}>
          <Text style={styles.chipText} numberOfLines={1}>{chip}</Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", left: 0, right: 0, top: 0, height: CALLOUT_LANE, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  abs: { position: "absolute", left: 0, right: 0, top: 0 },
  chip: { backgroundColor: palette.coral, borderRadius: 12, paddingHorizontal: 9, paddingVertical: 2, borderWidth: 2, borderColor: "#FFF8E8" },
  chipText: { fontFamily: fonts.display, fontSize: 15, color: "#fff", includeFontPadding: false },
});
