/**
 * Optimized CourseCard Component - Reduced animations for performance
 */
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Event, Star, TrendingUp } from '@mui/icons-material';
import ProgressBar from './ProgressBar';
import { formatExpiryDate, getDaysUntilExpiry } from '../utils/courseExpiry';

// OPTIMIZATION: Memoize component to prevent unnecessary re-renders
const CourseCard = memo(({
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
  const handleCardClick = React.useCallback(() => {
    if (onCourseClick) {
      onCourseClick(courseId);
    }
  }, [courseId, onCourseClick]);

  // OPTIMIZATION: Simplified animations
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
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

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={onCourseClick ? { y: -8 } : undefined}
      className={`group relative bg-white rounded-3xl overflow-hidden mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300 ${
        onCourseClick ? 'cursor-pointer' : ''
      }`}
      onClick={onCourseClick ? handleCardClick : undefined}
    >
      {/* Thumbnail Section */}
      <div className="relative h-48 sm:h-52 md:h-60 overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {!isPurchased && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
            <Star style={{ fontSize: '14px' }} />
            <span>New</span>
          </div>
        )}

        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md text-gray-800 px-4 py-2 rounded-full text-xs font-bold shadow-xl">
          📚 {chapters} Chapters
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 sm:p-6">
        {/* Membership Badge */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <div className="px-3 py-1 bg-gradient-to-r from-red-100 to-rose-100 text-red-700 rounded-full text-xs font-semibold">
            {membershipType}
          </div>
          {isPurchased && progress > 0 && progress < 100 && (
            <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-xs font-semibold flex items-center gap-1">
              <TrendingUp style={{ fontSize: '12px' }} />
              <span>In Progress</span>
            </div>
          )}
        </div>

        {/* Title and Status */}
        <div className={`flex items-start justify-between gap-3 ${showStatus ? 'mb-4' : 'mb-3'}`}>
          <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 flex-1 leading-tight group-hover:text-red-600 transition-colors duration-300">
            {title}
          </h2>
          {showStatus && (
            <span className={`${getStatusColor(status)} text-white text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap shadow-md`}>
              {status}
            </span>
          )}
        </div>

        {/* Progress Section */}
        {isPurchased && (
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1">
                <ProgressBar progress={progress} height="10px" />
              </div>
              {progress !== undefined && (
                <span className="text-base font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent whitespace-nowrap">
                  {progress}%
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 font-medium">
              {progress === 100 ? 'Course Completed! 🎉' : `${Math.floor(progress)}% completed - Keep going!`}
            </p>
          </div>
        )}

        {/* Expiry Information */}
        {isPurchased && expiryDate && status !== 'COMPLETED' && (
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl mb-3 ${
            status === 'EXPIRED' 
              ? 'bg-red-50 border border-red-200' 
              : getDaysUntilExpiry(expiryDate) <= 7 
                ? 'bg-amber-50 border border-amber-200'
                : 'bg-blue-50 border border-blue-200'
          }`}>
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
                      if (daysLeft < 0) return `Expired`;
                      else if (daysLeft === 0) return `⚠️ Expires today!`;
                      else if (daysLeft <= 7) return `⏰ ${daysLeft} day${daysLeft > 1 ? 's' : ''} remaining`;
                      else return `Valid until ${formatExpiryDate(expiryDate)}`;
                    }
                    return `Valid until ${formatExpiryDate(expiryDate)}`;
                  })()
              }
            </span>
          </div>
        )}

        {/* Buy Button */}
        {!isPurchased && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-medium mb-1">Price</span>
              <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                ₹{price}
              </span>
            </div>
            <motion.button 
              className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
            >
              <ShoppingCart style={{ fontSize: '18px' }} />
              <span>Buy Now</span>
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
});

CourseCard.displayName = 'CourseCard';

export default CourseCard;