// src/features/subtitleCrowdsourcing/SubtitleForm.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SubtitleForm = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sous-titres Communautaires</Text>
      <Text>Contribuez à la communauté en ajoutant des sous-titres</Text>
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

export default SubtitleForm;