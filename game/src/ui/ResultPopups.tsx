import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withRepeat, withSequence, withSpring, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Canvas, Path, RadialGradient, Skia, vec } from "@shopify/react-native-skia";
import { Image, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { mix } from "./raster";
import { Popup } from "./Popup";
import { Stars } from "./Stars";
import { GameButton } from "./GameButton";
import { AnimatedNumber } from "./AnimatedNumber";
import { PictureThumb } from "./PictureThumb";
import { Icon } from "./Icon";
import { Confetti } from "../fx/Confetti";
import { fonts, palette, softShadow } from "./theme";
import { LinearGradient } from "expo-linear-gradient";
import { play, haptic } from "../audio/sfx";
import { art } from "../art";
import type { Puzzle } from "../game/nonogram";
import { nextRenovation } from "../game/meta";
import { store } from "../modules/store";

/**
 * The finished picture hung in a gold-leaf frame — the reward the player keeps in the Gallery. `hue` paints it.
 * Every box is whole pixels and the picture sits on a cream mat with a clear margin on all four sides, so its
 * pixel rows line up with the frame and never touch (or overhang) the mat's edge.
 */
export function FramedArt({ puzzle, size, hue, glint }: { puzzle: Puzzle; size: number; hue?: string; glint?: boolean }) {
  const S = Math.round(size);
  const b = Math.max(6, Math.round(S * 0.09)); // gilt moulding
  const inner = S - b * 2 - 4; // inside the dark rebate (2 px each side)
  const matPad = Math.max(5, Math.round(inner * 0.08));
  // The picture: as large as the mat allows, then snapped so every cell is a whole number of pixels.
  const room = inner - 2 - matPad * 2;
  const n = Math.max(puzzle.w, puzzle.h);
  const pic = Math.max(n, Math.floor(room / n) * n);
  const mat = hue ? mix(hue, "#FFFBF0", 0.86) : "#FFFBF0";
  return (
    <View style={[{ width: S, height: S }, softShadow]}>
      <LinearGradient colors={["#F6D27A", "#C8912E", "#E9BC5A", "#9C6B1C"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ width: S, height: S, padding: b, borderRadius: 4 }}>
        <View style={{ width: inner + 4, height: inner + 4, backgroundColor: "#6E4824", padding: 2 }}>
          <View style={{ width: inner, height: inner, backgroundColor: mat, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#E3A83B" }}>
            <View style={{ width: pic, height: pic, overflow: "hidden" }}>
              <PictureThumb puzzle={puzzle} size={pic} background={mat} hue={hue} />
            </View>
          </View>
        </View>
      </LinearGradient>
      {glint ? <Glint size={S} /> : null}
    </View>
  );
}

/** Gold-leaf glint: a bright diagonal band glides across the framed painting every ~2.4 s (clipped to the frame). */
function Glint({ size }: { size: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(500, withRepeat(withSequence(withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }), withTiming(1, { duration: 1500 }), withTiming(0, { duration: 0 })), -1));
  }, [t]);
  const band = size * 0.42;
  const st = useAnimatedStyle(() => ({ opacity: t.value > 0 && t.value < 1 ? 1 : 0, transform: [{ translateX: -band * 1.6 + t.value * (size + band * 2.2) }, { rotate: "20deg" }] }));
  return (
    <View pointerEvents="none" style={{ position: "absolute", left: 0, top: 0, width: size, height: size, overflow: "hidden", borderRadius: 4 }}>
      <Animated.View style={[{ position: "absolute", top: -size * 0.3, width: band, height: size * 1.6 }, st]}>
        <LinearGradient colors={["rgba(255,246,214,0)", "rgba(255,246,214,0.75)", "rgba(255,246,214,0)"]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={{ flex: 1 }} />
      </Animated.View>
    </View>
  );
}

/** Slowly turning gold-leaf rays behind the finished painting — the win card never sits still. */
const Sunburst = memo(function Sunburst({ size, art: artSize }: { size: number; art: number }) {
  const r = useSharedValue(0);
  const p = useSharedValue(0);
  useEffect(() => {
    r.value = withRepeat(withTiming(1, { duration: 24000, easing: Easing.linear }), -1);
    p.value = withRepeat(withSequence(withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.sin) }), withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.sin) })), -1);
  }, [r, p]);
  const st = useAnimatedStyle(() => ({ transform: [{ rotate: `${r.value * 360}deg` }, { scale: 0.94 + p.value * 0.1 }], opacity: 0.75 + p.value * 0.25 }));
  const rays = useMemo(() => {
    const b = Skia.PathBuilder.Make(), c = size / 2, n = 14;
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2, w = Math.PI / n / 1.6;
      b.moveTo(c, c);
      b.lineTo(c + Math.cos(a - w) * c, c + Math.sin(a - w) * c);
      b.lineTo(c + Math.cos(a + w) * c, c + Math.sin(a + w) * c);
      b.close();
    }
    return b.detach();
  }, [size]);
  return (
    <Animated.View pointerEvents="none" style={[{ position: "absolute", width: size, height: size, top: -(size - artSize) / 2 }, st]}>
      <Canvas style={{ width: size, height: size }}>
        <Path path={rays}>
          <RadialGradient c={vec(size / 2, size / 2)} r={size / 2} colors={["rgba(242,179,94,0.6)", "rgba(242,179,94,0.2)", "rgba(242,179,94,0)"]} />
        </Path>
      </Canvas>
    </Animated.View>
  );
});

