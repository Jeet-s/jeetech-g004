import { useCallback, useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, View, type ImageSourcePropType } from "react-native";
import { GameButton, Icon, Popup, feedback, fonts, palette } from "../ui";
import { SeasonCard } from "../ui/SeasonCard";
import { iap, type ShopItem } from "../modules/iap";
import { ads } from "../modules/ads";
import { store } from "../modules/store";
import { analytics } from "../modules/analytics";
import {
  BOARD_SKINS, BRUSH_PACKS, FRAMES, addBrushes, boardSkinOf, buyBrushes, buyFrame, buySkin, equipSkin, framesOwned, selectFrame, skinsOwned, usePlayer,
  type BoardSkin,
} from "../game/meta";
import monetization from "../../monetization.json";
import { art } from "../art";

const COINS: Record<string, number> = Object.fromEntries(monetization.iap.filter((p) => "coins" in p).map((p) => [p.sku, (p as { coins: number }).coins]));

type StoreState = "ready" | "loading" | "unavailable";

/**
 * Shop: Remove Ads (one purchase, removes every ad and nag) with Restore right beside it, the free Studio Season
 * track, Pigment-priced studio cosmetics (board Paper & Ink sets, gallery frames), Hint Brushes, a free brush via
 * an opt-in rewarded ad, and Pigment packs. No random rewards, ever. Store products and prices appear only as the
 * store returns them — never placeholders; when the store can't be reached the card says so and offers Retry.
 */
