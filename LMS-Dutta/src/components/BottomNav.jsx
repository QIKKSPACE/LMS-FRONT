import React from 'react';
import { motion } from 'framer-motion';
import { Home, MenuBook, Person, VideoCall } from '@mui/icons-material';

const BottomNav = ({ activeTab, onTabChange }) => {
  const iconColor = 'rgb(220, 38, 38)';
  
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'mycourse', label: 'My Course', icon: MenuBook },
    { id: 'livesession', label: 'Live', icon: VideoCall },
    { id: 'profile', label: 'Profile', icon: Person },
  ];

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {/* Backdrop blur container */}
      <div className="relative bg-white/95 backdrop-blur-2xl border-t border-gray-200/50 shadow-2xl">
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
        
        {/* Navigation items */}
        <div className="flex flex-row justify-around items-center py-2 px-2">
          {navItems.map((item, index) => {
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="relative flex flex-col items-center justify-center py-2 px-3 min-w-[70px] rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {/* Active background */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl"
                    layoutId="activeNavBg"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30
                    }}
                  />
                )}
                
                {/* Icon container with animation */}
                <motion.div
                  className="relative z-10 mb-1"
                  animate={{
                    y: isActive ? [-2, 0, -2] : 0,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: isActive ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  {/* Glow effect for active icon */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 blur-lg opacity-30"
                      animate={{
                        scale: [1, 1.3, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{ backgroundColor: iconColor }}
                    />
                  )}
                  
                  {React.createElement(item.icon, { 
                    style: { 
                      color: isActive ? iconColor : 'rgb(107, 114, 128)', 
                      fontSize: '26px',
                      filter: isActive ? 'drop-shadow(0 2px 4px rgba(220, 38, 38, 0.3))' : 'none'
                    },
                    className: "relative transition-all duration-300"
                  })}
                </motion.div>

                {/* Label with animation */}
                <motion.span
                  className={`relative z-10 text-[11px] font-bold transition-all duration-300 ${
                    isActive ? 'text-red-600' : 'text-gray-500'
                  }`}
                  animate={{
                    scale: isActive ? [1, 1.05, 1] : 1,
                  }}
                  transition={{
                    duration: 0.3
                  }}
                >
                  {item.label}
                </motion.span>
              </motion.button>
            );
          })}
        </div>
        
        {/* Bottom safe area spacer for devices with home indicator */}
        <div className="h-safe-area-inset-bottom" />
      </div>
    </motion.div>
  );
};

export default BottomNav;