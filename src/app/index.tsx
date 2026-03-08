/**
 * Home screen: camera preview, object detection, controls.
 */

import { useObjectDetection, SSDLITE_320_MOBILENET_V3_LARGE } from 'react-native-executorch';
import { useRef, useState, useCallback } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CameraPreview } from '@/components/CameraPreview';
import { ControlPanel } from '@/components/ControlPanel';
import { DetectionList } from '@/components/DetectionList';
import { DetectionOverlay } from '@/components/DetectionOverlay';
import { useDetectionLoop } from '@/hooks/useDetectionLoop';
import { addResult } from '@/store/resultsStore';
import type { Detection } from '@/types/detection';
import { Spacing } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PREVIEW_ASPECT = 4 / 3;
const PREVIEW_HEIGHT = SCREEN_WIDTH / PREVIEW_ASPECT;

export default function HomeScreen() {
  const cameraRef = useRef<import('expo-camera').CameraView>(null);

  const [isDetecting, setIsDetecting] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.7);
  const [top5Only, setTop5Only] = useState(false);
  const [latestResult, setLatestResult] = useState<{
    uri: string;
    width: number;
    height: number;
    detections: Detection[];
    inferenceTimeMs: number;
  } | null>(null);

  const detection = useObjectDetection({
    model: SSDLITE_320_MOBILENET_V3_LARGE,
  });

  const onDetectionResult = useCallback(
    (result: { uri: string; width: number; height: number; detections: Detection[]; inferenceTimeMs: number }) => {
      setLatestResult(result);
    },
    []
  );

  useDetectionLoop({
    cameraRef,
    isActive: isDetecting,
    isGenerating: detection.isGenerating,
    forward: detection.forward,
    confidenceThreshold,
    onResult: onDetectionResult,
    onError: (err) => console.warn('Detection error:', err),
  });

  const filteredDetections = latestResult
    ? latestResult.detections.filter((d) => d.score >= confidenceThreshold)
    : [];
  const displayDetections = top5Only ? filteredDetections.slice(0, 5) : filteredDetections;

  const handleCaptureResult = useCallback(() => {
    if (!latestResult) return;
    addResult({
      uri: latestResult.uri,
      timestamp: Date.now(),
      detections: latestResult.detections,
      inferenceTimeMs: latestResult.inferenceTimeMs,
    });
  }, [latestResult]);

  const modelError = detection.error?.message ?? null;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={[styles.previewContainer, { height: PREVIEW_HEIGHT }]}>
          <CameraPreview ref={cameraRef} style={StyleSheet.absoluteFill} />
          {latestResult && (
            <>
              <Image
                source={{ uri: latestResult.uri }}
                style={[StyleSheet.absoluteFill, styles.overlayImage]}
                contentFit="fill"
              />
              <DetectionOverlay
                detections={displayDetections}
                imageWidth={latestResult.width}
                imageHeight={latestResult.height}
                displayWidth={SCREEN_WIDTH}
                displayHeight={PREVIEW_HEIGHT}
              />
            </>
          )}
        </View>

        <View style={styles.bottom}>
          <View style={styles.detectionList}>
            <DetectionList
              detections={filteredDetections}
              topN={top5Only ? 5 : undefined}
              confidenceThreshold={confidenceThreshold}
            />
          </View>
          <ControlPanel
            isDetecting={isDetecting}
            onToggleDetection={() => setIsDetecting((v) => !v)}
            confidenceThreshold={confidenceThreshold}
            onConfidenceChange={setConfidenceThreshold}
            top5Only={top5Only}
            onTop5Toggle={() => setTop5Only((v) => !v)}
            onCaptureResult={handleCaptureResult}
            inferenceTimeMs={latestResult?.inferenceTimeMs ?? null}
            detectionCount={filteredDetections.length}
            isModelReady={detection.isReady}
            modelError={modelError}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
  },
  previewContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  overlayImage: {
    backgroundColor: 'transparent',
  },
  bottom: {
    flex: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  detectionList: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: Spacing.two,
    maxHeight: 140,
  },
});
