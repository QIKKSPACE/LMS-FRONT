// src/services/razorpayService.js - FIXED VERSION
import { doc, updateDoc, arrayUnion, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import toast from 'react-hot-toast';
import { getRazorpayKeyId, COMPANY_INFO, PAYMENT_CONFIG } from '../config/razorpayConfig';

/**
 * Load Razorpay script dynamically
 */
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // Check if script already exists
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('Razorpay script loaded successfully');
      resolve(true);
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Create a payment order and initiate Razorpay checkout
 * FIXED: Now includes onPaymentSuccess callback to refresh user data
 */
export const initiatePayment = async (courseData, userInfo, onPaymentSuccess = null) => {
  try {
    console.log('=== PAYMENT INITIATION DEBUG ===');
    console.log('Course Data:', courseData);
    console.log('Course ID:', courseData.id || courseData.courseId);
    console.log('Course Title:', courseData.title || courseData.courseName || courseData.name);
    console.log('Course Price:', courseData.price);
    console.log('User Info:', userInfo);
    console.log('================================');

    // Validate course data
    if (!courseData || !courseData.price) {
      toast.error('Invalid course data');
      return { success: false, error: 'Invalid course data' };
    }

    // Validate user info
    if (!userInfo || !userInfo.uid) {
      toast.error('Please login to purchase');
      return { success: false, error: 'User not logged in' };
    }

    // Load Razorpay script
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error('Failed to load payment gateway. Please refresh and try again.');
      return { success: false, error: 'Failed to load Razorpay' };
    }

    // Check if Razorpay is available
    if (!window.Razorpay) {
      toast.error('Payment gateway not available. Please refresh and try again.');
      return { success: false, error: 'Razorpay not available' };
    }

    // Get Razorpay Key
    const razorpayKey = getRazorpayKeyId();
    
    if (!razorpayKey || razorpayKey.includes('YOUR_KEY_ID')) {
      toast.error('Payment gateway not configured. Please contact support.');
      console.error('Razorpay key not configured properly');
      return { success: false, error: 'Payment gateway not configured' };
    }

    // Prepare payment details
    const amount = Math.round(courseData.price * 100); // Convert to paise
    const currency = PAYMENT_CONFIG.currency;
    
    // Generate unique receipt ID
    const receiptId = `rcpt_${Date.now()}_${courseData.id.substring(0, 8)}`;

    console.log('Payment details:', {
      amount,
      currency,
      receiptId,
      courseId: courseData.id,
      userId: userInfo.uid
    });

    // Create Razorpay options
    const options = {
      key: razorpayKey,
      amount: amount,
      currency: currency,
      name: COMPANY_INFO.name,
      description: `${courseData.title}`,
      image: COMPANY_INFO.logo || 'https://via.placeholder.com/150',
      
      // Customer details
      prefill: {
        name: userInfo.name || 'Student',
        email: userInfo.email || '',
        contact: userInfo.mobileNumber || '',
      },
      
      // Additional notes
      notes: {
        course_id: courseData.id,
        course_title: courseData.title,
        user_id: userInfo.uid,
        receipt_id: receiptId,
      },
      
      // Theme
      theme: {
        color: PAYMENT_CONFIG.theme.color,
      },
      
      // Payment success handler - FIXED VERSION
      handler: async function (response) {
        console.log('Payment response received:', response);
        
        // Show loading toast
        const loadingToast = toast.loading('Processing your payment...');
        
        try {
          // Prepare payment data with validation
          const paymentInfo = {
            razorpayPaymentId: response.razorpay_payment_id || '',
            razorpaySignature: response.razorpay_signature || '',
            courseId: courseData.id || courseData.courseId || '',
            courseTitle: courseData.title || courseData.courseName || courseData.name || 'Course',
            amount: courseData.price || 0,
            currency: currency,
            userId: userInfo.uid || '',
            userEmail: userInfo.email || '',
            userName: userInfo.name || '',
            receiptId: receiptId,
          };

          console.log('Saving payment with data:', paymentInfo);

          // Save payment to Firestore and get updated user data
          const result = await handlePaymentSuccess(paymentInfo);

          toast.dismiss(loadingToast);
          
          if (result.success) {
            toast.success('🎉 Payment successful! Course added to your library.', {
              duration: 4000,
            });
            
            // CRITICAL: Call the callback to refresh user data
            if (onPaymentSuccess && result.updatedUser) {
              console.log('✅ Calling onPaymentSuccess callback with updated user');
              onPaymentSuccess(result.updatedUser);
            }
            
            // Reload page after 2 seconds
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            toast.error('Payment successful but failed to add course. Please contact support.');
          }
          
        } catch (error) {
          toast.dismiss(loadingToast);
          console.error('Error saving payment:', error);
          toast.error('Payment successful but failed to add course. Please contact support with payment ID: ' + response.razorpay_payment_id);
        }
      },
      
      // Payment modal settings
      modal: {
        ondismiss: function() {
          console.log('Payment cancelled by user');
          toast.error('Payment cancelled');
        },
        escape: true,
        backdropclose: false,
      },
      
      // Retry settings
      retry: {
        enabled: true,
        max_count: 3,
      },
    };

    console.log('Opening Razorpay checkout...');

    // Open Razorpay checkout
    const paymentObject = new window.Razorpay(options);
    
    // Handle payment errors
    paymentObject.on('payment.failed', function (response) {
      console.error('Payment failed:', response.error);
      toast.error(`Payment failed: ${response.error.description || 'Unknown error'}`);
    });

    paymentObject.open();

    return { success: true };
  } catch (error) {
    console.error('Error initiating payment:', error);
    toast.error('Failed to initiate payment. Please try again.');
    return { success: false, error: error.message };
  }
};

