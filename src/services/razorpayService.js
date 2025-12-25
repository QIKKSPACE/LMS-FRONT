// src/services/razorpayService.js - FIXED VERSION
import { getRazorpayKeyId, COMPANY_INFO, PAYMENT_CONFIG } from '../config/razorpayConfig';
import toast from 'react-hot-toast';

// ✅ YOUR CLOUD FUNCTION URL
const CLOUD_FUNCTION_URL = "https://verifypayment-7a4qi5ahaa-uc.a.run.app";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('✅ Razorpay script loaded');
      resolve(true);
    };
    script.onerror = () => {
      console.error('❌ Failed to load Razorpay');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const initiatePayment = async (courseData, userInfo, onPaymentSuccess = null) => {
  try {
    console.log('💳 Initiating payment...');

    // Validate
    if (!courseData || !courseData.price) {
      toast.error('Invalid course data');
      return { success: false, error: 'Invalid course data' };
    }

    if (!userInfo || !userInfo.uid) {
      toast.error('Please login to purchase');
      return { success: false, error: 'User not logged in' };
    }

    // Load Razorpay
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error('Failed to load payment gateway');
      return { success: false, error: 'Failed to load Razorpay' };
    }

    if (!window.Razorpay) {
      toast.error('Payment gateway not available');
      return { success: false, error: 'Razorpay not available' };
    }

    // Get key
    const razorpayKey = getRazorpayKeyId();
    if (!razorpayKey) {
      toast.error('Payment gateway not configured');
      return { success: false, error: 'Payment gateway not configured' };
    }

    // Payment details
    const amount = Math.round(courseData.price * 100); // Paise
    const currency = PAYMENT_CONFIG.currency;

    console.log('💰 Payment amount:', amount / 100, currency);

    // Razorpay options
    const options = {
      key: razorpayKey,
      amount: amount,
      currency: currency,
      name: COMPANY_INFO.name,
      description: `${courseData.title}`,
      image: COMPANY_INFO.logo,
      
      prefill: {
        name: userInfo.name || 'Student',
        email: userInfo.email || '',
        contact: userInfo.mobileNumber || '',
      },
      
      notes: {
        course_id: courseData.id,
        course_title: courseData.title,
        user_id: userInfo.uid,
      },
      
      theme: {
        color: PAYMENT_CONFIG.theme.color,
      },
      
      // ✅ FIXED: Payment success handler with proper undefined handling
      handler: async function (response) {
        console.log('✅ Payment response received:', response);
        
        // Log what Razorpay returned
        console.log('🔍 Razorpay response fields:', {
          payment_id: response.razorpay_payment_id,
          order_id: response.razorpay_order_id || 'N/A',
          signature: response.razorpay_signature || 'N/A'
        });
        
        const loadingToast = toast.loading('Verifying payment...');
        
        try {
          console.log('🔐 Calling backend verification...');
          
          // ✅ CRITICAL FIX: Only send defined values
          const paymentPayload = {
            // Required fields
            razorpay_payment_id: response.razorpay_payment_id,
            courseId: courseData.id,
            userId: userInfo.uid,
            
            // Optional fields - only include if they exist
            ...(response.razorpay_order_id && { razorpay_order_id: response.razorpay_order_id }),
            ...(response.razorpay_signature && { razorpay_signature: response.razorpay_signature }),
            
            // Course details
            courseTitle: courseData.title || courseData.courseTitle || 'Course',
            amount: courseData.price || 0,
            currency: currency,
            
            // User details
            userEmail: userInfo.email || '',
            userName: userInfo.name || '',
          };

          console.log('📤 Sending payload to backend:', paymentPayload);
          
          const verificationResponse = await fetch(CLOUD_FUNCTION_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentPayload),
          });

          console.log('📡 Backend response status:', verificationResponse.status);
          
          const verificationData = await verificationResponse.json();
          console.log('📦 Verification response:', verificationData);
          
          toast.dismiss(loadingToast);

          if (verificationData.success) {
            toast.success('🎉 Payment verified! Course added to your library.', {
              duration: 4000,
            });
            
            console.log('✅ Payment verification successful!');
            
            // Call success callback
            if (onPaymentSuccess) {
              console.log('✅ Calling success callback');
              onPaymentSuccess(userInfo);
            }
            
            // Reload after 2 seconds
            setTimeout(() => {
              console.log('🔄 Reloading page...');
              window.location.reload();
            }, 2000);
            
          } else {
            console.error('❌ Verification failed:', verificationData.error);
            toast.error(verificationData.error || 'Payment verification failed');
          }
          
        } catch (error) {
          toast.dismiss(loadingToast);
          console.error('❌ Error during verification:', error);
          toast.error('Payment verification failed. Please contact support with payment ID: ' + response.razorpay_payment_id);
        }
      },
      
      modal: {
        ondismiss: function() {
          console.log('❌ Payment cancelled by user');
          toast.error('Payment cancelled');
        },
        escape: true,
        backdropclose: false,
      },
      
      retry: {
        enabled: true,
        max_count: 3,
      },
    };

    console.log('🚀 Opening Razorpay checkout...');

    const paymentObject = new window.Razorpay(options);
    
    paymentObject.on('payment.failed', function (response) {
      console.error('❌ Payment failed:', response.error);
      toast.error(`Payment failed: ${response.error.description || 'Unknown error'}`);
    });

    paymentObject.open();

    return { success: true };
    
  } catch (error) {
    console.error('❌ Error initiating payment:', error);
    toast.error('Failed to initiate payment');
    return { success: false, error: error.message };
  }
};

/**
 * Verify if user has purchased a course
 */
export const verifyCoursePurchase = async (userId, courseId) => {
  try {
    // This would need to be implemented with your backend
    console.log('Verifying purchase for:', userId, courseId);
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
    const url = `https://us-central1-stf-web-34a3b.cloudfunctions.net/getUserTransactions?userId=${userId}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.success) {
      return { success: true, transactions: data.transactions };
    } else {
      return { success: false, error: data.error, transactions: [] };
    }
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return { success: false, error: error.message, transactions: [] };
  }
};