import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import CourseCard from '../components/CourseCard';
import FilterTabs from '../components/FilterTabs';
import SearchBar from '../components/SearchBar';
import { courses } from '../data/courses';

const CoursesPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs = [
    { id: 'all', label: 'All' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'expired', label: 'Expired' },
    { id: 'paid', label: 'Paid' },
  ];

  const filteredCourses = useMemo(() => {
    let result = courses;

    // Apply status filter
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
  }, [activeFilter, searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm sticky top-0 z-30">
        <div className="flex flex-row items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <div className="flex flex-row items-center gap-4">
            <button className="text-gray-600">
              <span className="text-xl">🔔</span>
            </button>
            <button className="text-gray-600 relative">
              <span className="text-xl">🔔</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="text-gray-600">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="px-4 pb-3">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={handleClearSearch}
            placeholder="Search all courses..."
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
      <div className="hidden lg:block bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="px-6 py-4">
          <div className="mb-4">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2">
              All Courses
            </h1>
            
            {/* Search Bar - Desktop */}
            <div className="max-w-2xl">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={handleClearSearch}
                placeholder="Search all courses..."
              />
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
      <div className="flex-1 px-4 py-4 pb-24 lg:pb-4">
        {filteredCourses.length === 0 ? (
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
              className="lg:grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-4"
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
                    title={course.title}
                    membershipType={course.membershipType}
                    thumbnail={course.thumbnail}
                    instructorImage={course.instructorImage}
                    status={course.status}
                    progress={course.progress}
                    chapters={course.chapters}
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

export default CoursesPage;