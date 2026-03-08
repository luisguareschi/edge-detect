/**
 * About screen: explains on-device inference and the app.
 */

import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>About Edge Detect</Text>

        <Text style={styles.sectionTitle}>On-device inference</Text>
        <Text style={styles.paragraph}>
          All object detection runs locally on your device. No images or data are sent to the cloud.
          The neural network model is stored on the device and executes using the device&apos;s CPU/GPU,
          keeping your data private and enabling offline use.
        </Text>

        <Text style={styles.sectionTitle}>Object detection</Text>
        <Text style={styles.paragraph}>
          Object detection is a computer vision task that identifies and locates objects within an
          image. For each detection, the model outputs a bounding box (rectangle around the object),
          a class label (e.g. person, car, dog), and a confidence score. This app uses a model
          trained on the COCO dataset, which recognizes 91 common object categories.
        </Text>

        <Text style={styles.sectionTitle}>Why a lightweight mobile model?</Text>
        <Text style={styles.paragraph}>
          We use SSDLite with MobileNetV3 Large—a model designed for mobile and edge devices. It
          is small (~14 MB), fast (~100–280 ms per image on modern phones), and runs efficiently
          without specialized hardware. Heavier models would be too slow or require cloud
          inference, which would defeat the purpose of on-device, real-time detection.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: Spacing.four,
    paddingBottom: Spacing.six,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: Spacing.four,
  },
  sectionTitle: {
    color: '#00ff88',
    fontSize: 16,
    fontWeight: '600',
    marginTop: Spacing.three,
    marginBottom: Spacing.one,
  },
  paragraph: {
    color: '#ccc',
    fontSize: 15,
    lineHeight: 22,
  },
});
