import { 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  query,
  where,
  orderBy,
  onSnapshot
} from "firebase/firestore";
import { db } from "../firebase";


const transformCourseData = (courseId, firestoreData) => {
  console.log('📄 Transforming course data for:', courseId);
  console.log('📦 Raw Firestore data:', firestoreData);
  
  // ✅ Extract sections from courseContent array
  let sections = [];
  let totalLecturesCount = 0; // Track total lectures correctly
  
  if (firestoreData.courseContent && Array.isArray(firestoreData.courseContent)) {
    console.log('✅ Found courseContent with', firestoreData.courseContent.length, 'chapters');
    
    sections = firestoreData.courseContent.map((chapter, index) => {
      // Extract lectures from chapterContent
      const lecturesList = chapter.chapterContent && Array.isArray(chapter.chapterContent)
        ? chapter.chapterContent.map((lecture, lectureIndex) => ({
            id: lecture.lectureId || `lect_${Date.now()}_${lectureIndex}`,
            title: lecture.lectureTitle || `Lecture ${lectureIndex + 1}`,
            duration: lecture.lectureDuration || '30',
            url: lecture.lectureUrl || '',
            order: lecture.lectureOrder || lectureIndex + 1,
            isPreviewFree: lecture.isPreviewFree || false,
            isCompleted: false,
          }))
        : [];
      
      // ✅ CRITICAL: Add to total lecture count
      totalLecturesCount += lecturesList.length;
      
      return {
        id: chapter.chapterId || `ch_${Date.now()}_${index}`,
        title: chapter.chapterTitle || `Section ${index + 1}`,
        order: chapter.chapterOrder || index + 1,
        lecturesList: lecturesList,
        lectures: lecturesList.length,
        completed: 0,
        duration: lecturesList.reduce((total, lec) => total + parseInt(lec.duration || 0), 0) + ' min'
      };
    });
  }
  
  console.log('✅ Transformed sections:', sections.length, 'sections');
  console.log('📊 Total lectures across all sections:', totalLecturesCount);
  
  // ✅ Return transformed course with correct totalLectures
  return {
    id: courseId,
    
    // Basic Info
    title: firestoreData.courseTitle || 'Untitled Course',
    courseTitle: firestoreData.courseTitle,
    courseName: firestoreData.courseTitle,
    
    // Thumbnail
    thumbnail: firestoreData.courseThumbnail || 'https://via.placeholder.com/800x400?text=Course',
    courseThumbnail: firestoreData.courseThumbnail,
    thumbnailUrl: firestoreData.courseThumbnail,
    imageUrl: firestoreData.courseThumbnail,
    
    // Description
    description: firestoreData.courseDescription || '',
    courseDescription: firestoreData.courseDescription,
    
    // Pricing
    price: firestoreData.price || 0,
    discount: firestoreData.discount || 0,
    
    // Category/Type
    membershipType: firestoreData.membershipType || 'Standard',
    
    // Educator
    educatorId: firestoreData.educatorId || '',
    
    // Content Structure
    sections: sections,
    chapters: sections.length,
    totalLectures: totalLecturesCount, // ✅ FIXED: Use correct count
    
    // Live Lectures
    liveLectures: firestoreData.liveLectures || [],
    
    // Timestamps
    createdAt: firestoreData.createdAt?.toDate?.()?.toISOString() || firestoreData.createdAt || null,
    updatedAt: firestoreData.updatedAt?.toDate?.()?.toISOString() || firestoreData.updatedAt || null,
    
    // Purchase/Progress (will be set based on user data)
    status: 'NOT_STARTED',
    progress: 0,
    isPurchased: false,
  };
};

/**
 * Fetch all courses from Firestore
 */
export const getAllCourses = async () => {
  try {
    console.log('📚 Fetching all courses from Firestore...');

    const coursesCollection = collection(db, 'courses');
    const coursesSnapshot = await getDocs(coursesCollection);
    
    const courses = [];
    coursesSnapshot.forEach((doc) => {
      const courseData = transformCourseData(doc.id, doc.data());
      courses.push(courseData);
    });

    console.log(`✅ Fetched ${courses.length} courses from Firestore`);
    if (courses.length > 0) {
      console.log('📦 Sample course:', {
        id: courses[0].id,
        title: courses[0].courseTitle,
        totalLectures: courses[0].totalLectures,
        chapters: courses[0].chapters
      });
    }
    
    return { success: true, courses };
  } catch (error) {
    console.error("❌ Error fetching courses:", error);
    return { 
      success: false, 
      error: "Failed to fetch courses",
      courses: [] 
    };
  }
};