/**
 * The framed painting lands with a squash-and-bounce, then breathes gently while the card is open — it only moves
 * up and down and scales, never rotates (a turned pixel picture reads as jagged / misaligned in its frame).
 */
function Swaying({ children }: { children: React.ReactNode }) {
  const t = useSharedValue(0);
  const land = useSharedValue(0);
  useEffect(() => {
    land.value = withDelay(120, withSpring(1, { damping: 6, stiffness: 180, mass: 0.8 }));
    t.value = withDelay(1200, withRepeat(withSequence(withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }), withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.sin) })), -1));
  }, [t, land]);
  const st = useAnimatedStyle(() => {
    const l = land.value;
    // squash on landing: wider + shorter as it overshoots, settling to 1
    const sq = (1 - l) * 0.2; // gentle: a still frame mid-landing must never read as a distorted painting
    return { opacity: Math.min(1, l * 2.5), transform: [{ translateY: -4 * t.value + (1 - Math.min(1, l)) * -40 }, { scaleX: 1 + sq * -0.4 + (l > 1 ? (l - 1) * 0.25 : 0) }, { scaleY: 1 + sq * 0.4 - (l > 1 ? (l - 1) * 0.25 : 0) }] };
  });
  return <Animated.View style={st}>{children}</Animated.View>;
}

/**
 * Confetti bursts from the two top corners of the screen and rains down BEHIND the card (Popup underlay) — it frames
 * the card but never crosses its title, stars, reward or buttons. Three rounds, alternating left and right.
 */
function ConfettiRain({ on }: { on: boolean }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  useEffect(() => {
    if (!on) return;
    setA((v) => v + 1);
    const t1 = setTimeout(() => setB((v) => v + 1), 260);
    // Three rounds, then the card rests: an endless particle loop keeps the GPU and UI thread busy for as long as the
    // card is left open (low-end phones stutter, input slows).
    let rounds = 1;
    const iv = setInterval(() => { if (++rounds > 3) { clearInterval(iv); return; } setA((v) => v + 1); setTimeout(() => setB((v) => v + 1), 900); }, 1800);
    return () => { clearTimeout(t1); clearInterval(iv); };
  }, [on]);
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Confetti trigger={a} count={30} origin={{ x: width * 0.08, y: insets.top + 40 }} />
      <Confetti trigger={b} count={30} origin={{ x: width * 0.92, y: insets.top + 40 }} />
    </View>
  );
}

type Box = { x: number; y: number; w: number; h: number };
const DROP_STAGGER = 70;
const DROP_FLIGHT = 720;

/**
 * Pigment droplets leave the framed painting's RIGHT edge and arc out and up to the balance pinned top-right —
 * they head sideways first, so they never cross the ribbon title, the picture name, the stars or the reward label.
 * The balance counts up one droplet at a time as each lands.
 */
