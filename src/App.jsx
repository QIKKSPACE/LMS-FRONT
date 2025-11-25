// src/App.jsx - OPTIMIZED VERSION WITH LAZY LOADING
import React, { useState, lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

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
  const { isAuthenticated, isLoading, authInitialized } = useAuth();
  const [activeNavTab, setActiveNavTab] = useState('home');
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [viewMode, setViewMode] = useState('buy');

  // OPTIMIZATION: Memoize handlers
  const handleTabChange = React.useCallback((tab) => {
    setActiveNavTab(tab);
    setSelectedCourseId(null);
    setViewMode('buy');
  }, []);

  const handleCourseClick = React.useCallback((courseId, isPurchased) => {
    setSelectedCourseId(courseId);
    setViewMode(isPurchased ? 'mycourse' : 'buy');
  }, []);

  const handlePurchase = React.useCallback((courseId) => {
    console.log('Purchasing course:', courseId);
    toast.success('Course purchased successfully!');
    setSelectedCourseId(null);
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

  const isCourseDetailsPage = selectedCourseId && viewMode === 'mycourse';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Suspense fallback={<LoadingSpinner />}>
        {isCourseDetailsPage ? (
          <div className="fixed inset-0 z-50">
            <MyCourseDetailsPage
              courseId={selectedCourseId}
              onBack={() => setSelectedCourseId(null)}
            />
          </div>
        ) : (
          <>
            <SidebarNav activeTab={activeNavTab} onTabChange={handleTabChange} />
            
            <div className="lg:ml-72 transition-all duration-300">
              {selectedCourseId ? (
                <BuyCourseDetailPage
                  courseId={selectedCourseId}
                  onBack={() => setSelectedCourseId(null)}
                  onPurchase={handlePurchase}
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
      {/* OPTIMIZATION: Reduced toast options */}
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
        }}
      />
      <AppContent />
    </AuthProvider>
  );
}

export default App;