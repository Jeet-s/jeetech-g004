import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconButton } from "./IconButton";
import { fonts, palette } from "./theme";
import { useSettings } from "../game/meta";

/** Screen header: round back button, centred title (+ subtitle), optional right slot. Sits under the status bar. */
export function TopBar({ title, subtitle, onBack, onSettings, right }: { title?: string; subtitle?: string; onBack?: () => void; onSettings?: () => void; right?: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const { dark } = useSettings();
  return (
    <View style={[styles.bar, { paddingTop: insets.top + 6 }]}>
      <View style={styles.side}>{onBack ? <IconButton icon="back" size={46} onPress={onBack} accessibilityLabel="Back" /> : null}</View>
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text style={[styles.title, dark && { color: "#F6EEDC" }]} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={[styles.sub, dark && { color: "#C9B8A0" }]} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.8}>{subtitle}</Text> : null}
      </View>
      <View style={[styles.side, { alignItems: "flex-end" }]}>
        {right ?? (onSettings ? <IconButton icon="gear" size={46} onPress={onSettings} accessibilityLabel="Settings" /> : null)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingBottom: 6 },
  side: { minWidth: 56 },
  title: { fontFamily: fonts.display, fontSize: 24, color: palette.ink, includeFontPadding: false },
  sub: { fontFamily: fonts.body, fontSize: 13, color: palette.inkSoft, marginTop: 1 },
});
