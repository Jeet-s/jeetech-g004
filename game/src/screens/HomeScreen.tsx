import { memo, useEffect, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { Canvas, Circle, RadialGradient, vec } from "@shopify/react-native-skia";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Background, CurrencyPill, GameButton, Icon, IconButton, StatsPopup, feedback, fonts, palette, softShadow } from "../ui";
import { ISLANDS, LEVELS } from "../game/levels";
import { EVENT_SIZE, currentStreak, dayKey, dailyOf, eventClaimed, eventProgress, islandSize, islandSolved, nextLevel, totalStars, usePlayer, optsOf } from "../game/meta";
import { useBannerHeight } from "../modules/layout";
import { art } from "../art";

/** A drifting watercolor mote around the key art — slow, soft, never busy. */
function Mote({ x, y, size, color, delay }: { x: number; y: number; size: number; color: string; delay: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(delay, withRepeat(withTiming(1, { duration: 5200, easing: Easing.inOut(Easing.sin) }), -1, true));
  }, [t, delay]);
  const st = useAnimatedStyle(() => ({ opacity: 0.25 + 0.45 * t.value, transform: [{ translateY: -14 * t.value }, { translateX: 6 * Math.sin(t.value * 3) }] }));
  return <Animated.View pointerEvents="none" style={[{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: size / 2, backgroundColor: color }, st]} />;
}

/** A gold sparkle that twinkles (pops in, turns, fades) near the easel every few seconds — the hero is never still. */
function Twinkle({ x, y, size, delay }: { x: `${number}%`; y: `${number}%`; size: number; delay: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(delay, withRepeat(withSequence(withTiming(1, { duration: 520, easing: Easing.out(Easing.back(2)) }), withTiming(0, { duration: 700, easing: Easing.in(Easing.quad) }), withTiming(0, { duration: 2300 })), -1));
  }, [t, delay]);
  const st = useAnimatedStyle(() => ({ opacity: t.value, transform: [{ scale: 0.3 + 0.9 * t.value }, { rotate: `${t.value * 90}deg` }] }));
  return <Animated.Text pointerEvents="none" style={[{ position: "absolute", left: x, top: y, fontSize: size, color: "#F2B35E", textShadowColor: "rgba(255,248,226,0.9)", textShadowRadius: 6 }, st]}>✦</Animated.Text>;
}

/**
 * The TITLE screen: Mina at her easel (idle breathing + bob), the illustrated logo, currencies, island
 * progress and ONE big "Play · Level N". Map, Shop and Settings are secondary icon buttons; the optional
 * atelier layer (Daily, Atelier, Gallery) sits around it and disappears when "Hide the atelier" is on.
 */
/** The warm halo behind the hero — a static canvas, memoised so Home's re-renders never redraw it. */
const HeroGlow = memo(function HeroGlow() {
  return (
    <Canvas style={{ width: 340, height: 340 }}>
      <Circle cx={170} cy={170} r={170}>
        <RadialGradient c={vec(170, 170)} r={170} colors={["rgba(255,240,200,0.95)", "rgba(255,236,190,0.55)", "rgba(141,180,142,0.18)", "rgba(255,255,255,0)"]} />
      </Circle>
    </Canvas>
  );
});

