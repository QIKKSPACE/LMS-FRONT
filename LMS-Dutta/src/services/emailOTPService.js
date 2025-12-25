const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
 
  const otpStore = new Map();
  
  export const sendEmailOTP = async (phoneNumber) => {
    try {
      console.log('📧 Sending OTP via Email for phone:', phoneNumber);
  
      // Validate phone number
      if (!phoneNumber || phoneNumber.length !== 10) {
        return {
          success: false,
          error: 'Invalid phone number. Must be 10 digits.'
        };
      }
  
      // Generate OTP
      const otp = generateOTP();
      const expiryTime = Date.now() + 5 * 60 * 1000; // 5 minutes
  
      // Store OTP with expiry
      otpStore.set(phoneNumber, {
        otp: otp,
        expiryTime: expiryTime,
        attempts: 0
      });
  
      // In production, send email here using backend service
      // For development, log to console
      console.log('═══════════════════════════════════════');
      console.log(' DEVELOPMENT MODE - OTP GENERATED');
      console.log('═══════════════════════════════════════');
      console.log('Phone Number:', phoneNumber);
      console.log(' YOUR OTP:', otp);
      console.log(' Valid for: 5 minutes');
      console.log('═══════════════════════════════════════');
  
      // Show toast with OTP (for development only)
      if (window.location.hostname === 'localhost') {
        const message = `🔐 Development OTP: ${otp}\n(Check console for details)`;
        console.warn(message);
      }
  
      return {
        success: true,
        message: 'OTP generated successfully! Check console for OTP (Development mode)',
        otp: otp // Only for development - remove in production
      };
    } catch (error) {
      console.error(' Error sending OTP:', error);
      return {
        success: false,
        error: 'Failed to generate OTP. Please try again.'
      };
    }
  };
  
  /**
   * Verify OTP
   */
  export const verifyEmailOTP = async (phoneNumber, otpCode) => {
    try {
      console.log('🔐 Verifying OTP for phone:', phoneNumber);
  
      // Validate inputs
      if (!phoneNumber || !otpCode) {
        return {
          success: false,
          error: 'Phone number and OTP are required.'
        };
      }
  
      if (otpCode.length !== 6) {
        return {
          success: false,
          error: 'OTP must be 6 digits.'
        };
      }
  
      // Get stored OTP
      const storedData = otpStore.get(phoneNumber);
  
      if (!storedData) {
        return {
          success: false,
          error: 'No OTP found. Please request a new one.'
        };
      }
  
      // Check expiry
      if (Date.now() > storedData.expiryTime) {
        otpStore.delete(phoneNumber);
        return {
          success: false,
          error: 'OTP has expired. Please request a new one.'
        };
      }
  
      // Check attempts
      if (storedData.attempts >= 3) {
        otpStore.delete(phoneNumber);
        return {
          success: false,
          error: 'Too many failed attempts. Please request a new OTP.'
        };
      }
  
      // Verify OTP
      if (storedData.otp === otpCode) {
        // Success - delete OTP
        otpStore.delete(phoneNumber);
        console.log(' OTP verified successfully!');
        
        return {
          success: true,
          message: 'Phone number verified successfully!',
          phoneNumber: `+91${phoneNumber}`
        };
      } else {
        // Wrong OTP - increment attempts
        storedData.attempts += 1;
        otpStore.set(phoneNumber, storedData);
        
        const remainingAttempts = 3 - storedData.attempts;
        console.warn(` Wrong OTP. ${remainingAttempts} attempts remaining`);
        
        return {
          success: false,
          error: `Invalid OTP. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`
        };
      }
    } catch (error) {
      console.error(' Error verifying OTP:', error);
      return {
        success: false,
        error: 'Failed to verify OTP. Please try again.'
      };
    }
  };
  
  /**
   * Resend OTP
   */
  export const resendEmailOTP = async (phoneNumber) => {
    console.log('🔄 Resending OTP for:', phoneNumber);
    
    // Delete old OTP
    otpStore.delete(phoneNumber);
    
    // Send new OTP
    return await sendEmailOTP(phoneNumber);
  };
  
  /**
   * Cleanup function
   */
  export const cleanupEmailOTP = (phoneNumber) => {
    if (phoneNumber) {
      otpStore.delete(phoneNumber);
      console.log('🧹 OTP cleaned up for:', phoneNumber);
    }
  };