import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber
} from "firebase/auth";
import { auth } from "../firebase";

let recaptchaVerifier = null;
let recaptchaContainer = null;

/**
 * Clean up reCAPTCHA
 */
const cleanupRecaptcha = () => {
  try {
    console.log(' Cleaning up reCAPTCHA...');
    
    if (recaptchaVerifier) {
      try {
        recaptchaVerifier.clear();
      } catch (e) {
        console.warn(' Error clearing verifier:', e);
      }
      recaptchaVerifier = null;
    }

    if (recaptchaContainer) {
      try {
        recaptchaContainer.remove();
      } catch (e) {
        console.warn('Error removing container:', e);
      }
      recaptchaContainer = null;
    }

    const existingContainer = document.getElementById('recaptcha-container');
    if (existingContainer) {
      existingContainer.remove();
    }

    const badges = document.querySelectorAll('.grecaptcha-badge');
    badges.forEach(badge => {
      try {
        badge.remove();
      } catch (e) {
        console.warn(' Error removing badge:', e);
      }
    });

    console.log(' reCAPTCHA cleanup complete');
  } catch (error) {
    console.error(' Error during cleanup:', error);
  }
};

/**
 *  Initialize reCAPTCHA with better error handling
 */
const initializeRecaptcha = () => {
  try {
    console.log(' Initializing reCAPTCHA...');

    cleanupRecaptcha();

    recaptchaContainer = document.createElement('div');
    recaptchaContainer.id = 'recaptcha-container';
    document.body.appendChild(recaptchaContainer);

    console.log(' Created new reCAPTCHA container');

    //  FIX: Add more robust configuration
    recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: (response) => {
        console.log(' reCAPTCHA solved:', response);
      },
      'expired-callback': () => {
        console.warn(' reCAPTCHA expired, cleaning up...');
        cleanupRecaptcha();
      },
      'error-callback': (error) => {
        console.error(' reCAPTCHA error:', error);
        cleanupRecaptcha();
      }
    });

    console.log(' reCAPTCHA verifier created');
    return recaptchaVerifier;
  } catch (error) {
    console.error(' Error initializing reCAPTCHA:', error);
    cleanupRecaptcha();
    throw error;
  }
};

/**
 *  Send OTP - Enhanced error handling for localhost + network errors
 */
export const verifyPhoneNumber = async (phoneNumber) => {
  try {
    console.log('📱 Starting phone verification for:', phoneNumber);

    if (!phoneNumber || phoneNumber.length !== 10) {
      return {
        success: false,
        error: 'Invalid phone number. Must be 10 digits.'
      };
    }

    const formattedNumber = `+91${phoneNumber}`;
    console.log(' Formatted number:', formattedNumber);

    //  CRITICAL: Check if this is a test number
    const testNumbers = ['9999999999', '9999999998', '9889019153'];
    const isTestNumber = testNumbers.includes(phoneNumber);
    
    if (isTestNumber) {
      console.log(' Using test phone number - will use test OTP');
    }

    //  Check internet connectivity first
    if (!navigator.onLine) {
      console.error(' No internet connection detected');
      return {
        success: false,
        error: 'No internet connection. Please check your network.'
      };
    }

    const appVerifier = initializeRecaptcha();

    console.log(' Sending OTP...');

    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedNumber,
        appVerifier
      );

      console.log(' OTP sent successfully');
      window.phoneConfirmationResult = confirmationResult;

      return {
        success: true,
        verificationId: 'stored',
        message: isTestNumber 
          ? ' Test number detected. Use test OTP from Firebase Console' 
          : 'OTP sent successfully'
      };
    } catch (error) {
      console.error(' signInWithPhoneNumber error:', error);
      
      //  Handle specific errors
      if (error.code === 'auth/network-request-failed') {
        console.error(' NETWORK ERROR');
        console.error(' Possible causes:');
        console.error('   1. Firewall/Antivirus blocking Firebase');
        console.error('   2. Corporate network restrictions');
        console.error('   3. DNS issues');
        console.error('   4. VPN/Proxy interference');
        
        return {
          success: false,
          error: ' Network error. Please check:\n1. Firewall/antivirus settings\n2. VPN is disabled\n3. Internet connection is stable\n\nTry: Open incognito mode or different browser'
        };
      }
      
      if (error.code === 'auth/invalid-app-credential') {
        console.error(' INVALID APP CREDENTIAL ERROR');
        console.error(' This means:');
        console.error('   1. You need to set up test phone numbers in Firebase Console');
        console.error('   2. OR enable App Check in Firebase');
        console.error('   3. OR your Firebase project settings need verification');
        
        return {
          success: false,
          error: ' Phone verification not configured.\n\nFor development: Set up test phone numbers in Firebase Console\nPhone: +919999999999, Code: 123456'
        };
      }
      
      throw error;
    }
  } catch (error) {
    console.error(' Error sending OTP:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);

    cleanupRecaptcha();
    window.phoneConfirmationResult = null;

    return {
      success: false,
      error: getErrorMessage(error.code) || error.message
    };
  }
};

/**
 *  Verify OTP
 */
export const verifyOTP = async (verificationId, otpCode) => {
  try {
    console.log(' Verifying OTP code...');

    if (!otpCode || otpCode.length !== 6) {
      return {
        success: false,
        error: 'Invalid OTP. Must be 6 digits.'
      };
    }

    const confirmationResult = window.phoneConfirmationResult;

    if (!confirmationResult) {
      return {
        success: false,
        error: 'No verification in progress. Please request OTP again.'
      };
    }

    console.log(' Confirming OTP...');

    const result = await confirmationResult.confirm(otpCode);

    console.log(' OTP verified successfully');
    console.log(' User:', result.user.uid);
    console.log(' Phone number:', result.user.phoneNumber);

    cleanupRecaptcha();
    window.phoneConfirmationResult = null;

    return {
      success: true,
      user: result.user,
      phoneNumber: result.user.phoneNumber,
      message: 'Phone number verified successfully'
    };
  } catch (error) {
    console.error(' Error verifying OTP:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);

    return {
      success: false,
      error: getErrorMessage(error.code) || 'Invalid OTP code'
    };
  }
};

/**
 *  Cleanup function
 */
export const cleanupPhoneVerification = () => {
  cleanupRecaptcha();
  window.phoneConfirmationResult = null;
  console.log(' Phone verification cleaned up');
};

/**
 *  Enhanced error messages with network troubleshooting
 */
const getErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/invalid-phone-number': 'Invalid phone number format',
    'auth/missing-phone-number': 'Phone number is required',
    'auth/captcha-check-failed': 'Security verification failed. Please try again.',
    'auth/invalid-app-credential': ' Phone verification requires setup.\n\n Quick Fix:\n1. Open Firebase Console\n2. Add test phone: +919999999999\n3. Add test code: 123456\n4. Save and try again',
    'auth/invalid-verification-code': 'Invalid OTP code. Please check and try again.',
    'auth/invalid-verification-id': 'Verification session expired. Please request a new OTP.',
    'auth/code-expired': 'OTP has expired. Please request a new one.',
    'auth/too-many-requests': 'Too many attempts. Please try again in 1-2 minutes.',
    'auth/quota-exceeded': 'Daily SMS limit reached. Use test phone numbers for development.',
    'auth/network-request-failed': ' Network connection failed.\n\n Try:\n1. Disable firewall/antivirus temporarily\n2. Turn off VPN\n3. Use incognito mode\n4. Try different browser\n5. Check internet connection\n\nIf on corporate network: Contact IT',
  };

  return errorMessages[errorCode] || `Verification error: ${errorCode || 'Unknown error'}`;
};