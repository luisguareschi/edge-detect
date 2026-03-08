/**
 * Results screen: gallery of saved detection snapshots.
 */

import React, { useState, useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { ResultCard } from '@/components/ResultCard';
import { getResults } from '@/store/resultsStore';
import { Spacing } from '@/constants/theme';

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
  );
}

const styles = StyleSheet.create({
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
