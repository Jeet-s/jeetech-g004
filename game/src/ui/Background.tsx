import { Image, StyleSheet, View, useWindowDimensions, type ImageSourcePropType } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { art } from "../art";
import { useSettings } from "../game/meta";

/**
 * Warm cream watercolor paper (bg_paper_main) with a soft vignette — the base of every screen. In the
 * night-studio theme the paper is washed deep indigo with a warm amber lamp glow from the upper left.
 */
export function Background({ image = art.bg_paper_main, children, wash }: { image?: ImageSourcePropType; children?: React.ReactNode; wash?: string }) {
  const { dark } = useSettings();
  const { width, height } = useWindowDimensions();
  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Decoded at the view's size, not the art's 1080x1920 — every screen keeps one of these in memory (Android). */}
      <Image source={image} style={{ position: "absolute", left: 0, top: 0, width, height }} resizeMode="cover" resizeMethod="resize" />
      {wash ? <View style={[StyleSheet.absoluteFill, { backgroundColor: wash }]} /> : null}
      <LinearGradient pointerEvents="none" colors={["rgba(255,255,255,0)", "rgba(120,86,40,0.10)"]} style={StyleSheet.absoluteFill} />
      {dark ? (
        <>
          <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(20,24,48,0.86)" }]} />
          <LinearGradient pointerEvents="none" colors={["rgba(242,179,94,0.28)", "rgba(242,179,94,0)"]} start={{ x: 0, y: 0 }} end={{ x: 0.7, y: 0.6 }} style={StyleSheet.absoluteFill} />
        </>
      ) : null}
      {children}
    </View>
  );
}