function PigmentFlight({ src, gained, balance, go, drops, landed, onLand }: {
  src: Box | null; gained: number; balance: number; go: number; drops: number; landed: number; onLand: (n: number) => void;
}) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  // Icon on the pill's right end: the drops land at the far right, well clear of the centred ribbon.
  const to = { x: width - 16 - 2 - 10 - 8, y: insets.top + 10 + 18 };
  const shown = balance - gained + (drops ? Math.round((gained * Math.min(landed, drops)) / drops) : gained);
  const bump = useSharedValue(1);
  useEffect(() => {
    if (!go || !src || !drops) return;
    const ts = Array.from({ length: drops }, (_, k) => setTimeout(() => {
      onLand(k + 1);
      bump.value = withSequence(withTiming(1.16, { duration: 70 }), withSpring(1, { damping: 8, stiffness: 300 }));
      play("coin", 0.35, 1 + k * 0.05);
      if (k === drops - 1) haptic("light");
    }, k * DROP_STAGGER + DROP_FLIGHT));
    return () => ts.forEach(clearTimeout);
  }, [go, src, drops, onLand, bump]);
  const pill = useAnimatedStyle(() => ({ transform: [{ scale: bump.value }] }));
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View style={[styles.balance, { top: insets.top + 10, right: 16 }, pill]} accessibilityLabel={`${balance} Pigments`}>
        {/* each landing is a short tick (shorter than the drop stagger, so AnimatedNumber never restarts mid-count) */}
        <AnimatedNumber value={shown} style={styles.balanceText} duration={DROP_STAGGER - 10} />
        <Image source={art.icon_pigment} style={{ width: 16, height: 21 }} resizeMode="contain" />
      </Animated.View>
      {go && src ? Array.from({ length: drops }, (_, k) => <Flyer key={`${go}-${k}`} k={k} n={drops} src={src} to={to} />) : null}
    </View>
  );
}

function Flyer({ k, n, src, to }: { k: number; n: number; src: Box; to: { x: number; y: number } }) {
  const t = useSharedValue(0);
  useEffect(() => { t.value = withDelay(k * DROP_STAGGER, withTiming(1, { duration: DROP_FLIGHT, easing: Easing.inOut(Easing.cubic) })); }, [t, k]);
  // Spawn out of the "+N Pigments" pill (spread along its right half), control point level with the spawn but out at
  // the counter's x: the drop travels right first, then rises to the balance — it never sits on the painting's frame.
  // Spawn just past the pill's right end (never over the "+N Pigments" text), a little fan of start heights.
  const x0 = src.x + src.w + 8;
  const y0 = src.y + src.h * (0.25 + 0.5 * (n > 1 ? k / (n - 1) : 0.5));
  const cx = to.x + (k % 3) * 3, cy = y0 + ((k % 2) * 2 - 1) * 8;
  const st = useAnimatedStyle(() => {
    const u = t.value;
    const x = (1 - u) * (1 - u) * x0 + 2 * (1 - u) * u * cx + u * u * to.x;
    const y = (1 - u) * (1 - u) * y0 + 2 * (1 - u) * u * cy + u * u * to.y;
    return { opacity: u <= 0 || u >= 1 ? 0 : Math.min(1, u * 8), transform: [{ translateX: x - 10 }, { translateY: y - 13 }, { scale: Math.min(1, 0.4 + u * 6) * (1 - u * 0.35) }, { rotate: `${(u - 0.5) * 40}deg` }] };
  });
  return <Animated.Image source={art.icon_pigment} style={[{ position: "absolute", left: 0, top: 0, width: 20, height: 26 }, st]} resizeMode="contain" />;
}

