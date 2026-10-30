import { useState } from "react";
import { View } from "react-native";
import { HomeScreen } from "./screens/HomeScreen";
import { LevelsScreen } from "./screens/LevelsScreen";
import { GameScreen } from "./screens/GameScreen";
import { GalleryScreen } from "./screens/GalleryScreen";
import { LEVELS } from "./game/levels";
import { dayKey } from "./game/meta";
import { store } from "./modules/store";

/**
 * Screenshot mode: the factory opens the app with <scheme>://shot/<id> on an emulator and captures the
 * screen for the store listing. Every scene renders a REAL state through the real screens. Ads are off here.
 */
const noop = () => {};

/** A level by its island and slot (robust while the campaign grows). */
const levelAt = (island: number, slot: number) => LEVELS.find((l) => l.island === island && l.slot === slot)?.number ?? Math.min(LEVELS.length, island * 12 + slot);

export function ScreenshotScene({ id }: { id: string }) {
  // A player well into the campaign: paintings, stars, Pigments, a streak — not an empty profile.
  useState(() => {
    const stars: Record<string, number> = {};
    LEVELS.filter((l) => l.island < 2).forEach((l, i) => (stars[l.spec.id] = i % 5 === 0 ? 2 : 3));
    const today = dayKey();
    const done = [1, 2, 3, 4, 5, 6].map((k) => { const d = new Date(); d.setDate(d.getDate() - k); return dayKey(d); });
    store.set({
      level: 25, coins: 1240, brushes: 5, stars, tutorialDone: true, welcomed: true, brushDay: today, rooms: [0],
      daily: { streak: 6, best: 9, last: done[0], done, frozen: [] },
    });
    return true;
  });
  const g = (n: number, demo: Parameters<typeof GameScreen>[0]["demo"]) => (
    <GameScreen target={{ kind: "level", n }} onExit={noop} onSettings={noop} onNext={noop} demo={demo} />
  );
  switch (id) {
    case "home":
      return <HomeScreen onPlay={noop} onLevels={noop} onShop={noop} onSettings={noop} onDaily={noop} onAtelier={noop} onGallery={noop} onEvents={noop} onStudio={noop} />;
    case "solve":
      // A 10×10 ink picture mid-solve: inked runs, X marks, a dot, grey clues.
      return g(levelAt(1, 3), { fill: 0.55, xs: true });
    case "color":
      return g(levelAt(2, 5), { fill: 0.6, xs: true });
    case "win":
      return g(levelAt(1, 12), { win: true });
    case "map":
      return <LevelsScreen onPlay={noop} onBack={noop} />;
    case "gallery":
      return <GalleryScreen onBack={noop} onPlay={noop} />;
    default:
      return <View />;
  }
}
