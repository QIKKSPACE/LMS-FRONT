// src/services/razorpayService.js - WITH VALIDITY MONTHS
import { getRazorpayKeyId, COMPANY_INFO, PAYMENT_CONFIG } from '../config/razorpayConfig';
import toast from 'react-hot-toast';

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

/**
 * ✅ UPDATED: Initiate payment with validity months support
 */
export const initiatePayment = async (courseData, userInfo, onPaymentSuccess = null) => {
  try {
    console.log('💳 Initiating payment...');

    if (!courseData || !courseData.price) {
      toast.error('Invalid course data');
      return { success: false, error: 'Invalid course data' };
    }

    if (!userInfo || !userInfo.uid) {
      toast.error('Please login to purchase');
      return { success: false, error: 'User not logged in' };
    }

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error('Failed to load payment gateway');
      return { success: false, error: 'Failed to load Razorpay' };
    }

    if (!window.Razorpay) {
      toast.error('Payment gateway not available');
      return { success: false, error: 'Razorpay not available' };
    }

    const razorpayKey = getRazorpayKeyId();
    if (!razorpayKey) {
      toast.error('Payment gateway not configured');
      return { success: false, error: 'Payment gateway not configured' };
    }

    const amount = Math.round(courseData.price * 100);
    const currency = PAYMENT_CONFIG.currency;

    // ✅ CRITICAL: Get validity months from course
    const validityMonths = parseInt(courseData.courseValidity || courseData.validityMonths || 1);
    
    console.log('💰 Payment details:', {
      amount: amount / 100,
      currency,
      validityMonths,
      courseId: courseData.id
    });

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
        validity_months: validityMonths, // ✅ Send validity to backend
      },
      
      theme: {
        color: PAYMENT_CONFIG.theme.color,
      },
      
      handler: async function (response) {
        console.log('✅ Payment response received:', response);
        
        const loadingToast = toast.loading('Verifying payment...');
        
        try {
          console.log('🔐 Calling backend verification...');
          
          // ✅ CRITICAL: Include validityMonths in payment verification
          const paymentPayload = {
            razorpay_payment_id: response.razorpay_payment_id,
            courseId: courseData.id,
            userId: userInfo.uid,
            
            ...(response.razorpay_order_id && { razorpay_order_id: response.razorpay_order_id }),
            ...(response.razorpay_signature && { razorpay_signature: response.razorpay_signature }),
            
            courseTitle: courseData.title || courseData.courseTitle || 'Course',
            amount: courseData.price || 0,
            currency: currency,
            validityMonths: validityMonths, // ✅ Send to backend
            
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
            
            if (onPaymentSuccess) {
              console.log('✅ Calling success callback');
              onPaymentSuccess(userInfo);
            }
            
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

export const verifyCoursePurchase = async (userId, courseId) => {
  try {
    console.log('Verifying purchase for:', userId, courseId);
    return false;
  } catch (error) {
    console.error('Error verifying purchase:', error);
    return false;
  }
};

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