export function ShopScreen({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const s = usePlayer();
  const [items, setItems] = useState<ShopItem[]>(iap.items());
  const [storeState, setStoreState] = useState<StoreState>(iap.items().length ? "ready" : "loading");
  const [note, setNote] = useState("");
  const [adNote, setAdNote] = useState("");
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);

  /** Re-read the store's products; if there are none, retry the billing connection once and read again. */
  const connect = useCallback(async (): Promise<ShopItem[]> => {
    let fresh = iap.items();
    if (!fresh.length) {
      setStoreState("loading");
      try { await iap.init(); } catch { /* reported below as unavailable */ }
      fresh = iap.items();
    }
    if (alive.current) {
      setItems(fresh);
      setStoreState(fresh.length ? "ready" : "unavailable");
    }
    return fresh;
  }, []);

  useEffect(() => {
    if (!visible) return;
    setNote("");
    setAdNote("");
    void connect();
    // Billing connects after ads at boot — keep picking the store's products up while the shop is open.
    const t = setInterval(() => {
      const now = iap.items();
      setItems((cur) => (cur.length === now.length ? cur : now));
      if (now.length) setStoreState("ready");
    }, 1500);
    return () => clearInterval(t);
  }, [visible, connect]);

  const buyRemoveAds = async () => {
    analytics.track("iap_tap", { sku: "remove_ads" });
    const fresh = await connect();
    if (!fresh.some((i) => i.sku === "remove_ads")) {
      feedback("error", "warning");
      return;
    }
    setAdNote("Opening the store…");
    iap.purchase("remove_ads").then(() => setAdNote("")).catch(() => setAdNote("The purchase couldn't start — please try again."));
  };
  const restore = async () => {
    analytics.track("premium_restore");
    setAdNote("Checking your purchases…");
    try {
      const fresh = await connect();
      await iap.restore();
      setAdNote(store.get().adsRemoved ? "Restored — ads are removed. Thank you!" : fresh.length ? "Nothing to restore on this account." : "The store isn't reachable right now — tap Retry in a moment.");
    } catch {
      setAdNote("The store isn't reachable right now — tap Retry in a moment.");
    }
  };

  const owned = framesOwned();
  const skins = skinsOwned(s);
  const skinOn = boardSkinOf(s).id;
  const removeAds = items.find((i) => i.sku === "remove_ads");
  const packs = items.filter((i) => i.sku !== "remove_ads" && COINS[i.sku]);
  return (
    <Popup visible={visible} title="Shop" onClose={onClose}>
      <View style={styles.balance}>
        <Image source={art.icon_pigment} style={{ width: 22, height: 30 }} resizeMode="contain" />
        <Text style={styles.balText}>{s.coins.toLocaleString()}</Text>
        <Image source={art.icon_hint_brush} style={{ width: 28, height: 30, marginLeft: 12 }} resizeMode="contain" />
        <Text style={styles.balText}>{s.brushes ?? 0}</Text>
      </View>

      {/* ── Remove Ads + Restore, together ── */}
      <View style={styles.adsCard}>
        <View style={styles.adsHead}>
          <Image source={art.hero_mina_easel} style={styles.icon} resizeMode="contain" />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Remove Ads</Text>
            <Text style={styles.sub}>{s.adsRemoved ? "Purchased — thank you! No interstitials, banners or nags, ever." : "Removes every interstitial and banner ad, forever."}</Text>
          </View>
        </View>
        {s.adsRemoved ? (
          <View style={styles.owned}>
            <Icon name="check" size={20} color={palette.primary} weight={3} />
            <Text style={styles.ownedText}>Ads removed ✓</Text>
          </View>
        ) : storeState === "unavailable" && !removeAds ? (
          <View style={styles.unavail}>
            <Text style={styles.unavailText}>Store unavailable — check your connection.</Text>
            <GameButton size="sm" variant="primary" label="Retry" onPress={() => { setAdNote(""); void connect(); }} />
          </View>
        ) : removeAds ? (
          <GameButton style={{ marginTop: 8 }} variant="accent" label={`Remove Ads · ${removeAds.price}`} onPress={buyRemoveAds} />
        ) : (
          <View style={styles.unavail}>
            <Text style={styles.unavailText}>Connecting to the store…</Text>
          </View>
        )}
        <GameButton style={{ marginTop: 8 }} size="sm" variant="light" label="Restore purchases" onPress={restore} />
        {adNote ? <Text style={styles.note}>{adNote}</Text> : null}
        {!s.adsRemoved ? <Text style={styles.small}>Ads are rare here: never before puzzle 10, never mid-puzzle, only at a puzzle's end.</Text> : null}
      </View>

      {/* ── free season track ── */}
      <Text style={styles.section}>Studio Season · free</Text>
      <SeasonCard />

      {/* ── cosmetics for Pigments ── */}
      <Text style={styles.section}>Studio cosmetics</Text>
      <Text style={styles.caption}>Paper & Ink sets for the puzzle board — the paper tint, and the ink for single-colour pictures.</Text>
      <View style={styles.grid}>
        {BOARD_SKINS.map((k) => {
          const has = skins.includes(k.id);
          const using = skinOn === k.id;
          return (
            <View key={k.id} style={[styles.skinCard, using && styles.skinOn]}>
              <SkinPreview skin={k} />
              <Text style={styles.skinName}>{k.name}</Text>
              <Text style={styles.skinBlurb}>{k.blurb}</Text>
              <GameButton
                size="sm"
                variant={using ? "primary" : has ? "light" : "secondary"}
                label={using ? "Equipped" : has ? "Equip" : `${k.cost}`}
                icon={!has ? <Image source={art.icon_pigment} style={styles.pig} resizeMode="contain" /> : undefined}
                disabled={!has && s.coins < k.cost}
                onPress={() => {
                  if (using) return;
                  if (has) { equipSkin(k.id); setNote(`${k.name} is on your board`); return; }
                  if (buySkin(k.id)) { feedback("unlock", "success"); setNote(`${k.name} bought and equipped — open a puzzle to see it`); }
                }}
              />
            </View>
          );
        })}
      </View>

      <Text style={styles.section}>Gallery frames</Text>
      <View style={styles.frames}>
        {FRAMES.map((f) => {
          const has = owned.includes(f.id);
          const using = (s.frame ?? "oak") === f.id;
          return (
            <View key={f.id} style={styles.frameCard}>
              <View style={[styles.swatch, { borderColor: f.outer, backgroundColor: f.inner }]}><View style={[styles.swatchIn, { borderColor: f.accent }]} /></View>
              <Text style={styles.frameName} numberOfLines={2}>{f.name}</Text>
              <GameButton
                size="sm"
                variant={using ? "primary" : has ? "light" : "secondary"}
                label={using ? "In use" : has ? "Use" : `${f.cost}`}
                icon={!has ? <Image source={art.icon_pigment} style={styles.pig} resizeMode="contain" /> : undefined}
                disabled={!has && s.coins < f.cost}
                onPress={() => { if (has) selectFrame(f.id); else if (buyFrame(f.id)) { feedback("unlock", "success"); setNote(`${f.name} frame added to your gallery`); } }}
              />
            </View>
          );
        })}
      </View>
      {note ? <Text style={styles.note}>{note}</Text> : null}

      <Text style={styles.section}>Hint Brushes</Text>
      {BRUSH_PACKS.map((pk) => (
        <Row key={pk.id} image={art.icon_hint_brush} title={`${pk.brushes} Hint Brushes`} sub="Each paints one row or column of your choice">
          <GameButton size="sm" variant="secondary" icon={<Image source={art.icon_pigment} style={styles.pig} resizeMode="contain" />} label={`${pk.cost}`} disabled={s.coins < pk.cost} onPress={() => { if (buyBrushes(pk.id)) { feedback("coin", "success"); setNote(`+${pk.brushes} Hint Brushes`); } }} />
        </Row>
      ))}
      <Row image={art.icon_hint_brush} title="Free Hint Brush" sub="Optional: watch a short ad">
        <GameButton
          size="sm"
          variant="primary"
          label="Watch"
          onPress={() => {
            analytics.track("ad_rewarded_offered", { place: "shop" });
            const ok = ads.showRewarded(() => { addBrushes(1); feedback("coin", "success"); analytics.track("ad_rewarded_completed", { place: "shop" }); setNote("+1 Hint Brush"); });
            if (!ok) setNote("No ad is ready right now — try again later.");
          }}
        />
      </Row>

      {packs.length ? <Text style={styles.section}>Pigments</Text> : null}
      {packs.map((i) => (
        <Row key={i.sku} image={art.icon_pigment} title={`${(COINS[i.sku] ?? 0).toLocaleString()} Pigments`} sub="For rooms, frames and Hint Brushes">
          <GameButton size="sm" variant="primary" label={i.price} onPress={() => { analytics.track("iap_tap", { sku: i.sku }); iap.purchase(i.sku).catch(() => setNote("The purchase couldn't start — please try again.")); }} />
        </Row>
      ))}
      <GameButton style={{ marginTop: 14 }} label="Close" onPress={onClose} />
    </Popup>
  );
}

/** A 5×5 corner of a board in this skin: its paper, grid hairlines and a few inked cells. */
function SkinPreview({ skin }: { skin: BoardSkin }) {
  const on = [1, 2, 3, 6, 8, 10, 11, 12, 13, 14, 16, 18, 21, 23];
  return (
    <View style={styles.preview}>
      <View style={[styles.previewPaper, { backgroundColor: skin.paper }]}>
        {Array.from({ length: 25 }, (_, i) => (
          <View key={i} style={[styles.pcell, on.includes(i) && { backgroundColor: skin.ink, borderRadius: 2 }]} />
        ))}
      </View>
    </View>
  );
}

function Row({ image, title, sub, children }: { image: ImageSourcePropType; title: string; sub: string; children: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <Image source={image} style={styles.icon} resizeMode="contain" />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{sub}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  balance: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 8 },
  balText: { fontFamily: fonts.display, fontSize: 22, color: palette.secondaryDark },
  section: { fontFamily: fonts.display, fontSize: 14, color: palette.primaryDark, textTransform: "uppercase", letterSpacing: 0.8, marginTop: 14, marginBottom: 6 },
  caption: { fontFamily: fonts.bodyRegular, fontSize: 12, color: palette.inkSoft, marginTop: -2, marginBottom: 8 },
  adsCard: { backgroundColor: "#F6ECD6", borderRadius: 18, padding: 12, borderWidth: 1.5, borderColor: "rgba(182,128,31,0.45)" },
  adsHead: { flexDirection: "row", alignItems: "center", gap: 10 },
  owned: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 8, backgroundColor: "#E4F0EC", borderRadius: 14, paddingVertical: 10 },
  ownedText: { fontFamily: fonts.display, fontSize: 16, color: palette.primaryDark },
  unavail: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8, backgroundColor: "#FBEBDD", borderRadius: 14, paddingVertical: 6, paddingHorizontal: 10, minHeight: 52 },
  unavailText: { flex: 1, fontFamily: fonts.body, fontSize: 13, color: palette.coralDark },
  row: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#F6ECD6", borderRadius: 16, padding: 10, marginBottom: 8, borderWidth: 1, borderColor: "rgba(182,128,31,0.3)" },
  icon: { width: 42, height: 42 },
  pig: { width: 14, height: 19 },
  title: { fontFamily: fonts.display, fontSize: 16, color: palette.ink },
  sub: { fontFamily: fonts.bodyRegular, fontSize: 12, color: palette.inkSoft },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "space-between" },
  skinCard: { width: "48.5%", alignItems: "center", backgroundColor: "#F6ECD6", borderRadius: 14, padding: 8, borderWidth: 1.5, borderColor: "rgba(182,128,31,0.3)" },
  skinOn: { borderColor: palette.primary, borderWidth: 2.5, backgroundColor: "#EEF3E8" },
  preview: { padding: 4, borderRadius: 4, backgroundColor: palette.oak, borderWidth: 1, borderColor: palette.oakDark },
  previewPaper: { width: 60, height: 60, flexDirection: "row", flexWrap: "wrap", padding: 2.5 },
  pcell: { width: 11, height: 11, borderWidth: 0.5, borderColor: "rgba(122,102,80,0.35)" },
  skinName: { fontFamily: fonts.display, fontSize: 14, color: palette.ink, marginTop: 6, textAlign: "center" },
  skinBlurb: { fontFamily: fonts.bodyRegular, fontSize: 11, color: palette.inkSoft, textAlign: "center", marginBottom: 6 },
  frames: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "flex-start" },
  frameCard: { width: "31%", alignItems: "center", backgroundColor: "#F6ECD6", borderRadius: 14, padding: 8, borderWidth: 1, borderColor: "rgba(182,128,31,0.3)" },
  swatch: { width: 48, height: 48, borderWidth: 6, borderRadius: 3, padding: 3 },
  swatchIn: { flex: 1, backgroundColor: "#FFFBF0", borderWidth: 1 },
  frameName: { fontFamily: fonts.body, fontSize: 12, color: palette.ink, marginVertical: 4, textAlign: "center" },
  small: { fontFamily: fonts.bodyRegular, fontSize: 11.5, color: palette.inkSoft, textAlign: "center", marginTop: 6 },
  note: { fontFamily: fonts.body, fontSize: 14, color: palette.primaryDark, textAlign: "center", marginTop: 10 },
});
