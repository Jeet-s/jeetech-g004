import { useState } from "react";
import { Image, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { ShopScreen } from "./ShopScreen";
import { Background, Confetti, GameButton, Icon, IconButton, MinaSays, Popup, TopBar, fonts, palette, play, haptic, shadow } from "../ui";
import { ROOMS, renovate, roomState, solvedCount, usePlayer, type Room } from "../game/meta";
import { useBannerHeight } from "../modules/layout";
import { art } from "../art";

/**
 * The atelier hub: a parallax cutaway of the old studio, renovated room by room with Pigments and finished
 * paintings. Each renovation unlocks a story beat with Mina and the old master Ostrava. Optional — it never
 * gates a puzzle, and Settings can hide it.
 */
export function AtelierScreen({ onBack, onPlay, onShop }: { onBack: () => void; onPlay: () => void; onShop?: () => void }) {
  const player = usePlayer();
  const insets = useSafeAreaInsets();
  const bannerH = useBannerHeight();
  const { width } = useWindowDimensions();
  const [story, setStory] = useState<Room | null>(null);
  const [burst, setBurst] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  /** The hub opens its own Shop (cosmetics, frames, Pigments) unless the app passes one in. */
  const [shopOpen, setShopOpen] = useState(false);
  const y = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => { y.value = e.contentOffset.y; });
  const heroH = Math.round(width * 0.95);
  const parallax = useAnimatedStyle(() => ({ transform: [{ translateY: y.value * 0.45 }, { scale: 1 + Math.max(0, -y.value) / 600 }] }));
  const done = player.rooms ?? [];
  const solved = solvedCount();

  return (
    <View style={{ flex: 1 }}>
      <Background />
      <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ paddingBottom: insets.bottom + bannerH + 28 }}>
        <View style={{ height: heroH, overflow: "hidden" }}>
          <Animated.Image source={art.bg_atelier_hub} style={[{ width, height: heroH * 1.25, position: "absolute", top: -heroH * 0.1 }, parallax]} resizeMode="cover" />
          <LinearGradient colors={["rgba(251,245,230,0)", "rgba(251,245,230,0.95)"]} style={[StyleSheet.absoluteFill, { top: heroH * 0.55 }]} />
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>The Atelier</Text>
            <Text style={styles.heroSub}>{done.length} of {ROOMS.length} rooms restored · {player.coins} Pigments · {solved} paintings</Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: 16, gap: 14 }}>
          {ROOMS.map((r) => {
            const st = roomState(r);
            const isDone = st === "done";
            return (
              <Animated.View key={r.index} style={[styles.card, shadow, isDone && styles.cardDone]}>
                <View style={styles.thumb}>
                  <Image source={art.bg_atelier_hub} style={[styles.thumbImg, { top: -((r.index % 5) * 0.17 + 0.12) * 260 }]} resizeMode="cover" />
                  {!isDone ? <View style={styles.dust}><Icon name="lock" size={22} color="rgba(255,255,255,0.9)" /></View> : <View style={styles.sparkle}><Icon name="star" size={18} color={palette.secondary} /></View>}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.room}>{r.index + 1}. {r.name}</Text>
                  <Text style={styles.isl}>{r.island}</Text>
                  {isDone ? (
                    <GameButton size="sm" variant="light" label="Story" onPress={() => setStory(r)} style={{ marginTop: 6, alignSelf: "flex-start" }} />
                  ) : st === "needArt" ? (
                    <>
                      <View style={styles.bar}><View style={[styles.barFill, { width: `${Math.min(100, (solved / r.needArt) * 100)}%` }]} /></View>
                      <Text style={styles.need}>Hang {r.needArt - solved} more painting{r.needArt - solved === 1 ? "" : "s"} · {r.cost} Pigments</Text>
                    </>
                  ) : (
                    <GameButton
                      size="sm"
                      variant="secondary"
                      label={`Renovate · ${r.cost}`}
                      disabled={st !== "ready"}
                      style={{ marginTop: 6, alignSelf: "flex-start" }}
                      onPress={() => {
                        if (!renovate(r)) return;
                        play("unlock"); haptic("success");
                        setBurst((b) => b + 1);
                        setCelebrate(true);
                        setTimeout(() => setStory(r), 700);
                      }}
                    />
                  )}
                  {st === "needPigments" ? <Text style={styles.need}>Needs {r.cost - player.coins} more Pigments</Text> : null}
                </View>
              </Animated.View>
            );
          })}
          <GameButton label="Paint the next picture" variant="primary" onPress={onPlay} />
        </View>
      </Animated.ScrollView>
      <View style={styles.header} pointerEvents="box-none">
        <TopBar onBack={onBack} right={<IconButton icon="shop" size={46} onPress={() => (onShop ? onShop() : setShopOpen(true))} accessibilityLabel="Shop" />} />
      </View>
      <Confetti trigger={burst} count={50} />
      {!onShop ? <ShopScreen visible={shopOpen} onClose={() => setShopOpen(false)} /> : null}
      <Popup visible={!!story} title={story ? `${story.name} restored` : ""} onClose={() => { setStory(null); setCelebrate(false); }} mina={false} overlay={story && celebrate ? <Confetti trigger={burst} count={44} /> : null}>
        {story ? (
          <View style={{ gap: 12 }}>
            {story.story.map((s, k) => (
              <MinaSays key={k} title={s.who === "Mina" ? "Mina, the curator" : "Ostrava, the old master"} text={s.line} />
            ))}
            <GameButton label="Lovely" onPress={() => { setStory(null); setCelebrate(false); }} />
          </View>
        ) : null}
      </Popup>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { position: "absolute", top: 0, left: 0, right: 0 },
  heroText: { position: "absolute", bottom: 14, left: 0, right: 0, alignItems: "center" },
  heroTitle: { fontFamily: fonts.display, fontSize: 32, color: palette.ink },
  heroSub: { fontFamily: fonts.body, fontSize: 13, color: palette.inkSoft },
  card: { flexDirection: "row", gap: 12, backgroundColor: "#FFFBF1", borderRadius: 18, padding: 10, borderWidth: 1.5, borderColor: "rgba(182,128,31,0.4)" },
  cardDone: { borderColor: palette.secondary, borderWidth: 2.5 },
  thumb: { width: 96, height: 84, borderRadius: 12, overflow: "hidden", backgroundColor: "#E9DEC6" },
  thumbImg: { position: "absolute", left: -20, width: 146, height: 260 },
  dust: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "rgba(110,96,80,0.55)", alignItems: "center", justifyContent: "center" },
  sparkle: { position: "absolute", right: 4, top: 4 },
  room: { fontFamily: fonts.display, fontSize: 18, color: palette.ink },
  isl: { fontFamily: fonts.body, fontSize: 12.5, color: palette.inkSoft },
  bar: { height: 8, borderRadius: 4, backgroundColor: "#E5D8BC", marginTop: 8, overflow: "hidden" },
  barFill: { height: "100%", backgroundColor: palette.sage },
  need: { fontFamily: fonts.bodyRegular, fontSize: 12.5, color: palette.inkSoft, marginTop: 4 },
});
