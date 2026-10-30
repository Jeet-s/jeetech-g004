import { useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View, useWindowDimensions, type GestureResponderEvent } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Background, GameButton, Icon, IconButton, Panel, PictureThumb, TopBar, feedback, fonts, palette } from "../ui";
import { checkDesign, deleteDesign, designPuzzle, designsOf, saveDesign, usePlayer } from "../game/meta";
import { runsOf } from "../game/nonogram";
import { useBannerHeight } from "../modules/layout";
import { analytics } from "../modules/analytics";

const SIZES = [5, 8, 10];

/**
 * Creator Studio: paint your own picture on a small canvas (tap or drag), watch its clues appear live, then
 * "Check & save" — the studio proves with the game's own line-logic solver that the clues lead to exactly this
 * picture without guessing. Saved designs live only on this device ("My designs") and can be played like any puzzle.
 */
export function CreatorScreen({ onPlay, onBack }: { onPlay: (id: string) => void; onBack: () => void }) {
  const player = usePlayer();
  const insets = useSafeAreaInsets();
  const bannerH = useBannerHeight();
  const { width } = useWindowDimensions();
  const [n, setN] = useState(8);
  const [cells, setCells] = useState<number[]>(() => Array(8 * 8).fill(0));
  const [stuck, setStuck] = useState<number[]>([]);
  const [note, setNote] = useState<{ text: string; good: boolean } | null>(null);
  const designs = player.designs ?? designsOf();

  const rowClues = useMemo(() => Array.from({ length: n }, (_, r) => runsOf(cells.slice(r * n, r * n + n)).map((b) => b.len)), [cells, n]);
  const colClues = useMemo(() => Array.from({ length: n }, (_, c) => runsOf(Array.from({ length: n }, (_, r) => cells[r * n + c])).map((b) => b.len)), [cells, n]);
  const maxRow = Math.max(1, Math.ceil(n / 2));
  const clueW = Math.max(30, maxRow * 13 + 8);
  const clueH = Math.max(26, maxRow * 15 + 6);
  const boardW = Math.min(width - 32 - 28, 460);
  const cell = Math.floor((boardW - clueW) / n);
  const gridPx = cell * n;

  // Drag-painting: the first cell decides ink or erase for the whole stroke.
  const stroke = useRef<{ value: number; seen: Set<number> } | null>(null);
  const at = (e: GestureResponderEvent) => {
    const { locationX: x, locationY: y } = e.nativeEvent;
    const c = Math.floor(x / cell), r = Math.floor(y / cell);
    return c >= 0 && r >= 0 && c < n && r < n ? r * n + c : -1;
  };
  const paintAt = (i: number) => {
    const st = stroke.current;
    if (i < 0 || !st || st.seen.has(i)) return;
    st.seen.add(i);
    setCells((cur) => (cur[i] === st.value ? cur : cur.map((v, k) => (k === i ? st.value : v))));
    feedback("tap", "light");
  };
  const begin = (e: GestureResponderEvent) => {
    const i = at(e);
    if (i < 0) return;
    stroke.current = { value: cells[i] ? 0 : 1, seen: new Set() };
    setNote(null);
    setStuck([]);
    paintAt(i);
  };

  const resize = (m: number) => { setN(m); setCells(Array(m * m).fill(0)); setStuck([]); setNote(null); };
  const save = () => {
    const chk = checkDesign(cells, n);
    if (!chk.ok) {
      setStuck(chk.stuck);
      setNote({ text: chk.reason ?? "This picture can't be solved by logic yet.", good: false });
      feedback("error", "warning");
      return;
    }
    const d = saveDesign(cells, n);
    if (d) {
      feedback("unlock", "success");
      setNote({ text: `Saved as "${d.title}" — it's solvable by pure logic. Find it under My designs.`, good: true });
      setCells(Array(n * n).fill(0));
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Background />
      <TopBar title="Creator Studio" subtitle="Paint a picture, make a puzzle" onBack={onBack} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + bannerH + 24, gap: 16 }}>
        <Animated.View entering={FadeInDown.duration(300)}>
          <Panel>
            <View style={styles.sizes}>
              {SIZES.map((m) => (
                <GameButton key={m} size="sm" variant={m === n ? "primary" : "light"} label={`${m}×${m}`} onPress={() => resize(m)} />
              ))}
            </View>
            <View style={{ alignSelf: "center", marginTop: 12 }}>
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: clueW, height: clueH }} />
                {colClues.map((cl, c) => (
                  <View key={c} style={[styles.colClue, { width: cell, height: clueH }]}>
                    {(cl.length ? cl : [0]).map((v, k) => <Text key={k} style={[styles.clue, !cl.length && styles.clueZero]}>{v}</Text>)}
                  </View>
                ))}
              </View>
              <View style={{ flexDirection: "row" }}>
                <View>
                  {rowClues.map((cl, r) => (
                    <View key={r} style={[styles.rowClue, { width: clueW, height: cell }]}>
                      <Text style={[styles.clue, !cl.length && styles.clueZero]}>{(cl.length ? cl : [0]).join(" ")}</Text>
                    </View>
                  ))}
                </View>
                <View
                  style={[styles.grid, { width: gridPx + 2, height: gridPx + 2 }]}
                  onStartShouldSetResponder={() => true}
                  onMoveShouldSetResponder={() => true}
                  onResponderTerminationRequest={() => false}
                  onResponderGrant={begin}
                  onResponderMove={(e) => paintAt(at(e))}
                  onResponderRelease={() => (stroke.current = null)}
                  accessibilityLabel="Design canvas"
                >
                  <View pointerEvents="none">
                    {Array.from({ length: n }, (_, r) => (
                      <View key={r} style={{ flexDirection: "row" }}>
                        {Array.from({ length: n }, (_, c) => {
                          const i = r * n + c;
                          const on = !!cells[i];
                          return (
                            <View
                              key={c}
                              style={[
                                styles.cell,
                                { width: cell, height: cell },
                                c % 5 === 4 && c < n - 1 && styles.thickR,
                                r % 5 === 4 && r < n - 1 && styles.thickB,
                                stuck.includes(i) && styles.stuck,
                              ]}
                            >
                              {on ? <View style={[styles.ink, { borderRadius: Math.max(2, cell * 0.12) }]} /> : null}
                            </View>
                          );
                        })}
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
            {note ? (
              <Animated.View entering={FadeIn.duration(200)} style={[styles.note, note.good ? styles.noteGood : styles.noteBad]}>
                <Icon name={note.good ? "check" : "bulb"} size={20} color={note.good ? palette.primaryDark : palette.accentDark} weight={2.6} />
                <Text style={[styles.noteText, { color: note.good ? palette.primaryDark : palette.accentDark }]}>{note.text}</Text>
              </Animated.View>
            ) : null}
            <View style={styles.actions}>
              <GameButton style={{ flex: 1 }} size="sm" variant="light" label="Clear" onPress={() => { setCells(Array(n * n).fill(0)); setStuck([]); setNote(null); }} />
              <GameButton style={{ flex: 2 }} size="sm" variant="accent" label="Check & save" onPress={save} />
            </View>
          </Panel>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(300)}>
          <Panel>
            <Text style={styles.h}>My designs</Text>
            {designs.length === 0 ? (
              <Text style={styles.p}>Nothing saved yet. Paint a picture above and tap "Check & save" — it becomes a puzzle you can play.</Text>
            ) : (
              designs.map((d) => {
                const pz = designPuzzle(d);
                const stars = player.stars?.[pz.id] ?? 0;
                return (
                  <View key={d.id} style={styles.row}>
                    <View style={styles.thumb}><PictureThumb puzzle={pz} size={52} background="#FFFBF0" /></View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.title}>{d.title}</Text>
                      <Text style={styles.p}>{pz.w}×{pz.h}{stars ? " · solved ★" : ""}</Text>
                    </View>
                    <GameButton size="sm" label="Play" onPress={() => { analytics.track("design_play", { size: pz.w }); onPlay(d.id); }} />
                    <IconButton icon="trash" size={40} accessibilityLabel={`Delete ${d.title}`} onPress={() => deleteDesign(d.id)} />
                  </View>
                );
              })
            )}
          </Panel>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sizes: { flexDirection: "row", justifyContent: "center", gap: 10 },
  colClue: { alignItems: "center", justifyContent: "flex-end", paddingBottom: 3 },
  rowClue: { alignItems: "flex-end", justifyContent: "center", paddingRight: 5 },
  clue: { fontFamily: fonts.body, fontSize: 12, lineHeight: 14, color: palette.ink, includeFontPadding: false },
  clueZero: { color: "rgba(31,42,58,0.3)" },
  grid: { borderWidth: 1, borderColor: "#7A6650", backgroundColor: "#FFFBF0" },
  cell: { borderRightWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: "rgba(122,102,80,0.45)", padding: 1.5 },
  thickR: { borderRightWidth: 1.5, borderRightColor: "#7A6650" },
  thickB: { borderBottomWidth: 1.5, borderBottomColor: "#7A6650" },
  stuck: { backgroundColor: "rgba(217,105,79,0.25)" },
  ink: { flex: 1, backgroundColor: "#1F2A3A" },
  note: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 14, padding: 10, marginTop: 12 },
  noteGood: { backgroundColor: "#E4F0EC" },
  noteBad: { backgroundColor: "#FBE6DE" },
  noteText: { flex: 1, fontFamily: fonts.body, fontSize: 13.5, lineHeight: 18 },
  actions: { flexDirection: "row", gap: 10, marginTop: 14 },
  h: { fontFamily: fonts.display, fontSize: 20, color: palette.ink, marginBottom: 6 },
  p: { fontFamily: fonts.bodyRegular, fontSize: 13.5, color: palette.inkSoft, lineHeight: 18 },
  row: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "rgba(122,102,80,0.3)" },
  thumb: { borderWidth: 3, borderColor: "#9A6A3A", borderRadius: 4, overflow: "hidden" },
  title: { fontFamily: fonts.display, fontSize: 17, color: palette.ink },
});
