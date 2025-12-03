// src/utils/progressTracker.js

/**
 * Initialize course progress for a user
 * Merges saved progress with course structure
 */
export const initializeCourseProgress = (courseData, savedProgress) => {
  try {
    console.log('Initializing course progress...');
    console.log('Course data:', courseData);
    console.log('Saved progress:', savedProgress);

    // If no sections, return course as is
    if (!courseData.sections || courseData.sections.length === 0) {
      return {
        ...courseData,
        progress: savedProgress?.progress || 0,
        status: savedProgress?.status || 'IN_PROGRESS'
      };
    }

    // Get completed lectures from saved progress
    const completedLectures = savedProgress?.completedLectures || [];
    console.log('Completed lectures:', completedLectures);

    // Initialize sections with lecture completion status
    const sectionsWithProgress = courseData.sections.map(section => {
      if (!section.lecturesList || section.lecturesList.length === 0) {
        return section;
      }

      // Mark each lecture as completed or not
      const lecturesWithStatus = section.lecturesList.map(lecture => ({
        ...lecture,
        isCompleted: completedLectures.includes(`${section.id}_${lecture.id}`)
      }));

      // Count completed lectures in this section
      const completedCount = lecturesWithStatus.filter(l => l.isCompleted).length;

      return {
        ...section,
        lecturesList: lecturesWithStatus,
        completed: completedCount,
        lectures: section.lecturesList.length
      };
    });

    // Calculate overall progress
    const totalLectures = sectionsWithProgress.reduce((sum, section) => 
      sum + (section.lecturesList?.length || 0), 0
    );
    
    const totalCompleted = completedLectures.length;
    const progress = totalLectures > 0 ? Math.round((totalCompleted / totalLectures) * 100) : 0;

    // Determine status
    let status = 'IN_PROGRESS';
    if (progress === 100) {
      status = 'COMPLETED';
    } else if (progress === 0) {
      status = 'NOT_STARTED';
    }

    console.log('Course initialized with progress:', progress);

    return {
      ...courseData,
      sections: sectionsWithProgress,
      progress: progress,
      status: status
    };
  } catch (error) {
    console.error('Error initializing course progress:', error);
    return {
      ...courseData,
      progress: 0,
      status: 'IN_PROGRESS'
    };
  }
};

/**
 * Toggle lecture completion and recalculate progress
 */
export const toggleLectureCompletion = (course, sectionId, lectureId) => {
  try {
    console.log('Toggling lecture:', sectionId, lectureId);

    if (!course.sections) {
      return course;
    }

    // Find section and lecture
    const updatedSections = course.sections.map(section => {
      if (section.id !== sectionId) {
        return section;
      }

      if (!section.lecturesList) {
        return section;
      }

      // Toggle lecture completion
      const updatedLectures = section.lecturesList.map(lecture => {
        if (lecture.id !== lectureId) {
          return lecture;
        }

        return {
          ...lecture,
          isCompleted: !lecture.isCompleted
        };
      });

      // Recalculate section completed count
      const completedCount = updatedLectures.filter(l => l.isCompleted).length;

      return {
        ...section,
        lecturesList: updatedLectures,
        completed: completedCount
      };
    });

    // Recalculate overall progress
    const totalLectures = updatedSections.reduce((sum, section) => 
      sum + (section.lecturesList?.length || 0), 0
    );
    
    const totalCompleted = updatedSections.reduce((sum, section) => 
      sum + (section.lecturesList?.filter(l => l.isCompleted).length || 0), 0
    );
    
    const progress = totalLectures > 0 ? Math.round((totalCompleted / totalLectures) * 100) : 0;

    // Determine status
    let status = 'IN_PROGRESS';
    if (progress === 100) {
      status = 'COMPLETED';
    } else if (progress === 0) {
      status = 'NOT_STARTED';
    }

    console.log('New progress:', progress);

    return {
      ...course,
      sections: updatedSections,
      progress: progress,
      status: status
    };
  } catch (error) {
    console.error('Error toggling lecture:', error);
    return course;
  }
};

/**
 * Save progress to localStorage (fallback)
 */
export const saveProgress = (courseId, courseData) => {
  try {
    const progressKey = `course_progress_${courseId}`;
    
    // Get completed lectures
    const completedLectures = [];
    if (courseData.sections) {
      courseData.sections.forEach(section => {
        if (section.lecturesList) {
          section.lecturesList.forEach(lecture => {
            if (lecture.isCompleted) {
              completedLectures.push(`${section.id}_${lecture.id}`);
            }
          });
        }
      });
    }

    const progressData = {
      courseId: courseId,
      progress: courseData.progress || 0,
      status: courseData.status || 'IN_PROGRESS',
      completedLectures: completedLectures,
      lastUpdated: new Date().toISOString()
    };

    localStorage.setItem(progressKey, JSON.stringify(progressData));
    console.log('Progress saved to localStorage');
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

/**
 * Load progress from localStorage (fallback)
 */
export const loadProgress = (courseId) => {
  try {
    const progressKey = `course_progress_${courseId}`;
    const savedData = localStorage.getItem(progressKey);
    
    if (savedData) {
      const progress = JSON.parse(savedData);
      console.log('Progress loaded from localStorage:', progress);
      return progress;
    }
    
    return null;
  } catch (error) {
    console.error('Error loading progress:', error);
    return null;
  }
};