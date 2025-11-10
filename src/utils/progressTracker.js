/**
 * Progress Tracker Utility
 * 
 * Handles progress tracking for courses based on completed lectures
 */

import { checkCourseExpiry } from './courseExpiry';

// Load progress from localStorage
export const loadProgress = (courseId) => {
  try {
    const savedProgress = localStorage.getItem(`course_progress_${courseId}`);
    return savedProgress ? JSON.parse(savedProgress) : null;
  } catch (error) {
    console.error('Error loading progress:', error);
    return null;
  }
};

// Save progress to localStorage
export const saveProgress = (courseId, courseData) => {
  try {
    localStorage.setItem(`course_progress_${courseId}`, JSON.stringify(courseData));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('courseProgressUpdated', { 
      detail: { courseId, courseData } 
    }));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

// Calculate progress percentage based on completed lectures
export const calculateProgress = (sections) => {
  if (!sections || sections.length === 0) return 0;
  
  let totalLectures = 0;
  let completedLectures = 0;
  
  sections.forEach((section) => {
    if (section.lecturesList && section.lecturesList.length > 0) {
      totalLectures += section.lecturesList.length;
      completedLectures += section.lecturesList.filter(
        (lecture) => lecture.isCompleted
      ).length;
    }
  });
  
  if (totalLectures === 0) return 0;
  return Math.round((completedLectures / totalLectures) * 100);
};

// Update section completed count
export const updateSectionCompleted = (section) => {
  if (!section.lecturesList || section.lecturesList.length === 0) {
    return { ...section, completed: 0 };
  }
  
  const completedCount = section.lecturesList.filter(
    (lecture) => lecture.isCompleted
  ).length;
  
  return { ...section, completed: completedCount };
};

// Toggle lecture completion
export const toggleLectureCompletion = (course, sectionId, lectureId) => {
  const updatedSections = course.sections.map((section) => {
    if (section.id === sectionId) {
      const updatedLecturesList = section.lecturesList.map((lecture) => {
        if (lecture.id === lectureId) {
          return { ...lecture, isCompleted: !lecture.isCompleted };
        }
        return lecture;
      });
      
      const updatedSection = {
        ...section,
        lecturesList: updatedLecturesList,
      };
      
      return updateSectionCompleted(updatedSection);
    }
    return section;
  });
  
  const progress = calculateProgress(updatedSections);
  
  let newStatus = course.status;
  if (progress === 100) {
    newStatus = 'COMPLETED';
  } else if (progress > 0) {
    newStatus = 'IN_PROGRESS';
  }
  
  const updatedCourse = {
    ...course,
    sections: updatedSections,
    progress: progress,
    status: newStatus,
  };
  
  // Check expiry date and update status if expired (but don't override COMPLETED)
  return checkCourseExpiry(updatedCourse);
};

// Initialize course with saved progress or default data
export const initializeCourseProgress = (course, defaultCourse) => {
  const savedProgress = loadProgress(course.id);
  
  if (savedProgress && savedProgress.sections) {
    // Merge saved progress with default course data
    const mergedSections = defaultCourse.sections.map((defaultSection) => {
      const savedSection = savedProgress.sections.find(
        (s) => s.id === defaultSection.id
      );
      
      if (savedSection && savedSection.lecturesList) {
        // Merge lecture completion status
        const mergedLecturesList = defaultSection.lecturesList.map((defaultLecture) => {
          const savedLecture = savedSection.lecturesList.find(
            (l) => l.id === defaultLecture.id
          );
          return savedLecture
            ? { ...defaultLecture, isCompleted: savedLecture.isCompleted }
            : defaultLecture;
        });
        
        const updatedSection = {
          ...defaultSection,
          lecturesList: mergedLecturesList,
        };
        
        return updateSectionCompleted(updatedSection);
      }
      
      return defaultSection;
    });
    
    const progress = calculateProgress(mergedSections);
    
    let newStatus = defaultCourse.status;
    if (progress === 100) {
      newStatus = 'COMPLETED';
    } else if (progress > 0) {
      newStatus = 'IN_PROGRESS';
    }
    
    const updatedCourse = {
      ...defaultCourse,
      sections: mergedSections,
      progress: progress,
      status: newStatus,
    };
    
    // Check expiry date and update status if expired (but don't override COMPLETED)
    return checkCourseExpiry(updatedCourse);
  }
  
  // If no saved progress, calculate from default data
  const progress = calculateProgress(defaultCourse.sections);
  const sectionsWithCompleted = defaultCourse.sections.map(updateSectionCompleted);
  
  let newStatus = defaultCourse.status;
  if (progress === 100) {
    newStatus = 'COMPLETED';
  } else if (progress > 0) {
    newStatus = 'IN_PROGRESS';
  }
  
  const updatedCourse = {
    ...defaultCourse,
    sections: sectionsWithCompleted,
    progress: progress,
    status: newStatus,
  };
  
  // Check expiry date and update status if expired (but don't override COMPLETED)
  return checkCourseExpiry(updatedCourse);
};

