/**
 * CourseCard Component
 * 
 * React Native Conversion Notes:
 * - Replace all <div> with <View> from react-native
 * - Replace <img> with <Image source={{ uri: url }} /> from react-native
 * - Replace className with style prop using StyleSheet.create()
 * - flex, flex-col, items-center, justify-between translate directly
 * - rounded-lg → borderRadius: 8
 * - shadow → shadowColor, shadowOffset, shadowOpacity, shadowRadius
 * - overflow-hidden → overflow: 'hidden'
 * - All spacing (p-4, mb-4, etc.) → padding, margin in StyleSheet
 * - text-sm → fontSize: 14
 * - font-bold → fontWeight: '700'
 * - Position absolute for avatar → position: 'absolute'
 */
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from '@mui/icons-material';
import ProgressBar from './ProgressBar';

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
  onCourseClick,
}) => {
  const handleCardClick = () => {
    if (onCourseClick) {
      onCourseClick(courseId);
    }
  };

  // Animation variants for Framer Motion
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.03,
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const contentVariants = {
    hover: {
      y: -5,
      transition: {
        duration: 0.3
      }
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500';
      case 'IN_PROGRESS':
        return 'bg-blue-500';
      case 'EXPIRED':
        return 'bg-red-500';
      case 'PAID':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const CardContent = (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={onCourseClick ? "hover" : undefined}
      className={`bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-300/50 overflow-hidden mb-4 ${
        onCourseClick ? 'cursor-pointer' : ''
      }`}
      onClick={onCourseClick ? handleCardClick : undefined}
    >
      {/* Thumbnail Banner Section */}
      <motion.div 
        className="relative h-56 overflow-hidden"
        variants={imageVariants}
      >
        {/* Background Image */}
        <motion.img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Course Details Section */}
      <motion.div 
        className="p-4"
        variants={contentVariants}
      >
        {/* Title and Status Badge */}
        <div className={`flex items-start justify-between ${showStatus ? 'mb-3' : 'mb-2'}`}>
          <motion.h2 
            className="text-lg font-bold text-gray-900 flex-1 mr-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {title}
          </motion.h2>
          {showStatus && (
            <motion.span
              className={`${getStatusColor(status)} text-white text-xs font-semibold px-2 py-1 rounded whitespace-nowrap`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {status}
            </motion.span>
          )}
        </div>

        {/* Progress Bar - Only for purchased courses */}
        {isPurchased && (
          <motion.div 
            className="mb-2"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '100%' }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <ProgressBar progress={progress} />
          </motion.div>
        )}

        {/* Progress Text and Chapters or Buy Button */}
        {isPurchased ? (
          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-sm text-primary font-medium">
              {progress}% completed
            </span>
            <span className="text-sm text-gray-500">
              {chapters} Chapters
            </span>
          </motion.div>
        ) : (
          <motion.div 
            className="flex items-center justify-between mt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.span 
              className="text-lg font-bold text-gray-900"
              whileHover={{ scale: 1.1 }}
            >
              ₹{price}
            </motion.span>
            <motion.button 
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2"
              whileHover={{ 
                scale: 1.1
              }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
            >
              <ShoppingCart style={{ fontSize: '18px' }} />
              Buy Now
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );

  return CardContent;
};

export default CourseCard;

