import { useState } from "react";
import { Pressable, SectionList, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Background, GameButton, PictureThumb, Popup, Stars, TopBar, feedback, fonts, palette, softShadow } from "../ui";
import { ISLANDS, LEVELS, type Level } from "../game/levels";
import { frameInUse, statsOf, totalStars, usePlayer, type Frame } from "../game/meta";
import { useBannerHeight } from "../modules/layout";

/** A painting in the player's chosen frame (oak / ink / teal / coral / gold leaf). */
export function Framed({ level, size, frame, solved }: { level: Level; size: number; frame: Frame; solved: boolean }) {
  const b = Math.max(5, Math.round(size * 0.09));
  return (
    <View style={[styles.frame, { width: size, height: size, borderWidth: b, borderColor: solved ? frame.outer : "#CDBFA3", padding: Math.max(2, b * 0.4), backgroundColor: solved ? frame.inner : "#E2D6BC" }]}>
      <View style={[styles.mat, { borderColor: solved ? frame.accent : "transparent" }]}>
        {solved ? <PictureThumb puzzle={level.puzzle} size={size - b * 2 - Math.max(2, b * 0.4) * 2 - 4} background="#FFFBF0" /> : <Text style={styles.q}>?</Text>}
      </View>
    </View>
  );
}

/** Gallery: every finished painting, framed, island by island — with the player's stats on top. */
export function GalleryScreen({ onBack, onPlay }: { onBack: () => void; onPlay: (n: number) => void }) {
  const player = usePlayer();
  const insets = useSafeAreaInsets();
  const bannerH = useBannerHeight();
  const { width } = useWindowDimensions();
  const [open, setOpen] = useState<Level | null>(null);
  const frame = frameInUse();
  const stats = statsOf();
  const cols = 4;
  const size = Math.floor((width - 32 - 10 * (cols - 1)) / cols);
  const solvedIds = new Set(LEVELS.filter((l) => (player.stars?.[l.spec.id] ?? 0) > 0).map((l) => l.spec.id));
  const sections = ISLANDS.map((isl, k) => {
    const ls = LEVELS.filter((l) => l.island === k);
    const rows: Level[][] = [];
    for (let i = 0; i < ls.length; i += cols) rows.push(ls.slice(i, i + cols));
    return { title: isl.name, room: isl.room, solved: ls.filter((l) => solvedIds.has(l.spec.id)).length, total: ls.length, data: rows };
  }).filter((s) => s.total > 0);

  return (
    <View style={{ flex: 1 }}>
      <Background />
      <TopBar title="Gallery & Stats" subtitle={`${solvedIds.size} of ${LEVELS.length} paintings collected`} onBack={onBack} />
      <SectionList
        sections={sections}
        keyExtractor={(row, i) => row[0]?.spec.id ?? String(i)}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + bannerH + 24 }}
        ListHeaderComponent={
          <View style={[styles.stats, softShadow]}>
            <Stat label="Paintings" value={solvedIds.size} />
            <Stat label="Stars" value={totalStars()} />
            <Stat label="Best streak" value={player.daily?.best ?? 0} />
            <Stat label="Pigments earned" value={stats.pigments} />
            <Stat label="Minutes painted" value={Math.round(stats.seconds / 60)} />
          </View>
        }
        renderSectionHeader={({ section }) => (
          <View style={styles.secHead}>
            <Text style={styles.secTitle}>{section.title}</Text>
            <Text style={styles.secSub}>{section.solved}/{section.total} · {section.room}</Text>
          </View>
        )}
        renderItem={({ item: row }) => (
          <View style={styles.row}>
            {row.map((l) => {
              const solved = solvedIds.has(l.spec.id);
              return (
                <Pressable key={l.spec.id} accessibilityLabel={solved ? l.spec.title : `Puzzle ${l.number}`} onPress={() => { feedback("tap", "light"); if (solved) setOpen(l); else onPlay(l.number); }} style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.94 : 1 }] })}>
                  <Framed level={l} size={size} frame={frame} solved={solved} />
                </Pressable>
              );
            })}
          </View>
        )}
      />
      <Popup visible={!!open} title={open?.spec.title} onClose={() => setOpen(null)} mina={false}>
        {open ? (
          <View style={{ alignItems: "center" }}>
            <Framed level={open} size={Math.min(240, width - 110)} frame={frame} solved />
            <Text style={styles.meta}>{open.puzzle.w}×{open.puzzle.h} · {ISLANDS[open.island].name}{open.masterwork ? " · Masterwork" : ""}</Text>
            <Stars count={player.stars?.[open.spec.id] ?? 0} size={32} />
            <GameButton label="Paint it again" variant="primary" onPress={() => { const n = open.number; setOpen(null); onPlay(n); }} style={{ alignSelf: "stretch", marginTop: 6 }} />
          </View>
        ) : null}
      </Popup>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statV}>{value}</Text>
      <Text style={styles.statL} numberOfLines={2}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { borderRadius: 4, alignItems: "center", justifyContent: "center", shadowColor: "#4A3416", shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  mat: { flex: 1, alignSelf: "stretch", backgroundColor: "#FFFBF0", alignItems: "center", justifyContent: "center", borderWidth: 1 },
  q: { fontFamily: fonts.display, fontSize: 22, color: "rgba(31,42,58,0.3)" },
  stats: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#FFFBF1", borderRadius: 18, padding: 12, borderWidth: 1.5, borderColor: "rgba(182,128,31,0.4)", marginTop: 4 },
  stat: { alignItems: "center", flex: 1 },
  statV: { fontFamily: fonts.display, fontSize: 20, color: palette.primaryDark },
  statL: { fontFamily: fonts.bodyRegular, fontSize: 11, color: palette.inkSoft, textAlign: "center" },
  secHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginTop: 18, marginBottom: 8 },
  secTitle: { fontFamily: fonts.display, fontSize: 19, color: palette.ink },
  secSub: { fontFamily: fonts.body, fontSize: 12.5, color: palette.inkSoft },
  row: { flexDirection: "row", gap: 10, marginBottom: 10 },
  meta: { fontFamily: fonts.body, fontSize: 13.5, color: palette.inkSoft, marginTop: 10 },
});
