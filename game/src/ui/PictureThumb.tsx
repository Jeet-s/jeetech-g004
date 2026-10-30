import { useMemo } from "react";
import { Image, PixelRatio, View } from "react-native";
import type { Puzzle } from "../game/nonogram";
import { pictureUri } from "./raster";
import { palette } from "./theme";

/**
 * A finished picture as a tiny painting (gallery, map nodes, library, board corner). `cells` draws a work in
 * progress instead of the solution (ink only). Rendered once to a cached PNG — no live canvas per thumbnail.
 */
export function PictureThumb({ puzzle, size, cells, background = palette.paper, hidden, hue }: {
  puzzle: Puzzle; size: number; cells?: number[]; background?: string; hidden?: boolean;
  /** Paint the finished picture (inked outlines + colour wash, see paintedColors) instead of a flat silhouette. */
  hue?: string;
}) {
  const px = Math.round(size * Math.min(3, PixelRatio.get()));
  const uri = useMemo(() => (hidden ? null : pictureUri(puzzle, px, cells, background, hue)), [puzzle, px, cells, background, hidden, hue]);
  if (!uri) return <View style={{ width: size, height: size, backgroundColor: background }} />;
  return <Image source={{ uri }} style={{ width: size, height: size }} fadeDuration={0} />;
}
