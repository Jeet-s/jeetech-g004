import { memo, useEffect, useMemo } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { Canvas, Group, RoundedRect, Circle, FillType, Skia } from "@shopify/react-native-skia";
import { Easing, useDerivedValue, useSharedValue, withTiming, type SharedValue } from "react-native-reanimated";

const COLORS = ["#E3A83B", "#2E8C8A", "#D9694F", "#8DB48E", "#FFF8E8", "#F2B35E"];

interface P { vx: number; vy: number; spin: number; size: number; color: string; round: boolean; delay: number }

function Particle({ p, t, ox, oy }: { p: P; t: SharedValue<number>; ox: number; oy: number }) {
  const transform = useDerivedValue(() => {
    const k = Math.max(0, t.value - p.delay);
    // Pieces leave from a small ring around the origin (not one point), so a burst never starts as a single clump.
    const x = ox + p.vx * (k + 0.03);
    const y = oy + p.vy * (k + 0.03) + 900 * k * k; // gravity
    return [{ translateX: x }, { translateY: y }, { rotate: p.spin * k }];
  });
  // Invisible until its own launch (a delayed piece must never wait at the origin — a clump of pieces stacked
  // there reads as a stray blob in a still frame).
  const opacity = useDerivedValue(() => (t.value <= p.delay ? 0 : Math.max(0, 1 - Math.max(0, t.value - p.delay - 0.6) / 0.6)));
  return (
    <Group transform={transform} opacity={opacity}>
      {p.round ? (
        <Circle cx={0} cy={0} r={p.size / 2} color={p.color} />
      ) : (
        <RoundedRect x={-p.size / 2} y={-p.size / 4} width={p.size} height={p.size / 2} r={2} color={p.color} />
      )}
    </Group>
  );
}

/**
 * Confetti / sparkle burst (GPU, Skia). Change `trigger` to fire again. Mount it with the screen
 * (trigger 0 = idle) rather than when the moment happens.
 * Use on wins, unlocks, purchases, combos.
 */
/** Memoised on its values (origin is often a fresh object): the canvas only redraws when a burst changes. */
/** `avoid`: a screen rect the pieces are never drawn over (e.g. the finished painting) — they pass behind it. */
export const Confetti = memo(function Confetti({ trigger, count = 70, origin, avoid }: { trigger: number; count?: number; origin?: { x: number; y: number }; avoid?: { x: number; y: number; w: number; h: number } }) {
  const { width, height } = useWindowDimensions();
  // Starts "finished" (every particle faded out) so the canvas can stay mounted: creating a Skia
  // canvas at the moment of a win stalls the frame the player is watching.
  const t = useSharedValue(1.6);
  const particles = useMemo<P[]>(
    () =>
      Array.from({ length: count }, (_, i) => {
        const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.2;
        const sp = 380 + Math.random() * 520;
        return {
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          spin: (Math.random() - 0.5) * 18,
          size: 8 + Math.random() * 10,
          color: COLORS[i % COLORS.length],
          round: Math.random() < 0.3,
          delay: Math.random() * 0.12,
        };
      }),
    // new set per trigger
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [trigger, count],
  );
  useEffect(() => {
    if (!trigger) return;
    t.value = 0;
    t.value = withTiming(1.6, { duration: 1600, easing: Easing.linear });
  }, [trigger, t]);
  const clip = useMemo(() => {
    if (!avoid || avoid.w <= 0 || avoid.h <= 0) return undefined;
    const b = Skia.PathBuilder.Make();
    b.addRect(Skia.XYWHRect(-200, -200, width + 400, height + 400));
    b.addRect(Skia.XYWHRect(avoid.x, avoid.y, avoid.w, avoid.h));
    b.setFillType(FillType.EvenOdd);
    return b.detach();
  }, [avoid?.x, avoid?.y, avoid?.w, avoid?.h, width, height]); // eslint-disable-line react-hooks/exhaustive-deps
  const ox = origin?.x ?? width / 2;
  const oy = origin?.y ?? height * 0.42;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
        <Group clip={clip}>
          {particles.map((p, i) => (
            <Particle key={i} p={p} t={t} ox={ox} oy={oy} />
          ))}
        </Group>
      </Canvas>
    </View>
  );
}, (a, b) => a.trigger === b.trigger && a.count === b.count && a.origin?.x === b.origin?.x && a.origin?.y === b.origin?.y
  && a.avoid?.x === b.avoid?.x && a.avoid?.y === b.avoid?.y && a.avoid?.w === b.avoid?.w && a.avoid?.h === b.avoid?.h);
