/** Game art (assets/art/manifest.json: kind/usage/size; "legacy" ids are the previous art). Use with expo Image or Skia useImage. */
export const art = {
  bg_paper_main: require("../assets/art/bg_paper_main.png"),
  bg_atelier_hub: require("../assets/art/bg_atelier_hub.png"),
  bg_island_map: require("../assets/art/bg_island_map.png"),
  hero_mina_easel: require("../assets/art/hero_mina_easel.png"),
  board_frame: require("../assets/art/board_frame.png"),
  cell_filled: require("../assets/art/cell_filled.png"),
  cell_x_mark: require("../assets/art/cell_x_mark.png"),
  cell_dot_mark: require("../assets/art/cell_dot_mark.png"),
  cell_color_swatch: require("../assets/art/cell_color_swatch.png"),
  hud_panel: require("../assets/art/hud_panel.png"),
  btn_primary_teal: require("../assets/art/btn_primary_teal.png"),
  btn_secondary_gold: require("../assets/art/btn_secondary_gold.png"),
  icon_pigment: require("../assets/art/icon_pigment.png"),
  icon_hint_brush: require("../assets/art/icon_hint_brush.png"),
  icon_framed_art: require("../assets/art/icon_framed_art.png"),
  fx_ink_bloom: require("../assets/art/fx_ink_bloom.png"),
  logo: require("../assets/art/logo.png"),
} as const;
export type ArtId = keyof typeof art;
