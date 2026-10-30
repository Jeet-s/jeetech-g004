import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Background, IconButton, LevelMap, MiniStars, PictureThumb, feedback, fonts, palette, softShadow, type MapLevel } from "../ui";
import { ISLANDS, LEVELS } from "../game/levels";
import { islandSize, islandSolved, nextLevel, saveProgress, usePlayer } from "../game/meta";
import { useBannerHeight } from "../modules/layout";
import { art } from "../art";

type Filter = "all" | "small" | "medium" | "large" | "color";
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "small", label: "Up to 10×10" },
  { id: "medium", label: "11–15" },
  { id: "large", label: "16+" },
  { id: "color", label: "Colour" },
];

/**
 * The island map (10 islands, each a pack ending in a Masterwork) and the Free Play library with size and
 * colour filters. Every puzzle is open from the first launch — nothing is locked behind difficulty.
 */
export function LevelsScreen({ onPlay, onBack }: { onPlay: (level: number) => void; onBack: () => void }) {
  const player = usePlayer();
  const insets = useSafeAreaInsets();
  const bannerH = useBannerHeight();
  const [tab, setTab] = useState<"map" | "library">("map");
  const current = nextLevel();
  const levels: MapLevel[] = useMemo(() => LEVELS.map((l) => ({
    id: l.spec.id,
    number: l.number,
    stars: player.stars?.[l.spec.id] ?? 0,
    chapter: ISLANDS[l.island].name,
    chapterSub: `Island ${l.island + 1} · ${islandSolved(l.island)}/${islandSize(l.island)} · ${ISLANDS[l.island].room}`,
    big: l.masterwork,
    puzzle: l.puzzle,
    progress: player.saves?.[l.spec.id] ? saveProgress(l.spec.id, l.puzzle) : 0,
  })), [player]);

  return (
    <View style={{ flex: 1 }}>
      <Background image={tab === "map" ? art.bg_island_map : art.bg_paper_main} />
      {tab === "map" ? (
        <LevelMap levels={levels} current={current} onSelect={(l) => onPlay(l.number)} padTop={insets.top + 130} padBottom={bannerH + insets.bottom + 120} />
      ) : (
        <Library onPlay={onPlay} top={insets.top + 128} bottom={bannerH + insets.bottom + 20} />
      )}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]} pointerEvents="box-none">
        <View style={styles.headRow}>
          <IconButton icon="back" size={46} onPress={onBack} accessibilityLabel="Back" />
          <View style={[styles.titleCard, softShadow]}>
            <Text style={styles.title}>{tab === "map" ? "Island Map" : "Free Play Library"}</Text>
            <Text style={styles.sub}>{LEVELS.filter((l) => (player.stars?.[l.spec.id] ?? 0) > 0).length} of {LEVELS.length} paintings finished</Text>
          </View>
          <View style={{ width: 46 }} />
        </View>
        <View style={[styles.tabs, softShadow]}>
          {(["map", "library"] as const).map((t) => (
            <Pressable key={t} style={({ pressed }) => [styles.tab, tab === t && styles.tabOn, pressed && { transform: [{ scale: 0.95 }], opacity: 0.85 }]} onPress={() => { feedback("tap", "select"); setTab(t); }} accessibilityRole="tab" accessibilityState={{ selected: tab === t }}>
              <Text style={[styles.tabText, tab === t && { color: "#fff" }]}>{t === "map" ? "Islands" : "Library"}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

function Library({ onPlay, top, bottom }: { onPlay: (n: number) => void; top: number; bottom: number }) {
  const player = usePlayer();
  const { width } = useWindowDimensions();
  const [filter, setFilter] = useState<Filter>("all");
  const cols = 3;
  const card = Math.floor((width - 16 * 2 - 12 * (cols - 1)) / cols);
  const list = LEVELS.filter((l) => {
    const n = Math.max(l.puzzle.w, l.puzzle.h);
    if (filter === "small") return n <= 10;
    if (filter === "medium") return n > 10 && n <= 15;
    if (filter === "large") return n > 15;
    if (filter === "color") return l.puzzle.palette.length > 1;
    return true;
  });
  return (
    <View style={{ flex: 1, paddingTop: top }}>
      <View style={styles.filters}>
        {FILTERS.map((f) => (
          <Pressable key={f.id} onPress={() => { feedback("tap", "select"); setFilter(f.id); }} style={({ pressed }) => [styles.chip, filter === f.id && styles.chipOn, pressed && { transform: [{ scale: 0.93 }], opacity: 0.85 }]}>
            <Text style={[styles.chipText, filter === f.id && { color: "#fff" }]}>{f.label}</Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={list}
        keyExtractor={(l) => l.spec.id}
        numColumns={cols}
        columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
        contentContainerStyle={{ gap: 12, paddingBottom: bottom, paddingTop: 8 }}
        initialNumToRender={12}
        renderItem={({ item: l, index }) => {
          const stars = player.stars?.[l.spec.id] ?? 0;
          return (
            <Animated.View entering={index < 12 ? FadeInDown.delay(index * 35).duration(260) : undefined}>
            <Pressable onPress={() => { feedback("pop", "medium"); onPlay(l.number); }} style={({ pressed }) => [styles.card, softShadow, { width: card, transform: [{ scale: pressed ? 0.95 : 1 }] }]}>
              <View style={[styles.canvas, { width: card - 16, height: card - 16 }, l.masterwork && { borderColor: palette.secondary, borderWidth: 3 }]}>
                {stars > 0 ? <PictureThumb puzzle={l.puzzle} size={card - 22} background="#FFFBF0" /> : (
                  <Text style={styles.size}>{l.puzzle.w}×{l.puzzle.h}</Text>
                )}
              </View>
              <Text style={styles.cardTitle} numberOfLines={1}>{stars > 0 ? l.spec.title : `Puzzle ${l.number}`}</Text>
              <View style={styles.cardRow}>
                {l.puzzle.palette.length > 1 ? <View style={styles.dots}>{l.puzzle.palette.slice(0, 4).map((c) => <View key={c} style={[styles.dotc, { backgroundColor: c }]} />)}</View> : <Text style={styles.ink}>Ink</Text>}
                <MiniStars count={stars} size={11} />
              </View>
            </Pressable>
            </Animated.View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { position: "absolute", left: 0, right: 0, top: 0, paddingHorizontal: 12 },
  headRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  titleCard: { flex: 1, alignItems: "center", backgroundColor: "rgba(255,250,238,0.95)", borderRadius: 18, paddingVertical: 6, borderWidth: 1.5, borderColor: "rgba(182,128,31,0.45)" },
  title: { fontFamily: fonts.display, fontSize: 21, color: palette.ink },
  sub: { fontFamily: fonts.body, fontSize: 12.5, color: palette.inkSoft },
  tabs: { flexDirection: "row", alignSelf: "center", marginTop: 10, backgroundColor: "#F7EEDA", borderRadius: 16, padding: 4, borderWidth: 1.5, borderColor: "rgba(31,42,58,0.15)" },
  tab: { paddingHorizontal: 26, paddingVertical: 8, borderRadius: 12, minHeight: 40, justifyContent: "center" },
  tabOn: { backgroundColor: palette.primary },
  tabText: { fontFamily: fonts.display, fontSize: 16, color: palette.ink },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: 16, paddingBottom: 6 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 14, backgroundColor: "rgba(255,250,238,0.95)", borderWidth: 1.5, borderColor: "rgba(31,42,58,0.18)", minHeight: 36, justifyContent: "center" },
  chipOn: { backgroundColor: palette.primary, borderColor: palette.primaryDark },
  chipText: { fontFamily: fonts.body, fontSize: 13, color: palette.ink },
  card: { backgroundColor: "#FFFBF1", borderRadius: 14, padding: 8, borderWidth: 1.5, borderColor: "rgba(182,128,31,0.4)" },
  canvas: { backgroundColor: "#F4EBD6", borderRadius: 6, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: "rgba(122,102,80,0.35)", overflow: "hidden" },
  size: { fontFamily: fonts.display, fontSize: 20, color: "rgba(31,42,58,0.45)" },
  cardTitle: { fontFamily: fonts.display, fontSize: 13.5, color: palette.ink, marginTop: 5 },
  cardRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 2 },
  dots: { flexDirection: "row", gap: 2 },
  dotc: { width: 9, height: 9, borderRadius: 5 },
  ink: { fontFamily: fonts.body, fontSize: 11, color: palette.inkSoft },
});
