import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { HAND_FILL, HAND_LINE } from "./iconAssets";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { palette } from "./theme";

const LOOP = 1500;
/**
 * The pointing hand is our own drawing (24-unit viewbox, skin fill + sumi-ink outline), not an emoji: an emoji's
 * fingertip sits at a different spot on every platform/font, so the hand could never be placed exactly. The hand is
 * placed so its fingertip (12.5, 2 in the viewbox) lands ON the target's centre — it touches the cell it teaches
 * (QA 2026-10-29: a hand resting below the target read as pointing at the board's frame).
 */
const SIZE = 46;
const TIP_X = (12.5 / 24) * SIZE, TIP_Y = (2 / 24) * SIZE;

function HandGlyph() {
  const box = { position: "absolute" as const, left: 0, top: 0, width: SIZE, height: SIZE };
  return (
    <View style={{ width: SIZE, height: SIZE }}>
      <Image source={HAND_FILL} style={[box, { left: 2, top: 3, tintColor: "rgba(31,42,58,0.28)" }]} fadeDuration={0} />
      <Image source={HAND_FILL} style={[box, { tintColor: "#FFE3C8" }]} fadeDuration={0} />
      <Image source={HAND_LINE} style={[box, { tintColor: "#3A2A1E" }]} fadeDuration={0} />
    </View>
  );
}

/**
 * Animated pointer demonstrating a tap at `from` or a swipe from → to. Show on the first levels.
 * Tap: the hand lifts, presses down onto the cell (it dips and squashes) and a teal ring ripples out of the touch
 * point, every 1.5 s. Swipe: it presses, glides to `to`, lifts and returns.
 */
/** `ring`: the press ripple (tool / clue pointers). Board pointers turn it off — the target cell has its own outline. */
/** `flip`: the hand reaches DOWN from above (targets just above Mina's card — the hand never covers her text). */
export function TutorialHand({ from, to, ring: showRing = true, flip = false }: { from: { x: number; y: number }; to?: { x: number; y: number }; ring?: boolean; flip?: boolean }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = 0;
    t.value = withRepeat(withTiming(1, { duration: LOOP, easing: Easing.linear }), -1);
  }, [t]);
  const hand = useAnimatedStyle(() => {
    const u = t.value;
    const dest = to ?? from;
    // 0-.25 approach + lift, .25-.38 press, .38-.75 hold / glide, .75-1 lift away
    const glide = to ? Math.max(0, Math.min(1, (u - 0.38) / 0.37)) : 0;
    const e = glide * glide * (3 - 2 * glide);
    const x = from.x + (dest.x - from.x) * e;
    const y = from.y + (dest.y - from.y) * e;
    const press = u < 0.25 ? 0 : u < 0.38 ? (u - 0.25) / 0.13 : u < 0.75 ? 1 : Math.max(0, 1 - (u - 0.75) / 0.12);
    const lift = (1 - press) * 14;
    return {
      opacity: u > 0.92 ? Math.max(0, 1 - (u - 0.92) / 0.08) : Math.min(1, u * 8),
      // The fingertip lands ON the target's centre (pressing it); the hand's body trails below/right of the cell.
      // Flipped (turned 180° about its centre) the fingertip sits at (SIZE − TIP_X, SIZE − TIP_Y) and lifts upward.
      transform: flip
        ? [{ translateX: x - (SIZE - TIP_X) }, { translateY: y - (SIZE - TIP_Y) - lift }, { scale: 1.08 - 0.14 * press }, { rotate: `${172 + 8 * press}deg` }]
        : [{ translateX: x - TIP_X }, { translateY: y - TIP_Y + lift }, { scale: 1.08 - 0.14 * press }, { rotate: `${-8 + 8 * press}deg` }],
    };
  });
  const ring = useAnimatedStyle(() => {
    const u = t.value;
    const k = Math.max(0, Math.min(1, (u - 0.36) / 0.5));
    return { opacity: k <= 0 || k >= 1 ? 0 : 0.85 * (1 - k), transform: [{ translateX: from.x - 22 }, { translateY: from.y - 22 }, { scale: 0.35 + 0.75 * k }] };
  });
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {showRing ? <Animated.View style={[styles.ring, ring]} /> : null}
      <Animated.View style={[styles.hand, hand]}>
        <HandGlyph />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  hand: { position: "absolute", left: 0, top: 0, width: SIZE, height: SIZE },
  ring: { position: "absolute", left: 0, top: 0, width: 44, height: 44, borderRadius: 22, borderWidth: 4, borderColor: palette.primary, backgroundColor: "rgba(46,140,138,0.15)" },
});
