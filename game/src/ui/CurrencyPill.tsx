import { Image, Pressable, StyleSheet, View, type ImageSourcePropType } from "react-native";
import { AnimatedNumber } from "./AnimatedNumber";
import { fonts, palette, softShadow } from "./theme";
import { feedback } from "../audio/sfx";

/** HUD chip: illustrated icon + animated count (Pigments, Hint Brushes, stars) on warm oak. */
export function CurrencyPill({ image, value, onPress, light }: { image: ImageSourcePropType; value: number; onPress?: () => void; light?: boolean }) {
  return (
    <Pressable
      disabled={!onPress}
      onPress={() => {
        feedback("tap", "light");
        onPress?.();
      }}
      style={[styles.pill, light ? styles.light : styles.oak, softShadow]}
    >
      <View style={styles.iconWrap}>
        <Image source={image} style={styles.icon} resizeMode="contain" />
      </View>
      <AnimatedNumber value={value} style={[styles.value, light ? { color: palette.ink } : null]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: { flexDirection: "row", alignItems: "center", borderRadius: 999, paddingRight: 14, paddingLeft: 4, height: 38, borderWidth: 2 },
  oak: { backgroundColor: "#7A5230", borderColor: "#D4A94A" },
  light: { backgroundColor: "rgba(255,250,238,0.92)", borderColor: "rgba(182,128,31,0.5)" },
  iconWrap: { width: 32, height: 32, alignItems: "center", justifyContent: "center", marginRight: 4 },
  icon: { width: 28, height: 28 },
  value: { fontFamily: fonts.display, fontSize: 18, color: "#FFF4DA", minWidth: 24, includeFontPadding: false },
});
