import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import CourseCard from '../components/CourseCard';
import FilterTabs from '../components/FilterTabs';
import SearchBar from '../components/SearchBar';
import { getUserCourses } from '../services/courseService';
import { useAuth } from '../context/AuthContext';
import { checkCourseExpiry } from '../utils/courseExpiry';
import { fixBrokenProgressDocuments, checkIfMigrationNeeded } from '../utils/migrationFix';
import toast from 'react-hot-toast';
import logo from '../assets/logo.png';

const MyCoursePage = ({ onCourseClick }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  // ✅ THREE TABS: All, Completed, Expired
  const filterTabs = [
    { id: 'all', label: 'All' },
    { id: 'completed', label: 'Completed' },
    { id: 'expired', label: 'Expired' },
  ];

  // Fetch user's purchased courses from Firestore
  useEffect(() => {
    const fetchUserCourses = async () => {
      if (!user || !user.uid) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log('📚 Fetching purchased courses for user:', user.uid);
        
        // ✅ Check if migration is needed
        const needsMigration = await checkIfMigrationNeeded(user.uid);
        
        if (needsMigration) {
          console.log('🔧 Migration needed! Fixing broken progress documents...');
          toast.loading('Fixing course progress data...', { id: 'migration' });
          
          const migrationResult = await fixBrokenProgressDocuments(user.uid);
          
          if (migrationResult.success) {
            toast.success(`✅ Fixed ${migrationResult.fixed} course(s)`, { id: 'migration' });
            console.log('✅ Migration complete:', migrationResult);
          } else {
            toast.error('Migration had some errors', { id: 'migration' });
            console.error('❌ Migration errors:', migrationResult);
          }
        }
        
        const result = await getUserCourses(user.uid);

        if (result.success) {
          // ✅ FIXED: Properly determine status for each course
          const coursesWithStatus = result.courses.map(course => {
            // First check expiry
            const courseWithExpiry = checkCourseExpiry(course);
            
            // Then determine status based on progress
            let finalStatus = courseWithExpiry.status;
            const progress = course.progress || 0;
            
            console.log(`📊 Course: ${course.courseTitle}, Progress: ${progress}%, Expired: ${courseWithExpiry.isExpired}`);
            
            if (courseWithExpiry.isExpired) {
              finalStatus = 'EXPIRED';
              console.log(`❌ ${course.courseTitle} is EXPIRED`);
            } else if (progress === 100) {
              finalStatus = 'COMPLETED';
              console.log(`✅ ${course.courseTitle} is COMPLETED (100%)`);
            } else if (progress > 0) {
              finalStatus = 'IN_PROGRESS';
              console.log(`⏳ ${course.courseTitle} is IN_PROGRESS (${progress}%)`);
            } else {
              finalStatus = 'NOT_STARTED';
              console.log(`🆕 ${course.courseTitle} is NOT_STARTED`);
            }
            
            return {
              ...courseWithExpiry,
              status: finalStatus,
              progress: progress // Ensure progress is set
            };
          });
          
          console.log('✅ User courses with status:', coursesWithStatus.map(c => ({
            title: c.courseTitle,
            progress: c.progress,
            status: c.status
          })));
          
          setCourses(coursesWithStatus);
        } else {
          console.error('❌ Failed to fetch user courses:', result.error);
          setError(result.error);
        }
      } catch (err) {
        console.error('❌ Error in fetchUserCourses:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCourses();
  }, [user]);

  // ✅ FIXED FILTERING: All (active courses), Completed (100%), Expired
  const filteredCourses = useMemo(() => {
    let result = courses;
    
    console.log('🔍 Filtering courses with activeFilter:', activeFilter);
    console.log('📦 Total courses:', courses.length);
    
    // Apply status filter
    if (activeFilter === 'all') {
      // "All" shows courses that are NOT expired and NOT 100% completed
      result = courses.filter(c => {
        const isNotExpired = c.status !== 'EXPIRED';
        const isNotCompleted = c.status !== 'COMPLETED';
        return isNotExpired && isNotCompleted;
      });
      console.log(`📋 "All" tab: ${result.length} active courses`);
    } else if (activeFilter === 'completed') {
      // ✅ CRITICAL: "Completed" shows ONLY courses with progress === 100
      result = courses.filter(c => {
        const isCompleted = c.progress === 100 && c.status === 'COMPLETED';
        if (isCompleted) {
          console.log(`✅ Including in Completed: ${c.courseTitle} (${c.progress}%)`);
        }
        return isCompleted;
      });
      console.log(`🎉 "Completed" tab: ${result.length} completed courses`);
    } else if (activeFilter === 'expired') {
      // "Expired" shows only expired courses
      result = courses.filter(c => c.status === 'EXPIRED');
      console.log(`❌ "Expired" tab: ${result.length} expired courses`);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((course) => {
        return (
          course.title?.toLowerCase().includes(query) ||
          course.courseTitle?.toLowerCase().includes(query) ||
          course.membershipType?.toLowerCase().includes(query) ||
          course.description?.toLowerCase().includes(query)
        );
      });
      console.log(`🔍 After search: ${result.length} courses`);
    }
    
    return result;
  }, [activeFilter, courses, searchQuery]);

  // ✅ FIXED COUNT: All, Completed, Expired
  const courseCounts = useMemo(() => {
    const counts = {
      all: courses.filter(c => c.status !== 'EXPIRED' && c.status !== 'COMPLETED').length,
      completed: courses.filter(c => c.progress === 100 && c.status === 'COMPLETED').length,
      expired: courses.filter(c => c.status === 'EXPIRED').length,
    };
    
    console.log('📊 Course counts:', counts);
    return counts;
  }, [courses]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading your courses...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-4xl">⚠️</span>
            </div>
            <p className="text-red-600 font-semibold text-lg mb-2">Failed to load courses</p>
            <p className="text-gray-600 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Filter Tabs with Counts */}
        <FilterTabs
          tabs={filterTabs.map(tab => ({
            ...tab,
            label: `${tab.label} ${courseCounts[tab.id] > 0 ? `(${courseCounts[tab.id]})` : ''}`
          }))}
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

          {/* Filter Tabs with Counts */}
          <FilterTabs
            tabs={filterTabs.map(tab => ({
              ...tab,
              label: `${tab.label} ${courseCounts[tab.id] > 0 ? `(${courseCounts[tab.id]})` : ''}`
            }))}
            activeTab={activeFilter}
            onTabChange={setActiveFilter}
          />
        </div>
      </div>

      {/* Course Cards List/Grid */}
      <div className="flex-1 px-6 lg:px-8 py-6 lg:py-8 pb-24 lg:pb-6">
        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <motion.div
              className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-4"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <span className="text-4xl">📚</span>
            </motion.div>
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
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : activeFilter === 'completed' 
                  ? 'Complete a course to 100% to see it here! 🎯'
                  : `No courses in "${filterTabs.find(t => t.id === activeFilter)?.label}"`
              }
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

            {/* Success message for completed courses */}
            {activeFilter === 'completed' && filteredCourses.length > 0 && (
              <motion.div
                className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎉</span>
                </div>
                <div>
                  <h3 className="font-bold text-green-800 text-lg">Congratulations!</h3>
                  <p className="text-green-700 text-sm">
                    You've completed {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}. Keep up the great work!
                  </p>
                </div>
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
                    courseTitle={course.courseTitle}
                    courseName={course.courseName}
                    membershipType={course.membershipType}
                    thumbnail={course.thumbnail}
                    courseThumbnail={course.courseThumbnail}
                    thumbnailUrl={course.thumbnailUrl}
                    imageUrl={course.imageUrl}
                    status={course.status}
                    progress={course.progress || 0}
                    chapters={course.chapters || 0}
                    isPurchased={true}
                    price={course.price}
                    expiryDate={course.expiryDate}
                    showStatus={false}
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