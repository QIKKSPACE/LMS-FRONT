import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import CourseCard from '../components/CourseCard';
import FilterTabs from '../components/FilterTabs';
import SearchBar from '../components/SearchBar';
import { courses } from '../data/courses';
import { loadProgress, initializeCourseProgress } from '../utils/progressTracker';
import { checkCourseExpiry, formatExpiryDate, getDaysUntilExpiry } from '../utils/courseExpiry';
import logo from '../assets/logo.png';

const MyCoursePage = ({ onCourseClick }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [coursesWithProgress, setCoursesWithProgress] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs = [
    { id: 'all', label: 'All' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'expired', label: 'Expired' },
  ];

  // Initialize courses with progress from localStorage
  useEffect(() => {
    const purchasedCourses = courses.filter((course) => course.isPurchased === true);
    const coursesWithProgressData = purchasedCourses.map((course) => {
      const initializedCourse = initializeCourseProgress(course, course);
      // Check expiry date and update status
      return checkCourseExpiry(initializedCourse);
    });
    setCoursesWithProgress(coursesWithProgressData);
  }, []);

  // Listen for progress updates from course details page
  useEffect(() => {
    const handleProgressUpdate = () => {
      const purchasedCourses = courses.filter((course) => course.isPurchased === true);
      const coursesWithProgressData = purchasedCourses.map((course) => {
        const initializedCourse = initializeCourseProgress(course, course);
        // Check expiry date and update status
        return checkCourseExpiry(initializedCourse);
      });
      setCoursesWithProgress(coursesWithProgressData);
    };

    // Listen for custom progress update event
    window.addEventListener('courseProgressUpdated', handleProgressUpdate);
    // Also listen for storage changes (for cross-tab updates)
    window.addEventListener('storage', handleProgressUpdate);

    return () => {
      window.removeEventListener('courseProgressUpdated', handleProgressUpdate);
      window.removeEventListener('storage', handleProgressUpdate);
    };
  }, []);

  // Periodic expiry check (every hour) to update expired courses
  useEffect(() => {
    const checkExpiryInterval = setInterval(() => {
      setCoursesWithProgress((prevCourses) => {
        return prevCourses.map((course) => checkCourseExpiry(course));
      });
    }, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(checkExpiryInterval);
  }, []);

  const filteredCourses = useMemo(() => {
    let result = coursesWithProgress;
    
    // Apply status filter
    if (activeFilter !== 'all') {
      result = result.filter((course) => {
        const categoryMap = {
          in_progress: 'IN_PROGRESS',
          completed: 'COMPLETED',
          expired: 'EXPIRED',
        };
        return course.status === categoryMap[activeFilter];
      });
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((course) => {
        return (
          course.title.toLowerCase().includes(query) ||
          (course.membershipType && course.membershipType.toLowerCase().includes(query)) ||
          (course.description && course.description.toLowerCase().includes(query))
        );
      });
    }
    
    return result;
  }, [activeFilter, coursesWithProgress, searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-30">
        <div className="flex flex-row items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">My Courses</h1>
          <img 
            src={logo} 
            alt="Spiritual Talk Foundation Logo" 
            className="h-10 w-10 object-contain rounded-full"
          />
        </div>

        {/* Search Bar - Mobile */}
        <div className="px-4 pb-3">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={handleClearSearch}
            placeholder="Search your courses..."
          />
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

          {/* Search Bar - Desktop */}
          <div className="mb-4 max-w-2xl">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={handleClearSearch}
              placeholder="Search your courses..."
            />
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
        {coursesWithProgress.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-500 text-lg mb-2">No purchased courses yet</p>
            <p className="text-gray-400 text-sm">Browse courses in the Home section to get started</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <motion.div 
            className="flex flex-col items-center justify-center h-64"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-4"
            >
              <span className="text-4xl">🔍</span>
            </motion.div>
            <p className="text-gray-500 text-lg font-semibold">No courses found</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchQuery ? 'Try adjusting your search terms' : 'No courses in this category'}
            </p>
          </motion.div>
        ) : (
          <>
            {/* Results count */}
            {searchQuery && (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-gray-600 text-sm">
                  Found <span className="font-bold text-red-600">{filteredCourses.length}</span> course{filteredCourses.length !== 1 ? 's' : ''} matching "{searchQuery}"
                </p>
              </motion.div>
            )}

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
                    expiryDate={course.expiryDate}
                    onCourseClick={onCourseClick}
                  />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyCoursePage;