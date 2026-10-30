import { Skia, PaintStyle, StrokeCap, StrokeJoin } from "@shopify/react-native-skia";
import type { Puzzle } from "../game/nonogram";
import { paintedColors } from "./paint";

export { mix, paintedColors } from "./paint";

/**
 * Small pictures drawn ONCE on a CPU Skia surface and handed to RN <Image> as PNG data URIs: gallery,
 * map and library thumbnails and the UI glyphs. Hundreds of them would otherwise each need a live Skia
 * canvas (a GPU surface per thumbnail) — this keeps scrolling lists light and battery-friendly.
 */
const cache = new Map<string, string>();
const MAX_CACHE = 700;

function remember(key: string, uri: string): string {
  if (cache.size > MAX_CACHE) cache.delete(cache.keys().next().value as string);
  cache.set(key, uri);
  return uri;
}

/** The picture (or a work in progress when `cells` is given) as a square PNG of `px` pixels; `hue` paints it (paintedColors). */
export function pictureUri(p: Puzzle, px: number, cells?: number[], background = "#FFFBF0", hue?: string): string | null {
  const size = Math.max(8, Math.round(px));
  const key = cells ? "" : `${p.id}:${size}:${background}:${hue ?? ""}`;
  if (key && cache.has(key)) return cache.get(key)!;
  const surface = Skia.Surface.Make(size, size);
  if (!surface) return null;
  const canvas = surface.getCanvas();
  const paint = Skia.Paint();
  paint.setAntiAlias(false);
  paint.setColor(Skia.Color(background));
  canvas.drawRect(Skia.XYWHRect(0, 0, size, size), paint);
  const k = size / Math.max(p.w, p.h);
  const ox = (size - k * p.w) / 2, oy = (size - k * p.h) / 2;
  const colors = p.palette.map((c) => Skia.Color(c));
  const painted = hue && !cells ? paintedColors(p, hue).map((c) => (c ? Skia.Color(c) : null)) : null;
  for (let i = 0; i < p.w * p.h; i++) {
    const v = cells ? (cells[i] > 0 ? cells[i] : 0) : p.solution[i];
    if (!v) continue;
    paint.setColor(painted?.[i] ?? colors[v - 1]);
    const x0 = Math.floor(ox + (i % p.w) * k), y0 = Math.floor(oy + Math.floor(i / p.w) * k);
    const x1 = Math.floor(ox + ((i % p.w) + 1) * k), y1 = Math.floor(oy + (Math.floor(i / p.w) + 1) * k);
    canvas.drawRect(Skia.XYWHRect(x0, y0, Math.max(1, x1 - x0), Math.max(1, y1 - y0)), paint);
  }
  surface.flush();
  const uri = `data:image/png;base64,${surface.makeImageSnapshot().encodeToBase64()}`;
  return key ? remember(key, uri) : uri;
}

/** A 24×24-viewbox glyph rendered white at `px` (tint it with the Image tintColor). */
export function glyphUri(name: string, d: string, filled: boolean, weight: number, px = 96): string | null {
  const key = `g:${name}:${weight}:${px}`;
  if (cache.has(key)) return cache.get(key)!;
  const path = Skia.Path.MakeFromSVGString(d);
  const surface = Skia.Surface.Make(px, px);
  if (!path || !surface) return null;
  const canvas = surface.getCanvas();
  canvas.scale(px / 24, px / 24);
  const paint = Skia.Paint();
  paint.setAntiAlias(true);
  paint.setColor(Skia.Color("#FFFFFF"));
  if (filled) paint.setStyle(PaintStyle.Fill);
  else {
    paint.setStyle(PaintStyle.Stroke);
    paint.setStrokeWidth(weight);
    paint.setStrokeCap(StrokeCap.Round);
    paint.setStrokeJoin(StrokeJoin.Round);
  }
  canvas.drawPath(path, paint);
  surface.flush();
  return remember(key, `data:image/png;base64,${surface.makeImageSnapshot().encodeToBase64()}`);
}