export function HomeScreen({ onPlay, onLevels, onShop, onSettings, onDaily, onAtelier, onGallery, onEvents, onStudio }: {
  onPlay: (level: number) => void; onLevels: () => void; onShop: () => void; onSettings: () => void;
  onDaily: () => void; onAtelier: () => void; onGallery: () => void; onEvents: () => void; onStudio: () => void;
}) {
  const player = usePlayer();
  const opts = optsOf(player);
  const insets = useSafeAreaInsets();
  const bannerH = useBannerHeight();
  const n = nextLevel();
  const lvl = LEVELS[n - 1];
  const isl = ISLANDS[lvl?.island ?? 0];
  const solvedHere = islandSolved(lvl?.island ?? 0);
  const sizeHere = islandSize(lvl?.island ?? 0) || 1;
  const streak = currentStreak(dailyOf());
  const dailyDone = (player.daily?.done ?? []).includes(dayKey());
  const evDone = eventProgress();
  const evClaimed = eventClaimed();
  // Fit every phone: the space left between the status bar and the banner decides the logo, hero and button sizes
  // (a 720x1280 phone leaves ~520 dp; the hero art flexes into whatever remains).
  const { height: winH, width: winW } = useWindowDimensions();
  const avail = winH - insets.top - insets.bottom - bannerH;
  const compact = avail < 640;
  const tight = avail < 560;
  const logoH = Math.max(64, Math.min(170, Math.round(avail * (tight ? 0.13 : compact ? 0.16 : 0.2))));
  const navSize = tight ? 48 : compact ? 52 : 58;
  // Two cards side by side on a 360 dp phone leave ~157 dp each: a smaller glyph tile keeps room for the subtitle.
  const small = tight || winW < 400;

  const [statsOpen, setStatsOpen] = useState(false);
  // Play: the button's sink, darken and ripple get ~200 ms on screen before the puzzle slides in.
  const leaving = useRef(false);
  const startPlay = () => {
    if (leaving.current) return;
    leaving.current = true;
    setTimeout(() => onPlay(n), 200);
  };
  const bob = useSharedValue(0);
  const glow = useSharedValue(0);
  const logoIn = useSharedValue(0);
  useEffect(() => {
    bob.value = withRepeat(withSequence(withTiming(1.6, { duration: 2200, easing: Easing.inOut(Easing.sin) }), withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.sin) })), -1);
    glow.value = withRepeat(withTiming(1, { duration: 3600, easing: Easing.inOut(Easing.sin) }), -1, true);
    logoIn.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.back(1.6)) });
  }, [bob, glow, logoIn]);
  // Mina breathes and sways on her easel: a visible bob + squash-stretch + a slight lean, ~4.4 s a cycle.
  const heroStyle = useAnimatedStyle(() => ({ transform: [{ translateY: -9 * bob.value }, { scaleY: 1 + 0.018 * bob.value }, { scaleX: 1 - 0.008 * bob.value }, { rotate: `${(bob.value - 0.8) * 1.1}deg` }] }));
  const shadowStyle = useAnimatedStyle(() => ({ transform: [{ scaleX: 1 - 0.06 * bob.value }], opacity: 0.12 - 0.04 * bob.value }));
  // Opacity only: scaling a Skia surface every frame is costly on the UI thread (soak ANR, 2026-10-27).
  const glowStyle = useAnimatedStyle(() => ({ opacity: 0.55 + 0.3 * glow.value }));
  // Idle life: a soft light glints across Mina's easel every few seconds, and the Play button breathes.
  const glint = useSharedValue(0);
  const breathe = useSharedValue(0);
  useEffect(() => {
    glint.value = withDelay(1200, withRepeat(withSequence(withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.quad) }), withTiming(1, { duration: 3200 }), withTiming(0, { duration: 0 })), -1));
    breathe.value = withRepeat(withTiming(1, { duration: 1300, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [glint, breathe]);
  const glintStyle = useAnimatedStyle(() => ({ opacity: glint.value > 0 && glint.value < 1 ? 0.85 : 0, transform: [{ translateX: -160 + 320 * glint.value }, { rotate: "18deg" }] }));
  const playStyle = useAnimatedStyle(() => ({ transform: [{ scale: 1 + 0.035 * breathe.value }, { translateY: -2 * breathe.value }] }));
  const logoStyle = useAnimatedStyle(() => ({ opacity: logoIn.value, transform: [{ scale: 0.85 + 0.15 * logoIn.value }, { translateY: -6 * bob.value * 0.4 }] }));
  const textColor = opts.dark ? "#F6EEDC" : palette.ink;

  return (
    <View style={styles.root}>
      <Background />
      <View style={[styles.content, { paddingTop: insets.top + (compact ? 4 : 8), paddingBottom: insets.bottom + bannerH + (compact ? 6 : 14) }]}>
        <View style={styles.topRow}>
          {!opts.hideMeta ? <IconButton icon="house" size={46} onPress={onAtelier} label="Atelier" /> : <View style={{ width: 46 }} />}
          <View style={styles.currencies}>
            <CurrencyPill image={art.icon_pigment} value={player.coins} onPress={onShop} />
            <CurrencyPill image={art.icon_hint_brush} value={player.brushes ?? 0} onPress={onShop} light />
          </View>
          {!opts.hideMeta ? <IconButton icon="gallery" size={46} onPress={onGallery} label="Gallery" /> : <View style={{ width: 46 }} />}
        </View>

        <Animated.View style={[styles.logoWrap, logoStyle]}>
          <Image source={art.logo} style={[styles.logo, { height: logoH, maxHeight: logoH }]} resizeMode="contain" accessibilityLabel="Nonogram Atelier" />
        </Animated.View>

        <View style={styles.heroArea}>
          <Animated.View style={[styles.glow, glowStyle]} pointerEvents="none">
            <HeroGlow />
          </Animated.View>
          <Mote x={30} y={60} size={10} color="rgba(46,140,138,0.5)" delay={0} />
          <Mote x={290} y={40} size={8} color="rgba(227,168,59,0.6)" delay={900} />
          <Animated.View style={[styles.heroShadow, shadowStyle]} />
          <Animated.Image source={art.hero_mina_easel} style={[styles.hero, heroStyle]} resizeMode="contain" />
          <Twinkle x="22%" y="14%" size={22} delay={300} />
          <Twinkle x="70%" y="22%" size={16} delay={1500} />
          <Twinkle x="36%" y="58%" size={18} delay={2600} />
          {/* the easel glint: a narrow light band sweeping over the hero (clipped by the hero area) */}
          <Animated.View pointerEvents="none" style={[styles.glint, glintStyle]} />
        </View>

        {!opts.hideMeta ? (
          <Animated.View style={[styles.cards, { marginBottom: compact ? 6 : 10 }]}>
            <Pressable onPress={() => { feedback("tap", "light"); onDaily(); }} style={({ pressed }) => [styles.card, softShadow, pressed && { transform: [{ scale: 0.97 }] }]} accessibilityRole="button" accessibilityLabel="Daily puzzle">
              <View style={[styles.cardIcon, small && styles.cardIconSm]}><Icon name="calendar" size={small ? 20 : 24} color={palette.primaryDark} /></View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle} numberOfLines={1}>Daily</Text>
                <Text style={styles.cardSub} numberOfLines={2}>{dailyDone ? "Solved today" : "Fresh picture"}</Text>
              </View>
              {/* streak sits on the card's corner, so it never takes the subtitle's width */}
              {/* Only a real streak gets a badge — a grey "0" on a new player's card read as a placeholder number. */}
              {streak > 0 ? (
                <View style={styles.streak} accessibilityLabel={`Daily streak ${streak} day${streak === 1 ? "" : "s"}`}>
                  <Icon name="flame" size={14} color={palette.coral} />
                  <Text style={styles.streakText}>{streak}</Text>
                </View>
              ) : null}
            </Pressable>
            <Pressable onPress={() => { feedback("tap", "light"); onEvents(); }} style={({ pressed }) => [styles.card, softShadow, pressed && { transform: [{ scale: 0.97 }] }]} accessibilityRole="button" accessibilityLabel="Events: weekly exhibition">
              <View style={[styles.cardIcon, { backgroundColor: "#FBF0D4" }, small && styles.cardIconSm]}><Icon name="trophy" size={small ? 20 : 24} color={palette.secondaryDark} /></View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle} numberOfLines={1}>Events</Text>
                <Text style={styles.cardSub} numberOfLines={2}>{evClaimed ? "Reward claimed" : evDone >= EVENT_SIZE ? "Reward ready!" : `Exhibition ${evDone}/${EVENT_SIZE}`}</Text>
              </View>
              {evDone >= EVENT_SIZE && !evClaimed ? <View style={styles.dot} /> : null}
            </Pressable>
          </Animated.View>
        ) : null}

        <View style={[styles.chapter, styles.capped, { marginBottom: compact ? 6 : 10 }]}>
          <Text style={[styles.chapterText, { color: textColor }]}>Island {(lvl?.island ?? 0) + 1} · {isl.name}</Text>
          <View style={styles.bar}>
            <View style={[styles.barFill, { width: `${Math.max(3, (solvedHere / sizeHere) * 100)}%` }]} />
          </View>
          {!tight ? <Text style={[styles.barText, { color: opts.dark ? "#C9B8A0" : palette.inkSoft }]}>{solvedHere}/{sizeHere} paintings · {totalStars()} ★</Text> : null}
        </View>

        <Animated.View style={[styles.capped, playStyle]}>
          <GameButton label={`Play · Level ${n}`} variant="accent" size={tight ? "md" : "lg"} sound="pop" onPress={startPlay} style={styles.play} />
        </Animated.View>

        <View style={[styles.iconRow, { marginTop: compact ? 8 : 14 }]}>
          <IconButton icon="map" size={navSize} label="Levels" onPress={onLevels} />
          <IconButton icon="pencil" size={navSize} label="Studio" accessibilityLabel="Creator Studio" onPress={onStudio} />
          <IconButton icon="shop" size={navSize} label="Shop" onPress={onShop} />
          <IconButton icon="stats" size={navSize} label="Stats" accessibilityLabel="Stats and Profile" onPress={() => setStatsOpen(true)} />
          <IconButton icon="gear" size={navSize} label="Settings" onPress={onSettings} />
        </View>
      </View>
      <StatsPopup visible={statsOpen} onClose={() => setStatsOpen(false)} onGallery={() => { setStatsOpen(false); onGallery(); }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  /** Tablets: the lower column keeps a phone-like width instead of stretching edge to edge. */
  capped: { width: "100%", maxWidth: 520, alignSelf: "center" },
  content: { flex: 1, paddingHorizontal: 18 },
  topRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  currencies: { flexDirection: "row", gap: 8, marginTop: 6 },
  logoWrap: { alignItems: "center", marginTop: 2 },
  logo: { width: "86%" },
  heroArea: { flex: 1, minHeight: 56, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  glow: { position: "absolute", width: 340, height: 340, alignItems: "center", justifyContent: "center" },
  hero: { width: "88%", height: "100%", maxWidth: 380 },
  glint: { position: "absolute", top: "8%", width: 46, height: "78%", borderRadius: 23, backgroundColor: "rgba(255,248,226,0.28)" },
  heroShadow: { position: "absolute", bottom: "5%", width: "50%", height: 14, borderRadius: 999, backgroundColor: "#5A4020" },
  cards: { flexDirection: "row", gap: 10, width: "100%", maxWidth: 520, alignSelf: "center" },
  card: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8, paddingRight: 8, backgroundColor: "#FFFBF1", borderRadius: 18, paddingLeft: 10, paddingVertical: 7, borderWidth: 1.5, borderColor: "rgba(182,128,31,0.45)", minHeight: 52 },
  cardText: { flex: 1, minWidth: 0 },
  cardIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: "#E4F0EC", alignItems: "center", justifyContent: "center" },
  cardIconSm: { width: 32, height: 32, borderRadius: 9 },
  cardTitle: { fontFamily: fonts.display, fontSize: 16, color: palette.ink },
  cardSub: { fontFamily: fonts.bodyRegular, fontSize: 11.5, color: palette.inkSoft },
  dot: { position: "absolute", top: 6, right: 8, width: 10, height: 10, borderRadius: 5, backgroundColor: palette.coral, borderWidth: 1.5, borderColor: "#FFF8E8" },
  streak: { position: "absolute", top: -9, right: -6, flexDirection: "row", alignItems: "center", gap: 1, backgroundColor: "#FBEBDD", borderRadius: 11, paddingLeft: 4, paddingRight: 7, height: 22, borderWidth: 1.5, borderColor: "#FFF8E8" },
  streakText: { fontFamily: fonts.display, fontSize: 13, color: palette.coralDark, includeFontPadding: false },
  chapter: { alignItems: "center" },
  chapterText: { fontFamily: fonts.display, fontSize: 18 },
  bar: { width: "78%", height: 12, borderRadius: 6, backgroundColor: "#E5D8BC", marginTop: 6, overflow: "hidden", borderWidth: 1, borderColor: "rgba(122,102,80,0.25)" },
  barFill: { height: "100%", borderRadius: 6, backgroundColor: palette.sage },
  barText: { fontFamily: fonts.body, fontSize: 12.5, marginTop: 4 },
  play: { marginHorizontal: 8 },
  iconRow: { flexDirection: "row", justifyContent: "space-evenly" },
});
