# Edge Detect

A polished Expo React Native app for **near real-time on-device object detection** using `react-native-executorch` and `expo-camera`. Built for a university deep learning assignment.

## Features

- Live camera preview with back camera
- Periodic frame capture (every ~850 ms) for object detection
- On-device inference with SSDLite MobileNetV3 Large (COCO 91 classes)
- Bounding boxes, labels, and confidence scores over the latest captured frame
- Confidence threshold slider (0.3–0.9)
- Top 5 detections toggle
- Capture Result to save snapshots to a gallery
- Results screen with saved detection history
- About screen explaining on-device inference

## Requirements

- **Custom Expo dev build** (Expo Go will **not** work—native modules required)
- iOS device or simulator (release builds may require a real device)
- Node.js 18+

## Install

```bash
yarn install
```

## Run

### iOS (custom dev build)

```bash
yarn ios:device # To test on a real device
yarn ios # To test on a simulator
```

This builds a development client with native modules. Use a connected iPhone or iOS Simulator.


### Why not Expo Go?

This app uses `react-native-executorch`, which depends on native C++ code (ExecuTorch runtime) and native modules. Expo Go is a pre-built sandbox that does not include these modules. You must create a **custom development build** that bundles the native code. Use `npx expo run:ios` or `eas build --profile development` to generate a dev build.

## Project Structure

```
src/
├── app/
│   ├── _layout.tsx      # Tab layout, dark theme
│   ├── index.tsx        # Home screen (camera + detection)
│   ├── results.tsx      # Saved results gallery
│   └── about.tsx        # About / explanation
├── components/
│   ├── CameraPreview.tsx
│   ├── DetectionOverlay.tsx
│   ├── DetectionList.tsx
│   ├── ControlPanel.tsx
│   └── ResultCard.tsx
├── hooks/
│   └── useDetectionLoop.ts
├── store/
│   └── resultsStore.ts
├── types/
│   └── detection.ts
└── utils/
    ├── scaleDetections.ts
    └── time.ts
```

## Near Real-Time Sampling Approach

Instead of running inference on every camera frame (which would overwhelm the device), the app:

1. Captures a still image from the camera every **X ms**
2. Runs object detection on that image
3. Skips capture if inference is already in progress (no queue buildup)
4. Displays the latest result with bounding boxes over the captured frame

This gives a responsive “near real-time” feel while keeping inference load manageable and avoiding race conditions.

## Model: SSDLite 320 MobileNetV3 Large

- **Size:** ~13.9 MB
- **Input:** 320×320 pixels
- **Output:** Bounding boxes, COCO class labels, confidence scores
- **Inference time:** ~100–280 ms on modern phones (iPhone 13 Pro, Galaxy S24, etc.)

This model was chosen because it is:

- **Lightweight:** Small enough to bundle in a mobile app
- **Fast:** Runs efficiently on CPU (XNNPACK) without requiring a GPU
- **Mobile-friendly:** Designed for edge deployment
- **Accurate enough:** Good balance of speed vs. accuracy for common objects

---

## Report Notes (for assignment)

### On-device inference

All object detection runs locally on the device. No images or data are sent to a server. The neural network model is stored on the device and executes using the device’s CPU (via XNNPACK). This keeps user data private and allows offline use.

### Object detection

Object detection identifies and locates objects in an image. For each detection, the model outputs a bounding box (rectangle), a class label (e.g. person, car, dog), and a confidence score. This app uses a model trained on the COCO dataset (91 classes).

### Near real-time sampling

The app does not run inference on every camera frame. It captures a still image every ~850 ms, runs detection on that image, and displays the result. If inference is still running when the next tick occurs, the capture is skipped. This avoids overloading the device and keeps the UI responsive.

### Model choice

SSDLite with MobileNetV3 Large was chosen because it is small (~14 MB), fast (~100–280 ms per image), and runs efficiently on mobile CPUs. Heavier models would be too slow for near real-time use or would require cloud inference.
