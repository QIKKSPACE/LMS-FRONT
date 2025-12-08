import React, { useState, lazy, Suspense, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { initConsoleCleanup } from './utils/consoleCleanup';

// OPTIMIZATION: Lazy load pages to reduce initial bundle size
const AuthPage = lazy(() => import('./pages/AuthPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const MyCoursePage = lazy(() => import('./pages/MyCoursePage'));
const BuyCourseDetailPage = lazy(() => import('./pages/BuyCourseDetailPage'));
const MyCourseDetailsPage = lazy(() => import('./pages/MyCourseDetailsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const LiveSessionPage = lazy(() => import('./pages/LiveSessionPage'));
const BottomNav = lazy(() => import('./components/BottomNav'));
const SidebarNav = lazy(() => import('./components/SidebarNav'));

// OPTIMIZATION: Lightweight loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-3 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
      <p className="text-gray-600 text-sm font-medium">Loading...</p>
    </div>
  </div>
);

// Main App Component wrapped with auth check
function AppContent() {
  const { isAuthenticated, isLoading, authInitialized, user } = useAuth();
  const [activeNavTab, setActiveNavTab] = useState('home');
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [viewMode, setViewMode] = useState(null); // null, 'buy', or 'mycourse'

  // ✅ Initialize console cleanup on mount
  useEffect(() => {
    initConsoleCleanup();
  }, []);

  // OPTIMIZATION: Memoize handlers
  const handleTabChange = React.useCallback((tab) => {
    console.log('Tab changed to:', tab);
    setActiveNavTab(tab);
    setSelectedCourseId(null);
    setViewMode(null);
  }, []);

  // FIXED: Handle course click from HomePage (unpurchased courses)
  const handleHomePageCourseClick = React.useCallback((courseId) => {
    console.log('Home page course clicked:', courseId);
    setSelectedCourseId(courseId);
    setViewMode('buy'); // Show BuyCourseDetailPage
  }, []);

  // FIXED: Handle course click from MyCoursePage (purchased courses)
  const handleMyCourseCourseClick = React.useCallback((courseId) => {
    console.log('My course clicked:', courseId);
    setSelectedCourseId(courseId);
    setViewMode('mycourse'); // Show MyCourseDetailsPage
  }, []);

  // Handle purchase completion
  const handlePurchaseComplete = React.useCallback((courseId) => {
    console.log('Purchase completed for course:', courseId);
    toast.success('🎉 Course purchased successfully! Check "My Courses"');
    
    // Clear selected course and go back to home
    setSelectedCourseId(null);
    setViewMode(null);
    
    // Force page reload to refresh user data and course lists
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }, []);

  // Handle back navigation
  const handleBackNavigation = React.useCallback(() => {
    console.log('Back navigation triggered');
    setSelectedCourseId(null);
    setViewMode(null);
  }, []);

  // OPTIMIZATION: Show minimal loading during auth initialization only
  if (isLoading && !authInitialized) {
    return <LoadingSpinner />;
  }

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <AuthPage />
      </Suspense>
    );
  }

  // Check if we're viewing a purchased course (MyCourseDetailsPage)
  const isViewingPurchasedCourse = selectedCourseId && viewMode === 'mycourse';

  // Check if we're viewing an unpurchased course detail (BuyCourseDetailPage)
  const isViewingCourseDetail = selectedCourseId && viewMode === 'buy';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Suspense fallback={<LoadingSpinner />}>
        {/* FIXED: Full-screen course player for purchased courses */}
        {isViewingPurchasedCourse ? (
          <div className="fixed inset-0 z-50 bg-gray-900">
            <MyCourseDetailsPage
              courseId={selectedCourseId}
              onBack={handleBackNavigation}
            />
          </div>
        ) : (
          <>
            {/* Sidebar Navigation (Desktop) */}
            <SidebarNav activeTab={activeNavTab} onTabChange={handleTabChange} />
            
            {/* Main Content Area */}
            <div className="lg:ml-72 transition-all duration-300">
              {/* FIXED: Show course detail page when viewing unpurchased course */}
              {isViewingCourseDetail ? (
                <BuyCourseDetailPage
                  courseId={selectedCourseId}
                  onBack={handleBackNavigation}
                  onPurchase={handlePurchaseComplete}
                />
              ) : (
                <>
                  {/* Home Tab - Shows unpurchased courses */}
                  {activeNavTab === 'home' && (
                    <HomePage onCourseClick={handleHomePageCourseClick} />
                  )}
                  
                  {/* My Course Tab - Shows purchased courses */}
                  {activeNavTab === 'mycourse' && (
                    <MyCoursePage onCourseClick={handleMyCourseCourseClick} />
                  )}
                  
                  {/* Live Session Tab */}
                  {activeNavTab === 'livesession' && (
                    <LiveSessionPage />
                  )}
                  
                  {/* Profile Tab */}
                  {activeNavTab === 'profile' && (
                    <ProfilePage />
                  )}
                </>
              )}
            </div>

            {/* Bottom Navigation (Mobile) */}
            <BottomNav activeTab={activeNavTab} onTabChange={handleTabChange} />
          </>
        )}
      </Suspense>
    </div>
  );
}

// Root App Component with AuthProvider
function App() {
  return (
    <AuthProvider>
      {/* Toast notifications */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
          top: 20,
        }}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#363636',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            duration: 2500,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
          loading: {
            duration: Infinity,
          },
        }}
      />
      <AppContent />
    </AuthProvider>
  );
}

export default App;