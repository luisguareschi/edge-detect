/**
 * Polling hook for periodic camera capture and object detection.
 * Captures a frame every 700-1000ms, runs inference, and reports results.
 * Skips capture when inference is already running to avoid queue buildup.
 */

import type { CameraView } from 'expo-camera';
import { useCallback, useEffect, useRef } from 'react';

import type { Detection } from '@/types/detection';
import { now } from '@/utils/time';

const POLL_INTERVAL_MS = 100;
const CAPTURE_QUALITY = 0.4;

export interface DetectionResult {
  uri: string;
  width: number;
  height: number;
  detections: Detection[];
  inferenceTimeMs: number;
}

interface UseDetectionLoopOptions {
  cameraRef: React.RefObject<CameraView | null>;
  isActive: boolean;
  isGenerating: boolean;
  forward: (imageSource: string, detectionThreshold?: number) => Promise<Detection[]>;
  confidenceThreshold: number;
  onResult: (result: DetectionResult) => void;
  onError?: (error: Error) => void;
}

export function useDetectionLoop({
  cameraRef,
  isActive,
  isGenerating,
  forward,
  confidenceThreshold,
  onResult,
  onError,
}: UseDetectionLoopOptions): void {
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);
  onResultRef.current = onResult;
  onErrorRef.current = onError;

  const tick = useCallback(async () => {
    if (isGenerating) return;
    const camera = cameraRef.current;
    if (!camera?.takePictureAsync) return;

    try {
      const photo = await camera.takePictureAsync({
        quality: CAPTURE_QUALITY,
        skipProcessing: true,
        shutterSound: false,
      });

      if (!photo?.uri) return;
      const width = photo.width ?? 1920;
      const height = photo.height ?? 1080;

      const t0 = now();
      const rawDetections = await forward(photo.uri, confidenceThreshold);
      const inferenceTimeMs = now() - t0;

      if (__DEV__) {
        console.log(`[DetectionLoop] inference ${inferenceTimeMs}ms, ${rawDetections.length} detections`);
      }

      onResultRef.current({
        uri: photo.uri,
        width,
        height,
        detections: rawDetections as Detection[],
        inferenceTimeMs,
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      onErrorRef.current?.(error);
      if (__DEV__) {
        console.warn('[DetectionLoop] error:', error);
      }
    }
  }, [cameraRef, isGenerating, forward, confidenceThreshold]);

  useEffect(() => {
    if (!isActive) return;

    const id = setInterval(tick, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isActive, tick]);
}
