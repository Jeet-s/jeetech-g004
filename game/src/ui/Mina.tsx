import { useEffect, useState } from "react";
import { Animated as RNAnimated, Image, StyleSheet, Text, View, type ViewStyle } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { art } from "../art";
import { fonts, palette, softShadow } from "./theme";

/**
 * Mina the curator cat: a round portrait framed on her face (cropped from the key art), with a gentle idle bob.
 * The crop is inside the badge, so the portrait is whole at any screen width — never cut by a screen edge.
 */
export function MinaAvatar({ size = 64, bob = true, style }: { size?: number; bob?: boolean; style?: ViewStyle }) {
  const t = useSharedValue(0);
  useEffect(() => {
    if (bob) t.value = withRepeat(withSequence(withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.sin) }), withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.sin) })), -1);
  }, [bob, t]);
  const st = useAnimatedStyle(() => ({ transform: [{ translateY: -2 * t.value }, { rotate: `${t.value * 2 - 1}deg` }] }));
  // Her face sits at ~(73%, 40%) of the 512×507 key art; scale it so the face fills the badge.
  const wi = size * 2.1, hi = wi * (507 / 512);
  return (
    <Animated.View style={[{ width: size, height: size }, style, st]}>
      <View style={[styles.badge, { width: size, height: size, borderRadius: size / 2 }]}>
        <Image source={art.hero_mina_easel} style={{ position: "absolute", width: wi, height: hi, left: size / 2 - wi * 0.73, top: size / 2 - hi * 0.42 }} resizeMode="contain" />
      </View>
    </Animated.View>
  );
}

/** Mina's speech card — tutorial steps, hint explanations, story beats. Portrait and bubble sit side by side. */
export function MinaSays({ text, title, children, style, who = "Mina", compact }: { text: string; title?: string; children?: React.ReactNode; style?: ViewStyle; who?: string; compact?: boolean }) {
  // compact: small phones (≤ 700 dp tall) — a smaller portrait and tighter type, so the board keeps its room.
  // Always fully opaque and in place (no fade, no slide — a half-faded card over the tools read as a glitch): when the
  // message changes the bubble gives a small squash-pop instead, so a new step is noticed without any ghosting.
  const k = useState(() => new RNAnimated.Value(1))[0];
  useEffect(() => {
    k.setValue(0.94);
    RNAnimated.spring(k, { toValue: 1, damping: 9, stiffness: 260, mass: 0.7, useNativeDriver: true }).start();
  }, [k, text, title]);
  const enter = { transform: [{ scale: k }] };
  return (
    <RNAnimated.View style={[styles.wrap, compact && { gap: 6 }, style, enter]}>
      <MinaAvatar size={compact ? 40 : 56} />
      <View style={[styles.bubble, compact && { paddingHorizontal: 11, paddingVertical: 6 }, softShadow]}>
        <View style={[styles.tail, compact && { bottom: 10 }]} />
        <Text style={[styles.who, compact && { fontSize: 12.5 }]}>{title ?? who}</Text>
        <Text style={[styles.text, compact && { fontSize: 13, lineHeight: 17 }]}>{text}</Text>
        {children}
      </View>
    </RNAnimated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "flex-end", gap: 10, width: "100%", maxWidth: 620, alignSelf: "center" },
  badge: { overflow: "hidden", backgroundColor: "#F6E7C4", borderWidth: 2.5, borderColor: "#E3A83B" },
  bubble: { flex: 1, backgroundColor: "#FFFBF1", borderRadius: 16, borderWidth: 1.5, borderColor: "rgba(182,128,31,0.5)", paddingHorizontal: 14, paddingVertical: 9 },
  tail: { position: "absolute", left: -7, bottom: 16, width: 12, height: 12, backgroundColor: "#FFFBF1", borderLeftWidth: 1.5, borderBottomWidth: 1.5, borderColor: "rgba(182,128,31,0.5)", transform: [{ rotate: "45deg" }] },
  who: { fontFamily: fonts.display, fontSize: 14, color: palette.primaryDark },
  text: { fontFamily: fonts.bodyRegular, fontSize: 14.5, lineHeight: 20, color: palette.ink },
});
