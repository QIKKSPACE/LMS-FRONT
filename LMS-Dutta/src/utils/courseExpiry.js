// src/utils/courseExpiry.js

/**
 * Format expiry date for display
 */
export const formatExpiryDate = (expiryDate) => {
  try {
    if (!expiryDate) return 'No expiry';

    const date = new Date(expiryDate);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    // Format: DD MMM YYYY (e.g., 25 Nov 2024)
    const day = date.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  } catch (error) {
    console.error('Error formatting expiry date:', error);
    return 'Invalid date';
  }
};

/**
 * Get number of days until course expires
 * Returns null if no expiry date, negative if expired
 */
export const getDaysUntilExpiry = (expiryDate) => {
  try {
    if (!expiryDate) return null;

    const expiry = new Date(expiryDate);
    const now = new Date();

    // Check if date is valid
    if (isNaN(expiry.getTime())) {
      return null;
    }

    // Set both dates to start of day for accurate day calculation
    expiry.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  } catch (error) {
    console.error('Error calculating days until expiry:', error);
    return null;
  }
};

/**
 * Check if course has expired and update status
 */
export const checkCourseExpiry = (course) => {
  try {
    if (!course) return course;

    // If no expiry date, return as is
    if (!course.expiryDate) {
      return course;
    }

    const daysLeft = getDaysUntilExpiry(course.expiryDate);

    // If expired (negative days or 0)
    if (daysLeft !== null && daysLeft < 0) {
      return {
        ...course,
        status: 'EXPIRED',
        isExpired: true
      };
    }

    // If expiring soon (within 7 days)
    if (daysLeft !== null && daysLeft <= 7) {
      return {
        ...course,
        isExpiringSoon: true,
        daysUntilExpiry: daysLeft
      };
    }

    return course;
  } catch (error) {
    console.error('Error checking course expiry:', error);
    return course;
  }
};

/**
 * Check if course is expired
 */
export const isCourseExpired = (expiryDate) => {
  try {
    if (!expiryDate) return false;

    const expiry = new Date(expiryDate);
    const now = new Date();

    return expiry < now;
  } catch (error) {
    console.error('Error checking if course expired:', error);
    return false;
  }
};

/**
 * Get expiry status message
 */
export const getExpiryStatusMessage = (expiryDate) => {
  try {
    if (!expiryDate) {
      return { message: 'Lifetime access', type: 'success' };
    }

    const daysLeft = getDaysUntilExpiry(expiryDate);

    if (daysLeft === null) {
      return { message: 'Lifetime access', type: 'success' };
    }

    if (daysLeft < 0) {
      return { 
        message: `Expired on ${formatExpiryDate(expiryDate)}`, 
        type: 'error' 
      };
    }

    if (daysLeft === 0) {
      return { 
        message: 'Expires today!', 
        type: 'warning' 
      };
    }

    if (daysLeft <= 7) {
      return { 
        message: `${daysLeft} day${daysLeft > 1 ? 's' : ''} remaining`, 
        type: 'warning' 
      };
    }

    return { 
      message: `Valid until ${formatExpiryDate(expiryDate)}`, 
      type: 'info' 
    };
  } catch (error) {
    console.error('Error getting expiry status:', error);
    return { message: 'Unknown status', type: 'info' };
  }
};