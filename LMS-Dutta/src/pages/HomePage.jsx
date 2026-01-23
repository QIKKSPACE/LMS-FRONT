import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CourseCard from '../components/CourseCard';
import SearchBar from '../components/SearchBar';
import { getAllCourses } from '../services/courseService';
import { initiatePayment } from '../services/razorpayService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import logo from '../assets/logo.png';

const HomePage = ({ onCourseClick, onLogoClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, refreshUserData } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('📚 Fetching courses from Firestore...');
        const result = await getAllCourses();
        
        if (result.success) {
          console.log('✅ Courses fetched successfully:', result.courses.length);
          
          if (result.courses.length === 0) {
            console.warn('⚠️ No courses found in Firestore!');
            setError('No courses available. Please add courses in admin panel.');
          } else {
            setCourses(result.courses);
          }
        } else {
          console.error('❌ Failed to fetch courses:', result.error);
          setError(result.error || 'Failed to load courses');
        }
      } catch (err) {
        console.error('❌ Error in fetchCourses:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    console.log('👤 User data updated, refreshing available courses');
  }, [user?.purchasedCourses]);

  const userPurchasedCourseIds = useMemo(() => {
    if (!user || !user.purchasedCourses) return [];
    console.log('🛒 User purchased courses:', user.purchasedCourses);
    return user.purchasedCourses;
  }, [user]);

  const availableCourses = useMemo(() => {
    const filtered = courses.filter((course) => {
      const isNotPurchased = !userPurchasedCourseIds.includes(course.id);
      if (!isNotPurchased) {
        console.log('🔒 Course already purchased, hiding:', course.id);
      }
      return isNotPurchased;
    });
    
    console.log(`📊 Available courses: ${filtered.length} out of ${courses.length}`);
    return filtered;
  }, [courses, userPurchasedCourseIds]);

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) {
      return availableCourses;
    }

    const query = searchQuery.toLowerCase().trim();
    return availableCourses.filter((course) => {
      return (
        course.title?.toLowerCase().includes(query) ||
        course.membershipType?.toLowerCase().includes(query) ||
        course.description?.toLowerCase().includes(query)
      );
    });
  }, [availableCourses, searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleCardClick = (courseId) => {
    console.log('Card clicked for course:', courseId);
    if (onCourseClick) {
      onCourseClick(courseId);
    }
  };

  const handleCoursePurchase = async (courseId) => {
    if (!user) {
      toast.error('Please login to purchase courses');
      return;
    }

    const course = courses.find(c => c.id === courseId);
    if (!course) {
      toast.error('Course not found');
      return;
    }

    if (userPurchasedCourseIds.includes(courseId)) {
      toast.info('You already own this course');
      return;
    }

    console.log('💳 Initiating payment for course:', {
      id: course.id,
      title: course.courseTitle,
      validity: course.courseValidity
    });

    const courseDataForPayment = {
      id: course.id,
      title: course.courseTitle || course.title,
      price: course.price || 0,
      thumbnail: course.courseThumbnail || course.thumbnail,
      description: course.courseDescription || course.description,
      courseValidity: course.courseValidity || '1',
    };

    const result = await initiatePayment(courseDataForPayment, user, async (updatedUser) => {
      console.log('✅ Payment successful callback received');
      
      if (refreshUserData) {
        await refreshUserData();
        console.log('✅ User data refreshed in AuthContext');
      }
    });
    
    if (!result.success) {
      toast.error('Failed to initiate payment. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      <motion.div 
        className="lg:hidden bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-30"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-row items-center justify-between px-4 py-4">
          <motion.h1 
            className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-red-700 to-gray-900 bg-clip-text text-transparent"
          >
            Home
          </motion.h1>
          <motion.img 
            src={logo} 
            alt="Spiritual Talk Foundation Logo" 
            className="h-12 w-12 object-contain rounded-full shadow-lg cursor-pointer"
            onClick={onLogoClick}
            whileHover={{ rotate: 360, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.6 }}
          />
        </div>
        
        <div className="px-4 pb-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={handleClearSearch}
            placeholder="Search courses..."
          />
        </div>
      </motion.div>

      <div className="hidden lg:block bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-20 shadow-sm">
        <div className="relative px-8 py-12 overflow-hidden">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-100/40 to-rose-100/40 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <div className="relative z-10">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/50 rounded-full mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.span
                className="relative flex h-3 w-3"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </motion.span>
              <span className="text-sm font-semibold text-red-700">
                {availableCourses.length} {availableCourses.length === 1 ? 'Course' : 'Courses'} Available
              </span>
            </motion.div>

            <motion.h1 
              className="text-5xl font-black mb-4 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-gray-900 via-red-800 to-gray-900 bg-clip-text text-transparent">
                Discover Your Next
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-600 via-rose-500 to-red-600 bg-clip-text text-transparent">
                Learning Adventure ✨
              </span>
            </motion.h1>

            <motion.p 
              className="text-gray-600 text-lg max-w-2xl mb-6 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Explore our curated collection of premium courses designed to transform your skills and elevate your knowledge. Start your journey today!
            </motion.p>

            <motion.div
              className="max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={handleClearSearch}
                placeholder="Search courses..."
              />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 lg:px-8 py-0 lg:py-2 pb-24 lg:pb-6">
        {availableCourses.length === 0 ? (
          <motion.div 
            className="flex flex-col items-center justify-center h-64"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
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
            <p className="text-gray-500 text-lg font-semibold">No courses available</p>
            <p className="text-gray-400 text-sm mt-2">
              {courses.length > 0 ? 'You have purchased all available courses! 🎉' : 'Check back soon for new courses!'}
            </p>
          </motion.div>
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
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search terms</p>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="lg:hidden mb-6 flex items-center justify-between"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-red-700 bg-clip-text text-transparent">
                Featured Courses 🔥
              </h2>
              {searchQuery && (
                <span className="text-sm text-gray-600 font-medium">
                  {filteredCourses.length} result{filteredCourses.length !== 1 ? 's' : ''}
                </span>
              )}
            </motion.div>

            {searchQuery && (
              <motion.div
                className="hidden lg:block mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
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
                    staggerChildren: 0.15
                  }
                }
              }}
            >
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.15,
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94]
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
                    isPurchased={false}
                    price={course.price}
                    validityMonths={parseInt(course.courseValidity || 1)}
                    showStatus={false}
                    onCourseClick={handleCardClick}
                    onBuyClick={handleCoursePurchase}
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

export default HomePage;