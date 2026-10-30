import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Background, GameButton, Icon, Panel, PictureThumb, TopBar, feedback, fonts, palette } from "../ui";
import { currentStreak, dailyOf, dailyPuzzle, dayKey, freezeAvailable, prettyDay, usePlayer } from "../game/meta";
import { useBannerHeight } from "../modules/layout";

const WEEK = ["M", "T", "W", "T", "F", "S", "S"];

/**
 * Daily puzzle + forgiving streak. One fresh picture a day (≈ 5 minutes), a free Streak Freeze each month that
 * bridges a single missed day, and missed days of this month can be painted later to recover their Pigments.
 */
export function DailyScreen({ onPlay, onBack }: { onPlay: (day: string) => void; onBack: () => void }) {
  const player = usePlayer();
  const insets = useSafeAreaInsets();
  const bannerH = useBannerHeight();
  const today = dayKey();
  const d = player.daily ?? dailyOf();
  const doneToday = d.done.includes(today);
  const streak = currentStreak(d, today);
  const { puzzle } = dailyPuzzle(today);

  // This month's calendar (Monday first).
  const [y, m] = today.split("-").map(Number);
  const first = new Date(y, m - 1, 1);
  const days = new Date(y, m, 0).getDate();
  const lead = (first.getDay() + 6) % 7;
  const cells: (string | null)[] = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, k) => dayKey(new Date(y, m - 1, k + 1)))];
  while (cells.length % 7) cells.push(null);
  const monthName = first.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const firstDay = player.firstDay ?? today;
  const missedThisMonth = cells.filter((c): c is string => !!c && c < today && c >= firstDay && !d.done.includes(c) && !d.frozen.includes(c));

  return (
    <View style={{ flex: 1 }}>
      <Background />
      <TopBar title="Daily Puzzle" subtitle={prettyDay(today)} onBack={onBack} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + bannerH + 24, gap: 16 }}>
        <Animated.View entering={FadeInDown.duration(300)}>
        <Panel>
          <View style={styles.todayRow}>
            <View style={styles.canvas}>
              {doneToday ? <PictureThumb puzzle={puzzle} size={104} background="#FFFBF0" /> : (
                <>
                  <Text style={styles.q}>?</Text>
                  <Text style={styles.size}>{puzzle.w}×{puzzle.h}</Text>
                </>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.h}>{doneToday ? `Today: ${puzzle.title}` : "Today's picture"}</Text>
              <Text style={styles.p}>{doneToday ? "Framed and hung in your gallery. A new one arrives tomorrow." : `${puzzle.w}×${puzzle.h}${puzzle.palette.length > 1 ? `, ${puzzle.palette.length} colours` : ", ink"} · no timer, no strikes.`}</Text>
            </View>
          </View>
          <GameButton style={{ marginTop: 14 }} label={doneToday ? "Paint it again" : "Play today's puzzle"} variant={doneToday ? "light" : "primary"} onPress={() => onPlay(today)} />
        </Panel>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(110).duration(300)}>
        <Panel>
          <View style={styles.streakRow}>
            <View style={styles.flame}><Icon name="flame" size={40} color={streak ? palette.coral : "#CDBFA3"} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.big}>{streak} day streak</Text>
              <Text style={styles.p}>Best {d.best} · {freezeAvailable(d, today) ? "Streak Freeze ready this month" : "This month's Streak Freeze is used"}</Text>
            </View>
          </View>
          <Text style={styles.month}>{monthName}</Text>
          <View style={styles.weekRow}>{WEEK.map((w, k) => <Text key={k} style={styles.wk}>{w}</Text>)}</View>
          {Array.from({ length: cells.length / 7 }, (_, r) => (
            <View key={r} style={styles.weekRow}>
              {cells.slice(r * 7, r * 7 + 7).map((c, k) => {
                if (!c) return <View key={k} style={styles.day} />;
                const done = d.done.includes(c), frozen = d.frozen.includes(c), isToday = c === today, future = c > today;
                const before = c < firstDay && !done;
                const missed = !done && !frozen && !future && !isToday && !before;
                return (
                  <Pressable
                    key={k}
                    disabled={future || before}
                    onPress={() => { feedback("tap", "light"); onPlay(c); }}
                    accessibilityLabel={`${prettyDay(c)}${done ? ", solved" : frozen ? ", frozen" : missed ? ", missed" : ""}`}
                    style={({ pressed }) => [styles.day, isToday && styles.today, pressed && { transform: [{ scale: 0.9 }], opacity: 0.85 }]}
                  >
                    {done ? (
                      <View style={styles.stamp}><Icon name="check" size={16} color="#fff" weight={3} /></View>
                    ) : frozen ? (
                      <View style={[styles.stamp, { backgroundColor: "#6FA8DC" }]}><Icon name="snow" size={15} color="#fff" weight={2} /></View>
                    ) : (
                      <Text style={[styles.dayNum, (future || before) && { opacity: 0.35 }, missed && { color: palette.secondaryDark }]}>{Number(c.slice(8))}</Text>
                    )}
                    {missed ? <View style={styles.missDot} /> : null}
                  </Pressable>
                );
              })}
            </View>
          ))}
          <View style={styles.legend}>
            <Legend color={palette.primary} icon="check" text="Solved" />
            <Legend color="#6FA8DC" icon="snow" text="Freeze" />
            <Legend color={palette.secondary} text="Missed — tap to recover" />
          </View>
          {missedThisMonth.length ? (
            <GameButton style={{ marginTop: 12 }} size="sm" variant="secondary" label={`Recover ${prettyDay(missedThisMonth[missedThisMonth.length - 1])}`} onPress={() => onPlay(missedThisMonth[missedThisMonth.length - 1])} />
          ) : null}
          <Text style={styles.note}>Recovered days earn their Pigments and painting. Your streak only counts days solved on the day — one missed day a month is bridged by the free Streak Freeze.</Text>
        </Panel>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function Legend({ color, icon, text }: { color: string; icon?: "check" | "snow"; text: string }) {
  return (
    <View style={styles.leg}>
      <View style={[styles.legDot, { backgroundColor: color }]}>{icon ? <Icon name={icon} size={10} color="#fff" weight={3} /> : null}</View>
      <Text style={styles.legText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  todayRow: { flexDirection: "row", gap: 14, alignItems: "center" },
  canvas: { width: 112, height: 112, borderRadius: 8, backgroundColor: "#F4EBD6", borderWidth: 3, borderColor: "#9A6A3A", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  q: { fontFamily: fonts.display, fontSize: 44, color: "rgba(31,42,58,0.35)" },
  size: { fontFamily: fonts.body, fontSize: 13, color: palette.inkSoft },
  h: { fontFamily: fonts.display, fontSize: 20, color: palette.ink },
  p: { fontFamily: fonts.bodyRegular, fontSize: 14, color: palette.inkSoft, marginTop: 2, lineHeight: 19 },
  streakRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 6 },
  flame: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#FBEBDD", alignItems: "center", justifyContent: "center" },
  big: { fontFamily: fonts.display, fontSize: 24, color: palette.ink },
  month: { fontFamily: fonts.display, fontSize: 17, color: palette.primaryDark, marginTop: 8, marginBottom: 4, textAlign: "center" },
  weekRow: { flexDirection: "row", justifyContent: "space-between" },
  wk: { width: 38, textAlign: "center", fontFamily: fonts.body, fontSize: 12, color: palette.inkSoft },
  day: { width: 38, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 20 },
  today: { borderWidth: 2.5, borderColor: palette.secondary },
  stamp: { width: 30, height: 30, borderRadius: 15, backgroundColor: palette.primary, alignItems: "center", justifyContent: "center", transform: [{ rotate: "-8deg" }] },
  dayNum: { fontFamily: fonts.body, fontSize: 15, color: palette.ink },
  missDot: { position: "absolute", bottom: 3, width: 5, height: 5, borderRadius: 3, backgroundColor: palette.secondary },
  legend: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 10, justifyContent: "center" },
  leg: { flexDirection: "row", alignItems: "center", gap: 5 },
  legDot: { width: 16, height: 16, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  legText: { fontFamily: fonts.bodyRegular, fontSize: 12, color: palette.inkSoft },
  note: { fontFamily: fonts.bodyRegular, fontSize: 12.5, color: palette.inkSoft, marginTop: 12, lineHeight: 17, textAlign: "center" },
});
