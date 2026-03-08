/**
 * Scrollable list of detections sorted by confidence.
 * Supports optional top-N limit.
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import type { Detection } from '@/types/detection';
import { Spacing } from '@/constants/theme';

interface DetectionListProps {
  detections: Detection[];
  topN?: number;
  confidenceThreshold: number;
}

export function DetectionList({
  detections,
  topN,
  confidenceThreshold,
}: DetectionListProps): React.ReactElement {
  const filtered = detections
    .filter((d) => d.score >= confidenceThreshold)
    .sort((a, b) => b.score - a.score);

  const display = topN ? filtered.slice(0, topN) : filtered;

  if (display.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No detections</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {display.map((d, i) => {
        const label = typeof d.label === 'string' ? d.label : String(d.label);
        const scorePct = (d.score * 100).toFixed(1);
        return (
          <View key={i} style={styles.row}>
            <Text style={styles.label} numberOfLines={1}>
              {label}
            </Text>
            <Text style={styles.score}>{scorePct}%</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    maxHeight: 120,
  },
  content: {
    paddingVertical: Spacing.one,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  score: {
    color: '#00ff88',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: Spacing.two,
  },
  empty: {
    padding: Spacing.three,
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
  },
});
