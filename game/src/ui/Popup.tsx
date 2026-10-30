import { useEffect } from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Panel } from "./Panel";
import { IconButton } from "./IconButton";
import { fonts, palette, springs } from "./theme";
import { play } from "../audio/sfx";
import { art } from "../art";

/**
 * Paper card that springs in over a soft warm scrim, with a teal ribbon header and Mina peeking over
 * the corner. Scrolls when the content is taller than a small phone.
 */
export function Popup({ visible, title, onClose, children, mina = true, maxWidth = 420, overlay, underlay, scrim }: {
  visible: boolean; title?: string; onClose?: () => void; children: React.ReactNode; mina?: boolean; maxWidth?: number;
  /** Scrim opacity colour override (the win card uses a deeper one so nothing of the screen behind competes). */
  scrim?: string;
  /** Drawn above the card, inside the modal (confetti) — anything outside a Modal renders underneath it. */
  overlay?: React.ReactNode;
  /** Drawn over the scrim but behind the card (celebration particles that must never cover the card's content). */
  underlay?: React.ReactNode;
}) {
  const s = useSharedValue(0);
  const d = useSharedValue(0);
  // The Panel (and its gradient face) never shrink, so the card's maxHeight alone can't make the body scroll: cap the
  // ScrollView itself to the space inside the centre padding (76 top + 40 bottom + 4 border), or a tall card (the win
  // card on a 360x640 phone) runs off the bottom of the screen.
  const { height: winH } = useWindowDimensions();
  useEffect(() => {
    if (visible) {
      play("whoosh", 0.4);
      // The scrim eases in first, then the card springs up out of it — never a hard cut from the screen behind.
      d.value = 0;
      d.value = withTiming(1, { duration: 320, easing: Easing.out(Easing.quad) });
      s.value = 0;
      s.value = withDelay(90, withSpring(1, springs.pop));
    } else d.value = 0;
  }, [visible, s, d]);
  const card = useAnimatedStyle(() => ({ transform: [{ scale: 0.82 + 0.18 * s.value }, { translateY: (1 - s.value) * 30 }], opacity: Math.min(1, s.value * 1.6) }));
  const dim = useAnimatedStyle(() => ({ opacity: d.value }));
  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <SafeAreaProvider>
        <Animated.View style={[StyleSheet.absoluteFill, styles.dim, scrim ? { backgroundColor: scrim } : null, dim]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>
        {underlay}
        <View style={styles.center} pointerEvents="box-none">
          <Animated.View style={[styles.cardWrap, { maxWidth }, card]}>
            {mina ? <Image source={art.hero_mina_easel} style={styles.mina} resizeMode="contain" /> : null}
            <Panel padded={false}>
              <ScrollView bounces={false} style={{ maxHeight: winH - 120 }} contentContainerStyle={[styles.body, title ? { paddingTop: 34 } : null]} showsVerticalScrollIndicator={false}>
                {children}
              </ScrollView>
            </Panel>
            {title ? (
              <View style={styles.ribbonWrap} pointerEvents="none">
                <View style={styles.ribbon}>
                  <Text style={styles.ribbonText} numberOfLines={1}>{title}</Text>
                </View>
              </View>
            ) : null}
            {onClose ? <IconButton icon="close" size={40} onPress={onClose} style={styles.close} accessibilityLabel="Close" /> : null}
          </Animated.View>
        </View>
        {overlay}
      </SafeAreaProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dim: { backgroundColor: "rgba(38,28,14,0.7)" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20, paddingTop: 76, paddingBottom: 40 },
  cardWrap: { width: "100%", maxHeight: "100%" },
  body: { padding: 20, paddingBottom: 22 },
  mina: { position: "absolute", width: 84, height: 84, left: -4, top: -60 },
  ribbonWrap: { position: "absolute", top: -20, left: 0, right: 0, alignItems: "center" },
  ribbon: { backgroundColor: palette.primary, paddingHorizontal: 26, paddingVertical: 8, borderRadius: 14, borderWidth: 2, borderColor: palette.primaryDark, maxWidth: "76%" },
  ribbonText: { fontFamily: fonts.display, fontSize: 21, color: "#fff", textShadowColor: "rgba(0,0,0,0.25)", textShadowRadius: 1, textShadowOffset: { width: 0, height: 1 } },
  close: { position: "absolute", right: -8, top: -22 },
});
