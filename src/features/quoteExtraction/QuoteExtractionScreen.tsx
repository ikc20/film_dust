import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const QuoteExtractionScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Extraction de Citations</Text>
      <Text>Fonctionnalité à venir - Extrayez vos citations préférées des films</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default QuoteExtractionScreen;