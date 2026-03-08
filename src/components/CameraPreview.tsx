/**
 * Camera preview component with permission handling.
 * Uses back camera and forwards ref for takePictureAsync.
 */

import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { forwardRef, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';

export const CameraPreview = forwardRef<CameraView, { style?: object }>(function CameraPreview(
  { style },
  ref
) {
  const [permission, requestPermission] = useCameraPermissions();
  const [lenses, setLenses] = useState<string[]>([]);
  const [selectedLens, setSelectedLens] = useState<string>();

  console.log(lenses);

  useEffect(() => {
    if (lenses.length > 0 && !selectedLens) {
      setSelectedLens(lenses[lenses.length - 1]);
    }
  }, [lenses, selectedLens]);

  if (!permission) {
    return (
      <View style={[styles.centered, style]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.centered, style]}>
        <Text style={styles.message}>Camera access is required for object detection.</Text>
        <Text style={styles.hint}>Tap below to grant permission.</Text>
        <Pressable onPress={requestPermission} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <CameraView
      ref={ref}
      style={[styles.camera, style]}
      facing="back"
      zoom={0}
      selectedLens={selectedLens ?? undefined}
      onAvailableLensesChanged={(e) => setLenses(e.lenses)}
    />
  );
});

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: Spacing.four,
  },
  message: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: Spacing.two,
  },
  hint: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: Spacing.four,
  },
  button: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: 8,
    backgroundColor: '#0a84ff',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
