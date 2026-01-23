import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Close, Email, CheckCircle } from '@mui/icons-material';
import { sendResetPasswordEmail } from '../services/passwordResetService';
import toast from 'react-hot-toast';

/**
 * ✅ Forgot Password Modal Component
 */
const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      console.log('📧 Requesting password reset for:', email);

      const result = await sendResetPasswordEmail(email.trim());

      if (result.success) {
        console.log('✅ Reset email sent successfully');
        setIsSuccess(true);
        toast.success('Password reset email sent! Check your inbox.', {
          duration: 5000,
          icon: '✉️'
        });

        // Close modal after 3 seconds
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        console.error('❌ Failed to send reset email:', result.error);
        toast.error(result.error || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('❌ Exception:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setIsSuccess(false);
    setIsLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-6 py-8 text-white">
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  <Close style={{ fontSize: '24px' }} />
                </button>

                {/* Icon */}
                <motion.div
                  className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  {isSuccess ? (
                    <CheckCircle style={{ fontSize: '32px', color: 'white' }} />
                  ) : (
                    <Email style={{ fontSize: '32px', color: 'white' }} />
                  )}
                </motion.div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-center">
                  {isSuccess ? 'Email Sent!' : 'Forgot Password?'}
                </h2>
                <p className="text-white/90 text-sm text-center mt-2">
                  {isSuccess 
                    ? 'Check your inbox for reset instructions' 
                    : 'Enter your email to receive reset link'
                  }
                </p>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                {isSuccess ? (
                  // Success Message
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle style={{ fontSize: '40px', color: '#10b981' }} />
                    </div>
                    <p className="text-gray-700 mb-2">
                      We've sent a password reset link to:
                    </p>
                    <p className="font-bold text-gray-900 mb-4">{email}</p>
                    <p className="text-sm text-gray-600">
                      Please check your inbox and spam folder. The link will expire in 1 hour.
                    </p>
                  </motion.div>
                ) : (
                  // Email Form
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Email style={{ fontSize: '20px', color: '#9ca3af' }} />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                          placeholder="Enter your email"
                          disabled={isLoading}
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isLoading || !email.trim()}
                      className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: isLoading ? 1 : 1.02 }}
                      whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Sending...
                        </div>
                      ) : (
                        'Send Reset Link'
                      )}
                    </motion.button>

                    {/* Help Text */}
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Remember your password?{' '}
                        <button
                          type="button"
                          onClick={handleClose}
                          className="text-red-600 font-semibold hover:text-red-700 transition-colors"
                          disabled={isLoading}
                        >
                          Back to Login
                        </button>
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ForgotPasswordModal;