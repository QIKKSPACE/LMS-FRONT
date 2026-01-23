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
  onSnapshot,
  Timestamp
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * ✅ FIXED: Convert Firestore Timestamp to ISO string safely
 */
const convertTimestampToISO = (timestamp) => {
  try {
    if (!timestamp) return null;
    
    // If it's already a string
    if (typeof timestamp === 'string') {
      return timestamp;
    }
    
    // If it's a Firestore Timestamp
    if (timestamp?.toDate && typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toISOString();
    }
    
    // If it's a Date object
    if (timestamp instanceof Date) {
      return timestamp.toISOString();
    }
    
    // If it's a timestamp object with seconds
    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000).toISOString();
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error converting timestamp:', error);
    return null;
  }
};

/**
 * ✅ Transform course data from Firestore to app format
 */
const transformCourseData = (courseId, firestoreData, isOverlay = false) => {
  console.log('🔄 Transforming course data for:', courseId);
  
  let sections = [];
  let totalLecturesCount = 0;
  
  if (firestoreData.courseContent && Array.isArray(firestoreData.courseContent)) {
    sections = firestoreData.courseContent.map((chapter, index) => {
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
  
  return {
    id: courseId,
    title: firestoreData.courseTitle || 'Untitled Course',
    courseTitle: firestoreData.courseTitle,
    courseName: firestoreData.courseTitle,
    thumbnail: firestoreData.courseThumbnail || 'https://via.placeholder.com/800x400?text=Course',
    courseThumbnail: firestoreData.courseThumbnail,
    thumbnailUrl: firestoreData.courseThumbnail,
    imageUrl: firestoreData.courseThumbnail,
    description: firestoreData.courseDescription || '',
    courseDescription: firestoreData.courseDescription,
    price: firestoreData.price || 0,
    discount: firestoreData.discount || 0,
    membershipType: firestoreData.membershipType || 'Standard',
    educatorId: firestoreData.educatorId || '',
    sections: sections,
    chapters: sections.length,
    totalLectures: totalLecturesCount,
    liveLectures: firestoreData.liveLectures || [],
    createdAt: convertTimestampToISO(firestoreData.createdAt),
    updatedAt: convertTimestampToISO(firestoreData.updatedAt),
    courseValidity: firestoreData.courseValidity || '1',
    status: 'NOT_STARTED',
    progress: 0,
    isPurchased: false,
    isOverlay: isOverlay,
  };
};

/**
 * ✅ FIXED: Calculate expiry date with proper validation
 */
const calculateExpiryDate = (assignedAt, validityMonths) => {
  try {
    if (!assignedAt || !validityMonths) {
      console.warn('⚠️ Missing assignedAt or validityMonths');
      return null;
    }

    // Convert assignedAt to Date object
    let startDate;
    if (typeof assignedAt === 'string') {
      startDate = new Date(assignedAt);
    } else if (assignedAt?.toDate && typeof assignedAt.toDate === 'function') {
      startDate = assignedAt.toDate();
    } else if (assignedAt instanceof Date) {
      startDate = assignedAt;
    } else if (assignedAt?.seconds) {
      startDate = new Date(assignedAt.seconds * 1000);
    } else {
      console.error('❌ Invalid assignedAt format:', assignedAt);
      return null;
    }

    // Validate date
    if (isNaN(startDate.getTime())) {
      console.error('❌ Invalid date after conversion:', startDate);
      return null;
    }

    const expiryDate = new Date(startDate);
    const months = parseInt(validityMonths);
    
    if (isNaN(months) || months <= 0) {
      console.error('❌ Invalid validityMonths:', validityMonths);
      return null;
    }
    
    expiryDate.setMonth(expiryDate.getMonth() + months);
    
    const isoString = expiryDate.toISOString();
    
    console.log('📅 Calculated expiry:', {
      assignedAt: startDate.toISOString(),
      validityMonths: months,
      expiryDate: isoString
    });

    return isoString;
  } catch (error) {
    console.error('❌ Error calculating expiry date:', error);
    return null;
  }
};

/**
 * ✅ Check if course is expired
 */
const checkIfExpired = (expiryDate) => {
  try {
    if (!expiryDate) return false;

    const expiry = new Date(expiryDate);
    
    if (isNaN(expiry.getTime())) {
      console.error('❌ Invalid expiry date:', expiryDate);
      return false;
    }
    
    const now = new Date();
    return expiry < now;
  } catch (error) {
    console.error('❌ Error checking expiry:', error);
    return false;
  }
};

/**
 * ✅ Update enrollment status based on expiry
 */
const updateEnrollmentStatus = async (userId, courseId, currentStatus, expiryDate) => {
  try {
    const isExpired = checkIfExpired(expiryDate);
    
    if (isExpired && currentStatus === 'active') {
      console.log('⏰ Course expired, updating status:', courseId);
      
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        console.error('❌ User not found:', userId);
        return false;
      }

      const userData = userSnap.data();
      const enrolledCourses = userData.EnrolledCourses || [];
      
      const updatedEnrolledCourses = enrolledCourses.map(enrollment => {
        if (enrollment.courseId === courseId) {
          return {
            ...enrollment,
            enrolledStatus: 'expired'
          };
        }
        return enrollment;
      });

      await updateDoc(userRef, {
        EnrolledCourses: updatedEnrolledCourses,
        updatedAt: Timestamp.now()
      });

      console.log('✅ Status updated to expired');
      return true;
    }

    return false;
  } catch (error) {
    console.error('❌ Error updating enrollment:', error);
    return false;
  }
};

/**
 * Fetch all courses
 */
export const getAllCourses = async () => {
  try {
    console.log('📚 Fetching all courses...');

    const coursesCollection = collection(db, 'courses');
    const coursesSnapshot = await getDocs(coursesCollection);
    
    const courses = [];
    coursesSnapshot.forEach((doc) => {
      const courseData = transformCourseData(doc.id, doc.data(), false);
      courses.push(courseData);
    });

    console.log(`✅ Fetched ${courses.length} courses`);
    
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
 * Fetch course by ID
 */
export const getCourseById = async (courseId) => {
  try {
    console.log('🔍 Fetching course:', courseId);

    let courseDocRef = doc(db, 'courses', courseId);
    let courseDocSnap = await getDoc(courseDocRef);
    let isOverlay = false;

    if (!courseDocSnap.exists()) {
      console.log('🔍 Checking overlayCourses...');
      courseDocRef = doc(db, 'overlayCourses', courseId);
      courseDocSnap = await getDoc(courseDocRef);
      isOverlay = true;
    }

    if (courseDocSnap.exists()) {
      const courseData = transformCourseData(courseDocSnap.id, courseDocSnap.data(), isOverlay);
      console.log('✅ Course found');
      return { success: true, course: courseData };
    } else {
      console.log('❌ Course not found');
      return { success: false, error: 'Course not found' };
    }
  } catch (error) {
    console.error("❌ Error fetching course:", error);
    return { success: false, error: "Failed to fetch course" };
  }
};

/**
 * ✅ FIXED: Get course progress
 */
export const getCourseProgress = async (userId, courseId) => {
  try {
    const progressId = `${userId}_${courseId}`;
    const progressRef = doc(db, 'userCourseProgress', progressId);
    const progressSnap = await getDoc(progressRef);

    if (progressSnap.exists()) {
      const progressData = progressSnap.data();
      
      return { 
        success: true, 
        progress: {
          ...progressData,
          enrolledAt: convertTimestampToISO(progressData.enrolledAt),
          lastAccessedAt: convertTimestampToISO(progressData.lastAccessedAt),
          expiryDate: convertTimestampToISO(progressData.expiryDate),
        }
      };
    }

    return { success: false, progress: null };
  } catch (error) {
    console.error('❌ Error getting progress:', error);
    return { success: false, error: error.message, progress: null };
  }
};

/**
 * ✅ FIXED: Toggle lecture completion
 */
export const toggleLectureCompletion = async (userId, courseId, sectionId, lectureId) => {
  try {
    console.log('🔄 Toggling lecture:', { userId, courseId, sectionId, lectureId });

    const progressId = `${userId}_${courseId}`;
    const progressRef = doc(db, 'userCourseProgress', progressId);
    const progressSnap = await getDoc(progressRef);

    if (!progressSnap.exists()) {
      console.log('⚠️ Creating progress document');
      
      const courseResult = await getCourseById(courseId);
      if (!courseResult.success) {
        return { success: false, error: 'Course not found' };
      }
      
      const totalLectures = courseResult.course.totalLectures || 0;
      if (totalLectures === 0) {
        return { success: false, error: 'Course has no lectures' };
      }
      
      const initialProgress = Math.round((1 / totalLectures) * 100);
      
      await setDoc(progressRef, {
        progressId,
        userId,
        courseId,
        progress: initialProgress,
        status: 'IN_PROGRESS',
        completedLectures: [`${sectionId}_${lectureId}`],
        totalLectures: totalLectures,
        enrolledAt: Timestamp.now(),
        lastAccessedAt: Timestamp.now(),
      });
      
      console.log('✅ Progress created:', initialProgress + '%');
      return { success: true };
    }

    const progressData = progressSnap.data();
    const completedLectures = progressData.completedLectures || [];
    const lectureKey = `${sectionId}_${lectureId}`;

    let totalLectures = progressData.totalLectures || 0;
    
    if (totalLectures === 0) {
      console.warn('⚠️ Recalculating totalLectures...');
      const courseResult = await getCourseById(courseId);
      if (courseResult.success && courseResult.course.totalLectures > 0) {
        totalLectures = courseResult.course.totalLectures;
      } else {
        return { success: false, error: 'Invalid course' };
      }
    }

    let updatedLectures;
    if (completedLectures.includes(lectureKey)) {
      updatedLectures = completedLectures.filter(l => l !== lectureKey);
      console.log('➖ Unmarking');
    } else {
      updatedLectures = [...completedLectures, lectureKey];
      console.log('✅ Marking');
    }

    const progress = Math.round((updatedLectures.length / totalLectures) * 100);
    
    let status = 'IN_PROGRESS';
    if (progress === 100) {
      status = 'COMPLETED';
    } else if (progress === 0) {
      status = 'NOT_STARTED';
    }

    await updateDoc(progressRef, {
      completedLectures: updatedLectures,
      progress: progress,
      status: status,
      totalLectures: totalLectures,
      lastAccessedAt: Timestamp.now(),
    });

    console.log('✅ Progress:', progress + '%');
    return { success: true };
  } catch (error) {
    console.error('❌ Error toggling:', error);
    return { success: false, error: error.message };
  }
};

/**
 * ✅ FIXED: Enroll user with Firestore Timestamp
 */
export const enrollInCourse = async (userId, courseId, validityMonths = 1) => {
  try {
    console.log('📝 Enrolling:', { userId, courseId, validityMonths });
    
    const courseResult = await getCourseById(courseId);
    if (!courseResult.success) {
      return { success: false, error: 'Course not found' };
    }
    
    const totalLectures = courseResult.course.totalLectures || 0;
    
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return { success: false, error: 'User not found' };
    }
    
    const userData = userSnap.data();
    const currentPurchasedCourses = userData.purchasedCourses || [];
    const currentEnrolledCourses = userData.EnrolledCourses || [];
    
    if (currentPurchasedCourses.includes(courseId)) {
      return { success: true, alreadyPurchased: true };
    }
    
    const now = Timestamp.now();
    const assignedAt = now.toDate();
    const expiryDate = calculateExpiryDate(assignedAt, validityMonths);
    
    if (!expiryDate) {
      return { success: false, error: 'Failed to calculate expiry' };
    }
    
    const enrollmentData = {
      courseId: courseId,
      assignedAt: now,
      expiryDate: Timestamp.fromDate(new Date(expiryDate)),
      validityMonths: parseInt(validityMonths),
      enrolledStatus: 'active',
      purchaseDate: now
    };
    
    const updatedEnrolledCourses = [...currentEnrolledCourses, enrollmentData];
    const updatedPurchasedCourses = [...currentPurchasedCourses, courseId];
    
    await updateDoc(userRef, {
      purchasedCourses: updatedPurchasedCourses,
      EnrolledCourses: updatedEnrolledCourses,
      updatedAt: now
    });
    
    console.log(' Enrollment created');
    
    const progressId = `${userId}_${courseId}`;
    const progressRef = doc(db, 'userCourseProgress', progressId);
    
    await setDoc(progressRef, {
      progressId,
      userId,
      courseId,
      progress: 0,
      status: 'IN_PROGRESS',
      completedLectures: [],
      totalLectures: totalLectures,
      enrolledAt: now,
      lastAccessedAt: now,
      expiryDate: Timestamp.fromDate(new Date(expiryDate)),
    });
    
    console.log(' Progress initialized');
    
    return { 
      success: true,
      updatedUser: {
        ...userData,
        purchasedCourses: updatedPurchasedCourses,
        EnrolledCourses: updatedEnrolledCourses,
        updatedAt: now.toDate().toISOString()
      }
    };
  } catch (error) {
    console.error(' Enrollment error:', error);
    return { success: false, error: error.message };
  }
};

/**
 *  FIXED: Get user courses with proper date handling
 */
export const getUserCourses = async (userId) => {
  try {
    console.log('👤 Fetching user courses:', userId);

    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return { success: false, error: 'User not found', courses: [] };
    }

    const userData = userDocSnap.data();
    
    const purchasedCourseIds = userData.purchasedCourses || [];
    const enrolledCourses = userData.EnrolledCourses || [];
    
    const enrolledCourseIds = enrolledCourses.map(ec => ec.courseId).filter(Boolean);
    const allCourseIds = [...new Set([...purchasedCourseIds, ...enrolledCourseIds])];

    console.log(' Course IDs:', allCourseIds);

    if (allCourseIds.length === 0) {
      return { success: true, courses: [] };
    }

    const courses = [];
    for (const courseId of allCourseIds) {
      const result = await getCourseById(courseId);
      
      if (result.success) {
        const progressResult = await getCourseProgress(userId, courseId);
        
        const enrollmentData = enrolledCourses.find(ec => ec.courseId === courseId);
        
        // ✅ FIXED: Proper date conversion
        const expiryDate = convertTimestampToISO(enrollmentData?.expiryDate);
        const validityMonths = enrollmentData?.validityMonths || null;
        const assignedAt = convertTimestampToISO(enrollmentData?.assignedAt);
        let enrolledStatus = enrollmentData?.enrolledStatus || 'active';
        
        // Check expiry
        if (expiryDate && checkIfExpired(expiryDate)) {
          console.log(' Expired:', courseId);
          
          if (enrolledStatus === 'active') {
            await updateEnrollmentStatus(userId, courseId, enrolledStatus, expiryDate);
            enrolledStatus = 'expired';
          }
        }
        
        if (progressResult.success && progressResult.progress) {
          const courseWithProgress = {
            ...result.course,
            progress: progressResult.progress.progress || 0,
            status: progressResult.progress.status || 'IN_PROGRESS',
            expiryDate: expiryDate,
            validityMonths: validityMonths,
            assignedAt: assignedAt,
            purchaseDate: assignedAt,
            enrolledStatus: enrolledStatus,
            isPurchased: true,
            isExpired: enrolledStatus === 'expired',
          };
          
          console.log(` ${courseId}: ${courseWithProgress.progress}% - ${enrolledStatus}`);
          courses.push(courseWithProgress);
        } else {
          courses.push({
            ...result.course,
            progress: 0,
            status: 'NOT_STARTED',
            expiryDate: expiryDate,
            validityMonths: validityMonths,
            assignedAt: assignedAt,
            purchaseDate: assignedAt,
            enrolledStatus: enrolledStatus,
            isPurchased: true,
            isExpired: enrolledStatus === 'expired',
          });
        }
      }
    }

    console.log(` Fetched ${courses.length} courses`);
    return { success: true, courses };
  } catch (error) {
    console.error(" Error fetching courses:", error);
    return { success: false, error: "Failed to fetch courses", courses: [] };
  }
};

export const subscribeToCoursesUpdates = (callback) => {
  try {
    const coursesCollection = collection(db, 'courses');
    
    const unsubscribe = onSnapshot(coursesCollection, (snapshot) => {
      const courses = [];
      snapshot.forEach((doc) => {
        const courseData = transformCourseData(doc.id, doc.data(), false);
        courses.push(courseData);
      });

      callback({ success: true, courses });
    }, (error) => {
      console.error("❌ Listener error:", error);
      callback({ success: false, error: "Failed to listen", courses: [] });
    });

    return unsubscribe;
  } catch (error) {
    console.error("❌ Setup error:", error);
    return () => {};
  }
};

export const getCoursesByCategory = async (category) => {
  try {
    const coursesCollection = collection(db, 'courses');
    const q = query(coursesCollection, where('membershipType', '==', category));
    const coursesSnapshot = await getDocs(q);
    
    const courses = [];
    coursesSnapshot.forEach((doc) => {
      courses.push(transformCourseData(doc.id, doc.data(), false));
    });

    return { success: true, courses };
  } catch (error) {
    console.error(" Error:", error);
    return { success: false, error: "Failed", courses: [] };
  }
};

export const searchCourses = async (searchTerm) => {
  try {
    const result = await getAllCourses();
    if (!result.success) return result;

    const searchLower = searchTerm.toLowerCase();
    const filteredCourses = result.courses.filter(course => 
      course.title?.toLowerCase().includes(searchLower) ||
      course.description?.toLowerCase().includes(searchLower) ||
      course.membershipType?.toLowerCase().includes(searchLower)
    );

    return { success: true, courses: filteredCourses };
  } catch (error) {
    console.error(" Search error:", error);
    return { success: false, error: "Failed", courses: [] };
  }
};