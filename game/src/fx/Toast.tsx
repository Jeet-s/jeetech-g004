import { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from "react-native-reanimated";
import { fonts } from "../ui/theme";

/**
 * Short message ribbon ("Hint Brush!", "That cell is given"): pops in with a spring, holds, then lifts away. By
 * default it sits in GameScreen's callout lane between the HUD and the board, so it never covers the title, the
 * cells or the clues. `top` places it absolutely elsewhere. Re-key to replay.
 */
export function Toast({ text, top = 0, color = "#2E8C8A", hold = 950 }: { text: string; top?: number; color?: string; hold?: number }) {
  const t = useSharedValue(0);
  const out = useSharedValue(0);
  useEffect(() => {
    t.value = withSpring(1, { damping: 13, stiffness: 300 });
    out.value = withDelay(hold, withTiming(1, { duration: 260, easing: Easing.in(Easing.quad) }));
  }, [t, out, hold]);
  const st = useAnimatedStyle(() => ({
    opacity: Math.min(1, t.value * 2) * (1 - out.value),
    transform: [{ scale: 0.4 + 0.6 * t.value }, { translateY: -6 * out.value }, { rotate: `${(1 - t.value) * -6}deg` }],
  }));
  return (
    <Animated.View pointerEvents="none" style={[styles.wrap, { top }]}>
      <Animated.View style={[styles.pill, { backgroundColor: color }, st]}>
        <Text style={styles.text} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>{text}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", left: 16, right: 16, height: 40, alignItems: "center", justifyContent: "center" },
  pill: {
    maxWidth: "100%", paddingHorizontal: 16, paddingVertical: 5, borderRadius: 18, borderWidth: 2, borderColor: "#FFF8E8",
    shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, elevation: 5,
  },
  text: { fontFamily: fonts.display, fontSize: 17, color: "#FFFFFF", includeFontPadding: false, textShadowColor: "rgba(0,0,0,0.25)", textShadowRadius: 1, textShadowOffset: { width: 0, height: 1 } },
});
