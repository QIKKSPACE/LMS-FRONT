// src/pages/MyCourseDetailsPage.jsx - UPDATED WITH FIRESTORE
import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowBack, 
  PlayArrow, 
  Pause, 
  VolumeUp, 
  Fullscreen, 
  PictureInPicture,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  CheckCircleOutline,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import { getCourseById, toggleLectureCompletion as toggleLectureInFirestore } from '../services/courseService';
import { useAuth } from '../context/AuthContext';
import { checkCourseExpiry } from '../utils/courseExpiry';
import toast from 'react-hot-toast';

const MyCourseDetailsPage = ({ courseId, onBack }) => {
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showSidebar, setShowSidebar] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Set sidebar visibility based on screen size
    const checkScreenSize = () => {
      setShowSidebar(window.innerWidth >= 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fetch course from Firestore
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const courseData = await getCourseById(courseId);
        
        if (courseData) {
          // Check expiry
          const courseWithExpiryCheck = checkCourseExpiry(courseData);
          setCourse(courseWithExpiryCheck);
          
          // Set first section and lecture as default
          if (courseWithExpiryCheck.sections && courseWithExpiryCheck.sections.length > 0) {
            const firstSection = courseWithExpiryCheck.sections[0];
            setSelectedSection(firstSection);
            if (firstSection.lecturesList && firstSection.lecturesList.length > 0) {
              setSelectedLecture(firstSection.lecturesList[0]);
            }
            // Expand first section by default
            setExpandedSections(new Set([firstSection.id]));
          }
        } else {
          toast.error('Course not found');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        toast.error('Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

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
    setSelectedSection(section);
    setSelectedLecture(lecture);
    setIsPlaying(true);
  };

  const handleToggleLectureCompletion = async (e, sectionId, lectureId) => {
    e.stopPropagation();
    
    if (!course || !user) return;
    
    try {
      const result = await toggleLectureInFirestore(user.uid, courseId, lectureId);
      
      if (result.success) {
        // Refresh course data
        const updatedCourse = await getCourseById(courseId);
        if (updatedCourse) {
          const courseWithExpiryCheck = checkCourseExpiry(updatedCourse);
          setCourse(courseWithExpiryCheck);
          
          // Update selected section and lecture
          const updatedSection = courseWithExpiryCheck.sections.find(s => s.id === sectionId);
          if (updatedSection) {
            setSelectedSection(updatedSection);
            const updatedLecture = updatedSection.lecturesList.find(l => l.id === lectureId);
            if (updatedLecture) {
              setSelectedLecture(updatedLecture);
            }
          }
        }
        toast.success('Progress updated!');
      } else {
        toast.error('Failed to update progress');
      }
    } catch (error) {
      console.error('Error toggling lecture:', error);
      toast.error('An error occurred');
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextLecture = () => {
    if (!course || !selectedSection || !selectedLecture) return;
    
    const currentSectionIndex = course.sections.findIndex(s => s.id === selectedSection.id);
    const currentLectureIndex = selectedSection.lecturesList.findIndex(l => l.id === selectedLecture.id);
    
    if (currentLectureIndex < selectedSection.lecturesList.length - 1) {
      // Next lecture in same section
      setSelectedLecture(selectedSection.lecturesList[currentLectureIndex + 1]);
    } else if (currentSectionIndex < course.sections.length - 1) {
      // First lecture of next section
      const nextSection = course.sections[currentSectionIndex + 1];
      setSelectedSection(nextSection);
      if (nextSection.lecturesList && nextSection.lecturesList.length > 0) {
        setSelectedLecture(nextSection.lecturesList[0]);
      }
    }
  };

  const handlePreviousLecture = () => {
    if (!course || !selectedSection || !selectedLecture) return;
    
    const currentSectionIndex = course.sections.findIndex(s => s.id === selectedSection.id);
    const currentLectureIndex = selectedSection.lecturesList.findIndex(l => l.id === selectedLecture.id);
    
    if (currentLectureIndex > 0) {
      // Previous lecture in same section
      setSelectedLecture(selectedSection.lecturesList[currentLectureIndex - 1]);
    } else if (currentSectionIndex > 0) {
      // Last lecture of previous section
      const prevSection = course.sections[currentSectionIndex - 1];
      setSelectedSection(prevSection);
      if (prevSection.lecturesList && prevSection.lecturesList.length > 0) {
        setSelectedLecture(prevSection.lecturesList[prevSection.lecturesList.length - 1]);
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-medium">Loading course...</p>
        </div>
      </div>
    );
  }

  // Course not found
  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <p className="text-white text-lg mb-4">Course not found</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // No sections
  if (!course.sections || course.sections.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <p className="text-white text-lg mb-4">Course content not available</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden bg-gray-800 border-b border-gray-700 flex items-center px-4 py-3 z-30">
        <button
          onClick={onBack}
          className="text-white hover:text-gray-300"
        >
          <ArrowBack style={{ fontSize: '24px' }} />
        </button>
        <h1 className="text-white text-sm font-medium truncate flex-1 mx-3">
          {course.title}
        </h1>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex bg-gray-800 border-b border-gray-700 items-center px-6 py-3 z-30">
        <button
          onClick={onBack}
          className="text-white hover:text-gray-300 mr-4"
        >
          <ArrowBack style={{ fontSize: '20px' }} />
        </button>
        <h1 className="text-white text-lg font-medium truncate flex-1">
          {course.title}
        </h1>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Video Player Section */}
        <div className="flex-1 flex flex-col bg-black relative lg:max-w-none min-h-0">
          {/* Video Player */}
          <div className="relative flex-1 min-h-[45vh] lg:min-h-0 flex items-center justify-center bg-black">
            {/* Navigation Arrows */}
            <button
              onClick={handlePreviousLecture}
              className="absolute left-4 z-10 text-purple-500 hover:text-purple-400 bg-black/50 rounded-full p-2 transition-colors"
              aria-label="Previous lecture"
            >
              <ChevronLeft style={{ fontSize: '32px' }} />
            </button>
            <button
              onClick={handleNextLecture}
              className="absolute right-4 z-10 text-purple-500 hover:text-purple-400 bg-black/50 rounded-full p-2 transition-colors"
              aria-label="Next lecture"
            >
              <ChevronRight style={{ fontSize: '32px' }} />
            </button>

            {/* Video or Placeholder */}
            <div className="w-full h-full flex items-center justify-center">
              {selectedLecture && selectedLecture.videoUrl ? (
                <iframe
                  src={selectedLecture.videoUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title={selectedLecture.title}
                ></iframe>
              ) : (
                <div className="text-center">
                  <button
                    onClick={handlePlayPause}
                    className="w-20 h-20 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center mb-4 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause style={{ fontSize: '40px', color: 'white' }} />
                    ) : (
                      <PlayArrow style={{ fontSize: '40px', color: 'white', marginLeft: '4px' }} />
                    )}
                  </button>
                  <p className="text-white text-lg">
                    {selectedLecture ? selectedLecture.title : 'Select a lecture to begin'}
                  </p>
                </div>
              )}
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePlayPause}
                  className="text-white hover:text-gray-300"
                >
                  {isPlaying ? (
                    <Pause style={{ fontSize: '20px' }} />
                  ) : (
                    <PlayArrow style={{ fontSize: '20px' }} />
                  )}
                </button>
                <span className="text-white text-sm">0:00</span>
                <div className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer relative">
                  <div className="h-full bg-white rounded-full" style={{ width: '0%' }}></div>
                  <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
                </div>
                <button className="text-white hover:text-gray-300">
                  <VolumeUp style={{ fontSize: '20px' }} />
                </button>
                <button className="text-white hover:text-gray-300">
                  <PictureInPicture style={{ fontSize: '20px' }} />
                </button>
                <button className="text-white hover:text-gray-300">
                  <Fullscreen style={{ fontSize: '20px' }} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content - Mobile (Below video) */}
        <div className="lg:hidden bg-gray-800 border-t border-gray-700 flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4">
            {course.sections.map((section) => (
              <div key={section.id} className="mb-4">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-left"
                >
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm">
                      Section {section.id}: {section.title}
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                      {section.completed} / {section.lecturesList ? section.lecturesList.length : section.lectures} | {section.duration}
                    </div>
                  </div>
                  {expandedSections.has(section.id) ? (
                    <ExpandLess className="text-gray-400" />
                  ) : (
                    <ExpandMore className="text-gray-400" />
                  )}
                </button>
                {expandedSections.has(section.id) && (
                  <div className="mt-2 space-y-1">
                    {section.lecturesList.map((lecture) => (
                      <button
                        key={lecture.id}
                        onClick={() => selectLecture(section, lecture)}
                        className={`w-full flex items-center justify-between p-2 rounded hover:bg-gray-700 transition-colors text-left ${
                          selectedLecture?.id === lecture.id && selectedSection?.id === section.id
                            ? 'bg-gray-700 border-l-4 border-purple-500'
                            : 'bg-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <button
                            onClick={(e) => handleToggleLectureCompletion(e, section.id, lecture.id)}
                            className="flex-shrink-0 hover:bg-gray-600 rounded p-1 transition-colors"
                            title={lecture.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                          >
                            {lecture.isCompleted ? (
                              <CheckCircle style={{ fontSize: '18px', color: '#10b981' }} />
                            ) : (
                              <CheckCircleOutline style={{ fontSize: '18px', color: '#6b7280' }} />
                            )}
                          </button>
                          <span className="text-gray-300 text-sm flex-1">{lecture.title}</span>
                        </div>
                        <span className="text-gray-500 text-xs">{lecture.duration}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Course Content Sidebar - Desktop */}
        <div className="hidden lg:flex w-80 bg-gray-800 border-l border-gray-700 flex-col min-h-0">
          <style>{`
            .course-content-scroll::-webkit-scrollbar {
              width: 8px;
            }
            .course-content-scroll::-webkit-scrollbar-track {
              background: #374151;
            }
            .course-content-scroll::-webkit-scrollbar-thumb {
              background: #4b5563;
              border-radius: 4px;
            }
            .course-content-scroll::-webkit-scrollbar-thumb:hover {
              background: #6b7280;
            }
            .course-content-scroll {
              scrollbar-width: thin;
              scrollbar-color: #4b5563 #374151;
            }
          `}</style>
          <div className="flex-1 overflow-y-auto p-4 course-content-scroll min-h-0 max-h-full">
            {course.sections.map((section) => (
              <div key={section.id} className="mb-4">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-left"
                >
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm">
                      Section {section.id}: {section.title}
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                      {section.completed} / {section.lecturesList ? section.lecturesList.length : section.lectures} | {section.duration}
                    </div>
                  </div>
                  {expandedSections.has(section.id) ? (
                    <ExpandLess className="text-gray-400" />
                  ) : (
                    <ExpandMore className="text-gray-400" />
                  )}
                </button>
                {expandedSections.has(section.id) && (
                  <div className="mt-2 space-y-1">
                    {section.lecturesList.map((lecture) => (
                      <button
                        key={lecture.id}
                        onClick={() => selectLecture(section, lecture)}
                        className={`w-full flex items-center justify-between p-2 rounded hover:bg-gray-700 transition-colors text-left ${
                          selectedLecture?.id === lecture.id && selectedSection?.id === section.id
                            ? 'bg-gray-700 border-l-4 border-purple-500'
                            : 'bg-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <button
                            onClick={(e) => handleToggleLectureCompletion(e, section.id, lecture.id)}
                            className="flex-shrink-0 hover:bg-gray-600 rounded p-1 transition-colors"
                            title={lecture.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                          >
                            {lecture.isCompleted ? (
                              <CheckCircle style={{ fontSize: '18px', color: '#10b981' }} />
                            ) : (
                              <CheckCircleOutline style={{ fontSize: '18px', color: '#6b7280' }} />
                            )}
                          </button>
                          <span className="text-gray-300 text-sm flex-1">{lecture.title}</span>
                        </div>
                        <span className="text-gray-500 text-xs">{lecture.duration}</span>
                      </button>
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