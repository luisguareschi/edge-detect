/**
 * Detection types for on-device object detection.
 * Aligned with react-native-executorch Detection output.
 */

/** Bounding box coordinates (model output space, typically 320x320) */
export interface Bbox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** Raw detection from the model */
export interface Detection {
  bbox: Bbox;
  label: string;
  score: number;
}

/** Detection with bbox scaled to display/image coordinates */
export interface ScaledDetection extends Detection {
  bbox: Bbox;
}

/** Saved result for the Results gallery */
export interface SavedResult {
  id: string;
  uri: string;
  timestamp: number;
  detections: Detection[];
  inferenceTimeMs: number;
}
