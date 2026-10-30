import { useEffect, useLayoutEffect, useState } from "react";
import { Animated, BackHandler, Easing, Linking, Platform, Settings, StyleSheet, View, useWindowDimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Fredoka_600SemiBold, Fredoka_700Bold } from "@expo-google-fonts/fredoka";
import { Nunito_600SemiBold, Nunito_700Bold } from "@expo-google-fonts/nunito";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { HomeScreen } from "./screens/HomeScreen";
import { LevelsScreen } from "./screens/LevelsScreen";
import { GameScreen } from "./screens/GameScreen";
import { ShopScreen } from "./screens/ShopScreen";
import { DailyScreen } from "./screens/DailyScreen";
import { AtelierScreen } from "./screens/AtelierScreen";
import { GalleryScreen } from "./screens/GalleryScreen";
import { EventsScreen } from "./screens/EventsScreen";
import { CreatorScreen } from "./screens/CreatorScreen";
import { SettingsPopup, initAudio } from "./ui";
import { bootMeta, nextLevel, targetKey, type PlayTarget } from "./game/meta";
import { notify } from "./modules/notify";
import { analytics } from "./modules/analytics";
import { layout } from "./modules/layout";
import { ads } from "./modules/ads";
import { iap } from "./modules/iap";
import { store } from "./modules/store";
import { ScreenshotScene } from "./screenshots";
import { qa } from "./modules/qa";

// Screenshot mode: <scheme>://shot/<id> on Android; on iOS the factory passes the scene as the launch argument
// -AGFShot <id> (iOS 27 asks "Open in …?" for deep links, which would end up in the store screenshots).
const initialShotUrl = (): Promise<string | null | undefined> => {
  const id = Platform.OS === "ios" ? (Settings.get("AGFShot") as string | undefined) : undefined;
  return id ? Promise.resolve(`agf://shot/${id}`) : Linking.getInitialURL();
};

SplashScreen.preventAutoHideAsync().catch(() => {});

/**
 * Root of the premium runtime. Boot order matters: fonts → player state →
 * audio → consent + ads → billing. The builder adds screens/flows but keeps
 * this shell: providers, fonts, the banner slot and screenshot mode.
 */
export default function App() {
  const [fontsLoaded] = useFonts({ Fredoka_600SemiBold, Fredoka_700Bold, Nunito_600SemiBold, Nunito_700Bold });
  // Screenshot mode (<scheme>://shot/<id>): render a store-screenshot scene
  // without ads or billing. undefined = still checking the launch URL.
  const [shot, setShot] = useState<string | null | undefined>(undefined);
  useEffect(() => {
    initialShotUrl()
      .then((u) => {
        // QA level replay (<scheme>://qa/level/<n>, src/modules/qa.ts): straight into level n.
        const lv = Number(u?.match(/qa\/level\/(\d+)/)?.[1] ?? NaN);
        if (Number.isFinite(lv) && lv > 0) qa.level = lv;
        setShot(u?.match(/shot\/([\w-]+)/)?.[1] ?? null);
      })
      .catch(() => setShot(null));
  }, []);
  const ready = fontsLoaded && shot !== undefined;
  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);
  if (!ready) return <View style={styles.root} />;
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        {shot ? <ScreenshotScene id={shot} /> : <Game />}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

type Screen =
  | { name: "home" }
  | { name: "levels" }
  | { name: "daily" }
  | { name: "atelier" }
  | { name: "gallery" }
  | { name: "events" }
  | { name: "studio" }
  | { name: "game"; target: PlayTarget };

/** Where a puzzle returns to when the player leaves it. */
const backOf = (t: PlayTarget): Screen =>
  t.kind === "daily" ? { name: "daily" } : t.kind === "event" ? { name: "events" } : t.kind === "custom" ? { name: "studio" } : { name: "home" };