/** The new painting lifts off its frame as a small gilt card and arcs (left of the text column) into the Gallery button. */
function ThumbFlight({ puzzle, hue, from, to, onDone }: { puzzle: Puzzle; hue?: string; from: Box; to: Box; onDone: () => void }) {
  const t = useSharedValue(0);
  const size = Math.round(from.w * 0.62);
  useEffect(() => {
    t.value = withTiming(1, { duration: 600, easing: Easing.inOut(Easing.cubic) });
    const id = setTimeout(onDone, 600);
    return () => clearTimeout(id);
  }, [t, onDone]);
  const sx = from.x + from.w / 2, sy = from.y + from.h / 2;
  const ex = to.x + Math.min(30, to.w / 2), ey = to.y + to.h / 2;
  const cx = Math.max(12 + size * 0.2, Math.min(sx, ex) - from.w * 0.85), cy = (sy + ey) / 2;
  const st = useAnimatedStyle(() => {
    const u = t.value;
    const x = (1 - u) * (1 - u) * sx + 2 * (1 - u) * u * cx + u * u * ex;
    const y = (1 - u) * (1 - u) * sy + 2 * (1 - u) * u * cy + u * u * ey;
    // Shrinks quickly to a small card, so it only brushes past the text on its way down.
    const sc = 1 - 0.7 * Math.min(1, u * 1.8);
    return { opacity: u >= 1 ? 0 : 1, transform: [{ translateX: x - size / 2 }, { translateY: y - size / 2 }, { scale: sc }, { rotate: `${-14 * Math.sin(u * Math.PI)}deg` }] };
  });
  return (
    <Animated.View pointerEvents="none" style={[styles.thumbFly, { width: size, height: size }, st]}>
      <PictureThumb puzzle={puzzle} size={size - 6} hue={hue} background={hue ? mix(hue, "#FFFBF0", 0.86) : "#FFFBF0"} />
    </Animated.View>
  );
}

/**
 * Where the Pigments go next: the next atelier room, its cost, and a bar that fills as the droplets land. The moment
 * the room becomes affordable the bar flashes gold, a chime plays and a "Renovate" button pops in that opens the
 * Atelier — the payoff is one tap away, never a silently full bar.
 */
