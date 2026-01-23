// src/utils/toast.js - Custom Toast Utility
import toast from 'react-hot-toast';

/**
 * ✅ Custom Toast Notifications with Enhanced Styling
 * Use these instead of plain toast.success(), toast.error() etc.
 */

// Success Toast
export const showSuccess = (message, options = {}) => {
  return toast.success(message, {
    duration: 3500,
    icon: '✅',
    style: {
      background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
      color: '#065f46',
      border: '2px solid #10b981',
      fontWeight: '600',
    },
    ...options,
  });
};

// Error Toast
export const showError = (message, options = {}) => {
  return toast.error(message, {
    duration: 5000,
    icon: '❌',
    style: {
      background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
      color: '#991b1b',
      border: '2px solid #ef4444',
      fontWeight: '600',
    },
    ...options,
  });
};

// Warning Toast
export const showWarning = (message, options = {}) => {
  return toast(message, {
    duration: 4000,
    icon: '⚠️',
    style: {
      background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
      color: '#854d0e',
      border: '2px solid #eab308',
      fontWeight: '600',
    },
    ...options,
  });
};

// Info Toast
export const showInfo = (message, options = {}) => {
  return toast(message, {
    duration: 4000,
    icon: 'ℹ️',
    style: {
      background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
      color: '#1e40af',
      border: '2px solid #3b82f6',
      fontWeight: '600',
    },
    ...options,
  });
};

// Loading Toast
export const showLoading = (message = 'Loading...', options = {}) => {
  return toast.loading(message, {
    icon: '⏳',
    style: {
      background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
      color: '#374151',
      border: '2px solid #9ca3af',
      fontWeight: '600',
    },
    ...options,
  });
};

// Promise Toast (for async operations)
export const showPromise = (promise, messages, options = {}) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Success!',
      error: messages.error || 'Something went wrong',
    },
    {
      style: {
        minWidth: '320px',
        fontWeight: '600',
      },
      success: {
        duration: 3500,
        icon: '✅',
        style: {
          background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
          color: '#065f46',
          border: '2px solid #10b981',
        },
      },
      error: {
        duration: 5000,
        icon: '❌',
        style: {
          background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
          color: '#991b1b',
          border: '2px solid #ef4444',
        },
      },
      loading: {
        icon: '⏳',
        style: {
          background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
          color: '#374151',
          border: '2px solid #9ca3af',
        },
      },
      ...options,
    }
  );
};

// Custom Toast with Icon
export const showCustom = (message, icon = '📢', options = {}) => {
  return toast(message, {
    duration: 4000,
    icon: icon,
    style: {
      background: '#ffffff',
      color: '#1f2937',
      border: '2px solid #e5e7eb',
      fontWeight: '600',
    },
    ...options,
  });
};

// Dismiss a specific toast
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

// Dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};

// Remove a specific toast
export const removeToast = (toastId) => {
  toast.remove(toastId);
};

/**
 * ✅ Pre-configured toasts for common scenarios
 */

// Authentication
export const authToasts = {
  loginSuccess: () => showSuccess('✅ Login successful! Welcome back!'),
  loginError: (error) => showError(`❌ Login failed: ${error}`),
  signupSuccess: () => showSuccess('✅ Account created successfully!'),
  signupError: (error) => showError(`❌ Signup failed: ${error}`),
  logoutSuccess: () => showInfo('👋 Logged out successfully'),
};

// Payment
export const paymentToasts = {
  verifying: () => showLoading('Verifying payment...'),
  success: () => showSuccess('🎉 Payment verified! Course added to your library.', { duration: 4000 }),
  failed: (error) => showError(`❌ Payment verification failed: ${error}`, { duration: 6000 }),
  cancelled: () => showWarning('⚠️ Payment cancelled'),
};

// Course Progress
export const progressToasts = {
  lectureCompleted: () => showSuccess('✅ Lecture completed!', { duration: 2000 }),
  courseCompleted: () => showSuccess('🎉 Congratulations! Course completed!', { duration: 4000 }),
  progressSaved: () => showInfo('💾 Progress saved', { duration: 1500 }),
};

// Profile
export const profileToasts = {
  updateSuccess: () => showSuccess('✅ Profile updated successfully!'),
  updateError: (error) => showError(`❌ Update failed: ${error}`),
  phoneVerified: () => showSuccess('✅ Phone number verified successfully!'),
  otpSent: () => showInfo('📧 OTP sent! Check your messages.'),
  otpInvalid: () => showError('❌ Invalid OTP. Please try again.'),
};

// Network
export const networkToasts = {
  offline: () => showError('❌ No internet connection'),
  online: () => showSuccess('✅ Back online'),
  error: () => showError('❌ Network error. Please try again.'),
};

// Example usage in your components:
/*
import { showSuccess, showError, authToasts, paymentToasts } from '@/utils/toast';

// Simple usage
showSuccess('Operation successful!');
showError('Something went wrong!');

// Pre-configured toasts
authToasts.loginSuccess();
paymentToasts.verifying();

// Custom options
showSuccess('Custom duration!', { duration: 10000 });
showError('With position', { position: 'bottom-center' });

// Promise toast
const fetchData = async () => {
  // your async operation
};

showPromise(fetchData(), {
  loading: 'Fetching data...',
  success: 'Data loaded!',
  error: 'Failed to load data'
});
*/

export default {
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo,
  loading: showLoading,
  promise: showPromise,
  custom: showCustom,
  dismiss: dismissToast,
  dismissAll: dismissAllToasts,
  remove: removeToast,
  auth: authToasts,
  payment: paymentToasts,
  progress: progressToasts,
  profile: profileToasts,
  network: networkToasts,
};