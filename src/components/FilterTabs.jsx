
import React from 'react';
import { motion } from 'framer-motion';

const FilterTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="relative flex flex-row overflow-x-auto px-4 py-4 gap-3 hide-scrollbar">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-50/30 to-transparent pointer-events-none" />
      
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;
        return (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="relative px-6 py-3 rounded-2xl whitespace-nowrap font-semibold text-sm overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: isActive ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Active state background */}
            {isActive ? (
              <>
                {/* Gradient background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-600 via-rose-600 to-red-700"
                  layoutId="activeTab"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30
                  }}
                />
                
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(220, 38, 38, 0.4)',
                      '0 0 30px rgba(220, 38, 38, 0.6)',
                      '0 0 20px rgba(220, 38, 38, 0.4)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Text */}
                <span className="relative z-10 text-white drop-shadow-sm">
                  {tab.label}
                </span>
              </>
            ) : (
              <>
                {/* Inactive state background */}
                <div className="absolute inset-0 bg-white/90 backdrop-blur-md border-2 border-gray-200/80 rounded-2xl" />
                
                {/* Hover gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-50/0 via-red-50/50 to-red-50/0 rounded-2xl opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Text */}
                <span className="relative z-10 text-gray-700 group-hover:text-red-600 transition-colors">
                  {tab.label}
                </span>
              </>
            )}
            
            {/* Active indicator dot */}
            {isActive && (
              <motion.div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10
                }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default FilterTabs;