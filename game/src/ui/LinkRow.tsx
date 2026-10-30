import { Linking, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Icon, type IconName } from "./Icon";
import { fonts, palette } from "./theme";
import { feedback } from "../audio/sfx";

/** Opens the phone's own display settings (theme, font size). Android-only intent behind a Platform check. */
export async function openDisplaySettings(): Promise<void> {
  if (Platform.OS === "android") {
    try {
      await Linking.sendIntent("android.settings.DISPLAY_SETTINGS");
      return;
    } catch {
      // some launchers block the intent — fall through to the app's settings page
    }
  }
  try { await Linking.openSettings(); } catch { /* nothing else to open */ }
}

/** Ink chevron drawn with two hairline borders (no font glyph), so the row reads as "tap to open". */
export function Chevron({ color = palette.inkSoft, size = 10 }: { color?: string; size?: number }) {
  return <View style={{ width: size, height: size, borderTopWidth: 2.4, borderRightWidth: 2.4, borderColor: color, borderRadius: 1.5, transform: [{ rotate: "45deg" }], marginRight: 4 }} />;
}

/**
 * A tappable settings row: glyph tile, label + value/hint, chevron. ≥ 56 dp tall, the whole row is the hit area.
 */
export function LinkRow({ icon, label, value, hint, onPress, accessibilityLabel }: {
  icon: IconName; label: string; value?: string; hint?: string; onPress: () => void; accessibilityLabel?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? `${label}${value ? `, ${value}` : ""}`}
      onPress={() => { feedback("tap", "light"); onPress(); }}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.tile}><Icon name={icon} size={20} color={palette.primaryDark} /></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>
          {label}
          {value ? <Text style={styles.value}>{` · ${value}`}</Text> : null}
        </Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
      <Chevron />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 56, paddingVertical: 8, paddingHorizontal: 10, marginVertical: 3, borderRadius: 14, backgroundColor: "#F6ECD6", borderWidth: 1, borderColor: "rgba(182,128,31,0.3)" },
  pressed: { backgroundColor: "#EFE1C2", transform: [{ scale: 0.985 }] },
  tile: { width: 34, height: 34, borderRadius: 10, backgroundColor: "#E4F0EC", alignItems: "center", justifyContent: "center" },
  label: { fontFamily: fonts.body, fontSize: 16, color: palette.ink },
  value: { fontFamily: fonts.bodyRegular, fontSize: 14, color: palette.primaryDark },
  hint: { fontFamily: fonts.bodyRegular, fontSize: 12, color: palette.inkSoft, marginTop: 1 },
});
