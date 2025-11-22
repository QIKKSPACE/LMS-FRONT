import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import MyCoursePage from './pages/MyCoursePage';
import BuyCourseDetailPage from './pages/BuyCourseDetailPage';
import MyCourseDetailsPage from './pages/MyCourseDetailsPage';
import ProfilePage from './pages/ProfilePage';
import LiveSessionPage from './pages/LiveSessionPage';
import BottomNav from './components/BottomNav';
import SidebarNav from './components/SidebarNav';

// Main App Component wrapped with auth check
function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const isCourseDetailsPage = selectedCourseId && viewMode === 'mycourse';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Course Details Page - Full Screen (No Sidebar/Nav) */}
      {isCourseDetailsPage ? (
        <div className="fixed inset-0 z-50">
          <MyCourseDetailsPage
            courseId={selectedCourseId}
            onBack={() => setSelectedCourseId(null)}
          />
        </div>
      ) : (
        <>
          {/* Desktop Sidebar Navigation */}
          <SidebarNav activeTab={activeNavTab} onTabChange={handleTabChange} />

          {/* Main Content Area */}
          <div className="lg:ml-72">
            {/* Page Content */}
            <div>
              {selectedCourseId ? (
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
              ) : (
                <>
                  {activeNavTab === 'home' && (
                    <HomePage onCourseClick={(id) => handleCourseClick(id, false)} />
                  )}
                  {activeNavTab === 'mycourse' && (
                    <MyCoursePage onCourseClick={(id) => handleCourseClick(id, true)} />
                  )}
                  {activeNavTab === 'livesession' && <LiveSessionPage />}
                  {activeNavTab === 'profile' && <ProfilePage />}
                </>
              )}
            </div>
          </div>

          {/* Mobile Bottom Navigation */}
          <BottomNav activeTab={activeNavTab} onTabChange={handleTabChange} />
        </>
      )}
    </div>
  );
}

// Root App Component with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;