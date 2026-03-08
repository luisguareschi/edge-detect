/**
 * Overlay that draws bounding boxes and labels over the detected image.
 * Boxes are positioned using scaled detection coordinates.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { Detection } from '@/types/detection';

interface DetectionOverlayProps {
  detections: Detection[];
  imageWidth: number;
  imageHeight: number;
  /** Width/height of the displayed overlay container (for scaling) */
  displayWidth: number;
  displayHeight: number;
}

export function DetectionOverlay({
  detections,
  imageWidth,
  imageHeight,
  displayWidth,
  displayHeight,
}: DetectionOverlayProps): React.ReactElement | null {
  if (detections.length === 0) return null;

  const scaleX = displayWidth / imageWidth;
  const scaleY = displayHeight / imageHeight;

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]} pointerEvents="none">
      {detections.map((d, i) => {
        const left = d.bbox.x1 * scaleX;
        const top = d.bbox.y1 * scaleY;
        const width = (d.bbox.x2 - d.bbox.x1) * scaleX;
        const height = (d.bbox.y2 - d.bbox.y1) * scaleY;

        const label = typeof d.label === 'string' ? d.label : String(d.label);
        const scoreText = (d.score * 100).toFixed(0);

        return (
          <View key={i} style={[styles.box, { left, top, width, height }]}>
            <View style={styles.labelBg}>
              <Text style={styles.label} numberOfLines={1}>
                {label} {scoreText}%
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  box: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#00ff88',
    backgroundColor: 'transparent',
  },
  labelBg: {
    position: 'absolute',
    top: -20,
    left: 0,
    backgroundColor: '#00ff88',
    paddingHorizontal: 6,
    paddingVertical: 2,
    maxWidth: 200,
  },
  label: {
    color: '#000',
    fontSize: 11,
    fontWeight: '600',
  },
});
