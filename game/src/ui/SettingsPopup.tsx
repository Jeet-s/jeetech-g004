import { Linking, StyleSheet, Text, View } from "react-native";
import { Popup } from "./Popup";
import { Toggle } from "./Toggle";
import { GameButton } from "./GameButton";
import { LinkRow, openDisplaySettings } from "./LinkRow";
import { useState } from "react";
import { store } from "../modules/store";
import { iap } from "../modules/iap";
import { notify } from "../modules/notify";
import { analytics } from "../modules/analytics";
import { setOpt, usePlayer, optsOf } from "../game/meta";
import { fonts, palette } from "./theme";

/**
 * Settings: display (theme + text size follow the phone; Night studio overrides), sound/music/haptics, the puzzle helpers (auto-X, clue grey-out, strikes), comfort and accessibility
 * (left-handed, night studio, high contrast, colour patterns), hide the atelier meta, daily reminder, restore.
 */
export function SettingsPopup({ visible, onClose, privacyUrl }: { visible: boolean; onClose: () => void; privacyUrl?: string }) {
  const s = usePlayer();
  const o = optsOf(s);
  const [restoreNote, setRestoreNote] = useState("");
  const restore = async () => {
    analytics.track("premium_restore");
    setRestoreNote("Checking the store…");
    try {
      if (!iap.items().length) await iap.init();
      await iap.restore();
      setRestoreNote(store.get().adsRemoved ? "Restored — ads are removed. Thank you!" : iap.items().length ? "Nothing to restore on this account." : "The store isn't reachable right now — try again later.");
    } catch {
      setRestoreNote("The store isn't reachable right now — try again later.");
    }
  };
  const setSys = (k: "sound" | "music" | "haptics", v: boolean) => { store.set({ [k]: v }); analytics.track("settings_changed", { key: k, value: v }); };
  return (
    <Popup visible={visible} title="Settings" onClose={onClose}>
      <Text style={[styles.section, { marginTop: 0 }]}>Display</Text>
      <LinkRow icon="bulb" label="Theme" value="Follows your phone" hint="Opens your phone's display settings" onPress={() => { analytics.track("settings_changed", { key: "system_theme", value: true }); void openDisplaySettings(); }} />
      <LinkRow icon="pencil" label="Text size" value="Follows your phone" hint="Opens your phone's display settings" onPress={() => { analytics.track("settings_changed", { key: "system_text_size", value: true }); void openDisplaySettings(); }} />
      <Toggle label="Night studio" hint="Dark studio even when your phone is light" value={o.dark} onChange={(v) => setOpt("dark", v)} />
      <Text style={styles.section}>Sound</Text>
      <Toggle label="Sound effects" value={s.sound !== false} onChange={(v) => setSys("sound", v)} />
      <Toggle label="Music" value={s.music !== false} onChange={(v) => setSys("music", v)} />
      <Toggle label="Haptics" hint="Soft ticks while you paint" value={s.haptics !== false} onChange={(v) => setSys("haptics", v)} />
      <Text style={styles.section}>Puzzle</Text>
      <Toggle label="Auto-X finished lines" value={o.autoX} onChange={(v) => setOpt("autoX", v)} />
      <Toggle label="Grey out solved clues" value={o.greyClues} onChange={(v) => setOpt("greyClues", v)} />
      <Toggle label="Strikes mode" hint="Off by default: no lives, no penalties" value={o.strikes} onChange={(v) => setOpt("strikes", v)} />
      <Text style={styles.section}>Comfort</Text>
      <Toggle label="Left-handed toolbar" value={o.leftHand} onChange={(v) => setOpt("leftHand", v)} />
      <Toggle label="High contrast" value={o.contrast} onChange={(v) => setOpt("contrast", v)} />
      <Toggle label="Colour patterns" hint="Pattern glyphs on colour cells" value={o.patterns} onChange={(v) => setOpt("patterns", v)} />
      <Toggle label="Hide the atelier" hint="Just puzzles: hides rooms, gallery and daily cards" value={o.hideMeta} onChange={(v) => setOpt("hideMeta", v)} />
      <Toggle
        label="Daily puzzle reminder"
        value={o.reminders}
        onChange={async (v) => {
          if (!v) { setOpt("reminders", false); notify.cancel("daily-puzzle"); return; }
          const ok = await notify.ask("A gentle reminder for your daily puzzle");
          setOpt("reminders", ok);
          if (ok) notify.daily("daily-puzzle", { hour: 19, minute: 0 }, { title: "Your daily puzzle is ready", body: "A fresh picture is waiting in the atelier — keep your streak going." });
        }}
      />
      <View style={{ height: 8 }} />
      <Text style={styles.section}>Purchases</Text>
      <GameButton size="sm" variant="light" label="Restore purchases" onPress={restore} />
      {restoreNote ? <Text style={styles.note}>{restoreNote}</Text> : null}
      {privacyUrl ? <Text style={styles.link} onPress={() => Linking.openURL(privacyUrl)}>Privacy policy</Text> : null}
      <GameButton style={{ marginTop: 12 }} label="Done" onPress={onClose} />
    </Popup>
  );
}

const styles = StyleSheet.create({
  section: { fontFamily: fonts.display, fontSize: 15, color: palette.primaryDark, marginTop: 8, marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.8 },
  note: { fontFamily: fonts.body, fontSize: 13, color: palette.primaryDark, textAlign: "center", marginTop: 8 },
  link: { fontFamily: fonts.bodyRegular, color: palette.inkSoft, textAlign: "center", marginTop: 12, textDecorationLine: "underline" },
});
