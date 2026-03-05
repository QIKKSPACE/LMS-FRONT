import React, { useState, lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { initConsoleCleanup } from './utils/consoleCleanup';

const AuthPage = lazy(() => import('./pages/AuthPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const MyCoursePage = lazy(() => import('./pages/MyCoursePage'));
const BuyCourseDetailPage = lazy(() => import('./pages/BuyCourseDetailPage'));
// const MyCourseDetailsPage = lazy(() => import('./pages/MyCourseDetailsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const LiveSessionPage = lazy(() => import('./pages/LiveSessionPage'));
const BottomNav = lazy(() => import('./components/BottomNav'));
const SidebarNav = lazy(() => import('./components/SidebarNav'));

// ✅ ADD THESE TWO IMPORTS - Terms and Privacy pages
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));

const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-3 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
      <p className="text-gray-600 text-sm font-medium">Loading...</p>
    </div>
  </div>
);

function AppContent() {
  const { isAuthenticated, isLoading, authInitialized } = useAuth();
  const [activeNavTab, setActiveNavTab] = useState('home');
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [viewMode, setViewMode] = useState(null); 
 
  useEffect(() => {
    initConsoleCleanup();
  }, []);

  const handleTabChange = React.useCallback((tab) => {
    console.log('Tab changed to:', tab);
    setActiveNavTab(tab);
    setSelectedCourseId(null);
    setViewMode(null);
  }, []);

  const handleLogoClick = React.useCallback(() => {
    console.log('🏠 Logo clicked - navigating to home');
    setActiveNavTab('home');
    setSelectedCourseId(null);
    setViewMode(null);
  }, []);

  const handleHomePageCourseClick = React.useCallback((courseId) => {
    console.log('Home page course clicked:', courseId);
    setSelectedCourseId(courseId);
    setViewMode('buy');
  }, []);

  const handleMyCourseCourseClick = React.useCallback((courseId) => {
    console.log('My course clicked:', courseId);
    setSelectedCourseId(courseId);
    setViewMode('mycourse');
  }, []);

  const handlePurchaseComplete = React.useCallback((courseId) => {
    console.log('Purchase completed for course:', courseId);
    toast.success('🎉 Course purchased successfully! Check "My Courses"');
    
    setSelectedCourseId(null);
    setViewMode(null);
    
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }, []);

  const handleBackNavigation = React.useCallback(() => {
    console.log('Back navigation triggered');
    setSelectedCourseId(null);
    setViewMode(null);
  }, []);

  // ✅ FIX: Wait for auth to initialize before showing anything
  // This prevents the flash of login page on refresh
  if (!authInitialized) {
    return null; // Return nothing while checking auth status
  }

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <AuthPage />
      </Suspense>
    );
  }

  const isViewingPurchasedCourse = selectedCourseId && viewMode === 'mycourse';
  const isViewingCourseDetail = selectedCourseId && viewMode === 'buy';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Suspense fallback={<LoadingSpinner />}>
        {isViewingPurchasedCourse ? (
          <div className="fixed inset-0 z-50 bg-gray-900">
            <MyCoursePage
              courseId={selectedCourseId}
              onBack={handleBackNavigation}
            />
          </div>
        ) : (
          <>
            <SidebarNav 
              activeTab={activeNavTab} 
              onTabChange={handleTabChange}
            />
            
            <div className="lg:ml-72 transition-all duration-300">
              {isViewingCourseDetail ? (
                <BuyCourseDetailPage
                  courseId={selectedCourseId}
                  onBack={handleBackNavigation}
                  onPurchase={handlePurchaseComplete}
                />
              ) : (
                <>
                  {activeNavTab === 'home' && (
                    <HomePage 
                      onCourseClick={handleHomePageCourseClick}
                      onLogoClick={handleLogoClick}
                    />
                  )}
                  
                  {activeNavTab === 'mycourse' && (
                    <MyCoursePage 
                      onCourseClick={handleMyCourseCourseClick}
                      onLogoClick={handleLogoClick}
                    />
                  )}
                  
                  {activeNavTab === 'livesession' && (
                    <LiveSessionPage 
                      onLogoClick={handleLogoClick}
                    />
                  )}
                  
                  {activeNavTab === 'profile' && (
                    <ProfilePage 
                      onLogoClick={handleLogoClick}
                    />
                  )}
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

function App() {
  return (
    <AuthProvider>
      {/* ✅ ADD ROUTER WRAPPER */}
      <Router>
        {/* ✅ FIXED: Enhanced Toaster Configuration with Higher Z-Index */}
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={12}
          containerClassName="toast-container"
          containerStyle={{
            top: '80px',
            zIndex: 99999,
          }}
          toastOptions={{
            duration: 4000,
            className: 'toast-notification',
            style: {
              background: '#ffffff',
              color: '#1f2937',
              padding: '16px 20px',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
              fontSize: '15px',
              fontWeight: '500',
              maxWidth: '500px',
              minWidth: '320px',
              backdropFilter: 'blur(10px)',
            },
            success: {
              duration: 3500,
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
              style: {
                background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                color: '#065f46',
                border: '2px solid #10b981',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
              style: {
                background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                color: '#991b1b',
                border: '2px solid #ef4444',
              },
            },
            loading: {
              duration: Infinity,
              iconTheme: {
                primary: '#3b82f6',
                secondary: '#ffffff',
              },
              style: {
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                color: '#1e40af',
                border: '2px solid #3b82f6',
              },
            },
            blank: {
              duration: 4000,
              style: {
                background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
                color: '#854d0e',
                border: '2px solid #eab308',
              },
            },
          }}
        />
        
        {/* ✅ ADD ROUTES CONFIGURATION */}
        <Routes>
          {/* Legal Pages - Accessible without authentication */}
          <Route path="/terms" element={
            <Suspense fallback={<LoadingSpinner />}>
              <TermsOfService />
            </Suspense>
          } />
          <Route path="/privacy" element={
            <Suspense fallback={<LoadingSpinner />}>
              <PrivacyPolicy />
            </Suspense>
          } />
          
          {/* Main App Content */}
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;