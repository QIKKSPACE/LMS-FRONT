
import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress = 0, height = '10px' }) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  return (
    <div className="relative w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full overflow-hidden shadow-inner">
      {/* Background shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ width: '50%' }}
      />
      
      {/* Progress bar with gradient and animation */}
      <motion.div
        className="relative h-full rounded-full shadow-lg"
        style={{
          height: height,
          background: 'linear-gradient(90deg, #dc2626 0%, #ef4444 50%, #f87171 100%)',
          boxShadow: '0 0 20px rgba(220, 38, 38, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3)'
        }}
        initial={{ width: 0 }}
        animate={{ width: `${clampedProgress}%` }}
        transition={{
          duration: 1.2,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        {/* Glossy overlay effect */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)'
          }}
        />
        
        {/* Animated shine effect */}
        {clampedProgress > 0 && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)'
            }}
            animate={{
              x: ['-100%', '200%']
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 1
            }}
          />
        )}
        
        {/* Pulse effect at the end */}
        {clampedProgress > 0 && (
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default ProgressBar;