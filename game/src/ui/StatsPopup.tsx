import { StyleSheet, Text, View } from "react-native";
import { Popup } from "./Popup";
import { GameButton } from "./GameButton";
import { Icon, type IconName } from "./Icon";
import { fonts, palette } from "./theme";
import { LEVELS, ISLANDS } from "../game/levels";
import { ROOMS, currentStreak, dailyOf, islandSize, islandSolved, solvedCount, statsOf, totalStars, usePlayer } from "../game/meta";

function Tile({ icon, value, label, tint }: { icon: IconName; value: string | number; label: string; tint: string }) {
  return (
    <View style={styles.tile}>
      <View style={[styles.tileIcon, { backgroundColor: tint }]}><Icon name={icon} size={18} color={palette.ink} /></View>
      <Text style={styles.tileV} numberOfLines={1}>{value}</Text>
      <Text style={styles.tileL} numberOfLines={2}>{label}</Text>
    </View>
  );
}

/** The painter's profile: lifetime stats, streaks and how far the atelier has come — opened from Home ("Stats"). */
export function StatsPopup({ visible, onClose, onGallery }: { visible: boolean; onClose: () => void; onGallery?: () => void }) {
  const player = usePlayer();
  const st = statsOf();
  const solved = solvedCount();
  const islandsDone = ISLANDS.filter((_, k) => islandSolved(k) >= islandSize(k)).length;
  const perfect = LEVELS.filter((l) => (player.stars?.[l.spec.id] ?? 0) >= 3).length;
  const rooms = (player.rooms ?? []).length;
  const minutes = Math.round(st.seconds / 60);
  const pct = Math.round((solved / LEVELS.length) * 100);
  return (
    <Popup visible={visible} title="Stats & Profile" onClose={onClose}>
      <Text style={styles.rank}>{solved >= 100 ? "Master Painter" : solved >= 60 ? "Gallery Painter" : solved >= 24 ? "Journeyman" : solved >= 6 ? "Apprentice" : "New Arrival"}</Text>
      <View style={styles.progress}>
        <View style={[styles.progressFill, { width: `${Math.max(3, pct)}%` }]} />
      </View>
      <Text style={styles.progressText}>{solved} of {LEVELS.length} paintings · {pct}% of the campaign</Text>
      <View style={styles.grid}>
        <View style={styles.row}>
          <Tile icon="star" value={totalStars()} label="Stars earned" tint="#FBE7B8" />
          <Tile icon="check" value={perfect} label="3-star paintings" tint="#E4F0EC" />
          <Tile icon="flame" value={currentStreak(dailyOf())} label="Daily streak" tint="#FBE1D6" />
        </View>
        <View style={styles.row}>
          <Tile icon="trophy" value={player.daily?.best ?? 0} label="Best streak" tint="#FBF0D4" />
          <Tile icon="map" value={`${islandsDone}/${ISLANDS.length}`} label="Islands complete" tint="#E1ECF5" />
          <Tile icon="house" value={`${rooms}/${ROOMS.length}`} label="Rooms renovated" tint="#EFE6D6" />
        </View>
        <View style={styles.row}>
          <Tile icon="fill" value={st.pigments} label="Pigments earned" tint="#FBE7B8" />
          <Tile icon="bulb" value={st.brushesUsed} label="Hint Brushes used" tint="#E4F0EC" />
          <Tile icon="calendar" value={minutes} label="Minutes painted" tint="#E1ECF5" />
        </View>
      </View>
      {onGallery ? <GameButton label="Open the Gallery" variant="primary" size="sm" onPress={onGallery} style={{ marginTop: 12 }} /> : null}
    </Popup>
  );
}

const styles = StyleSheet.create({
  rank: { fontFamily: fonts.display, fontSize: 20, color: palette.primaryDark, textAlign: "center" },
  progress: { height: 10, borderRadius: 5, backgroundColor: "#E5D8BC", marginTop: 8, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 5, backgroundColor: palette.sage },
  progressText: { fontFamily: fonts.body, fontSize: 12.5, color: palette.inkSoft, textAlign: "center", marginTop: 4 },
  grid: { marginTop: 12, gap: 8 },
  row: { flexDirection: "row", gap: 8 },
  tile: { flex: 1, alignItems: "center", backgroundColor: "#FFFBF1", borderRadius: 14, paddingVertical: 8, paddingHorizontal: 4, borderWidth: 1, borderColor: "rgba(182,128,31,0.3)" },
  tileIcon: { width: 30, height: 30, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  tileV: { fontFamily: fonts.display, fontSize: 19, color: palette.ink, marginTop: 3 },
  tileL: { fontFamily: fonts.bodyRegular, fontSize: 11, color: palette.inkSoft, textAlign: "center" },
});
