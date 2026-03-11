/**
 * Card displaying a saved detection result in the Results gallery.
 */

import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import type { SavedResult } from "@/types/detection";
import { formatTimestamp } from "@/utils/time";
import { Spacing } from "@/constants/theme";

interface ResultCardProps {
  result: SavedResult;
}

export function ResultCard({ result }: ResultCardProps): React.ReactElement {
  const summary =
    result.detections.length === 0
      ? "No detections"
      : result.detections
          .slice(0, 3)
          .map(d => `${d.label} ${(d.score * 100).toFixed(0)}%`)
          .join(", ") + (result.detections.length > 3 ? "..." : "");

  return (
    <View style={styles.card}>
      <Image source={{ uri: result.uri }} style={styles.thumbnail} contentFit="cover" />
      <View style={styles.info}>
        <Text style={styles.timestamp}>{formatTimestamp(result.timestamp)}</Text>
        <Text style={styles.summary} numberOfLines={2}>
          {summary}
        </Text>
        <Text style={styles.inference}>{result.inferenceTimeMs} ms</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: Spacing.two,
  },
  thumbnail: {
    width: "100%",
    aspectRatio: 4 / 3,
    backgroundColor: "#333",
  },
  info: {
    padding: Spacing.two,
  },
  timestamp: {
    color: "#888",
    fontSize: 12,
    marginBottom: Spacing.one,
  },
  summary: {
    color: "#fff",
    fontSize: 14,
  },
  inference: {
    color: "#00ff88",
    fontSize: 12,
    marginTop: Spacing.one,
  },
});
