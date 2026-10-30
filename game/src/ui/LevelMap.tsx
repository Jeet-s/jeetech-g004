import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Canvas, Group, Path, Skia, DashPathEffect, type SkPath } from "@shopify/react-native-skia";
import Animated, { Easing, ZoomIn, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { MiniStars } from "./Stars";
import { PictureThumb } from "./PictureThumb";
import { fonts, palette, shadow } from "./theme";
import { feedback } from "../audio/sfx";
import type { Puzzle } from "../game/nonogram";

const NODE = 66;
const BIG = 84;
const GAP = 104;
const BANNER_GAP = 96; // room where an island starts, so its banner never covers a node
// The path is drawn in canvas tiles: one canvas the height of the whole map exceeds the GPU's texture limit (16384 px),
// which draws nothing on phones and crashed the QA emulator (2026-10-26).
// Only the tiles and nodes near the visible window are mounted (the whole map is ~13 000 dp tall: drawing all of it
// at once held hundreds of MB of canvas textures and ~600 views, and stalled input on low-memory phones).
const TILE = 1000;
const BUCKET = 300;

export interface MapLevel {
  id: string;
  number: number;
  stars: number; // 0-3 (every puzzle is open from the start)
  chapter?: string; // island name, shown as a banner where it changes
  chapterSub?: string;
  big?: boolean; // the island's Masterwork
  puzzle?: Puzzle; // solved nodes show their finished picture
  progress?: number; // 0..1 of a saved, unfinished canvas
}

function Pulse({ size }: { size: number }) {
  const s = useSharedValue(1);
  useEffect(() => {
    s.value = withRepeat(withSequence(withTiming(1.22, { duration: 800 }), withTiming(1, { duration: 800 })), -1);
  }, [s]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: s.value }], opacity: 1.9 - s.value * 1.3 }));
  return <Animated.View style={[styles.pulse, { width: size + 24, height: size + 24, borderRadius: (size + 24) / 2, top: -12 }, style]} />;
}

/** "Next" flag that bobs over the puzzle the player continues with. */
function NextFlag({ size }: { size: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(500, withRepeat(withSequence(withTiming(1, { duration: 700, easing: Easing.inOut(Easing.sin) }), withTiming(0, { duration: 700, easing: Easing.inOut(Easing.sin) })), -1));
  }, [t]);
  const st = useAnimatedStyle(() => ({ transform: [{ translateY: -6 * t.value }] }));
  return (
    <Animated.View pointerEvents="none" entering={ZoomIn.delay(450).springify().damping(11)} style={[styles.flagWrap, { top: -36 }]}>
      <Animated.View style={[styles.flag, shadow, st]}>
        <Text style={styles.flagText}>Next</Text>
        <View style={styles.flagTip} />
      </Animated.View>
    </Animated.View>
  );
}

/** Winding island path (bottom = puzzle 1). Solved puzzles show their painting, the next one pulses teal. */
/** One ≤ TILE-tall slice of the map's dashed trail (memoised: scrolling re-renders the map, not the trail). */
const PathTile = memo(function PathTile({ k, width, height, path }: { k: number; width: number; height: number; path: SkPath }) {
  return (
    <Canvas style={{ position: "absolute", left: 0, top: k * TILE, width, height }} pointerEvents="none">
      <Group transform={[{ translateY: -k * TILE }]}>
        <Path path={path} style="stroke" strokeWidth={14} color="rgba(122,82,48,0.22)" strokeCap="round" />
        <Path path={path} style="stroke" strokeWidth={5} color="rgba(255,250,238,0.95)" strokeCap="round">
          <DashPathEffect intervals={[10, 12]} />
        </Path>
      </Group>
    </Canvas>
  );
});

