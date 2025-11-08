import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import MyCoursePage from './pages/MyCoursePage';
import BuyCourseDetailPage from './pages/BuyCourseDetailPage';
import MyCourseDetailsPage from './pages/MyCourseDetailsPage';
import BottomNav from './components/BottomNav';
import SidebarNav from './components/SidebarNav';

function App() {
  const [activeNavTab, setActiveNavTab] = useState('home');
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [viewMode, setViewMode] = useState('buy'); // 'buy' or 'mycourse'

  // Clear selected course when navigation tab changes
  const handleTabChange = (tab) => {
    setActiveNavTab(tab);
    setSelectedCourseId(null);
    setViewMode('buy');
  };

  const handleCourseClick = (courseId, isPurchased) => {
    setSelectedCourseId(courseId);
    setViewMode(isPurchased ? 'mycourse' : 'buy');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Desktop Sidebar Navigation */}
      <SidebarNav activeTab={activeNavTab} onTabChange={handleTabChange} />

      {/* Main Content Area */}
      <div className="lg:ml-64">
        {/* Page Content */}
        <div>
          {selectedCourseId ? (
            viewMode === 'mycourse' ? (
              <MyCourseDetailsPage
                courseId={selectedCourseId}
                onBack={() => setSelectedCourseId(null)}
              />
            ) : (
              <BuyCourseDetailPage
                courseId={selectedCourseId}
                onBack={() => setSelectedCourseId(null)}
                onPurchase={(courseId) => {
                  // Handle purchase logic here
                  console.log('Purchasing course:', courseId);
                  setSelectedCourseId(null);
                  // You can update the course data here to mark it as purchased
                }}
              />
            )
          ) : (
            <>
              {activeNavTab === 'home' && (
                <HomePage onCourseClick={(id) => handleCourseClick(id, false)} />
              )}
              {activeNavTab === 'mycourse' && (
                <MyCoursePage onCourseClick={(id) => handleCourseClick(id, true)} />
              )}
              {activeNavTab === 'profile' && (
                <div className="flex items-center justify-center h-screen">
                  <p className="text-gray-500">Profile Page - Coming Soon</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeNavTab} onTabChange={handleTabChange} />
    </div>
  );
}

export default App;

