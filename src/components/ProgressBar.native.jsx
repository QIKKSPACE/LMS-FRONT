 import React from 'react';
import { View, StyleSheet } from 'react-native';

const ProgressBarNative = ({ progress = 0, height = 2 }) => {
  const styles = StyleSheet.create({
    container: {
      width: '100%',
      backgroundColor: '#E5E7EB',
      borderRadius: 9999,
      overflow: 'hidden',
    },
    bar: {
      height: height,
      borderRadius: 9999,
      backgroundColor: '#DC2626', // primary color
    },
  });

  const progressWidth = Math.min(100, Math.max(0, progress));

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.bar,
          {
            width: `${progressWidth}%`,
          },
        ]}
      />
    </View>
  );
};

export default ProgressBarNative;

