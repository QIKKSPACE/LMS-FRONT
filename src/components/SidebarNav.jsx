import React from 'react';
import { motion } from 'framer-motion';
import { Home, MenuBook, Person, Logout, VideoCall } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const SidebarNav = ({ activeTab, onTabChange }) => {
  const { logout, user } = useAuth();
  const iconColor = 'rgb(220, 38, 38)';
  
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'mycourse', label: 'My Course', icon: MenuBook },
    { id: 'livesession', label: 'Live Session', icon: VideoCall },
    { id: 'profile', label: 'Profile', icon: Person },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <motion.div 
      className="hidden lg:flex fixed left-0 top-0 h-screen w-72 bg-white/95 backdrop-blur-2xl border-r border-gray-200/50 flex-col z-40 shadow-2xl"
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-transparent to-purple-50/30 pointer-events-none" />
      
      {/* Header with logo */}
      <motion.div 
        className="relative border-b border-gray-200/50 bg-gradient-to-br from-white/90 to-white/70 px-6 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center space-x-4">
          {/* Animated logo container */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-rose-600 to-red-700 rounded-2xl blur-lg opacity-30" />
            <img 
              src={logo} 
              alt="Logo" 
              className="relative h-14 w-14 object-contain flex-shrink-0 rounded-2xl shadow-lg"
            />
          </motion.div>
          
          <div className="flex-1 min-w-0 overflow-hidden">
            <motion.h1 
              className="text-sm font-extrabold bg-gradient-to-r from-gray-900 via-red-800 to-gray-900 bg-clip-text text-transparent leading-tight mb-1"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Spiritual Talk Foundation
            </motion.h1>
            <motion.p 
              className="text-[11px] text-gray-600 leading-tight font-semibold"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Learning Management System
            </motion.p>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <motion.div
            className="mt-4 pt-4 border-t border-gray-200/50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-rose-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
      
      {/* Navigation Items */}
      <div className="relative flex flex-col px-4 py-8 flex-1 overflow-y-auto">
        {navItems.map((item, index) => {
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="relative flex flex-row items-center py-4 px-5 rounded-2xl mb-3 transition-all duration-300 group overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Active background with gradient */}
              {isActive ? (
                <>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-2xl"
                    layoutId="activeSidebarBg"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30
                    }}
                  />
                  
                  {/* Animated shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{
                      x: ['-100%', '200%']
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(220, 38, 38, 0.3)',
                        '0 0 30px rgba(220, 38, 38, 0.5)',
                        '0 0 20px rgba(220, 38, 38, 0.3)'
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </>
              ) : (
                <motion.div
                  className="absolute inset-0 bg-gray-100/50 rounded-2xl opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.2 }}
                />
              )}
              
              {/* Icon with animation */}
              <motion.div
                className="relative z-10 mr-4"
                animate={{
                  scale: isActive ? [1, 1.1, 1] : 1,
                  rotate: isActive ? [0, -5, 5, 0] : 0
                }}
                transition={{
                  duration: 2,
                  repeat: isActive ? Infinity : 0,
                  ease: "easeInOut"
                }}
              >
                {React.createElement(item.icon, { 
                  style: { 
                    color: isActive ? 'white' : iconColor, 
                    fontSize: '22px',
                    filter: isActive ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))' : 'none'
                  }
                })}
              </motion.div>
              
              {/* Label */}
              <span className={`relative z-10 font-bold text-base ${
                isActive ? 'text-white' : 'text-gray-700 group-hover:text-red-600'
              } transition-colors duration-300`}>
                {item.label}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg"
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
      
      {/* Logout Button with enhanced styling */}
      <motion.div 
        className="relative px-4 pb-6 mt-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={handleLogout}
          className="relative flex flex-row items-center py-4 px-5 rounded-2xl w-full transition-all duration-300 group overflow-hidden border-2 border-red-200/50"
          whileHover={{ scale: 1.02, borderColor: 'rgb(220, 38, 38)' }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Hover background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl opacity-0 group-hover:opacity-100"
            transition={{ duration: 0.3 }}
          />
          
          {/* Icon */}
          <motion.div
            className="relative z-10 mr-4"
            whileHover={{ rotate: 15 }}
            transition={{ duration: 0.3 }}
          >
            {React.createElement(Logout, { 
              style: { color: iconColor, fontSize: '22px' }
            })}
          </motion.div>
          
          {/* Label */}
          <span className="relative z-10 font-bold text-base text-gray-700 group-hover:text-red-600 transition-colors duration-300">
            Logout
          </span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default SidebarNav;