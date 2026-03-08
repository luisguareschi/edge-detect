/**
 * Scales bounding box coordinates from model input space (320x320)
 * to the actual image dimensions.
 */

import type { Detection, ScaledDetection } from '@/types/detection';

const MODEL_INPUT_SIZE = 320;

/**
 * Scale detections from model output coordinates (320x320) to image coordinates.
 * The model resizes input to 320x320, so bbox is in that space.
 */
export function scaleDetectionsToImage(
  detections: Detection[],
  modelInputSize: number,
  imageWidth: number,
  imageHeight: number
): ScaledDetection[] {
  const scaleX = imageWidth / modelInputSize;
  const scaleY = imageHeight / modelInputSize;

  return detections.map((d) => ({
    ...d,
    bbox: {
      x1: d.bbox.x1 * scaleX,
      y1: d.bbox.y1 * scaleY,
      x2: d.bbox.x2 * scaleX,
      y2: d.bbox.y2 * scaleY,
    },
  }));
}

export { MODEL_INPUT_SIZE };
