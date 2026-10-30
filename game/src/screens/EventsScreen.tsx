import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Background, GameButton, Icon, Panel, PictureThumb, TopBar, feedback, fonts, palette } from "../ui";
import { EVENT_REWARD, EVENT_SIZE, addDays, claimEvent, eventClaimed, eventProgress, eventPuzzle, eventSolved, prettyDay, usePlayer, weekOf } from "../game/meta";
import { useBannerHeight } from "../modules/layout";
import { SeasonCard } from "../ui/SeasonCard";
import { art } from "../art";

/**
 * Events: the Weekly Exhibition. Three pictures from the islands, hung upside down as brand-new boards; paint all
 * three this week to claim a fixed, known reward (Pigments + Hint Brushes). A new exhibition opens every Monday.
 */
export function EventsScreen({ onPlay, onBack }: { onPlay: (week: string, k: number) => void; onBack: () => void }) {
  usePlayer();
  const insets = useSafeAreaInsets();
  const bannerH = useBannerHeight();
  const week = weekOf();
  const done = eventProgress(week);
  const claimed = eventClaimed(week);
  const [justClaimed, setJustClaimed] = useState(false);
  const nextK = Array.from({ length: EVENT_SIZE }, (_, k) => k).find((k) => !eventSolved(week, k));
  const ends = prettyDay(addDays(week, 6));

  return (
    <View style={{ flex: 1 }}>
      <Background />
      <TopBar title="Events" subtitle={`Weekly Exhibition · until ${ends}`} onBack={onBack} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + bannerH + 24, gap: 16 }}>
        <Animated.View entering={FadeInDown.duration(300)}>
          <Panel>
            <View style={styles.head}>
              <View style={styles.trophy}><Icon name="trophy" size={36} color={palette.secondaryDark} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.h}>Weekly Exhibition</Text>
                <Text style={styles.p}>Paint all {EVENT_SIZE} pictures this week to open the exhibition. Each one is an island picture hung upside down — a new puzzle.</Text>
              </View>
            </View>
            <View style={styles.bar}><View style={[styles.barFill, { width: `${Math.max(4, (done / EVENT_SIZE) * 100)}%` }]} /></View>
            <Text style={styles.count}>{done}/{EVENT_SIZE} painted</Text>
            <View style={styles.reward}>
              <Text style={styles.rewardLabel}>Reward</Text>
              <Image source={art.icon_pigment} style={{ width: 18, height: 25 }} resizeMode="contain" />
              <Text style={styles.rewardText}>{EVENT_REWARD.pigments}</Text>
              <Image source={art.icon_hint_brush} style={{ width: 24, height: 25, marginLeft: 8 }} resizeMode="contain" />
              <Text style={styles.rewardText}>{EVENT_REWARD.brushes}</Text>
            </View>
            {claimed ? (
              <Animated.View entering={justClaimed ? ZoomIn.springify() : undefined} style={styles.claimed}>
                <Icon name="check" size={22} color={palette.primary} weight={3} />
                <Text style={styles.claimedText}>{justClaimed ? `+${EVENT_REWARD.pigments} Pigments, +${EVENT_REWARD.brushes} Hint Brushes!` : "Reward claimed — a new exhibition opens Monday"}</Text>
              </Animated.View>
            ) : done >= EVENT_SIZE ? (
              <GameButton style={{ marginTop: 12 }} variant="accent" sound="coin" label="Claim reward" onPress={() => { if (claimEvent(week)) { feedback("coin", "success"); setJustClaimed(true); } }} />
            ) : nextK !== undefined ? (
              <GameButton style={{ marginTop: 12 }} label={`Play picture ${nextK + 1}`} onPress={() => onPlay(week, nextK)} />
            ) : null}
          </Panel>
        </Animated.View>

        {/* the free monthly Studio Season track (same card as in the Shop) */}
        <Animated.View entering={FadeInDown.delay(60).duration(300)}>
          <SeasonCard />
        </Animated.View>

        {Array.from({ length: EVENT_SIZE }, (_, k) => {
          const { puzzle } = eventPuzzle(week, k);
          const solved = eventSolved(week, k);
          return (
            <Animated.View key={k}>
              <Panel>
                <View style={styles.row}>
                  <View style={styles.canvas}>
                    {solved ? <PictureThumb puzzle={puzzle} size={72} background="#FFFBF0" /> : <Text style={styles.q}>?</Text>}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{solved ? puzzle.title : `Picture ${k + 1}`}</Text>
                    <Text style={styles.p}>{puzzle.w}×{puzzle.h}{puzzle.palette.length > 1 ? `, ${puzzle.palette.length} colours` : ", ink"}{solved ? " · painted" : ""}</Text>
                  </View>
                  <GameButton size="sm" variant={solved ? "light" : "primary"} label={solved ? "Replay" : "Play"} onPress={() => onPlay(week, k)} />
                </View>
              </Panel>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: "row", alignItems: "center", gap: 12 },
  trophy: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#FBF0D4", alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: "rgba(182,128,31,0.4)" },
  h: { fontFamily: fonts.display, fontSize: 22, color: palette.ink },
  p: { fontFamily: fonts.bodyRegular, fontSize: 13.5, color: palette.inkSoft, marginTop: 2, lineHeight: 18 },
  bar: { height: 14, borderRadius: 7, backgroundColor: "#E5D8BC", marginTop: 14, overflow: "hidden", borderWidth: 1, borderColor: "rgba(122,102,80,0.25)" },
  barFill: { height: "100%", borderRadius: 7, backgroundColor: palette.secondary },
  count: { fontFamily: fonts.body, fontSize: 13, color: palette.inkSoft, textAlign: "center", marginTop: 4 },
  reward: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 8 },
  rewardLabel: { fontFamily: fonts.display, fontSize: 15, color: palette.primaryDark, marginRight: 6 },
  rewardText: { fontFamily: fonts.display, fontSize: 18, color: palette.secondaryDark },
  claimed: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12, backgroundColor: "#E4F0EC", borderRadius: 14, padding: 10 },
  claimedText: { fontFamily: fonts.body, fontSize: 14, color: palette.primaryDark, flexShrink: 1 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  canvas: { width: 80, height: 80, borderRadius: 6, backgroundColor: "#F4EBD6", borderWidth: 3, borderColor: "#9A6A3A", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  q: { fontFamily: fonts.display, fontSize: 34, color: "rgba(31,42,58,0.35)" },
  title: { fontFamily: fonts.display, fontSize: 18, color: palette.ink },
});
