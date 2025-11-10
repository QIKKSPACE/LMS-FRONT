/**
 * LiveSessionPage Component
 * 
 * Displays all live sessions available to users
 * 
 * React Native Conversion Notes:
 * - Replace <div> with <View> from react-native
 * - Use ScrollView or FlatList for session list
 * - flex-col → flexDirection: 'column'
 * - grid → Use FlatList with numColumns prop for grid layout
 * - px-4, py-4 → paddingHorizontal, paddingVertical
 * - mb-20 → marginBottom for bottom nav spacing
 * - Use SafeAreaView for mobile safe areas
 */
import React from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

const LiveSessionPage = () => {
  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return {
      month: months[date.getMonth()],
      day: date.getDate()
    };
  };

  // Dummy live session data
  const liveSessions = [
    {
      id: 1,
      title: "Boot Camp",
      topic: "Video Editing",
      date: "2024-10-25",
      time: "11:00 AM - 12:00 PM",
      status: "upcoming",
      organizer: "Digital Changemakers Academy",
      isLive: false
    },
    {
      id: 2,
      title: "Live Workshop",
      topic: "Web Development",
      date: "2024-10-20",
      time: "2:00 PM - 4:00 PM",
      status: "upcoming",
      organizer: "Digital Changemakers Academy",
      isLive: false
    },
    {
      id: 3,
      title: "Boot Camp",
      topic: "React Fundamentals",
      date: "2024-10-18",
      time: "3:00 PM - 4:30 PM",
      status: "live",
      organizer: "Digital Changemakers Academy",
      isLive: true
    },
    {
      id: 4,
      title: "Live Session",
      topic: "Design Patterns",
      date: "2024-10-22",
      time: "11:00 AM - 12:00 PM",
      status: "upcoming",
      organizer: "Digital Changemakers Academy",
      isLive: false
    }
  ];


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-30">
        <div className="flex flex-row items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Live Sessions
          </h1>
        </div>
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
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No live sessions scheduled</p>
          </div>
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
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200/50 cursor-pointer"
                >
                  {/* Top Section - Red Gradient Banner */}
                  <div 
                    className="relative bg-gradient-to-r from-red-600 via-red-800 to-black p-6 text-white min-h-[180px]"
                    style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)`,
                      backgroundSize: '32px 32px'
                    }}
                  >
                    {/* Logo - Top Right */}
                    <div className="absolute top-4 right-4">
                      <img 
                        src={logo} 
                        alt="Logo" 
                        className="h-8 w-auto object-contain"
                        style={{ filter: 'brightness(0) invert(1)' }}
                      />
                    </div>

                    {/* Title and Topic */}
                    <div className="mt-12">
                      <h3 className="text-3xl lg:text-4xl font-extrabold mb-3 leading-tight">
                        {session.title}
                      </h3>
                      <p className="text-white/95 text-base lg:text-lg font-medium">
                        Topic : {session.topic}
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
                        <p className="text-gray-900 font-medium text-sm lg:text-base">
                          {session.time}
                        </p>
                      </div>
                    </div>

                    {/* Session Title */}
                    <h4 className="text-lg lg:text-xl font-bold text-gray-900">
                      {session.title} : Topic: {session.topic}
                    </h4>
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