/**
 * Fetch a single course by ID
 */
export const getCourseById = async (courseId) => {
  try {
    console.log('🔍 Fetching course:', courseId);

    const courseDocRef = doc(db, 'courses', courseId);
    const courseDocSnap = await getDoc(courseDocRef);

    if (courseDocSnap.exists()) {
      const courseData = transformCourseData(courseDocSnap.id, courseDocSnap.data());
      
      console.log('✅ Course found:', courseId);
      console.log('📸 Thumbnail URL:', courseData.courseThumbnail);
      console.log('💰 Price:', courseData.price);
      console.log('📚 Sections:', courseData.sections?.length || 0);
      console.log('🎓 Total Lectures:', courseData.totalLectures);
      
      return {
        success: true,
        course: courseData
      };
    } else {
      console.log('❌ Course not found:', courseId);
      return {
        success: false,
        error: 'Course not found'
      };
    }
  } catch (error) {
    console.error("❌ Error fetching course:", error);
    return {
      success: false,
      error: "Failed to fetch course"
    };
  }
};

/**
 * ✅ FIXED: Get course progress with correct calculation
 */
export const getCourseProgress = async (userId, courseId) => {
  try {
    const progressId = `${userId}_${courseId}`;
    const progressRef = doc(db, 'userCourseProgress', progressId);
    const progressSnap = await getDoc(progressRef);

    if (progressSnap.exists()) {
      const progressData = progressSnap.data();
      
      console.log('📊 Found saved progress:', {
        progress: progressData.progress,
        completedLectures: progressData.completedLectures?.length || 0,
        totalLectures: progressData.totalLectures,
        status: progressData.status
      });
      
      return { 
        success: true, 
        progress: {
          ...progressData,
          enrolledAt: progressData.enrolledAt || null,
          lastAccessedAt: progressData.lastAccessedAt || null,
          expiryDate: progressData.expiryDate || null,
        }
      };
    }

    console.log('⚠️ No progress found for:', progressId);
    return { success: false, progress: null };
  } catch (error) {
    console.error('❌ Error getting course progress:', error);
    return { success: false, error: error.message, progress: null };
  }
};

/**
 * ✅ FIXED: Toggle lecture completion with correct progress calculation
 */
