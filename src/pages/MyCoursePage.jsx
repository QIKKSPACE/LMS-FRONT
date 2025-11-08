/**
 * MyCoursePage Component
 * 
 * Shows only purchased/bought courses
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
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import CourseCard from '../components/CourseCard';
import FilterTabs from '../components/FilterTabs';
import { courses } from '../data/courses';

const MyCoursePage = ({ onCourseClick }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filterTabs = [
    { id: 'all', label: 'All' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'expired', label: 'Expired' },
    { id: 'paid', label: 'Paid' },
  ];

  const filteredCourses = useMemo(() => {
    // Filter only purchased courses
    let result = courses.filter((course) => course.isPurchased === true);
    
    if (activeFilter !== 'all') {
      result = result.filter((course) => {
        const categoryMap = {
          in_progress: 'IN_PROGRESS',
          completed: 'COMPLETED',
          expired: 'EXPIRED',
          paid: 'PAID',
        };
        return course.status === categoryMap[activeFilter];
      });
    }
    
    return result;
  }, [activeFilter]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-30">
        <div className="flex flex-row items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">My Courses</h1>
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

        {/* Filter Tabs */}
        <FilterTabs
          tabs={filterTabs}
          activeTab={activeFilter}
          onTabChange={setActiveFilter}
        />
      </div>

      {/* Desktop Filter Tabs */}
      <div className="hidden lg:block bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-20 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">My Courses</h1>
              <p className="text-gray-600 mt-1 text-sm">Your purchased courses and progress</p>
            </div>
          </div>
          <FilterTabs
            tabs={filterTabs}
            activeTab={activeFilter}
            onTabChange={setActiveFilter}
          />
        </div>
      </div>

      {/* Course Cards List/Grid */}
      <div className="flex-1 px-6 lg:px-8 py-6 lg:py-8 pb-24 lg:pb-6">
        {filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-500 text-lg mb-2">No purchased courses yet</p>
            <p className="text-gray-400 text-sm">Browse courses in the Home section to get started</p>
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
            {filteredCourses.map((course, index) => (
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

export default MyCoursePage;

