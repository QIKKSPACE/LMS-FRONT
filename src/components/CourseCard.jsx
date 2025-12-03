/**
 * Enhanced CourseCard Component with Premium UI - FIXED
 */
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Event, Star, TrendingUp } from '@mui/icons-material';
import ProgressBar from './ProgressBar';
import { formatExpiryDate, getDaysUntilExpiry } from '../utils/courseExpiry';

const CourseCard = ({
  courseId,
  title,
  courseTitle,
  courseName,
  membershipType,
  thumbnail,
  courseThumbnail,
  thumbnailUrl,
  imageUrl,
  status,
  progress,
  chapters,
  isPurchased,
  price,
  showStatus = true,
  expiryDate,
  onCourseClick,
  onBuyClick,
}) => {
  // Determine which title field to use - prioritize courseTitle from admin
  const displayTitle = courseTitle || title || courseName || 'Untitled Course';
  
  // Determine which thumbnail field to use - prioritize courseThumbnail from admin
  const displayThumbnail = courseThumbnail || thumbnail || thumbnailUrl || imageUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"%3E%3Crect fill="%23f3f4f6" width="400" height="250"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="24" font-weight="bold" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ECourse Image%3C/text%3E%3C/svg%3E';

  console.log('CourseCard rendering:', { courseId, displayTitle, displayThumbnail, price, isPurchased });

  // FIXED: Card click handler - works for both purchased and unpurchased
  const handleCardClick = () => {
    console.log('Card clicked:', courseId, 'isPurchased:', isPurchased);
    
    // If purchased, view course content
    if (isPurchased && onCourseClick) {
      onCourseClick(courseId);
    } 
    // If not purchased, show course detail page for buying
    else if (!isPurchased && onCourseClick) {
      onCourseClick(courseId);
    }
  };

  const handleBuyClick = (e) => {
    e.stopPropagation(); // Prevent card click
    console.log('Buy button clicked for course:', courseId);
    if (onBuyClick) {
      onBuyClick(courseId);
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
      whileHover="hover"
      className="group relative bg-white rounded-3xl overflow-hidden mb-6 cursor-pointer"
      style={{
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)"
      }}
      onClick={handleCardClick}
    >
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-transparent to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Thumbnail Section with Enhanced Overlay */}
      <motion.div 
        className="relative h-60 overflow-hidden bg-gray-100"
        variants={glowVariants}
      >
        <motion.img
          src={displayThumbnail}
          alt={displayTitle}
          className="w-full h-full object-cover"
          variants={imageVariants}
          loading="lazy"
          onError={(e) => {
            // Replace with inline SVG placeholder if image fails
            e.target.onerror = null;
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"%3E%3Crect fill="%23f3f4f6" width="400" height="250"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="24" font-weight="bold" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ECourse Image%3C/text%3E%3C/svg%3E';
          }}
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
        {chapters > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md text-gray-800 px-4 py-2 rounded-full text-xs font-bold shadow-xl"
          >
            📚 {chapters} Chapters
          </motion.div>
        )}
      </motion.div>

      {/* Content Section */}
      <motion.div 
        className="p-6 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {/* Membership Badge */}
        {membershipType && (
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
        )}

        {/* Title Only - No Status Badge */}
        <div className="mb-3">
          <motion.h2 
            className="text-xl font-extrabold text-gray-900 leading-tight group-hover:text-red-600 transition-colors duration-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {displayTitle}
          </motion.h2>
        </div>

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

        {/* Enhanced Buy Button - Only show if not purchased */}
        {!isPurchased && price !== undefined && (
          <motion.div 
            className="pt-4 border-t border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="flex items-center justify-between gap-4">
              {/* Price Display */}
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-medium mb-0.5">Course Price</span>
                <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                  ₹{price}
                </span>
              </div>
              
              {/* Buy Now Button */}
              <motion.button 
                className="relative bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg overflow-hidden group/btn"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(220, 38, 38, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBuyClick}
              >
                {/* Animated shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <ShoppingCart style={{ fontSize: '18px' }} className="relative z-10" />
                <span className="relative z-10">Buy Now</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* View Course Button - Only show if purchased */}
        {isPurchased && (
          <motion.div 
            className="pt-4 border-t border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <motion.button 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCardClick}
            >
              Continue Learning →
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