export const toggleLectureCompletion = async (userId, courseId, sectionId, lectureId) => {
  try {
    console.log('🔄 Toggling lecture completion:', { userId, courseId, sectionId, lectureId });

    const progressId = `${userId}_${courseId}`;
    const progressRef = doc(db, 'userCourseProgress', progressId);
    const progressSnap = await getDoc(progressRef);

    if (!progressSnap.exists()) {
      console.log('⚠️ Progress document not found, creating new one');
      
      // Get course to calculate total lectures
      const courseResult = await getCourseById(courseId);
      
      if (!courseResult.success) {
        return { success: false, error: 'Course not found' };
      }
      
      // ✅ CRITICAL: Use the correct totalLectures from transformed course
      const totalLectures = courseResult.course.totalLectures || 0;
      
      if (totalLectures === 0) {
        console.error('❌ Course has 0 total lectures! Cannot create progress.');
        return { success: false, error: 'Course has no lectures' };
      }
      
      console.log('📊 Creating progress with totalLectures:', totalLectures);
      
      const initialProgress = totalLectures > 0 ? Math.round((1 / totalLectures) * 100) : 0;
      
      await setDoc(progressRef, {
        progressId,
        userId,
        courseId,
        progress: initialProgress,
        status: 'IN_PROGRESS',
        completedLectures: [`${sectionId}_${lectureId}`],
        totalLectures: totalLectures,
        enrolledAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString(),
      });
      
      console.log('✅ Progress document created with progress:', initialProgress + '%');
      return { success: true };
    }

    const progressData = progressSnap.data();
    const completedLectures = progressData.completedLectures || [];
    const lectureKey = `${sectionId}_${lectureId}`;

    console.log('📋 Current completed lectures:', completedLectures);
    console.log('🎯 Total lectures in course:', progressData.totalLectures);

    // ✅ CRITICAL FIX: If totalLectures is 0 or invalid, recalculate from course
    let totalLectures = progressData.totalLectures || 0;
    
    if (totalLectures === 0) {
      console.warn('⚠️ totalLectures is 0! Recalculating from course...');
      
      const courseResult = await getCourseById(courseId);
      if (courseResult.success && courseResult.course.totalLectures > 0) {
        totalLectures = courseResult.course.totalLectures;
        console.log('✅ Recalculated totalLectures:', totalLectures);
        
        // Update the progress document with correct totalLectures
        await updateDoc(progressRef, {
          totalLectures: totalLectures
        });
      } else {
        console.error('❌ Cannot recalculate totalLectures! Course may be invalid.');
        return { success: false, error: 'Invalid course structure' };
      }
    }

    // Toggle completion
    let updatedLectures;
    if (completedLectures.includes(lectureKey)) {
      // Remove from completed
      updatedLectures = completedLectures.filter(l => l !== lectureKey);
      console.log('➖ Unmarking lecture as complete');
    } else {
      // Add to completed
      updatedLectures = [...completedLectures, lectureKey];
      console.log('✅ Marking lecture as complete');
    }

    // ✅ Calculate progress percentage
    const progress = Math.round((updatedLectures.length / totalLectures) * 100);
    
    // Determine status
    let status = 'IN_PROGRESS';
    if (progress === 100) {
      status = 'COMPLETED';
      console.log('🎉 COURSE COMPLETED!');
    } else if (progress === 0) {
      status = 'NOT_STARTED';
    }

    console.log('📊 New progress calculation:', {
      completedLectures: updatedLectures.length,
      totalLectures: totalLectures,
      progress: progress + '%',
      status: status
    });

    // Update Firestore
    await updateDoc(progressRef, {
      completedLectures: updatedLectures,
      progress: progress,
      status: status,
      totalLectures: totalLectures, // ✅ Also update totalLectures in case it was recalculated
      lastAccessedAt: new Date().toISOString(),
    });

    console.log('✅ Lecture completion toggled successfully');
    console.log('📈 Course progress is now:', progress + '%');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error toggling lecture completion:', error);
    return { success: false, error: error.message };
  }
};

/**
 * ✅ FIXED: Enroll user with correct totalLectures count
 */
