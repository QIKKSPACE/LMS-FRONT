/**
 * Course Expiry Utility
 * 
 * Handles course expiry date checking and status updates
 */

// Check if a course is expired
export const isCourseExpired = (expiryDate) => {
  if (!expiryDate) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
  
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  
  return today > expiry;
};

// Get days until expiry (negative if expired)
export const getDaysUntilExpiry = (expiryDate) => {
  if (!expiryDate) return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Format expiry date for display
export const formatExpiryDate = (expiryDate) => {
  if (!expiryDate) return null;
  
  const date = new Date(expiryDate);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Check and update course status based on expiry date
export const checkCourseExpiry = (course) => {
  if (!course) return course;
  
  // If course is already completed, don't mark as expired
  if (course.status === 'COMPLETED') {
    return course;
  }
  
  // Check if course has expired
  if (course.expiryDate && isCourseExpired(course.expiryDate)) {
    return {
      ...course,
      status: 'EXPIRED',
    };
  }
  
  return course;
};

