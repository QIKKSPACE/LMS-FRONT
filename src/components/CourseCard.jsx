/**
 * Enhanced CourseCard Component with Premium UI
 */
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Event, Star, TrendingUp } from '@mui/icons-material';
import ProgressBar from './ProgressBar';
import { formatExpiryDate, getDaysUntilExpiry } from '../utils/courseExpiry';

const CourseCard = ({
  courseId,
  title,
  membershipType,
  thumbnail,
  status,
  progress,
  chapters,
  isPurchased,
  price,
  showStatus = true,
  expiryDate,
  onCourseClick,
}) => {
  const handleCardClick = () => {
    if (onCourseClick) {
      onCourseClick(courseId);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    hover: {
      y: -12,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.15,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const glowVariants = {
    hover: {
      boxShadow: "0 20px 60px rgba(220, 38, 38, 0.4), 0 0 40px rgba(220, 38, 38, 0.2)",
      transition: {
        duration: 0.3
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-gradient-to-r from-green-500 to-emerald-600';
      case 'IN_PROGRESS':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600';
      case 'EXPIRED':
        return 'bg-gradient-to-r from-red-500 to-rose-600';
      case 'PAID':
        return 'bg-gradient-to-r from-purple-500 to-pink-600';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-600';
    }
  };

  const CardContent = (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={onCourseClick ? "hover" : undefined}
      className={`group relative bg-white rounded-3xl overflow-hidden mb-6 ${
        onCourseClick ? 'cursor-pointer' : ''
      }`}
      style={{
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)"
      }}
      onClick={onCourseClick ? handleCardClick : undefined}
    >
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-transparent to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Thumbnail Section with Enhanced Overlay */}
      <motion.div 
        className="relative h-60 overflow-hidden"
        variants={glowVariants}
      >
        <motion.img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover"
          variants={imageVariants}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Floating Badge */}
        {!isPurchased && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-1"
          >
            <Star style={{ fontSize: '14px' }} />
            <span>New</span>
          </motion.div>
        )}

        {/* Chapter Count Badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md text-gray-800 px-4 py-2 rounded-full text-xs font-bold shadow-xl"
        >
          📚 {chapters} Chapters
        </motion.div>
      </motion.div>

      {/* Content Section */}
      <motion.div 
        className="p-6 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {/* Membership Badge */}
        <div className="flex items-center gap-2 mb-3">
          <div className="px-3 py-1 bg-gradient-to-r from-red-100 to-rose-100 text-red-700 rounded-full text-xs font-semibold">
            {membershipType}
          </div>
          {isPurchased && progress > 0 && progress < 100 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-xs font-semibold flex items-center gap-1"
            >
              <TrendingUp style={{ fontSize: '12px' }} />
              <span>In Progress</span>
            </motion.div>
          )}
        </div>

        {/* Title and Status */}
        <div className={`flex items-start justify-between ${showStatus ? 'mb-4' : 'mb-3'}`}>
          <motion.h2 
            className="text-xl font-extrabold text-gray-900 flex-1 mr-3 leading-tight group-hover:text-red-600 transition-colors duration-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {title}
          </motion.h2>
          {showStatus && (
            <motion.span
              className={`${getStatusColor(status)} text-white text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap shadow-md`}
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              {status}
            </motion.span>
          )}
        </div>

        {/* Progress Section with Enhanced Styling */}
        {isPurchased && (
          <motion.div 
            className="mb-4"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '100%' }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1">
                <ProgressBar progress={progress} height="10px" />
              </div>
              {progress !== undefined && (
                <motion.span 
                  className="text-base font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent whitespace-nowrap"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                >
                  {progress}%
                </motion.span>
              )}
            </div>
            <p className="text-xs text-gray-500 font-medium">
              {progress === 100 ? 'Course Completed! 🎉' : `${Math.floor(progress)}% completed - Keep going!`}
            </p>
          </motion.div>
        )}

        {/* Expiry Information with Icon */}
        {isPurchased && expiryDate && status !== 'COMPLETED' && (
          <motion.div 
            className={`flex items-center gap-2 px-4 py-3 rounded-xl mb-3 ${
              status === 'EXPIRED' 
                ? 'bg-red-50 border border-red-200' 
                : getDaysUntilExpiry(expiryDate) <= 7 
                  ? 'bg-amber-50 border border-amber-200'
                  : 'bg-blue-50 border border-blue-200'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Event style={{ 
              fontSize: '18px', 
              color: status === 'EXPIRED' 
                ? '#dc2626' 
                : getDaysUntilExpiry(expiryDate) <= 7 
                  ? '#f59e0b'
                  : '#3b82f6'
            }} />
            <span className={`text-xs font-semibold ${
              status === 'EXPIRED' 
                ? 'text-red-700' 
                : getDaysUntilExpiry(expiryDate) <= 7 
                  ? 'text-amber-700'
                  : 'text-blue-700'
            }`}>
              {status === 'EXPIRED' 
                ? `Expired on ${formatExpiryDate(expiryDate)}`
                : (() => {
                    const daysLeft = getDaysUntilExpiry(expiryDate);
                    if (daysLeft !== null) {
                      if (daysLeft < 0) {
                        return `Expired`;
                      } else if (daysLeft === 0) {
                        return `⚠️ Expires today!`;
                      } else if (daysLeft <= 7) {
                        return `⏰ ${daysLeft} day${daysLeft > 1 ? 's' : ''} remaining`;
                      } else {
                        return `Valid until ${formatExpiryDate(expiryDate)}`;
                      }
                    }
                    return `Valid until ${formatExpiryDate(expiryDate)}`;
                  })()
              }
            </span>
          </motion.div>
        )}

        {/* Enhanced Buy Button */}
        {!isPurchased && (
          <motion.div 
            className="flex items-center justify-between pt-4 border-t border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col"
            >
              <span className="text-xs text-gray-500 font-medium mb-1">Price</span>
              <span className="text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                ₹{price}
              </span>
            </motion.div>
            <motion.button 
              className="relative bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white px-7 py-3.5 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg overflow-hidden group"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(220, 38, 38, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
            >
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <ShoppingCart style={{ fontSize: '18px' }} className="relative z-10" />
              <span className="relative z-10">Buy Now</span>
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Hover Border Effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-red-200 transition-colors duration-500 pointer-events-none"
      />
    </motion.div>
  );

  return CardContent;
};

export default CourseCard;