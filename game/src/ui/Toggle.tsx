import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import { fonts, palette, springs } from "./theme";
import { feedback } from "../audio/sfx";

export function Toggle({ label, value, onChange, hint }: { label: string; value: boolean; onChange: (v: boolean) => void; hint?: string }) {
  const knob = useAnimatedStyle(() => ({ transform: [{ translateX: withSpring(value ? 24 : 0, springs.press) }] }));
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
      style={styles.row}
      onPress={() => {
        feedback("tap", "select");
        onChange(!value);
      }}
    >
      <View style={{ flex: 1, paddingRight: 10 }}>
        <Text style={styles.label}>{label}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
      <View style={[styles.track, { backgroundColor: value ? palette.primary : "#D8CBB0" }]}>
        <Animated.View style={[styles.knob, knob]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8, minHeight: 48 },
  label: { fontFamily: fonts.body, fontSize: 17, color: palette.ink },
  hint: { fontFamily: fonts.bodyRegular, fontSize: 12.5, color: palette.inkSoft, marginTop: 1 },
  track: { width: 54, height: 30, borderRadius: 15, padding: 3, borderWidth: 1.5, borderColor: "rgba(31,42,58,0.15)" },
  knob: { width: 22, height: 22, borderRadius: 11, backgroundColor: "#FFFBF1", elevation: 2, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } },
});
