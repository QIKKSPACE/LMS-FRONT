import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Close } from '@mui/icons-material';
import logo from '../assets/logo.png';

const SearchBar = ({ value, onChange, onClear, placeholder = "Search courses..." }) => {
  return (
    <motion.div
      className="relative w-full"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search style={{ fontSize: '22px', color: '#dc2626' }} />
      </div>

      {/* Search Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-20 py-3 bg-white/95 backdrop-blur-sm border-2 border-gray-200/80 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 shadow-sm hover:shadow-md"
      />

      {/* Search Icon Button (Right Side) */}
      <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
        <motion.div
          className="w-10 h-10 bg-gradient-to-br from-red-600 to-rose-600 rounded-full flex items-center justify-center shadow-md cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Search style={{ fontSize: '20px', color: 'white' }} />
        </motion.div>
      </div>

      {/* Clear Button */}
      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={onClear}
            className="absolute inset-y-0 right-16 flex items-center text-gray-400 hover:text-red-600 transition-colors z-10"
            aria-label="Clear search"
          >
            <Close style={{ fontSize: '20px' }} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Animated border glow on focus */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }}
        whileFocus={{ opacity: 1 }}
        style={{
          boxShadow: '0 0 0 3px rgba(220, 38, 38, 0.1)'
        }}
      />
    </motion.div>
  );
};

export default SearchBar;