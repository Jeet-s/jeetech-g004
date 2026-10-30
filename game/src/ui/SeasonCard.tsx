import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
import { GameButton } from "./GameButton";
import { Icon } from "./Icon";
import { fonts, palette } from "./theme";
import { feedback } from "../audio/sfx";
import { FRAMES, SEASON_STEP, SEASON_TIERS, claimSeason, frameRewardFallback, framesOwned, prettyDay, seasonOf, seasonRewardLabel, usePlayer, type SeasonReward } from "../game/meta";
import { art } from "../art";

/** One tier's fixed reward as a tiny token: Pigment drop, Hint Brush, or a frame swatch. */
function RewardToken({ r, size = 22 }: { r: SeasonReward; size?: number }) {
  if (r.frame) {
    const f = FRAMES.find((x) => x.id === r.frame);
    return <View style={[styles.frameTok, { width: size, height: size, borderColor: f?.outer ?? palette.oak, backgroundColor: f?.inner ?? palette.oak }]}><View style={[styles.frameIn, { borderColor: f?.accent ?? palette.secondary }]} /></View>;
  }
  return <Image source={r.brushes ? art.icon_hint_brush : art.icon_pigment} style={{ width: size, height: size }} resizeMode="contain" />;
}

/**
 * Studio Season — a FREE season-pass-style track. Tiers open every SEASON_STEP puzzles solved this month;
 * every reward is fixed and shown up front (no purchase, nothing random). Claim grants all reached tiers.
 */
export function SeasonCard() {
  const s = usePlayer();
  const se = seasonOf(s);
  const [got, setGot] = useState<string>("");
  const done = se.claimed >= SEASON_TIERS.length;
  const into = se.solved - se.unlocked * SEASON_STEP; // solves toward the next tier
  const claimable = se.unlocked - se.claimed;
  const next = SEASON_TIERS[claimable > 0 ? se.claimed : se.unlocked];
  // Node k sits at k/(n-1) along the rail and is reached at progress k+1 (tiers, fractional between nodes).
  const fill = Math.max(0, Math.min(1, (se.unlocked + (se.unlocked >= SEASON_TIERS.length ? 0 : into / SEASON_STEP) - 1) / (SEASON_TIERS.length - 1)));
  const ownedFrames = framesOwned();
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <View style={styles.badge}><Icon name="trophy" size={22} color={palette.secondaryDark} /></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Studio Season</Text>
          <Text style={styles.sub}>{se.name} · free · until {prettyDay(se.ends)}</Text>
        </View>
      </View>
      {/* the track: one node per tier, gold once reached, ticked once claimed */}
      <View style={styles.track}>
        <View style={styles.railBox}>
          <View style={styles.rail} />
          <View style={[styles.railFill, { width: `${fill * 100}%` }]} />
        </View>
        {SEASON_TIERS.map((r, k) => {
          const reached = k < se.unlocked, claimed = k < se.claimed;
          return (
            <View key={k} style={[styles.node, reached && styles.nodeOn, claimed && styles.nodeClaimed]} accessibilityLabel={`Tier ${k + 1}: ${seasonRewardLabel(r)}${claimed ? ", claimed" : reached ? ", ready" : ""}`}>
              {claimed ? <Icon name="check" size={14} color="#fff" weight={3} /> : <RewardToken r={r} size={16} />}
            </View>
          );
        })}
      </View>
      <Text style={styles.progress}>
        {done ? "Season complete — a new season opens next month" : `Tier ${se.unlocked}/${SEASON_TIERS.length} · ${se.solved} puzzle${se.solved === 1 ? "" : "s"} solved this season`}
      </Text>
      {!done && next ? (
        <View style={styles.nextRow}>
          <Text style={styles.nextLabel}>{claimable > 0 ? "Ready:" : "Next:"}</Text>
          <RewardToken r={next} />
          <Text style={styles.nextText}>
            {seasonRewardLabel(next)}
            {next.frame && ownedFrames.includes(next.frame) ? ` (owned: +${frameRewardFallback(next.frame)} Pigments)` : ""}
            {claimable > 0 ? "" : ` · ${SEASON_STEP - into} more puzzle${SEASON_STEP - into === 1 ? "" : "s"}`}
          </Text>
        </View>
      ) : null}
      {claimable > 0 ? (
        <GameButton
          style={{ marginTop: 10 }}
          variant="accent"
          sound="coin"
          label={claimable > 1 ? `Claim ${claimable} rewards` : "Claim reward"}
          onPress={() => {
            const g = claimSeason();
            if (!g.length) return;
            feedback("coin", "success");
            setGot(g.map(seasonRewardLabel).join(" · "));
          }}
        />
      ) : null}
      {got ? (
        <Animated.View entering={ZoomIn.springify()} style={styles.got}>
          <Icon name="check" size={18} color={palette.primary} weight={3} />
          <Text style={styles.gotText}>+ {got}</Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#FFF7E4", borderRadius: 18, padding: 12, borderWidth: 2, borderColor: "rgba(227,168,59,0.75)", marginBottom: 8 },
  head: { flexDirection: "row", alignItems: "center", gap: 10 },
  badge: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FBF0D4", alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: "rgba(182,128,31,0.4)" },
  title: { fontFamily: fonts.display, fontSize: 18, color: palette.ink },
  sub: { fontFamily: fonts.bodyRegular, fontSize: 12, color: palette.inkSoft },
  track: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12, height: 28 },
  railBox: { position: "absolute", left: 13, right: 13, height: 6 },
  rail: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, borderRadius: 3, backgroundColor: "#E5D8BC" },
  railFill: { position: "absolute", left: 0, top: 0, height: 6, borderRadius: 3, backgroundColor: palette.secondary },
  node: { width: 26, height: 26, borderRadius: 13, backgroundColor: "#FFFBF1", borderWidth: 1.5, borderColor: "#CDB78F", alignItems: "center", justifyContent: "center" },
  nodeOn: { borderColor: palette.secondaryDark, backgroundColor: "#FBE7B8" },
  nodeClaimed: { backgroundColor: palette.primary, borderColor: palette.primaryDark },
  progress: { fontFamily: fonts.body, fontSize: 12.5, color: palette.inkSoft, textAlign: "center", marginTop: 6 },
  nextRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 6, flexWrap: "wrap" },
  nextLabel: { fontFamily: fonts.display, fontSize: 14, color: palette.primaryDark },
  nextText: { fontFamily: fonts.body, fontSize: 13.5, color: palette.ink, flexShrink: 1 },
  frameTok: { borderWidth: 3, borderRadius: 2, padding: 1.5 },
  frameIn: { flex: 1, backgroundColor: "#FFFBF0", borderWidth: 0.8 },
  got: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 10, backgroundColor: "#E4F0EC", borderRadius: 12, padding: 8 },
  gotText: { fontFamily: fonts.body, fontSize: 13.5, color: palette.primaryDark, flexShrink: 1, textAlign: "center" },
});
