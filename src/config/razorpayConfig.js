// src/config/razorpayConfig.js

/**
 * Razorpay Configuration
 * 
 * IMPORTANT: 
 * 1. Replace these values with your actual Razorpay credentials
 * 2. For development, use TEST MODE keys
 * 3. For production, use LIVE MODE keys
 * 
 * Get your keys from: https://dashboard.razorpay.com/app/keys
 */

export const RAZORPAY_CONFIG = {
    // Test Mode Keys (For Sandbox Testing)
    TEST: {
      KEY_ID: 'rzp_test_RlW0LHbsIPqB0g', // ⚠️ REPLACE THIS with your actual test key
      KEY_SECRET: '0XAbzixRBQ6ry3wKag0KMxC1', // Keep this secure, use only in backend
    },
  
    // Live Mode Keys (For Production)
    LIVE: {
      KEY_ID: 'rzp_live_YOUR_KEY_ID', // Replace with your live key
      KEY_SECRET: 'YOUR_LIVE_KEY_SECRET', // Keep this secure, use only in backend
    },
  
    // Current environment
    ENVIRONMENT: 'TEST', // Change to 'LIVE' for production
  };
  
  /**
   * Get current Razorpay Key ID based on environment
   */
  export const getRazorpayKeyId = () => {
    const keyId = RAZORPAY_CONFIG.ENVIRONMENT === 'LIVE' 
      ? RAZORPAY_CONFIG.LIVE.KEY_ID 
      : RAZORPAY_CONFIG.TEST.KEY_ID;
    
    // Validate key
    if (!keyId || keyId.includes('YOUR_KEY_ID')) {
      console.error('❌ Razorpay Key not configured! Please update razorpayConfig.js');
      return null;
    }
    
    console.log('✅ Using Razorpay key:', keyId.substring(0, 15) + '...');
    return keyId;
  };
  
  /**
   * Check if running in test mode
   */
  export const isTestMode = () => {
    return RAZORPAY_CONFIG.ENVIRONMENT === 'TEST';
  };
  
  /**
   * Company/Organization Details for Razorpay
   */
  export const COMPANY_INFO = {
    name: 'Spiritual Talk Foundation',
    logo: 'https://i.ibb.co/QXqZQYm/logo.png', // Replace with your actual logo URL
    description: 'Learning Management System',
    supportEmail: 'support@spiritualtalkfoundation.com',
    supportPhone: '+91-XXXXXXXXXX',
  };
  
  /**
   * Payment Configuration
   */
  export const PAYMENT_CONFIG = {
    currency: 'INR',
    theme: {
      color: '#dc2626', // Red color matching your brand
      backdrop_color: 'rgba(0, 0, 0, 0.5)',
    },
    modal: {
      backdropclose: false, // Don't close on backdrop click
      escape: true, // Allow escape key to close
      handleback: true, // Handle Android back button
    },
    retry: {
      enabled: true, // Allow retry on payment failure
      max_count: 3, // Maximum retry attempts
    },
  };