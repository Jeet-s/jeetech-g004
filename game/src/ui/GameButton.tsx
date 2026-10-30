import { Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { palette, radius, shadow, springs, type } from "./theme";
import { feedback, type Sfx } from "../audio/sfx";

type Variant = "primary" | "secondary" | "accent" | "danger" | "light";
const COLORS: Record<Variant, { top: string; bottom: string; lip: string; text: string }> = {
  primary: { top: "#45A8A4", bottom: palette.primary, lip: palette.primaryDark, text: palette.onPrimary },
  secondary: { top: "#F5C766", bottom: palette.secondary, lip: palette.secondaryDark, text: "#4A3010" },
  accent: { top: "#F5C766", bottom: palette.accent, lip: palette.accentDark, text: "#4A3010" },
  danger: { top: "#E8866E", bottom: palette.danger, lip: palette.dangerDark, text: "#FFFFFF" },
  light: { top: "#FFFBF0", bottom: "#F1E5C9", lip: "#CDB78F", text: palette.ink },
};

/**
 * Chunky casual-game button: gradient face, darker 3D lip, spring squash on
 * press, tap sound + haptic. Use for EVERY tappable action.
 */
export function GameButton({
  label,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  disabled,
  sound = "tap",
  style,
}: {
  label?: string;
  onPress?: () => void;
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  disabled?: boolean;
  sound?: Sfx;
  style?: ViewStyle;
}) {
  const c = COLORS[variant];
  const press = useSharedValue(0);
  const ring = useSharedValue(0);
  // Press: the face snaps down within ~60 ms (squash to 0.94 + a light flash), then springs back with a little
  // overshoot on release while a gold ring ripples out of the button — visible in the first frames of a tap.
  const face = useAnimatedStyle(() => ({
    transform: [{ translateY: press.value * 4 }, { scale: 1 - press.value * 0.05 }],
    // (release overshoots to press -0.4: the face pops up ~2.4% past rest, then settles — a visible bounce)
  }));
  // Held: the face darkens and sinks onto its lip (a pressed plate), so the press reads even in a still frame.
  const flash = useAnimatedStyle(() => ({ opacity: Math.max(0, press.value) * 0.22 }));
  const ripple = useAnimatedStyle(() => ({
    opacity: ring.value <= 0 || ring.value >= 1 ? 0 : 0.7 * (1 - ring.value),
    transform: [{ scaleX: 1 + ring.value * 0.08 }, { scaleY: 1 + ring.value * 0.45 }],
  }));
  const h = size === "lg" ? 64 : size === "sm" ? 44 : 54;
  const lip = 4;
  return (
    <Pressable
      disabled={disabled}
      onPressIn={() => {
        press.value = withTiming(1, { duration: 60, easing: Easing.out(Easing.quad) });
        ring.value = 0;
        ring.value = withSequence(withTiming(0.01, { duration: 0 }), withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) }));
      }}
      onPressOut={() => (press.value = withSequence(withTiming(-0.4, { duration: 90, easing: Easing.out(Easing.quad) }), withSpring(0, springs.press)))}
      onPress={() => {
        feedback(sound, "light");
        onPress?.();
      }}
      style={[{ height: h + lip, opacity: disabled ? 0.5 : 1 }, style]}
      hitSlop={6}
    >
      <Animated.View pointerEvents="none" style={[styles.ring, { height: h, borderRadius: radius.pill, borderColor: c.top }, ripple]} />
      <View style={[styles.lip, { height: h, top: lip, backgroundColor: c.lip, borderRadius: radius.pill }, shadow]} />
      <Animated.View style={[{ height: h, borderRadius: radius.pill, overflow: "hidden", borderWidth: 1.5, borderColor: "rgba(31,42,58,0.18)" }, face]}>
        <LinearGradient colors={[c.top, c.bottom]} style={[styles.face, { paddingHorizontal: size === "sm" ? 16 : 26 }]}>
          <View style={styles.shine} />
          <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.flash, flash]} />
          {icon}
          {label ? (
            <Text numberOfLines={1} style={[type.button, styles.label, { color: c.text, fontSize: size === "lg" ? 24 : size === "sm" ? 16 : 20 }, variant === "light" ? null : styles.labelShadow]}>{label}</Text>
          ) : null}
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  lip: { position: "absolute", left: 0, right: 0 },
  ring: { position: "absolute", left: 0, right: 0, top: 0, borderWidth: 3 },
  flash: { backgroundColor: "#1F2A3A" },
  face: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  shine: { position: "absolute", top: 3, left: 12, right: 12, height: "34%", borderRadius: 999, backgroundColor: "rgba(255,255,255,0.22)" },
  label: { includeFontPadding: false },
  labelShadow: { textShadowColor: "rgba(0,0,0,0.22)", textShadowRadius: 1, textShadowOffset: { width: 0, height: 1 } },
});
