/**
 * HomePage Component
 * 
 * Shows only courses available to buy (unpurchased courses)
 * 
 * React Native Conversion Notes:
 * - Replace <div> with <View> from react-native
 * - Use ScrollView or FlatList for course list
 * - flex-col → flexDirection: 'column'
 * - grid → Use FlatList with numColumns prop for grid layout
 * - px-4, py-4 → paddingHorizontal, paddingVertical
 * - mb-20 → marginBottom for bottom nav spacing
 * - Use SafeAreaView for mobile safe areas
 */
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import CourseCard from '../components/CourseCard';
import { courses } from '../data/courses';

const HomePage = ({ onCourseClick }) => {
  // Only show unpurchased courses (available to buy)
  const availableCourses = useMemo(() => {
    return courses.filter((course) => course.isPurchased === false);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-30">
        <div className="flex flex-row items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Home</h1>
          <div className="flex flex-row items-center gap-4">
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              <span className="text-xl">🔍</span>
            </button>
            <button className="text-gray-600 relative hover:text-gray-900 transition-colors">
              <span className="text-xl">🔔</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-20 shadow-sm">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Discover Courses
          </h1>
          <p className="text-gray-600 mt-1 text-sm">Explore our collection of premium courses</p>
        </div>
      </div>

      {/* Course Cards List/Grid */}
      <div className="flex-1 px-6 lg:px-8 py-6 lg:py-8 pb-24 lg:pb-6">
        {availableCourses.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No courses available to buy</p>
          </div>
        ) : (
          <motion.div 
            className="lg:grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {availableCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: "easeOut"
                }}
              >
                <CourseCard
                  courseId={course.id}
                  title={course.title}
                  membershipType={course.membershipType}
                  thumbnail={course.thumbnail}
                  status={course.status}
                  progress={course.progress}
                  chapters={course.chapters}
                  isPurchased={course.isPurchased}
                  price={course.price}
                  showStatus={false}
                  onCourseClick={onCourseClick}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

