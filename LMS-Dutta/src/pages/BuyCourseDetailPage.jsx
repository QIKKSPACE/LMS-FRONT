import React, { useState, useEffect } from 'react';
import { ArrowBack, ShoppingCart } from '@mui/icons-material';
import { getCourseById } from '../services/courseService';
import { initiatePayment } from '../services/razorpayService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const BuyCourseDetailPage = ({ courseId, onBack, onPurchase }) => {
  const { user, refreshUserData } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  // Fetch course from Firestore
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching course details for:', courseId);
        
        const result = await getCourseById(courseId);
        
        if (result.success && result.course) {
          console.log('✅ Course fetched successfully:', result.course);
          console.log('📸 Thumbnail:', result.course.courseThumbnail);
          console.log('💰 Price:', result.course.price);
          setCourse(result.course);
        } else {
          console.error('❌ Course not found:', result.error);
          toast.error('Course not found');
        }
      } catch (error) {
        console.error('❌ Error fetching course:', error);
        toast.error('Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  // ✅ FIXED: Handle Buy Now with proper Razorpay integration
  const handleBuyNow = async () => {
    if (!user) {
      toast.error('Please login to purchase this course');
      return;
    }

    if (purchasing) return;

    try {
      setPurchasing(true);
      console.log('💳 Initiating payment for:', course.courseTitle);
      console.log('💰 Price:', course.price);
      
      // ✅ Prepare course data for Razorpay
      const courseDataForPayment = {
        id: course.id,
        title: course.courseTitle || course.title,
        price: course.price || 0,
        thumbnail: course.courseThumbnail || course.thumbnail,
        description: course.courseDescription || course.description,
      };

      console.log('📦 Course data for payment:', courseDataForPayment);

      // ✅ Initiate Razorpay payment with callback
      const result = await initiatePayment(
        courseDataForPayment, 
        user,
        async (updatedUser) => {
          console.log('✅ Payment successful! Refreshing user data...');
          
          // Refresh user data in AuthContext
          if (refreshUserData) {
            await refreshUserData();
            console.log('✅ User data refreshed');
          }
          
          // Call onPurchase callback if provided
          if (onPurchase) {
            onPurchase(courseId);
          }
        }
      );

      if (!result.success) {
        console.error('❌ Payment initiation failed:', result.error);
        toast.error('Failed to initiate payment. Please try again.');
      }
    } catch (error) {
      console.error('❌ Purchase error:', error);
      toast.error('An error occurred during purchase');
    } finally {
      setPurchasing(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading course...</p>
        </div>
      </div>
    );
  }

  // Course not found
  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-4xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist.</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ✅ Get course display data with fallbacks
  const displayTitle = course.courseTitle || course.title || 'Untitled Course';
  const displayThumbnail = course.courseThumbnail || course.thumbnail || 'https://via.placeholder.com/1200x600?text=Course+Thumbnail';
  const displayPrice = course.price || 0;
  const displayDescription = course.courseDescription || course.description || 'No description available.';
  const displayChapters = course.chapters || 0;

  console.log('🎨 Rendering with:', {
    title: displayTitle,
    thumbnail: displayThumbnail,
    price: displayPrice,
  });

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
          src={displayThumbnail}
          alt={displayTitle}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error('❌ Image failed to load:', displayThumbnail);
            e.target.src = 'https://via.placeholder.com/1200x600?text=Course+Image';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
          <div className="text-white">
            <h2 className="text-4xl lg:text-6xl font-extrabold drop-shadow-2xl mb-2">
              {displayTitle}
            </h2>
            {course.membershipType && (
              <span className="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                {course.membershipType}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Course Details Section */}
      <div className="flex-1 flex flex-col px-4 lg:px-6 py-6 pb-24 lg:pb-6">
        <div className="max-w-4xl mx-auto flex-1 flex flex-col">
          {/* Course Description */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-8 mb-6">
            <h3 className="text-2xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">About This Course</h3>
            
            {/* Description */}
            <div 
              className="text-gray-700 leading-relaxed text-lg mb-6"
              dangerouslySetInnerHTML={{ __html: displayDescription }}
            />

            {/* Course Info */}
            <div className="mt-6 pt-6 border-t border-gray-200/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-xl">📚</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Chapters</p>
                    <p className="text-lg font-bold text-gray-900">{displayChapters} Chapters</p>
                  </div>
                </div>

                {course.sections && course.sections.length > 0 && (
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xl">🎥</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Lectures</p>
                      <p className="text-lg font-bold text-gray-900">
                        {course.sections.reduce((sum, section) => sum + (section.lectures || 0), 0)} Lectures
                      </p>
                    </div>
                  </div>
                )}
              </div>

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
          <div className="bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-2xl p-8 mt-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-2 font-medium">Total Price</p>
                <div className="flex items-baseline gap-3">
                  <p className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    ₹{displayPrice}
                  </p>
                  {course.discount > 0 && (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 line-through">
                        ₹{Math.round(displayPrice / (1 - course.discount / 100))}
                      </span>
                      <span className="text-xs text-green-600 font-semibold">
                        Save {course.discount}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleBuyNow}
                disabled={purchasing}
                className="w-full lg:w-auto bg-gradient-to-r from-red-600 to-red-700 text-white px-10 py-4 rounded-xl text-lg font-bold hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
              >
                {purchasing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart style={{ fontSize: '22px' }} />
                    Buy Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyCourseDetailPage;