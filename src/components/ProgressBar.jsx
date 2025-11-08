/**
 * ProgressBar Component
 * 
 * React Native Conversion Notes:
 * - Replace <div> with <View> from react-native
 * - Replace className with style prop
 * - Use StyleSheet.create() for styles
 * - width: `${progress}%` becomes style={{ width: `${progress}%` }}
 * - backgroundColor, height, borderRadius all translate directly
 */
import React from 'react';

const ProgressBar = ({ progress = 0, height = '8px' }) => {
  return (
    <div className="w-full bg-gray-200/60 rounded-full overflow-hidden shadow-inner">
      <div
        className="bg-gradient-to-r from-red-600 to-red-700 h-full rounded-full transition-all duration-500 ease-out shadow-lg shadow-red-500/30"
        style={{
          width: `${Math.min(100, Math.max(0, progress))}%`,
          height: height,
        }}
      />
    </div>
  );
};

export default ProgressBar;