function Game() {
  const insets = useSafeAreaInsets();
  const [booted, setBooted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [screen, setScreen] = useState<Screen>(qa.level ? { name: "game", target: { kind: "level", n: qa.level } } : { name: "home" });
  const [shopOpen, setShopOpen] = useState(false);
  const go = (next: Screen) => setScreen(next);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    (async () => {
      await store.load();
      bootMeta();
      analytics.track("app_open");
      setBooted(true);
      await initAudio();
      if (qa.level) return; // QA replay: no ads, no billing — nothing may cover the board
      await ads.init();
      setShowBanner(ads.canShowBanner());
      await iap.init();
      // Comeback nudge, re-armed on every launch (fires only if the player stays away). Never asks permission here.
      void notify.comeback({ days: 2, title: "Your streak is waiting", body: "A fresh daily picture is ready in the atelier." });
    })();
    return store.subscribe(() => setShowBanner(ads.canShowBanner()));
  }, []);
  useEffect(() => {
    if (!showBanner) layout.setBannerHeight(0);
  }, [showBanner]);
  // Android back: popups close themselves (Modal onRequestClose); screens step back toward Home.
  useEffect(() => {
    if (Platform.OS !== "android") return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (screen.name === "home") return false;
      setScreen(screen.name === "game" ? backOf(screen.target) : { name: "home" });
      return true;
    });
    return () => sub.remove();
  }, [screen]);

  if (!booted) return <View style={styles.root} />;
  return (
    <View style={styles.root}>
      <ScreenSwap id={screen.name === "game" ? `game-${targetKey(screen.target)}` : screen.name} intoPuzzle={screen.name === "game"}>
        {screen.name === "home" ? (
          <HomeScreen
            onPlay={(n) => go({ name: "game", target: { kind: "level", n } })}
            onLevels={() => go({ name: "levels" })}
            onShop={() => setShopOpen(true)}
            onSettings={() => setSettingsOpen(true)}
            onDaily={() => go({ name: "daily" })}
            onAtelier={() => go({ name: "atelier" })}
            onGallery={() => go({ name: "gallery" })}
            onEvents={() => go({ name: "events" })}
            onStudio={() => go({ name: "studio" })}
          />
        ) : screen.name === "events" ? (
          <EventsScreen onPlay={(week, k) => go({ name: "game", target: { kind: "event", week, k } })} onBack={() => go({ name: "home" })} />
        ) : screen.name === "studio" ? (
          <CreatorScreen onPlay={(id) => go({ name: "game", target: { kind: "custom", id } })} onBack={() => go({ name: "home" })} />
        ) : screen.name === "levels" ? (
          <LevelsScreen onPlay={(n) => go({ name: "game", target: { kind: "level", n } })} onBack={() => go({ name: "home" })} />
        ) : screen.name === "daily" ? (
          <DailyScreen onPlay={(day) => go({ name: "game", target: { kind: "daily", day } })} onBack={() => go({ name: "home" })} />
        ) : screen.name === "atelier" ? (
          <AtelierScreen onBack={() => go({ name: "home" })} onPlay={() => go({ name: "game", target: { kind: "level", n: nextLevel() } })} />
        ) : screen.name === "gallery" ? (
          <GalleryScreen onBack={() => go({ name: "home" })} onPlay={(n) => go({ name: "game", target: { kind: "level", n } })} />
        ) : (
          <GameScreen
            target={screen.target}
            onExit={() => go(backOf(screen.target))}
            onSettings={() => setSettingsOpen(true)}
            onNext={(t) => go(t ? { name: "game", target: t } : backOf(screen.target))}
            onGallery={() => go({ name: "gallery" })}
            onAtelier={() => go({ name: "atelier" })}
          />
        )}
      </ScreenSwap>
      <ShopScreen visible={shopOpen} onClose={() => setShopOpen(false)} />
      <SettingsPopup visible={settingsOpen} onClose={() => setSettingsOpen(false)} />
      {showBanner && (
        // The banner box clears the gesture pill / home indicator (padded by the bottom inset). Screens already pad by
        // insets.bottom themselves, so the shared banner height excludes it (no double gap above their controls).
        <View style={[styles.banner, { paddingBottom: insets.bottom }]} onLayout={(e) => layout.setBannerHeight(Math.max(0, e.nativeEvent.layout.height - insets.bottom))}>
          <BannerAd unitId={ads.bannerUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
        </View>
      )}
    </View>
  );
}

/**
 * Screen changes. The container is stable and its content is ALWAYS drawn: the new screen mounts at full layout and
 * only eases from 0.94 → 1 opacity (a deeper fade read as greyed, missing art) with a short rise (core Animated, native driver). A teal-and-gold brush stroke
 * sweeps across once on the way into a puzzle. No Reanimated layout animations here — on Android (new arch) a
 * whole-screen `entering`/`exiting` pair could leave the incoming screen invisible and ghost layers of the old one
 * on screen (QA 2026-10-27: blank cream screen after "Play").
 */
function ScreenSwap({ id, intoPuzzle, children }: { id: string; intoPuzzle: boolean; children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const t = useState(() => new Animated.Value(1))[0];
  const wipe = useState(() => new Animated.Value(1))[0];
  const first = useState(() => ({ id }))[0];
  // Layout effect: the new screen's first frame is already the start of the ease, never a full-opacity flash.
  useLayoutEffect(() => {
    if (first.id === id) { first.id = ""; return; } // the launch screen just appears
    t.setValue(0);
    Animated.timing(t, { toValue: 1, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    if (intoPuzzle) {
      wipe.setValue(0);
      Animated.timing(wipe, { toValue: 1, duration: 520, easing: Easing.inOut(Easing.quad), useNativeDriver: true }).start();
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  const band = Math.round(width * 0.55);
  return (
    <View style={styles.root}>
      <Animated.View
        key={id}
        style={[styles.root, {
          opacity: t.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] }),
          transform: [{ translateY: t.interpolate({ inputRange: [0, 1], outputRange: [intoPuzzle ? 22 : 10, 0] }) }],
        }]}
      >
        {children}
      </Animated.View>
      {/* The brush stroke: rests off-screen on both ends of its run, so it can never be left covering the screen. */}
      <Animated.View
        pointerEvents="none"
        style={[styles.wipe, { width: band, transform: [{ translateX: wipe.interpolate({ inputRange: [0, 1], outputRange: [-band * 1.4, width + band * 0.4] }) }, { skewX: "-14deg" }] }]}
      >
        <LinearGradient
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          colors={["rgba(46,140,138,0)", "rgba(46,140,138,0.38)", "rgba(242,196,106,0.55)", "rgba(246,238,220,0)"]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wipe: { position: "absolute", top: -40, bottom: -40, left: 0 },
  root: { flex: 1, backgroundColor: "#F6EEDC" },
  banner: { position: "absolute", left: 0, right: 0, bottom: 0, alignItems: "center" },
});
