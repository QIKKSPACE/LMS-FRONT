import { sendPasswordResetEmail, confirmPasswordReset } from "firebase/auth";
import { auth } from "../firebase";

/**
 *  Send password reset email to user
 * @param {string} email - User's email address
 * @returns {Promise<object>} - Success/error result
 */
export const sendResetPasswordEmail = async (email) => {
  try {
    console.log('📧 Sending password reset email to:', email);

    if (!email || !email.trim()) {
      return {
        success: false,
        error: 'Email is required'
      };
    }

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'Invalid email format'
      };
    }

    // Firebase will send reset email
    await sendPasswordResetEmail(auth, email.trim());

    console.log('✅ Password reset email sent successfully');

    return {
      success: true,
      message: 'Password reset email sent successfully. Please check your inbox.'
    };

  } catch (error) {
    console.error('❌ Error sending reset email:', error);
    return {
      success: false,
      error: getResetErrorMessage(error.code)
    };
  }
};

/**
 *  Verify password reset code
 * @param {string} oobCode - Reset code from email link
 * @returns {Promise<object>} - Verification result
 */
export const verifyResetCode = async (oobCode) => {
  try {
    console.log(' Verifying reset code...');

    if (!oobCode) {
      return {
        success: false,
        error: 'Invalid reset code'
      };
    }

    // Verify the code (this doesn't reset password yet)
    const { verifyPasswordResetCode } = await import("firebase/auth");
    const email = await verifyPasswordResetCode(auth, oobCode);

    console.log(' Reset code verified for:', email);

    return {
      success: true,
      email: email
    };

  } catch (error) {
    console.error(' Error verifying reset code:', error);
    return {
      success: false,
      error: getResetErrorMessage(error.code)
    };
  }
};

/**
 *  Reset password with code
 * @param {string} oobCode - Reset code from email link
 * @param {string} newPassword - New password
 * @returns {Promise<object>} - Reset result
 */
export const resetPasswordWithCode = async (oobCode, newPassword) => {
  try {
    console.log(' Resetting password...');

    if (!oobCode) {
      return {
        success: false,
        error: 'Invalid reset code'
      };
    }

    if (!newPassword || newPassword.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters long'
      };
    }

    // Confirm password reset
    await confirmPasswordReset(auth, oobCode, newPassword);

    console.log(' Password reset successfully');

    return {
      success: true,
      message: 'Password reset successfully. You can now login with your new password.'
    };

  } catch (error) {
    console.error(' Error resetting password:', error);
    return {
      success: false,
      error: getResetErrorMessage(error.code)
    };
  }
};

/**
 * Convert Firebase error codes to user-friendly messages
 */
const getResetErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address';
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/expired-action-code':
      return 'Password reset link has expired. Please request a new one.';
    case 'auth/invalid-action-code':
      return 'Invalid or expired reset link. Please request a new one.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use a stronger password.';
    case 'auth/too-many-requests':
      return 'Too many requests. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    default:
      return 'An error occurred. Please try again.';
  }
};