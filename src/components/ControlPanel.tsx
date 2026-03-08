/**
 * Control panel for detection: start/stop, confidence threshold,
 * top-5 toggle, capture result, and stats display.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';

interface ControlPanelProps {
  isDetecting: boolean;
  onToggleDetection: () => void;
  confidenceThreshold: number;
  onConfidenceChange: (value: number) => void;
  top5Only: boolean;
  onTop5Toggle: () => void;
  onCaptureResult: () => void;
  inferenceTimeMs: number | null;
  detectionCount: number;
  isModelReady: boolean;
  modelError: string | null;
}

export function ControlPanel({
  isDetecting,
  onToggleDetection,
  confidenceThreshold,
  onConfidenceChange,
  top5Only,
  onTop5Toggle,
  onCaptureResult,
  inferenceTimeMs,
  detectionCount,
  isModelReady,
  modelError,
}: ControlPanelProps): React.ReactElement {
  return (
    <View style={styles.container}>
      {modelError && (
        <Text style={styles.error} numberOfLines={2}>
          {modelError}
        </Text>
      )}

      <View style={styles.row}>
        <Pressable
          onPress={onToggleDetection}
          disabled={!isModelReady}
          style={({ pressed }) => [
            styles.mainButton,
            isDetecting ? styles.stopButton : styles.startButton,
            !isModelReady && styles.disabled,
            pressed && styles.pressed,
          ]}>
          <Text style={styles.mainButtonText}>
            {isDetecting ? 'Stop Detection' : 'Start Detection'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.stats}>
        <Text style={styles.statText}>
          {inferenceTimeMs != null ? `${inferenceTimeMs} ms` : '—'} inference
        </Text>
        <Text style={styles.statText}>{detectionCount} detections</Text>
      </View>

      <View style={styles.sliderRow}>
        <Text style={styles.label}>Confidence: {(confidenceThreshold * 100).toFixed(0)}%</Text>
        <View style={styles.sliderContainer}>
          <Pressable
            style={styles.sliderBtn}
            onPress={() => onConfidenceChange(Math.max(0.3, confidenceThreshold - 0.1))}>
            <Text style={styles.sliderBtnText}>−</Text>
          </Pressable>
          <View style={styles.sliderTrack}>
            <View
              style={[
                styles.sliderFill,
                { width: `${((confidenceThreshold - 0.3) / 0.6) * 100}%` },
              ]}
            />
          </View>
          <Pressable
            style={styles.sliderBtn}
            onPress={() => onConfidenceChange(Math.min(0.9, confidenceThreshold + 0.1))}>
            <Text style={styles.sliderBtnText}>+</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.row}>
        <Pressable
          onPress={onTop5Toggle}
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
          <Text style={styles.secondaryButtonText}>
            {top5Only ? 'Top 5 only ✓' : 'Show all'}
          </Text>
        </Pressable>
        <Pressable
          onPress={onCaptureResult}
          disabled={detectionCount === 0}
          style={({ pressed }) => [
            styles.secondaryButton,
            detectionCount === 0 && styles.disabled,
            pressed && styles.pressed,
          ]}>
          <Text style={styles.secondaryButtonText}>Capture Result</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'center',
  },
  mainButton: {
    flex: 1,
    paddingVertical: Spacing.three,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#00aa55',
  },
  stopButton: {
    backgroundColor: '#cc3333',
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: Spacing.two,
    borderRadius: 8,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statText: {
    color: '#aaa',
    fontSize: 13,
  },
  sliderRow: {
    gap: Spacing.one,
  },
  label: {
    color: '#fff',
    fontSize: 13,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  sliderBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  sliderTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#00aa55',
    borderRadius: 4,
  },
  error: {
    color: '#ff6b6b',
    fontSize: 12,
    textAlign: 'center',
  },
});
