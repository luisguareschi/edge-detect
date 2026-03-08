/**
 * Results screen: gallery of saved detection snapshots.
 */

import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { ResultCard } from '@/components/ResultCard';
import { Spacing } from '@/constants/theme';
import { getResults } from '@/store/resultsStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResultsScreen() {
  const [results, setResults] = useState(getResults());

  useFocusEffect(
    useCallback(() => {
      setResults(getResults());
    }, [])
  );

  if (results.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>No results yet</Text>
        <Text style={styles.emptyText}>
          Start detection on the Home screen and tap &quot;Capture Result&quot; to save snapshots here.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container]}>
        <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ResultCard result={item} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => setResults(getResults())}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  list: {
    padding: Spacing.three,
    paddingBottom: Spacing.six,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.five,
    backgroundColor: '#000',
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.two,
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
});