function RenovationTeaser({ coins, onRenovate, small }: { coins: number; onRenovate?: () => void; small?: boolean }) {
  const reno = nextRenovation();
  const frac = useSharedValue(0);
  const flash = useSharedValue(0);
  const cta = useSharedValue(0);
  const target = reno ? Math.max(0, Math.min(1, coins / reno.cost)) : 0;
  const have = reno ? Math.max(0, Math.min(coins, reno.cost)) : 0;
  const ready = !!reno && have >= reno.cost && reno.needArt === 0;
  const wasReady = useRef<boolean | null>(null);
  const bounce = useSharedValue(1);
  const lastTarget = useRef(target);
  useEffect(() => {
    frac.value = withTiming(target, { duration: 420, easing: Easing.out(Easing.cubic) });
    // Each landing droplet nudges the bar: a small squash-bounce, so the renovation visibly fills.
    if (target > lastTarget.current) bounce.value = withSequence(withTiming(1.05, { duration: 90 }), withSpring(1, { damping: 6, stiffness: 300 }));
    lastTarget.current = target;
  }, [target, frac, bounce]);
  const bounceSt = useAnimatedStyle(() => ({ transform: [{ scale: bounce.value }] }));
  useEffect(() => {
    if (wasReady.current === null) { wasReady.current = ready; if (ready) cta.value = withDelay(300, withSpring(1, { damping: 7, stiffness: 220 })); return; }
    if (ready && !wasReady.current) {
      flash.value = withSequence(withTiming(1, { duration: 140 }), withTiming(0, { duration: 600 }));
      cta.value = withDelay(200, withSpring(1, { damping: 6, stiffness: 220 }));
      play("unlock", 0.7);
      haptic("success");
    }
    wasReady.current = ready;
  }, [ready, flash, cta]);
  const bar = useAnimatedStyle(() => ({ width: `${Math.max(4, frac.value * 100)}%` }));
  const glow = useAnimatedStyle(() => ({ opacity: flash.value }));
  const ctaSt = useAnimatedStyle(() => ({ opacity: Math.min(1, cta.value * 2), transform: [{ scale: 0.6 + 0.4 * cta.value }] }));
  if (!reno) return null;
  const paintings = `${reno.needArt} more painting${reno.needArt === 1 ? "" : "s"}`;
  const headline = ready ? `${reno.room.name} ready to renovate!` : reno.needArt > 0 && have >= reno.cost ? `${reno.room.name}: ${paintings} to go` : `${reno.room.name}: ${reno.cost - have} Pigments to go`;
  const status = !ready && reno.needArt > 0 && have < reno.cost ? `then ${paintings}` : null;
  return (
    <Animated.View style={[styles.teaser, bounceSt]} accessibilityLabel={`Atelier renovation: ${reno.room.name}, ${have} of ${reno.cost} Pigments`}>
      <Animated.View pointerEvents="none" style={[styles.teaserGlow, glow]} />
      <View style={styles.teaserIcon}><Icon name="house" size={22} color={palette.secondaryDark} /></View>
      <View style={{ flex: 1, minWidth: 0 }}>
        {small ? null : <Text style={styles.teaserLabel}>Atelier renovation</Text>}
        <Text style={[styles.teaserHead, small && { fontSize: 14.5 }]}>{headline}</Text>
        <Text style={styles.teaserText}>{have}/{reno.cost} Pigments{status ? ` · ${status}` : ""}</Text>
        <View style={styles.teaserBar}><Animated.View style={[styles.teaserFill, ready && { backgroundColor: palette.primary }, bar]} /></View>
      </View>
      {ready && onRenovate ? (
        <Animated.View style={ctaSt}>
          <GameButton size="sm" variant="secondary" label="Renovate" onPress={onRenovate} />
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

/**
 * Puzzle complete: the painted picture swaying in its frame over turning rays, confetti raining behind the card,
 * stars popping in. The new painting flies into the Gallery button; the Pigments count up from 0, then fly from the
 * frame into the balance, and the atelier-renovation bar fills with them. One big Next.
 */
export function WinPopup({ visible, puzzle, hue, title, stars, goals, pigments, balance, bonus, extra, onNext, onGallery, onHome, onAtelier, nextLabel = "Next Puzzle", children }: {
  visible: boolean; puzzle: Puzzle; hue?: string; title: string; stars: number; pigments: number; balance?: number; bonus?: string; extra?: string;
  /** What each star was for — met goals in gold, a missed one greyed with its reason, so a missing star is explained. */
  goals?: { label: string; met: boolean; why?: string }[];
  onNext: () => void; onGallery?: () => void; onHome?: () => void; onAtelier?: () => void; nextLabel?: string; children?: React.ReactNode;
}) {
  const { height: winH, width: winW } = useWindowDimensions();
  const small = winH < 720; // 360x640 dp phones: a smaller frame keeps Next on screen and the ribbon clear of the balance
  // The painting is the hero of the card: ~60% of the card's inner width (card = min(420, screen − 40), body padding 20).
  const inner = Math.min(420, winW - 40) - 44;
  // 360x800-class phones: a slightly smaller frame and no bonus breakdown, so the whole card (Gallery / Home included)
  // sits on one screen without scrolling.
  const mid = !small && winH < 860;
  const artSize = Math.round(small ? Math.min(118, inner * 0.42) : mid ? Math.min(176, inner * 0.54) : Math.min(230, inner * 0.6));
  // The rays stay inside the card's body (a ScrollView clips): never wider than the body, and the block above the
  // frame reserves room for their top half.
  const burst = Math.min(Math.round(artSize * 1.5), inner);
  const burstPad = Math.max(0, Math.round((burst - artSize) / 2) - 26);
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const [counted, setCounted] = useState(false);
  const [fly, setFly] = useState(0);
  const [src, setSrc] = useState<Box | null>(null);
  const [landed, setLanded] = useState(0);
  const [thumb, setThumb] = useState<{ from: Box; to: Box } | null>(null);
  const frameRef = useRef<React.ComponentRef<typeof View>>(null);
  const rewardRef = useRef<React.ComponentRef<typeof View>>(null);
  const galleryRef = useRef<React.ComponentRef<typeof View>>(null);
  const drops = pigments > 0 ? Math.min(9, pigments) : 0;
  const galleryPop = useSharedValue(1);
  const onLand = useCallback((n: number) => setLanded((v) => Math.max(v, n)), []);
  const popGallery = useCallback(() => {
    setThumb(null);
    galleryPop.value = withSequence(withTiming(1.2, { duration: 110 }), withSpring(1, { damping: 6, stiffness: 260 }));
    play("pop", 0.6);
    haptic("light");
  }, [galleryPop]);
  useEffect(() => {
    setCount(0);
    setCounted(false);
    setLanded(0);
    setSrc(null);
    setThumb(null);
    if (!visible) return;
    play("success", 0.8);
    haptic("success");
    // As the card settles, the new painting flies into the Gallery button.
    const tThumb = setTimeout(() => {
      if (reduced || !onGallery) return;
      frameRef.current?.measureInWindow((fx, fy, fw, fh) => {
        galleryRef.current?.measureInWindow((gx, gy, gw, gh) => {
          if (!fw || !gw || gy + gh / 2 > winH - 8) return; // Gallery scrolled off a tiny screen: skip the flight
          setThumb({ from: { x: fx, y: fy, w: fw, h: fh }, to: { x: gx, y: gy, w: gw, h: gh } });
        });
      });
    }, 950);
    // Count 0 → total once the stars have landed, then send the pigments from the frame to the balance.
    let raf = 0;
    const t0 = Date.now() + 700, dur = 1000;
    const tick = () => {
      const u = Math.max(0, Math.min(1, (Date.now() - t0) / dur));
      setCount(Math.round(pigments * (1 - Math.pow(1 - u, 3))));
      if (u < 1) raf = requestAnimationFrame(tick);
      else {
        setCounted(true);
        play("coin", 0.7);
        if (reduced || !drops) { setLanded(drops); return; }
        rewardRef.current?.measureInWindow((x, y, w, h) => { setSrc({ x, y, w, h }); setFly((f) => f + 1); });
      }
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); clearTimeout(tThumb); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, pigments]);
  const pop = useSharedValue(1);
  useEffect(() => { if (counted) pop.value = withSequence(withTiming(1.18, { duration: 120 }), withSpring(1, { damping: 6, stiffness: 240 })); }, [counted, pop]);
  const pillSt = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));
  const galSt = useAnimatedStyle(() => ({ transform: [{ scale: galleryPop.value }] }));
  // The balance the renovation bar shows: before the flight it is the old total; it fills as each droplet lands.
  const total = balance ?? store.get().coins;
  const coinsNow = total - pigments + (drops ? Math.round((pigments * Math.min(landed, drops)) / drops) : pigments);
  return (
    <Popup
      visible={visible}
      title="Masterpiece!"
      mina={false}
      scrim="rgba(38,28,14,0.88)"
      underlay={visible ? <ConfettiRain on={visible} /> : null}
      overlay={visible ? (
        <>
          {balance != null ? <PigmentFlight src={src} gained={pigments} balance={balance} go={fly} drops={drops} landed={landed} onLand={onLand} /> : null}
          {thumb ? <ThumbFlight puzzle={puzzle} hue={hue} from={thumb.from} to={thumb.to} onDone={popGallery} /> : null}
        </>
      ) : null}
    >
      <View style={{ alignItems: "center", paddingTop: burstPad }}>
        <View style={{ position: "absolute", top: burstPad, left: 0, right: 0, alignItems: "center" }} pointerEvents="none">
          <Sunburst size={burst} art={artSize} />
        </View>
        <View ref={frameRef} collapsable={false}>
          <Swaying><FramedArt puzzle={puzzle} size={artSize} hue={hue} glint={!reduced} /></Swaying>
        </View>
        {/* text sits on its own paper plate, so nothing celebratory ever reads through it */}
        <View style={styles.plate}>
          <Text style={[styles.name, small && { fontSize: 22 }]}>{title}</Text>
        </View>
        <Stars count={stars} animate={visible} size={small ? 32 : 40} />
        {goals ? (
          <View style={styles.goals} accessibilityLabel={goals.map((g) => `${g.label}${g.met ? "" : ` missed: ${g.why ?? ""}`}`).join(", ")}>
            {goals.map((g) => (
              <View key={g.label} style={styles.goal}>
                <Text style={[styles.goalStar, { color: g.met ? palette.star : "#CDBF9F" }]}>★</Text>
                <Text style={[styles.goalText, !g.met && styles.goalMissed]}>{g.met ? g.label : `${g.label}: ${g.why ?? "missed"}`}</Text>
              </View>
            ))}
          </View>
        ) : null}
        <Animated.View style={[{ maxWidth: "100%" }, pillSt]}>
          <View ref={rewardRef} collapsable={false} style={styles.reward} accessibilityLabel={`plus ${pigments} Pigments`}>
            {counted && !reduced ? <PillShine /> : null}
            <Image source={art.icon_pigment} style={small ? styles.pigSm : styles.pig} resizeMode="contain" />
            <Text style={[styles.coinText, small && { fontSize: 24 }]}>+{count}</Text>
            <Text style={styles.unit}>Pigments</Text>
          </View>
        </Animated.View>
        {/* Small phones keep the card on one screen: the bonus breakdown is a detail, the reward pill says the total. */}
        {bonus && !small && !mid ? <Text style={[styles.bonus, { opacity: counted ? 1 : 0 }]}>{bonus}</Text> : null}
        {extra && !small ? <Text style={styles.extra}>{extra}</Text> : null}
      </View>
      <RenovationTeaser coins={coinsNow} onRenovate={onAtelier} small={small} />
      <NextReveal visible={visible} delay={reduced ? 0 : 1650}>
        <GameButton label={nextLabel} variant="primary" size="lg" onPress={onNext} />
      </NextReveal>
      <View style={styles.row}>
        {onGallery ? (
          <Animated.View ref={galleryRef} collapsable={false} style={[{ flex: 1 }, galSt]}>
            <GameButton size="sm" variant="light" label="Gallery" icon={<Icon name="gallery" size={18} color={palette.ink} />} onPress={onGallery} />
          </Animated.View>
        ) : null}
        {onHome ? <GameButton style={{ flex: 1 }} size="sm" variant="light" label="Home" icon={<Icon name="house" size={18} color={palette.ink} />} onPress={onHome} /> : null}
      </View>
      {children}
    </Popup>
  );
}

/**
 * The Next button holds its place (no layout jump) but lands only after the celebration beat — stars, count-up and
 * droplets first — with a springy pop and a chime, then breathes in a slow pulse so it draws the eye.
 */
function NextReveal({ visible, delay, children }: { visible: boolean; delay: number; children: React.ReactNode }) {
  const v = useSharedValue(0);
  const pulse = useSharedValue(0);
  const [live, setLive] = useState(false);
  useEffect(() => {
    v.value = 0;
    pulse.value = 0;
    setLive(false);
    if (!visible) return;
    // No overshoot past full size, and the pulse stays inside the side margin: the button never spills off the card.
    v.value = withDelay(delay, withTiming(1, { duration: 320, easing: Easing.out(Easing.cubic) }));
    pulse.value = withDelay(delay + 450, withRepeat(withSequence(withTiming(1, { duration: 560, easing: Easing.inOut(Easing.sin) }), withTiming(0, { duration: 560, easing: Easing.inOut(Easing.sin) })), -1));
    const t = setTimeout(() => { setLive(true); play("pop", 0.5, 1.1); }, delay);
    return () => clearTimeout(t);
  }, [visible, delay, v, pulse]);
  // The pulse breathes 0.95 → 1.0 (never past full size) inside a side margin, so it never spills off the card.
  const st = useAnimatedStyle(() => ({ opacity: Math.min(1, v.value * 1.5), transform: [{ scale: (0.8 + 0.2 * v.value) * (0.95 + pulse.value * 0.05) }, { translateY: -2 * pulse.value }] }));
  return (
    <Animated.View pointerEvents={live ? "auto" : "none"} style={[{ marginTop: 10, marginHorizontal: 4 }, st]}>
      {children}
    </Animated.View>
  );
}

/** A soft light band glides across the reward pill a few times once the count has landed — the payout keeps glinting. */
function PillShine() {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(withSequence(withTiming(1, { duration: 650, easing: Easing.inOut(Easing.quad) }), withTiming(1, { duration: 900 }), withTiming(0, { duration: 0 })), 4);
  }, [t]);
  const st = useAnimatedStyle(() => ({ opacity: t.value > 0 && t.value < 1 ? 1 : 0, transform: [{ translateX: -60 + t.value * 260 }, { rotate: "18deg" }] }));
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderRadius: 18, overflow: "hidden" }]}>
      <Animated.View style={[{ position: "absolute", top: -12, width: 34, height: 70 }, st]}>
        <LinearGradient colors={["rgba(255,250,228,0)", "rgba(255,250,228,0.9)", "rgba(255,250,228,0)"]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={{ flex: 1 }} />
      </Animated.View>
    </View>
  );
}

