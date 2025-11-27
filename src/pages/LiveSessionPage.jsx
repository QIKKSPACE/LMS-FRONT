import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import logo from '../assets/logo.png';

const LiveSessionPage = () => {
  const [liveSessions, setLiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch live sessions from all courses
  useEffect(() => {
    const fetchLiveSessions = async () => {
      try {
        setLoading(true);
        const coursesRef = collection(db, 'courses');
        const snapshot = await getDocs(coursesRef);
        
        const allSessions = [];
        
        // Loop through all courses and extract live lectures
        snapshot.docs.forEach(doc => {
          const courseData = doc.data();
          
          if (courseData.liveLectures && Array.isArray(courseData.liveLectures)) {
            courseData.liveLectures.forEach((lecture, index) => {
              allSessions.push({
                id: `${doc.id}_${index}`,
                courseId: doc.id,
                courseTitle: courseData.courseTitle,
                link: lecture.link,
                status: lecture.status || 'upcoming',
                date: lecture.date,
                time: lecture.time,
                // Extract topic from course title or use default
                topic: courseData.courseTitle || 'General Topic'
              });
            });
          }
        });

        // Sort by date (most recent first)
        allSessions.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB - dateA;
        });

        setLiveSessions(allSessions);
        setError(null);
      } catch (err) {
        console.error('Error fetching live sessions:', err);
        setError('Failed to load live sessions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchLiveSessions();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return {
      month: months[date.getMonth()],
      day: date.getDate()
    };
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'live':
        return 'bg-red-500';
      case 'upcoming':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading live sessions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-30">
        <div className="flex flex-row items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Live Sessions
          </h1>
          <img 
            src={logo} 
            alt="Spiritual Talk Foundation Logo" 
            className="h-10 w-10 object-contain rounded-full"
          />
        </div>
        <p className="px-4 pb-4 text-sm text-gray-600">
          Join live sessions and interact with instructors in real-time
        </p>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-20 shadow-sm">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Live Sessions
          </h1>
          <p className="text-gray-600 mt-1 text-sm">Join live sessions and interact with instructors in real-time</p>
        </div>
      </div>

      {/* Live Sessions List */}
      <div className="flex-1 px-6 lg:px-8 py-6 lg:py-8 pb-24 lg:pb-6">
        {liveSessions.length === 0 ? (
          <motion.div 
            className="flex flex-col items-center justify-center h-64"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-4"
            >
              <span className="text-4xl">📹</span>
            </motion.div>
            <p className="text-gray-500 text-lg font-semibold">No live sessions scheduled</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for upcoming sessions</p>
          </motion.div>
        ) : (
          <motion.div 
            className="lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-6 space-y-4 lg:space-y-0"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {liveSessions.map((session, index) => {
              const dateInfo = formatDate(session.date);
              const statusColor = getStatusColor(session.status);
              
              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200/50 cursor-pointer group"
                  whileHover={{ y: -5 }}
                >
                  {/* Top Section - Red Gradient Banner */}
                  <div 
                    className="relative bg-gradient-to-r from-red-600 via-red-800 to-black p-6 text-white min-h-[180px]"
                    style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)`,
                      backgroundSize: '32px 32px'
                    }}
                  >
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`${statusColor} text-white px-3 py-1 rounded-full text-xs font-bold uppercase`}>
                        {session.status}
                      </span>
                    </div>

                    {/* Live Indicator (if live) */}
                    {session.status.toLowerCase() === 'live' && (
                      <motion.div
                        className="absolute top-4 left-4 flex items-center gap-2"
                        animate={{
                          opacity: [1, 0.5, 1]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                        <span className="text-white text-sm font-bold">LIVE NOW</span>
                      </motion.div>
                    )}

                    {/* Title and Topic */}
                    <div className="mt-12">
                      <h3 className="text-2xl lg:text-3xl font-extrabold mb-2 leading-tight">
                        Live Session
                      </h3>
                      <p className="text-white/95 text-base lg:text-lg font-medium">
                        {session.topic}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Section - White Info Card */}
                  <div className="p-5 bg-white">
                    {/* Date and Time */}
                    <div className="flex items-center gap-3 mb-4">
                      {/* Calendar Icon with Date */}
                      <div className="flex-shrink-0 w-14 h-14 bg-blue-500 rounded-md flex flex-col items-center justify-center text-white shadow-sm">
                        <span className="text-[10px] font-bold uppercase leading-tight mt-1">{dateInfo.month}</span>
                        <span className="text-2xl font-extrabold leading-none">{dateInfo.day}</span>
                      </div>

                      {/* Time */}
                      <div className="flex-1">
                        <p className="text-gray-900 font-semibold text-sm lg:text-base flex items-center gap-2">
                          <span className="text-lg">🕐</span>
                          {session.time}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          {session.date}
                        </p>
                      </div>
                    </div>

                    {/* Course Title */}
                    <div className="mb-4 pb-4 border-b border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">From Course:</p>
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-2">
                        {session.courseTitle}
                      </h4>
                    </div>

                    {/* Join Button */}
                    <a 
                      href={session.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <motion.button
                        className={`w-full py-3 rounded-lg text-white font-bold text-sm transition-all duration-300 ${
                          session.status.toLowerCase() === 'live' 
                            ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800' 
                            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {session.status.toLowerCase() === 'live' ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="text-lg">🔴</span>
                            Join Live Now
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <span className="text-lg">📹</span>
                            Join Session
                          </span>
                        )}
                      </motion.button>
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LiveSessionPage;