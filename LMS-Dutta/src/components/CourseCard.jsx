/**
 * ✅ CourseCard with FIXED NaN handling
 */
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Event, Star, TrendingUp, Lock } from '@mui/icons-material';
import ProgressBar from './ProgressBar';

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
  validityMonths,
  enrolledStatus,
  isExpired,
  onCourseClick,
  onBuyClick,
}) => {
  const displayTitle = courseTitle || title || courseName || 'Untitled Course';
  const displayThumbnail = courseThumbnail || thumbnail || thumbnailUrl || imageUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"%3E%3Crect fill="%23f3f4f6" width="400" height="250"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="24" font-weight="bold" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ECourse Image%3C/text%3E%3C/svg%3E';

  // ✅ FIXED: Safe date calculation with validation
  const getDaysUntilExpiry = (expiryDateStr) => {
    if (!expiryDateStr) return null;

    try {
      const expiry = new Date(expiryDateStr);

      // Validate date
      if (isNaN(expiry.getTime())) {
        console.error('❌ Invalid expiry date:', expiryDateStr);
        return null;
      }

      const now = new Date();
      expiry.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);

      const diffTime = expiry.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays;
    } catch (error) {
      console.error('❌ Error calculating days:', error);
      return null;
    }
  };

  // ✅ FIXED: Safe date formatting
  const formatExpiryDate = (expiryDateStr) => {
    if (!expiryDateStr) return 'No expiry';

    try {
      const date = new Date(expiryDateStr);

      // Validate date
      if (isNaN(date.getTime())) {
        console.error('❌ Invalid date for formatting:', expiryDateStr);
        return 'Invalid date';
      }

      const day = date.getDate();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[date.getMonth()];
      const year = date.getFullYear();

      return `${day} ${month} ${year}`;
    } catch (error) {
      console.error('❌ Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const handleCardClick = () => {
    if (isExpired || enrolledStatus === 'expired') {
      console.log('⏰ Course expired, blocked');
      return;
    }

    if (onCourseClick) {
      onCourseClick(courseId);
    }
  };

  const handleBuyClick = (e) => {
    e.stopPropagation();
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

  const courseIsExpired = isExpired || enrolledStatus === 'expired';
  const daysLeft = getDaysUntilExpiry(expiryDate);

  const CardContent = (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={courseIsExpired ? {} : "hover"}
      className={`group relative bg-white rounded-3xl overflow-hidden mb-6 ${courseIsExpired ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
      style={{
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)"
      }}
      onClick={handleCardClick}
    >
      {courseIsExpired && (
        <div className="absolute inset-0 bg-black/60 z-30 flex items-center justify-center backdrop-blur-sm">
          <div className="text-center px-6">
            <Lock style={{ fontSize: '48px', color: 'white', marginBottom: '12px' }} className="mx-auto" />
            <h3 className="text-white font-bold text-xl mb-2">Course Expired</h3>
            <p className="text-gray-200 text-sm">
              Expired on {formatExpiryDate(expiryDate)}
            </p>
            <p className="text-gray-300 text-xs mt-2">
              Contact support to renew
            </p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-transparent to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

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
            e.target.onerror = null;
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"%3E%3Crect fill="%23f3f4f6" width="400" height="250"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="24" font-weight="bold" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ECourse Image%3C/text%3E%3C/svg%3E';
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {!isPurchased && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
          </motion.div>
        )}

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

      <motion.div
        className="p-6 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        
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

        {/* ✅ FIXED: Only show if expiryDate is valid */}
        {isPurchased && expiryDate && !courseIsExpired && daysLeft !== null && (
          <motion.div
            className={`flex items-center gap-2 px-4 py-3 rounded-xl mb-3 ${daysLeft <= 7
                ? 'bg-amber-50 border border-amber-200'
                : 'bg-blue-50 border border-blue-200'
              }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Event style={{
              fontSize: '18px',
              color: daysLeft <= 7 ? '#f59e0b' : '#3b82f6'
            }} />
            <div className="flex-1">
              <span className={`text-xs font-semibold block ${daysLeft <= 7 ? 'text-amber-700' : 'text-blue-700'
                }`}>
                {daysLeft < 0 ? (
                  `Expired`
                ) : daysLeft === 0 ? (
                  `⚠️ Expires today!`
                ) : daysLeft <= 7 ? (
                  `⏰ ${daysLeft} day${daysLeft > 1 ? 's' : ''} remaining`
                ) : (
                  `Valid until ${formatExpiryDate(expiryDate)}`
                )}
              </span>
              {validityMonths && (
                <span className="text-xs text-gray-600 block mt-1">
                  {validityMonths} month{validityMonths > 1 ? 's' : ''} validity
                </span>
              )}
            </div>
          </motion.div>
        )}

        {isPurchased && courseIsExpired && (
          <motion.div
            className="flex items-center gap-2 px-4 py-3 rounded-xl mb-3 bg-red-50 border border-red-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Event style={{ fontSize: '18px', color: '#dc2626' }} />
            <div className="flex-1">
              <span className="text-xs font-semibold text-red-700 block">
                Expired on {formatExpiryDate(expiryDate)}
              </span>
              <span className="text-xs text-red-600 block mt-1">
                Contact support to renew
              </span>
            </div>
          </motion.div>
        )}

        {!isPurchased && price !== undefined && (
          <motion.div
            className="pt-4 border-t border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-medium mb-0.5">Course Price</span>
                <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                  ₹{price}
                </span>
              </div>

              <motion.button
                className="relative bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg overflow-hidden group/btn"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(220, 38, 38, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBuyClick}
              >
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

        {isPurchased && !courseIsExpired && (
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
              {progress > 0 ? 'Continue Learning →' : 'Start Learning →'}
            </motion.button>
          </motion.div>
        )}

        {isPurchased && courseIsExpired && (
          <motion.div
            className="pt-4 border-t border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <motion.button
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                alert('Please contact support to renew this course.');
              }}
            >
              Contact Support to Renew
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-red-200 transition-colors duration-500 pointer-events-none"
      />
    </motion.div>
  );

  return CardContent;
};

export default CourseCard;