/** Strikes mode only (off by default): out of strikes — retry, or keep painting with strikes switched off. */
export function FailPopup({ visible, message, onRetry, onContinue, onHome }: {
  visible: boolean; message: string; onRetry: () => void; onContinue?: () => void; onHome?: () => void;
}) {
  useEffect(() => {
    if (visible) { play("fail", 0.5); haptic("warning"); }
  }, [visible]);
  return (
    <Popup visible={visible} title="Out of strikes">
      <View style={{ alignItems: "center", marginBottom: 6 }}>
        <Icon name="bulb" size={44} color={palette.secondaryDark} />
      </View>
      <Text style={styles.msg}>{message}</Text>
      <GameButton label="Try Again" variant="primary" size="lg" onPress={onRetry} />
      {onContinue ? <GameButton style={{ marginTop: 12 }} label="Keep painting, no strikes" variant="secondary" onPress={onContinue} /> : null}
      {onHome ? <GameButton style={{ marginTop: 12 }} size="sm" variant="light" label="Home" onPress={onHome} /> : null}
    </Popup>
  );
}

const styles = StyleSheet.create({
  plate: { marginTop: 6, paddingHorizontal: 12, paddingVertical: 1, borderRadius: 12, backgroundColor: "#FFFBF1", maxWidth: "100%" },
  name: { fontFamily: fonts.display, fontSize: 24, color: palette.ink, textAlign: "center" },
  // Wraps instead of truncating: "+18 Pigments" can never be clipped at 360 dp or with a large system font.
  reward: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 4, backgroundColor: "#F3E8CF", borderRadius: 18, paddingVertical: 5, paddingHorizontal: 16, borderWidth: 1, borderColor: "rgba(182,128,31,0.35)" },
  pig: { width: 26, height: 32 },
  pigSm: { width: 22, height: 27 },
  balance: { position: "absolute", flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#FFF8E8", borderRadius: 18, paddingHorizontal: 10, height: 36, borderWidth: 2, borderColor: palette.secondary },
  balanceText: { fontFamily: fonts.display, fontSize: 16, color: palette.secondaryDark, fontVariant: ["tabular-nums"], includeFontPadding: false },
  coinText: { fontFamily: fonts.display, fontSize: 28, color: palette.secondaryDark, fontVariant: ["tabular-nums"] },
  unit: { fontFamily: fonts.body, fontSize: 14, color: palette.inkSoft, marginLeft: 2 },
  bonus: { fontFamily: fonts.body, fontSize: 13, color: palette.primaryDark, marginTop: 5, textAlign: "center" },
  extra: { fontFamily: fonts.body, fontSize: 13.5, color: palette.coralDark, marginTop: 3, textAlign: "center" },
  teaser: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10, backgroundColor: "#FBF3E0", borderRadius: 14, paddingVertical: 7, paddingHorizontal: 10, borderWidth: 1, borderColor: "rgba(182,128,31,0.35)" },
  teaserGlow: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, borderRadius: 14, backgroundColor: "rgba(246,210,122,0.55)" },
  teaserIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#FBE7B8", alignItems: "center", justifyContent: "center" },
  teaserLabel: { fontFamily: fonts.display, fontSize: 11, color: palette.primaryDark, textTransform: "uppercase", letterSpacing: 0.6 },
  teaserStatus: { fontFamily: fonts.body, fontSize: 11, color: palette.primary, textTransform: "none", letterSpacing: 0 },
  teaserHead: { fontFamily: fonts.display, fontSize: 16.5, color: palette.ink, marginTop: 1 },
  teaserText: { fontFamily: fonts.body, fontSize: 12.5, color: palette.inkSoft },
  teaserBar: { height: 7, borderRadius: 4, backgroundColor: "#E5D8BC", marginTop: 4, overflow: "hidden" },
  teaserFill: { height: "100%", borderRadius: 4, backgroundColor: palette.secondary },
  thumbFly: { position: "absolute", left: 0, top: 0, padding: 3, borderRadius: 3, backgroundColor: "#D9A646", borderWidth: 1, borderColor: "#9C6B1C", alignItems: "center", justifyContent: "center", shadowColor: "#4A3416", shadowOpacity: 0.3, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
  row: { flexDirection: "row", gap: 12, marginTop: 12 },
  goals: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", columnGap: 10, rowGap: 1, marginBottom: 4, maxWidth: "100%" },
  goal: { flexDirection: "row", alignItems: "center", gap: 3 },
  goalStar: { fontFamily: fonts.display, fontSize: 14, includeFontPadding: false },
  goalText: { fontFamily: fonts.body, fontSize: 12.5, color: palette.ink },
  goalMissed: { color: palette.coralDark },
  msg: { fontFamily: fonts.body, fontSize: 16, color: palette.inkSoft, textAlign: "center", marginBottom: 16 },
});
