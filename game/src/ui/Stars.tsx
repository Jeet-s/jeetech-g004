import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withSequence, withSpring, withTiming } from "react-native-reanimated";
import { Icon } from "./Icon";
import { play, haptic } from "../audio/sfx";
import { palette } from "./theme";

function Star({ on, index, animate, size }: { on: boolean; index: number; animate: boolean; size: number }) {
  const s = useSharedValue(animate ? 0 : 1);
  useEffect(() => {
    if (!animate) return;
    const delay = 200 + index * 260;
    // Start from nothing every time the card opens (the card is mounted earlier, hidden, with the stars at rest —
    // without this reset they sat there at full size and only twitched: "the stars look static").
    s.value = 0;
    // Slams in past full size, then springs back with a wobble — a still frame mid-landing reads as a big gold pop.
    s.value = withDelay(delay, withSequence(withTiming(1.35, { duration: 230, easing: Easing.out(Easing.quad) }), withSpring(1, { damping: 5, stiffness: 220 })));
    if (on) {
      const id = setTimeout(() => {
        play(`star${index + 1}` as "star1", 0.7);
        haptic("medium");
      }, delay + 100);
      return () => clearTimeout(id);
    }
  }, [animate, index, on, s]);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: s.value }, { rotate: `${(1 - Math.min(1, s.value)) * -30}deg` }, { translateY: index === 1 ? -10 : 0 }],
  }));
  const sz = index === 1 ? size * 1.2 : size;
  return (
    <View style={styles.star}>
      {animate && on ? <StarBurst size={sz} delay={200 + index * 260 + 220} lift={index === 1 ? -10 : 0} /> : null}
      <Animated.View style={style}>
        <Icon name="star" size={sz} color={on ? palette.star : "#E4D7BC"} />
      </Animated.View>
    </View>
  );
}

/** As a won star lands: a gold ring flashes out of it and four sparks shoot away (each star its own little payoff). */
function StarBurst({ size, delay, lift }: { size: number; delay: number; lift: number }) {
  const t = useSharedValue(0);
  useEffect(() => { t.value = withDelay(delay, withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) })); }, [t, delay]);
  const ring = useAnimatedStyle(() => ({ opacity: t.value <= 0 ? 0 : 0.85 * (1 - t.value), transform: [{ translateY: lift }, { scale: 0.5 + t.value * 1.1 }] }));
  const d = size * 1.25;
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { alignItems: "center", justifyContent: "center", overflow: "visible" }]}>
      <Animated.View style={[{ position: "absolute", width: d, height: d, borderRadius: d / 2, borderWidth: 3, borderColor: "#F6D27A" }, ring]} />
      {[0, 1, 2, 3].map((k) => <Spark key={k} t={t} angle={-Math.PI / 4 + (k * Math.PI) / 2} dist={size * 0.85} lift={lift} />)}
    </View>
  );
}

function Spark({ t, angle, dist, lift }: { t: { value: number }; angle: number; dist: number; lift: number }) {
  const st = useAnimatedStyle(() => ({
    opacity: t.value <= 0 ? 0 : 1 - t.value,
    transform: [{ translateX: Math.cos(angle) * dist * t.value }, { translateY: lift + Math.sin(angle) * dist * t.value }, { rotate: "45deg" }, { scale: 1 - t.value * 0.5 }],
  }));
  return <Animated.View style={[{ position: "absolute", width: 7, height: 7, borderRadius: 1.5, backgroundColor: "#FFE7A3" }, st]} />;
}

/** Three gold-leaf stars with staggered pop + rising chimes. `animate` for the win card. */
export function Stars({ count, animate = false, size = 48 }: { count: number; animate?: boolean; size?: number }) {
  return (
    <View style={styles.row}>
      {[0, 1, 2].map((i) => (
        <Star key={i} index={i} on={i < count} animate={animate} size={size} />
      ))}
    </View>
  );
}

/** Small static stars (map nodes, HUD). */
export function MiniStars({ count, size = 12, dim = "#D9CCAE" }: { count: number; size?: number; dim?: string }) {
  return (
    <View style={styles.mini}>
      {[0, 1, 2].map((i) => (
        <Icon key={i} name="star" size={size} color={i < count ? palette.star : dim} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "center", alignItems: "flex-end", gap: 4, marginVertical: 6 },
  star: { alignItems: "center", justifyContent: "center" },
  mini: { flexDirection: "row", gap: 1 },
});
