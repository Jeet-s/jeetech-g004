import { StyleSheet, View, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { palette, radius, shadow } from "./theme";

/** Cream paper card with a gold-leaf hairline border and a soft warm shadow — popups, menus, HUD groups. */
export function Panel({ children, style, dark, padded = true }: { children: React.ReactNode; style?: ViewStyle; dark?: boolean; padded?: boolean }) {
  return (
    <View style={[styles.wrap, shadow, style]}>
      <LinearGradient
        colors={dark ? ["#2A3058", palette.night] : ["#FFFBF1", "#F6ECD6"]}
        style={[styles.face, padded && styles.pad, { borderColor: dark ? "rgba(242,179,94,0.55)" : "rgba(182,128,31,0.55)" }]}
      >
        <View pointerEvents="none" style={[styles.inner, { borderColor: dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.8)" }]} />
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: radius.lg },
  face: { borderRadius: radius.lg, borderWidth: 2 },
  pad: { padding: 20 },
  inner: { position: "absolute", left: 3, right: 3, top: 3, bottom: 3, borderRadius: radius.lg - 3, borderWidth: 1 },
});
