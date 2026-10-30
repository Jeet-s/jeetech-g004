/**
 * Hand-inked UI glyphs (24×24 viewbox): rounded caps, slightly heavy line, one colour. Pure data — shared by Icon and
 * by scripts/bake-icons.ts, which rasterises them ONCE into bundled PNGs (assets/icons) so every icon is a packaged
 * image that draws in a screen's first frame (QA 2026-10-29: base64 glyphs decoded at mount showed empty circle
 * buttons for several frames on Android).
 */
export const STROKE: Record<string, string> = {
  back: "M14.5 5 L7.5 12 L14.5 19 M8 12 H19.5",
  undo: "M9 5.5 L4.5 10 L9 14.5 M5 10 H14.5 C17.8 10 20 12.2 20 15 C20 17.8 17.8 19.5 15 19.5 H11",
  redo: "M15 5.5 L19.5 10 L15 14.5 M19 10 H9.5 C6.2 10 4 12.2 4 15 C4 17.8 6.2 19.5 9 19.5 H13",
  map: "M3.5 6.5 L9 4.5 L15 6.5 L20.5 4.5 V17.5 L15 19.5 L9 17.5 L3.5 19.5 Z M9 4.5 V17.5 M15 6.5 V19.5",
  shop: "M3.5 9.5 L5.5 4.5 H18.5 L20.5 9.5 M3.5 9.5 C3.5 11 4.6 12 6 12 C7.4 12 8.6 11 8.6 9.5 C8.6 11 9.9 12 11.9 12 C13.9 12 15.2 11 15.2 9.5 C15.2 11 16.5 12 18 12 C19.4 12 20.5 11 20.5 9.5 M5.5 12 V20 H18.5 V12 M10 20 V15.5 H14 V20",
  gear: "M12 8.6 A3.4 3.4 0 1 0 12 15.4 A3.4 3.4 0 1 0 12 8.6 M12 2.8 V5.2 M12 18.8 V21.2 M2.8 12 H5.2 M18.8 12 H21.2 M5.5 5.5 L7.2 7.2 M16.8 16.8 L18.5 18.5 M5.5 18.5 L7.2 16.8 M16.8 7.2 L18.5 5.5 M12 5.2 A6.8 6.8 0 1 0 12 18.8 A6.8 6.8 0 1 0 12 5.2",
  calendar: "M4 6 H20 V20 H4 Z M4 10.5 H20 M8 3.5 V7.5 M16 3.5 V7.5 M8 14 H9.5 M11.3 14 H12.8 M14.6 14 H16.1 M8 17 H9.5 M11.3 17 H12.8",
  gallery: "M4 4.5 H20 V19.5 H4 Z M6.5 16.5 L10.5 11.5 L13.5 14.5 L15.5 12.5 L18 16.5 M15.5 8 A1.2 1.2 0 1 0 15.5 8.1",
  house: "M3 11.5 L12 4 L21 11.5 M5.5 9.5 V20 H18.5 V9.5 M9.8 20 V14.5 H14.2 V20",
  zoomIn: "M10.5 4.5 A6 6 0 1 0 10.5 16.5 A6 6 0 1 0 10.5 4.5 M15 15 L20 20 M8 10.5 H13 M10.5 8 V13",
  zoomOut: "M10.5 4.5 A6 6 0 1 0 10.5 16.5 A6 6 0 1 0 10.5 4.5 M15 15 L20 20 M8 10.5 H13",
  close: "M6 6 L18 18 M18 6 L6 18",
  check: "M5 12.5 L10 17.5 L19 7",
  x: "M6.5 6.5 L17.5 17.5 M17.5 6.5 L6.5 17.5",
  restart: "M19 12 A7 7 0 1 1 16.5 6.6 M17 3.5 V7.2 H13.3",
  bulb: "M9 18 H15 M10 21 H14 M12 3 C8.5 3 6 5.6 6 9 C6 11.4 7.3 12.8 8.5 14 C9 14.5 9 15 9 15.5 H15 C15 15 15 14.5 15.5 14 C16.7 12.8 18 11.4 18 9 C18 5.6 15.5 3 12 3",
  play: "M8 5.5 L18.5 12 L8 18.5 Z",
  lock: "M7 11 H17 V20 H7 Z M9 11 V8 C9 6.2 10.3 5 12 5 C13.7 5 15 6.2 15 8 V11",
  snow: "M12 3 V21 M4.2 7.5 L19.8 16.5 M4.2 16.5 L19.8 7.5 M10 4.5 L12 6.5 L14 4.5 M10 19.5 L12 17.5 L14 19.5",
  stats: "M5 20 V13 M10 20 V8 M15 20 V11 M20 20 V5 M3.5 20.5 H21",
  pencil: "M15.5 4.5 L19.5 8.5 L8.5 19.5 H4.5 V15.5 Z M13 7 L17 11",
  trophy: "M8 4.5 H16 V10 C16 12.5 14.2 14.5 12 14.5 C9.8 14.5 8 12.5 8 10 Z M8 6.5 H5 C5 9 6.3 10.5 8.2 10.8 M16 6.5 H19 C19 9 17.7 10.5 15.8 10.8 M12 14.5 V18 M9.5 18 H14.5 V20.5 H9.5 Z",
  trash: "M4.5 7 H19.5 M9.5 7 V4.5 H14.5 V7 M6.5 7 L7.5 20 H16.5 L17.5 7 M10.3 10.5 V16.5 M13.7 10.5 V16.5",
  bell: "M6 16.5 V11 C6 7.6 8.6 5 12 5 C15.4 5 18 7.6 18 11 V16.5 L19.5 18 H4.5 Z M10 20.5 H14",
};

export const FILL: Record<string, string> = {
  flame: "M12 2.5 C13.2 6.4 17.8 8.6 17.8 14 C17.8 17.6 15.2 20.8 12 20.8 C8.8 20.8 6.2 17.6 6.2 14 C6.2 11 8 9.6 8.8 7.6 C9.8 9.4 10.6 10 11.2 10 C11.2 7.6 11 5 12 2.5 Z",
  pause: "M7 5 H10.2 V19 H7 Z M13.8 5 H17 V19 H13.8 Z",
  star: "M12 2.6 L14.8 8.6 L21.3 9.3 L16.4 13.7 L17.8 20.2 L12 16.9 L6.2 20.2 L7.6 13.7 L2.7 9.3 L9.2 8.6 Z",
  dot: "M12 7 A5 5 0 1 0 12 17 A5 5 0 1 0 12 7",
  fill: "M6 5 H18 C18.6 5 19 5.4 19 6 V18 C19 18.6 18.6 19 18 19 H6 C5.4 19 5 18.6 5 18 V6 C5 5.4 5.4 5 6 5 Z",
};


/** The tutorial pointing hand (skin fill + sumi outline with knuckles). */
export const HAND = "M10.5 3.2 C10.5 1.4 14.5 1.4 14.5 3.2 V10 C14.5 8.9 17.5 8.9 17.5 10.6 C17.5 9.5 20 9.7 20 11.6 V16 C20 19.6 17.6 22.2 14 22.2 H12.2 C9.4 22.2 7.8 20.8 6.8 18.8 L4.3 14.2 C3.6 12.9 5.2 11.8 6.3 12.9 L8.2 14.8 H10.5 Z";
export const KNUCKLES = "M14.5 10 V12.8 M17.5 10.6 V12.8 M10.5 9.5 V14.6";
/** Stroke weights baked per glyph (any other weight snaps to the nearest). */
export const WEIGHTS = [2.3, 3] as const;
