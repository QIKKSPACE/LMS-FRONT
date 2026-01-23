import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowBack, 
  PlayArrow, 
  Pause, 
  CheckCircle,
  CheckCircleOutline,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import { getCourseById, toggleLectureCompletion as toggleLectureInFirestore } from '../services/courseService';
import { initializeCourseProgress, toggleLectureCompletion } from '../utils/progressTracker';
import { checkCourseExpiry } from '../utils/courseExpiry';
import { useAuth } from '../context/AuthContext';
import ProtectedVideoPlayer from '../components/ProtectedVideoPlayer'; 
import toast from 'react-hot-toast';

const MyCourseDetailsPage = ({ courseId, onBack }) => {
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [hasMarkedComplete, setHasMarkedComplete] = useState(false);
  const videoRef = useRef(null);

  // ✅ Fetch course and initialize progress
  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId || !user) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('📚 Fetching course details:', courseId);
        setIsLoading(true);

        const result = await getCourseById(courseId);

        if (result.success && result.course) {
          console.log('✅ Course fetched:', result.course);

          // Get saved progress from Firestore
          const { getCourseProgress } = await import('../services/courseService');
          const progressResult = await getCourseProgress(user.uid, courseId);
          
          console.log(' Progress data:', progressResult);

          // Initialize course with progress
          const savedProgress = progressResult.success && progressResult.progress 
            ? progressResult.progress 
            : { progress: 0, completedLectures: [], status: 'IN_PROGRESS' };

          const initializedCourse = initializeCourseProgress(result.course, savedProgress);
          const courseWithExpiry = checkCourseExpiry(initializedCourse);
          
          console.log(' Course initialized with progress:', courseWithExpiry.progress + '%');
          
          setCourse(courseWithExpiry);

          // Set first section and lecture as default
          if (courseWithExpiry.sections && courseWithExpiry.sections.length > 0) {
            const firstSection = courseWithExpiry.sections[0];
            setSelectedSection(firstSection);
            if (firstSection.lecturesList && firstSection.lecturesList.length > 0) {
              setSelectedLecture(firstSection.lecturesList[0]);
            }
            setExpandedSections(new Set([firstSection.id]));
          }
        } else {
          console.error('Failed to fetch course:', result.error);
          toast.error('Failed to load course');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        toast.error('An error occurred while loading the course');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, user]);

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const selectLecture = (section, lecture) => {
    console.log('🎥 Selecting lecture:', lecture.title);
    setSelectedSection(section);
    setSelectedLecture(lecture);
    setIsPlaying(true);
    setVideoProgress(0);
    setHasMarkedComplete(false);
  };

  // ✅ Auto-mark lecture as complete when 90% watched
  const handleVideoProgress = async (e) => {
    if (!e.target || !selectedLecture || !selectedSection) return;
    
    const video = e.target;
    const progress = (video.currentTime / video.duration) * 100;
    setVideoProgress(progress);
    
    // Auto-complete when 90% watched
    if (progress >= 90 && !selectedLecture.isCompleted && !hasMarkedComplete) {
      console.log(' Lecture 90% complete, auto-marking as done');
      setHasMarkedComplete(true);
      
      await handleToggleLectureCompletion(
        { stopPropagation: () => {} }, 
        selectedSection.id, 
        selectedLecture.id
      );
      
      toast.success(' Lecture completed!', { duration: 2000 });
    }
  };

  //  Handle lecture completion toggle
  const handleToggleLectureCompletion = async (e, sectionId, lectureId) => {
    e.stopPropagation();
    
    if (!course || !user) return;
    
    try {
      console.log(' Toggling lecture completion:', { sectionId, lectureId });
      
      // Update local state
      const updatedCourse = toggleLectureCompletion(course, sectionId, lectureId);
      setCourse(updatedCourse);
      
      console.log(' Local state updated, new progress:', updatedCourse.progress + '%');
      
      // Update Firestore
      const result = await toggleLectureInFirestore(user.uid, courseId, sectionId, lectureId);
      
      if (result.success) {
        console.log(' Firestore updated successfully');
        toast.success('Progress saved!', { duration: 1500 });
      } else {
        console.error(' Failed to update Firestore:', result.error);
        toast.error('Failed to save progress');
        setCourse(course);
      }
      
      // Update selected section/lecture
      const updatedSection = updatedCourse.sections.find(s => s.id === sectionId);
      if (updatedSection) {
        setSelectedSection(updatedSection);
        const updatedLecture = updatedSection.lecturesList.find(l => l.id === lectureId);
        if (updatedLecture) {
          setSelectedLecture(updatedLecture);
        }
      }
    } catch (error) {
      console.error(' Error toggling lecture:', error);
      toast.error('Failed to update progress');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-gray-900">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white font-medium">Loading course...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (!course) {
    return (
      <div className="flex flex-col h-screen bg-gray-900">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <p className="text-white text-lg mb-4">Course not found</p>
            <button
              onClick={onBack}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No sections state
  if (!course.sections || course.sections.length === 0) {
    return (
      <div className="flex flex-col h-screen bg-gray-900">
        <div className="bg-gray-800 border-b border-gray-700 flex items-center px-4 lg:px-6 py-3">
          <button onClick={onBack} className="text-white hover:text-gray-300 mr-4">
            <ArrowBack style={{ fontSize: '20px' }} />
          </button>
          <h1 className="text-white text-lg font-medium truncate">{course.courseTitle || course.title}</h1>
        </div>

        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-white text-lg mb-2">Course content not available</p>
            <p className="text-gray-400 text-sm mb-4">This course doesn't have any sections or lectures yet.</p>
            <button
              onClick={onBack}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden bg-gray-800 border-b border-gray-700 flex items-center px-4 py-3 z-30">
        <button onClick={onBack} className="text-white hover:text-gray-300">
          <ArrowBack style={{ fontSize: '24px' }} />
        </button>
        <h1 className="text-white text-sm font-medium truncate flex-1 mx-3">
          {course.courseTitle || course.title}
        </h1>
        <div className="text-xs text-green-400 font-bold">
          {course.progress || 0}%
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex bg-gray-800 border-b border-gray-700 items-center px-6 py-3 z-30">
        <button onClick={onBack} className="text-white hover:text-gray-300 mr-4">
          <ArrowBack style={{ fontSize: '20px' }} />
        </button>
        <h1 className="text-white text-lg font-medium truncate flex-1">
          {course.courseTitle || course.title}
        </h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            Progress: <span className="text-green-400 font-bold">{course.progress || 0}%</span>
          </div>
          <div className="text-sm text-gray-400">
            {course.sections.reduce((sum, s) => sum + (s.lecturesList?.filter(l => l.isCompleted).length || 0), 0)} / {course.sections.reduce((sum, s) => sum + (s.lecturesList?.length || 0), 0)} Lectures
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Video Section with Protected Player */}
        <div className="flex-1 flex flex-col bg-black relative min-h-[45vh] lg:min-h-0">
          <div className="relative flex-1 flex items-center justify-center">
            {selectedLecture && selectedLecture.url ? (
              // ✅ USE PROTECTED VIDEO PLAYER
              <ProtectedVideoPlayer
                videoUrl={selectedLecture.url}
                lectureTitle={selectedLecture.title}
                onTimeUpdate={handleVideoProgress}
                onEnded={async () => {
                  console.log('🎬 Video ended');
                  if (!selectedLecture.isCompleted) {
                    await handleToggleLectureCompletion(
                      { stopPropagation: () => {} }, 
                      selectedSection.id, 
                      selectedLecture.id
                    );
                    toast.success(' Lecture completed!', { duration: 2000 });
                  }
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full h-full"
                autoPlay={false}
              />
            ) : (
              <div className="text-center">
                <div 
                  className="w-20 h-20 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center mb-4 mx-auto cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause style={{ fontSize: '40px', color: 'white' }} />
                  ) : (
                    <PlayArrow style={{ fontSize: '40px', color: 'white', marginLeft: '4px' }} />
                  )}
                </div>
                <p className="text-white text-lg">
                  {selectedLecture ? selectedLecture.title : 'Select a lecture'}
                </p>
                {selectedLecture && !selectedLecture.url && (
                  <p className="text-gray-400 text-sm mt-2">Video URL not available</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Course Content Sidebar - Keep existing code */}
        <div className="lg:w-80 bg-gray-800 border-l border-gray-700 flex flex-col min-h-0">
          {/* Progress Bar */}
          <div className="px-4 py-3 bg-gray-900 border-b border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400 font-medium">Course Progress</span>
              <span className="text-sm text-green-400 font-bold">{course.progress || 0}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${course.progress || 0}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {course.sections.reduce((sum, s) => sum + (s.lecturesList?.filter(l => l.isCompleted).length || 0), 0)} of {course.sections.reduce((sum, s) => sum + (s.lecturesList?.length || 0), 0)} lectures completed
            </div>
          </div>

          {/* Sections List - Keep existing code */}
          <div className="flex-1 overflow-y-auto p-4">
            {course.sections.map((section) => (
              <div key={section.id} className="mb-4">
                <div
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer"
                >
                  <div className="flex-1 text-left">
                    <div className="text-white font-medium text-sm">
                      {section.title}
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                      {section.lecturesList?.filter(l => l.isCompleted).length || 0} / {section.lecturesList?.length || 0} completed
                    </div>
                  </div>
                  {expandedSections.has(section.id) ? <ExpandLess className="text-gray-400" /> : <ExpandMore className="text-gray-400" />}
                </div>
                {expandedSections.has(section.id) && section.lecturesList && (
                  <div className="mt-2 space-y-1">
                    {section.lecturesList.map((lecture) => (
                      <div
                        key={lecture.id}
                        onClick={() => selectLecture(section, lecture)}
                        className={`w-full flex items-center justify-between p-2 rounded cursor-pointer ${
                          selectedLecture?.id === lecture.id ? 'bg-gray-700 border-l-4 border-purple-500' : 'bg-gray-800 hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <div
                            onClick={(e) => handleToggleLectureCompletion(e, section.id, lecture.id)}
                            className="flex-shrink-0 cursor-pointer"
                          >
                            {lecture.isCompleted ? (
                              <CheckCircle style={{ fontSize: '18px', color: '#10b981' }} />
                            ) : (
                              <CheckCircleOutline style={{ fontSize: '18px', color: '#6b7280' }} />
                            )}
                          </div>
                          <span className={`text-sm flex-1 ${lecture.isCompleted ? 'text-gray-400 line-through' : 'text-gray-300'}`}>
                            {lecture.title}
                          </span>
                        </div>
                        <span className="text-gray-500 text-xs">{lecture.duration || '5'} min</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourseDetailsPage;