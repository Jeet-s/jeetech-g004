import { Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Icon, type IconName } from "./Icon";
import { fonts, palette, shadow, springs } from "./theme";
import { feedback, type Sfx } from "../audio/sfx";
import { useSettings } from "../game/meta";

/**
 * Round cream "paper button" with an ink glyph (back, undo, map, shop, settings…). Squashes 4% on press,
 * a darker lip underneath, optional coral count badge and caption label underneath.
 */
export function IconButton({ icon, onPress, size = 52, label, badge, active, disabled, muted, sound = "tap", style, color, children, accessibilityLabel }: {
  icon?: IconName; onPress?: () => void; size?: number; label?: string; badge?: number | string; active?: boolean; disabled?: boolean;
  /** Nothing to do right now (undo with no history): the button stays solid and pressable, only its glyph goes pale. */
  muted?: boolean;
  sound?: Sfx; style?: ViewStyle; color?: string; children?: React.ReactNode; accessibilityLabel?: string;
}) {
  const press = useSharedValue(0);
  const { dark } = useSettings();
  const face = useAnimatedStyle(() => ({ transform: [{ translateY: press.value * 3 }, { scale: 1 - press.value * 0.05 }] }));
  const lip = Math.max(3, Math.round(size * 0.07));
  return (
    <View style={[{ alignItems: "center", opacity: disabled ? 0.55 : 1 }, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label ?? icon}
        disabled={disabled}
        hitSlop={8}
        onPressIn={() => (press.value = withSpring(1, springs.press))}
        onPressOut={() => (press.value = withSpring(0, springs.press))}
        onPress={() => {
          feedback(sound, "light");
          onPress?.();
        }}
        style={{ width: size, height: size + lip }}
      >
        <View style={[styles.lip, { width: size, height: size, top: lip, borderRadius: size / 2 }, shadow]} />
        <Animated.View style={[{ width: size, height: size, borderRadius: size / 2, overflow: "hidden" }, styles.rim, active && styles.activeRim, face]}>
          <LinearGradient colors={active ? [palette.primaryLight, palette.primary] : ["#FFFCF3", "#EFE2C4"]} style={styles.face}>
            <View style={styles.shine} />
            {children ?? (icon ? <Icon name={icon} size={size * 0.5} color={color ?? (active ? "#fff" : muted ? "#B3A486" : palette.ink)} /> : null)}
          </LinearGradient>
        </Animated.View>
        {badge !== undefined && badge !== 0 ? (
          <View style={[styles.badge, { right: -4, top: -4 }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
      </Pressable>
      {label ? <Text style={[styles.label, dark && { color: "#F6EEDC" }]} numberOfLines={1}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  lip: { position: "absolute", left: 0, backgroundColor: "#C9B086" },
  rim: { borderWidth: 1.5, borderColor: "rgba(31,42,58,0.22)" },
  activeRim: { borderColor: palette.primaryDark },
  face: { flex: 1, alignItems: "center", justifyContent: "center" },
  shine: { position: "absolute", top: 3, left: "22%", right: "22%", height: "30%", borderRadius: 999, backgroundColor: "rgba(255,255,255,0.55)" },
  badge: { position: "absolute", minWidth: 24, height: 24, paddingHorizontal: 5, borderRadius: 12, backgroundColor: palette.coral, borderWidth: 2, borderColor: "#FFF8E8", alignItems: "center", justifyContent: "center" },
  badgeText: { fontFamily: fonts.display, fontSize: 13, color: "#fff", includeFontPadding: false },
  label: { marginTop: 4, fontFamily: fonts.body, fontSize: 13, color: palette.ink },
});