/**
 * Handle successful payment - Save to Firestore
 * FIXED: Now returns updated user data
 */
const handlePaymentSuccess = async (paymentData) => {
  try {
    console.log('Saving payment data to Firestore...');
    console.log('Payment data received:', paymentData);

    const timestamp = new Date().toISOString();

    // Validate required fields
    if (!paymentData.userId || !paymentData.courseId) {
      throw new Error('Missing required payment data');
    }

    // 1. Get current user data
    const userDocRef = doc(db, 'users', paymentData.userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    const currentPurchasedCourses = userData.purchasedCourses || [];

    // Check if already purchased
    if (currentPurchasedCourses.includes(paymentData.courseId)) {
      console.log('⚠️ Course already purchased');
      return { success: true, alreadyPurchased: true };
    }

    // 2. Add course to user's purchased courses
    const updatedPurchasedCourses = [...currentPurchasedCourses, paymentData.courseId];
    
    await updateDoc(userDocRef, {
      purchasedCourses: updatedPurchasedCourses,
      updatedAt: timestamp
    });

    console.log('✅ Course added to user purchases:', updatedPurchasedCourses);

    // 3. Save payment transaction record
    const transactionId = `txn_${Date.now()}_${paymentData.userId.substring(0, 8)}`;
    const transactionDocRef = doc(db, 'transactions', transactionId);
    
    const transactionData = {
      transactionId: transactionId,
      razorpayPaymentId: paymentData.razorpayPaymentId || '',
      razorpaySignature: paymentData.razorpaySignature || '',
      receiptId: paymentData.receiptId || '',
      courseId: paymentData.courseId || '',
      courseTitle: paymentData.courseTitle || 'Course',
      amount: paymentData.amount || 0,
      currency: paymentData.currency || 'INR',
      userId: paymentData.userId || '',
      userEmail: paymentData.userEmail || '',
      userName: paymentData.userName || '',
      status: 'SUCCESS',
      paymentMethod: 'razorpay',
      paymentDate: timestamp,
      createdAt: timestamp,
    };

    // Remove any undefined values
    Object.keys(transactionData).forEach(key => {
      if (transactionData[key] === undefined) {
        delete transactionData[key];
      }
    });

    console.log('Saving transaction with data:', transactionData);
    
    await setDoc(transactionDocRef, transactionData);

    console.log('✅ Transaction record saved with ID:', transactionId);

    // 4. Initialize course progress for user
    const progressId = `${paymentData.userId}_${paymentData.courseId}`;
    const userCourseProgressRef = doc(db, 'userCourseProgress', progressId);
    
    const progressData = {
      progressId: progressId,
      userId: paymentData.userId,
      courseId: paymentData.courseId,
      progress: 0,
      status: 'IN_PROGRESS',
      enrolledAt: timestamp,
      lastAccessedAt: timestamp,
      completedLectures: [],
      totalLectures: 0,
      createdAt: timestamp,
    };

    // Remove any undefined values
    Object.keys(progressData).forEach(key => {
      if (progressData[key] === undefined) {
        delete progressData[key];
      }
    });
    
    await setDoc(userCourseProgressRef, progressData);

    console.log('✅ Course progress initialized');

    // 5. Return updated user data
    const updatedUser = {
      ...userData,
      purchasedCourses: updatedPurchasedCourses,
      updatedAt: timestamp
    };

    console.log('✅ Payment successful, returning updated user:', updatedUser);

    return { success: true, updatedUser };
  } catch (error) {
    console.error('Error saving payment data:', error);
    console.error('Error details:', error.message);
    throw error;
  }
};

/**
 * Verify if user has purchased a course
 */
export const verifyCoursePurchase = async (userId, courseId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const purchasedCourses = userData.purchasedCourses || [];
      return purchasedCourses.includes(courseId);
    }

    return false;
  } catch (error) {
    console.error('Error verifying purchase:', error);
    return false;
  }
};

/**
 * Get user's transaction history
 */
export const getUserTransactions = async (userId) => {
  try {
    console.log('Fetching transactions for user:', userId);
    return { success: true, transactions: [] };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return { success: false, error: error.message, transactions: [] };
  }
};