export const enrollInCourse = async (userId, courseId, expiryDate = null) => {
  try {
    console.log('📝 Enrolling user in course:', { userId, courseId, expiryDate });
    
    // Get course to calculate total lectures
    const courseResult = await getCourseById(courseId);
    if (!courseResult.success) {
      return { success: false, error: 'Course not found' };
    }
    
    // ✅ CRITICAL: Use correct totalLectures from transformed course
    const totalLectures = courseResult.course.totalLectures || 0;
    
    console.log('📊 Course has', totalLectures, 'total lectures');
    
    // Get current user data
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return { success: false, error: 'User not found' };
    }
    
    const userData = userSnap.data();
    const currentPurchasedCourses = userData.purchasedCourses || [];
    
    // Check if already purchased
    if (currentPurchasedCourses.includes(courseId)) {
      console.log('⚠️ User already owns this course');
      return { success: true, alreadyPurchased: true };
    }
    
    // Add course to user's purchased courses
    const updatedPurchasedCourses = [...currentPurchasedCourses, courseId];
    
    await updateDoc(userRef, {
      purchasedCourses: updatedPurchasedCourses,
      updatedAt: new Date().toISOString()
    });
    
    console.log('✅ Course added to user purchases:', updatedPurchasedCourses);
    
    // Create progress document with CORRECT totalLectures
    const progressId = `${userId}_${courseId}`;
    const progressRef = doc(db, 'userCourseProgress', progressId);
    
    await setDoc(progressRef, {
      progressId,
      userId,
      courseId,
      progress: 0,
      status: 'IN_PROGRESS',
      completedLectures: [],
      totalLectures: totalLectures, // ✅ FIXED: Use correct count
      enrolledAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      expiryDate: expiryDate,
    });
    
    console.log('✅ Course progress initialized with totalLectures:', totalLectures);
    
    // Return updated user data
    return { 
      success: true,
      updatedUser: {
        ...userData,
        purchasedCourses: updatedPurchasedCourses,
        updatedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('❌ Error enrolling user:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Fetch courses purchased by a specific user
 */
export const getUserCourses = async (userId) => {
  try {
    console.log('👤 Fetching courses for user:', userId);

    // First, get user's purchased courses from their profile
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      console.log('❌ User not found');
      return { success: false, error: 'User not found', courses: [] };
    }

    const userData = userDocSnap.data();
    const purchasedCourseIds = userData.purchasedCourses || [];

    if (purchasedCourseIds.length === 0) {
      console.log('ℹ️ User has no purchased courses');
      return { success: true, courses: [] };
    }

    console.log('🛒 User purchased course IDs:', purchasedCourseIds);

    // Fetch all purchased courses with their progress
    const courses = [];
    for (const courseId of purchasedCourseIds) {
      const result = await getCourseById(courseId);
      if (result.success) {
        // Get progress for this course
        const progressResult = await getCourseProgress(userId, courseId);
        
        if (progressResult.success && progressResult.progress) {
          // Merge progress with course data
          const courseWithProgress = {
            ...result.course,
            progress: progressResult.progress.progress || 0,
            status: progressResult.progress.status || 'IN_PROGRESS',
            expiryDate: progressResult.progress.expiryDate || null,
            isPurchased: true,
          };
          
          console.log(`✅ Course ${courseId}: ${courseWithProgress.progress}% (${courseWithProgress.status})`);
          courses.push(courseWithProgress);
        } else {
          // No progress yet, add with defaults
          console.log(`⚠️ No progress for course ${courseId}, using defaults`);
          courses.push({
            ...result.course,
            progress: 0,
            status: 'NOT_STARTED',
            isPurchased: true,
          });
        }
      }
    }

    console.log(`✅ Fetched ${courses.length} purchased courses for user`);
    return { success: true, courses };
  } catch (error) {
    console.error("❌ Error fetching user courses:", error);
    return {
      success: false,
      error: "Failed to fetch user courses",
      courses: []
    };
  }
};

// Export other helper functions
export const subscribeToCoursesUpdates = (callback) => {
  try {
    console.log('👂 Setting up real-time course listener...');

    const coursesCollection = collection(db, 'courses');
    
    const unsubscribe = onSnapshot(coursesCollection, (snapshot) => {
      const courses = [];
      snapshot.forEach((doc) => {
        const courseData = transformCourseData(doc.id, doc.data());
        courses.push(courseData);
      });

      console.log(`🔄 Real-time update: ${courses.length} courses`);
      callback({ success: true, courses });
    }, (error) => {
      console.error("❌ Error in course listener:", error);
      callback({ success: false, error: "Failed to listen to courses", courses: [] });
    });

    return unsubscribe;
  } catch (error) {
    console.error("❌ Error setting up course listener:", error);
    return () => {}; // Return empty function
  }
};

export const getCoursesByCategory = async (category) => {
  try {
    console.log('🔍 Fetching courses by category:', category);

    const coursesCollection = collection(db, 'courses');
    const q = query(
      coursesCollection,
      where('membershipType', '==', category)
    );
    
    const coursesSnapshot = await getDocs(q);
    
    const courses = [];
    coursesSnapshot.forEach((doc) => {
      const courseData = transformCourseData(doc.id, doc.data());
      courses.push(courseData);
    });

    console.log(`✅ Fetched ${courses.length} courses in category: ${category}`);
    return { success: true, courses };
  } catch (error) {
    console.error("❌ Error fetching courses by category:", error);
    return {
      success: false,
      error: "Failed to fetch courses by category",
      courses: []
    };
  }
};

export const searchCourses = async (searchTerm) => {
  try {
    console.log('🔍 Searching courses:', searchTerm);

    // Firestore doesn't support full-text search, so we fetch all and filter
    const result = await getAllCourses();
    
    if (!result.success) {
      return result;
    }

    const searchLower = searchTerm.toLowerCase();
    const filteredCourses = result.courses.filter(course => 
      course.title?.toLowerCase().includes(searchLower) ||
      course.description?.toLowerCase().includes(searchLower) ||
      course.membershipType?.toLowerCase().includes(searchLower)
    );

    console.log(`✅ Found ${filteredCourses.length} courses matching: ${searchTerm}`);
    return { success: true, courses: filteredCourses };
  } catch (error) {
    console.error("❌ Error searching courses:", error);
    return {
      success: false,
      error: "Failed to search courses",
      courses: []
    };
  }
};