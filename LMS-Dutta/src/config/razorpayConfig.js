// src/config/razorpayConfig.js - FIXED VERSION

/**
 * ✅ SECURE: Razorpay Configuration using Environment Variables
 */

/**
 * Get Razorpay Key ID from environment variables
 */
export const getRazorpayKeyId = () => {
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
  
  if (!keyId) {
    console.error('❌ RAZORPAY KEY NOT CONFIGURED!');
    return null;
  }
  
  if (!keyId.startsWith('rzp_')) {
    console.error('❌ Invalid Razorpay Key format!');
    return null;
  }
  
  const isLive = keyId.startsWith('rzp_live_');
  const mode = isLive ? '🔴 LIVE' : '🟡 TEST';
  
  console.log(`✅ Razorpay Key Loaded: ${mode} MODE`);
  console.log(`🔑 Key ID: ${keyId.substring(0, 15)}...`);
  
  return keyId;
};

/**
 * Check if running in test mode
 */
export const isTestMode = () => {
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
  return keyId && keyId.startsWith('rzp_test_');
};

/**
 * Check if running in live mode
 */
export const isLiveMode = () => {
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
  return keyId && keyId.startsWith('rzp_live_');
};

/**
 * Company/Organization Details for Razorpay
 * ✅ FIXED: Using working placeholder logo
 */
export const COMPANY_INFO = {
  name: 'Spiritual Talk Foundation',
  // ✅ FIXED: Using a working placeholder logo (no 404 error)
  logo: 'https://ui-avatars.com/api/?name=Spiritual+Talk&background=dc2626&color=fff&size=200&font-size=0.4&bold=true',
  // Alternative options:
  // logo: 'https://placehold.co/200x200/dc2626/white?text=STF',
  // logo: '/logo.png', // Use this if you have logo.png in public/ folder
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
    color: '#dc2626',
    backdrop_color: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backdropclose: false,
    escape: true,
    handleback: true,
  },
  retry: {
    enabled: true,
    max_count: 3,
  },
};

/**
 * Validate Razorpay configuration
 */
export const validateRazorpayConfig = () => {
  const keyId = getRazorpayKeyId();
  
  if (!keyId) {
    console.error('❌ Razorpay configuration is invalid!');
    return false;
  }
  
  console.log('✅ Razorpay configuration is valid');
  return true;
};

// Validate configuration on module load
if (import.meta.env.MODE !== 'test') {
  validateRazorpayConfig();
}