export function LevelMap({ levels, current, onSelect, header, padTop = 120, padBottom = 160 }: {
  levels: MapLevel[]; current: number; onSelect: (l: MapLevel) => void; header?: React.ReactNode; padTop?: number; padBottom?: number;
}) {
  const { width, height: winH } = useWindowDimensions();
  const scroll = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const { pos, height } = useMemo(() => {
    let up = 0;
    const offs = levels.map((l, i) => {
      if (i > 0) up += GAP;
      if (l.chapter && l.chapter !== levels[i - 1]?.chapter && i > 0) up += BANNER_GAP;
      return up;
    });
    const h = Math.max(padBottom + BIG + up + padTop + BANNER_GAP, winH);
    return { height: h, pos: offs.map((o, i) => ({ x: width / 2 + Math.sin(i * 0.85) * (width * 0.27), y: h - padBottom - BIG / 2 - o })) };
  }, [levels, width, winH, padTop, padBottom]);
  const path = useMemo(() => {
    const b = Skia.PathBuilder.Make();
    pos.forEach((q, i) => {
      if (i === 0) b.moveTo(q.x, q.y);
      else { const prev = pos[i - 1]; b.cubicTo(prev.x, prev.y - GAP / 2, q.x, q.y + GAP / 2, q.x, q.y); }
    });
    return b.detach();
  }, [pos]);
  const startY = useMemo(() => {
    const y = pos[Math.max(0, current - 1)]?.y ?? 0;
    return Math.min(height - winH, Math.max(0, y - (padTop + (winH - padTop - padBottom) / 2)));
  }, [current, pos, height, winH, padTop, padBottom]);
  // Scroll position, quantised so scrolling re-renders the map only every BUCKET dp.
  const [bucket, setBucket] = useState(() => Math.floor(startY / BUCKET));
  useEffect(() => {
    setBucket(Math.floor(startY / BUCKET));
    const id = setTimeout(() => scroll.current?.scrollTo({ y: startY, animated: false }), 60);
    return () => clearTimeout(id);
  }, [startY]);
  const viewTop = bucket * BUCKET - winH, viewBottom = bucket * BUCKET + winH * 2 + BUCKET;
  const visible = (y: number, pad = 0) => y + pad >= viewTop && y - pad <= viewBottom;

  return (
    <ScrollView
      ref={scroll}
      contentContainerStyle={{ height }}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={64}
      onScroll={(e) => { const b = Math.floor(e.nativeEvent.contentOffset.y / BUCKET); if (b !== bucket) setBucket(b); }}
    >
      {header}
      {Array.from({ length: Math.ceil(height / TILE) }, (_, k) => !(k * TILE + TILE >= viewTop && k * TILE <= viewBottom) ? null : (
        <PathTile key={k} k={k} width={width} height={Math.min(TILE, height - k * TILE)} path={path} />
      ))}
      {levels.map((l, i) => {
        if (!visible(pos[i].y, BIG + BANNER_GAP)) return null;
        const isCurrent = l.number === current;
        const size = l.big ? BIG : NODE;
        const showBanner = l.chapter && l.chapter !== levels[i - 1]?.chapter;
        const solved = l.stars > 0;
        // Nodes around where the player is pop in one after another when the map opens.
        const near = Math.abs(l.number - current);
        const enter = near <= 6 ? ZoomIn.delay(80 + near * 55).springify().damping(12).stiffness(180) : undefined;
        return (
          <View key={l.id} style={isCurrent ? { zIndex: 5 } : undefined}>
            {showBanner ? (
              <View style={[styles.bannerWrap, { top: pos[i].y + size / 2 + 22 }]} pointerEvents="none">
                <View style={[styles.banner, shadow]}>
                  <Text style={styles.bannerText}>{l.chapter}</Text>
                  {l.chapterSub ? <Text style={styles.bannerSub}>{l.chapterSub}</Text> : null}
                </View>
              </View>
            ) : null}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Puzzle ${l.number}`}
              onPress={() => { feedback("pop", "medium"); onSelect(l); }}
              style={({ pressed }) => [styles.nodeWrap, { width: size, left: pos[i].x - size / 2, top: pos[i].y - size / 2, transform: [{ scale: pressed ? 0.92 : 1 }] }]}
            >
              {isCurrent ? <Pulse size={size} /> : null}
              <Animated.View entering={enter} style={{ width: size, alignItems: "center" }}>
              <View style={[styles.lip, { width: size, height: size, borderRadius: size / 2, backgroundColor: l.big ? palette.secondaryDark : isCurrent ? palette.primaryDark : "#B89A6C" }]} />
              <View style={[styles.node, shadow, { width: size, height: size, borderRadius: size / 2, borderColor: l.big ? palette.secondary : isCurrent ? palette.primary : "#FFF8E8", backgroundColor: isCurrent ? palette.primary : palette.paper }]}>
                {solved && l.puzzle ? (
                  <View style={{ width: size * 0.62, height: size * 0.62, borderRadius: 4, overflow: "hidden" }}>
                    <PictureThumb puzzle={l.puzzle} size={size * 0.62} background="#FFFBF0" />
                  </View>
                ) : (
                  <Text style={[styles.num, { color: isCurrent ? "#fff" : palette.ink, fontSize: l.big ? 28 : 24 }]}>{l.number}</Text>
                )}
                {!solved && l.progress ? <View style={[styles.progress, { width: `${Math.round(l.progress * 70)}%` }]} /> : null}
              </View>
              </Animated.View>
              {solved || l.big ? (
                <View style={styles.starsUnder}>
                  {solved ? <MiniStars count={l.stars} size={13} /> : <Text style={styles.mw}>Masterwork</Text>}
                </View>
              ) : null}
              {isCurrent ? <NextFlag size={size} /> : null}
            </Pressable>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  nodeWrap: { position: "absolute", alignItems: "center" },
  node: { alignItems: "center", justifyContent: "center", borderWidth: 3.5, overflow: "hidden" },
  lip: { position: "absolute", top: 5 },
  num: { fontFamily: fonts.display, includeFontPadding: false },
  pulse: { position: "absolute", backgroundColor: "rgba(46,140,138,0.35)" },
  starsUnder: { marginTop: 6, backgroundColor: "rgba(255,248,232,0.85)", borderRadius: 8, paddingHorizontal: 4, paddingVertical: 1 },
  mw: { fontFamily: fonts.display, fontSize: 11, color: palette.secondaryDark },
  progress: { position: "absolute", bottom: 8, height: 4, borderRadius: 2, backgroundColor: palette.primary },
  flagWrap: { position: "absolute", alignItems: "center" },
  flag: { backgroundColor: palette.secondary, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 3, borderWidth: 2, borderColor: "#FFF8E8", alignItems: "center" },
  flagText: { fontFamily: fonts.display, fontSize: 14, color: "#4A3010", includeFontPadding: false },
  flagTip: { position: "absolute", bottom: -8, width: 0, height: 0, borderLeftWidth: 7, borderRightWidth: 7, borderTopWidth: 8, borderLeftColor: "transparent", borderRightColor: "transparent", borderTopColor: palette.secondary },
  bannerWrap: { position: "absolute", left: 0, right: 0, alignItems: "center" },
  banner: { backgroundColor: palette.primary, paddingHorizontal: 24, paddingVertical: 7, borderRadius: 16, borderWidth: 2.5, borderColor: "#FFF8E8", alignItems: "center" },
  bannerText: { fontFamily: fonts.display, fontSize: 19, color: "#fff" },
  bannerSub: { fontFamily: fonts.body, fontSize: 12, color: "#E6F4F2" },
});
