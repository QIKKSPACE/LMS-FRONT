/**
 * BuyCourseDetailPage Component
 * 
 * Dynamic course detail page with banner, details, price, and Buy Now button
 * 
 * React Native Conversion Notes:
 * - Replace <div> with <View> from react-native
 * - Replace <img> with <Image> from react-native
 * - Replace <button> with <TouchableOpacity> from react-native
 * - Use ScrollView for scrollable content
 * - Use SafeAreaView for mobile safe areas
 */
import React from 'react';
import { ArrowBack, ShoppingCart } from '@mui/icons-material';
import { courses } from '../data/courses';

const BuyCourseDetailPage = ({ courseId, onBack, onPurchase }) => {
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Course not found</p>
      </div>
    );
  }

  const handleBuyNow = () => {
    if (onPurchase) {
      onPurchase(course.id);
    } else {
      console.log('Purchase course:', course.id);
      // Add purchase logic here
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-30">
        <div className="flex flex-row items-center px-4 py-4">
          <button
            onClick={onBack}
            className="mr-4 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowBack style={{ fontSize: '24px' }} />
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Course Details</h1>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-20 shadow-sm">
        <div className="px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-700 hover:text-red-600 mb-4 transition-colors group"
          >
            <ArrowBack style={{ fontSize: '20px', marginRight: '8px' }} className="group-hover:transform group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back</span>
          </button>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">Course Details</h1>
        </div>
      </div>

      {/* Course Banner */}
      <div className="relative w-full h-72 lg:h-[500px] overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
          <div className="text-white">
            <h2 className="text-4xl lg:text-6xl font-extrabold drop-shadow-2xl mb-2">
              {course.title}
            </h2>
          </div>
        </div>
      </div>

      {/* Course Details Section */}
      <div className="flex-1 flex flex-col px-4 lg:px-6 py-6 pb-24 lg:pb-6">
        <div className="max-w-4xl mx-auto flex-1 flex flex-col">
          {/* Course Description */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-8 mb-6">
            <h3 className="text-2xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">About This Course</h3>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              {course.title} is a comprehensive course designed to help you master the fundamentals
              and advanced concepts. This course includes {course.chapters} detailed chapters covering
              all aspects of the subject matter. Whether you're a beginner or looking to enhance your
              skills, this course provides the knowledge and tools you need to succeed.
            </p>
            <div className="mt-6 pt-6 border-t border-gray-200/50">
              <h4 className="font-bold text-gray-900 mb-4 text-lg">What you'll learn:</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <li className="flex items-start space-x-3">
                  <span className="text-red-600 font-bold mt-1">✓</span>
                  <span className="text-gray-700">Comprehensive understanding of core concepts</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-600 font-bold mt-1">✓</span>
                  <span className="text-gray-700">Practical skills and real-world applications</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-600 font-bold mt-1">✓</span>
                  <span className="text-gray-700">Expert guidance and support</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-600 font-bold mt-1">✓</span>
                  <span className="text-gray-700">Access to all course materials and resources</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Spacer to push purchase section to bottom */}
          <div className="flex-1"></div>

          {/* Purchase Section - Stuck at bottom */}
          {!course.isPurchased && (
            <div className="bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-2xl p-8 mt-auto">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-2 font-medium">Total Price</p>
                  <p className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">₹{course.price}</p>
                </div>
                <button
                  onClick={handleBuyNow}
                  className="w-full lg:w-auto bg-gradient-to-r from-red-600 to-red-700 text-white px-10 py-4 rounded-xl text-lg font-bold hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105 transform"
                >
                  <ShoppingCart style={{ fontSize: '22px' }} />
                  Buy Now
                </button>
              </div>
            </div>
          )}

          {/* Already Purchased Message */}
          {course.isPurchased && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300/50 rounded-2xl p-8 mt-auto shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl font-bold">✓</span>
                </div>
                <div>
                  <p className="font-extrabold text-green-900 text-lg">You own this course</p>
                  <p className="text-sm text-green-700 font-medium mt-1">Access all content in My Courses</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyCourseDetailPage;

