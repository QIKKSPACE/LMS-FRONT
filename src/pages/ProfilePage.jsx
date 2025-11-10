/**
 * ProfilePage Component
 * 
 * Display profile page with name, mobile number, email, and address with edit functionality
 * 
 * React Native Conversion Notes:
 * - Replace <div> with <View> from react-native
 * - Replace <p> with <Text> from react-native
 * - Replace <input> with <TextInput> from react-native
 * - flex-col → flexDirection: 'column'
 * - Use SafeAreaView for mobile safe areas
 */
import React, { useState, useEffect } from 'react';
import { Person, Phone, LocationOn, Edit, Save, Cancel, Security, Email } from '@mui/icons-material';
import logo from '../assets/logo.png';

const ProfilePage = () => {
  // This would typically come from user context or API
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    mobileNumber: '+1 234 567 8900',
    email: 'john.doe@example.com',
    address: '123 Main Street, City, State 12345, Country'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: '',
    mobileNumber: '',
    email: '',
    address: ''
  });

  // Privacy protection: Prevent screenshots and screen recording
  useEffect(() => {
    if (isEditing) {
      // Allow editing, so disable protections
      return;
    }

    // Disable keyboard shortcuts for screenshots and dev tools (only when profile is visible)
    const handleKeyDown = (e) => {
      // Disable F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        alert('Developer tools are disabled on this page for security reasons.');
        return false;
      }

      // Disable Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
        alert('Developer tools are disabled on this page for security reasons.');
        return false;
      }

      // Disable Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
        alert('Developer tools are disabled on this page for security reasons.');
        return false;
      }

      // Disable Ctrl+Shift+C (Element Inspector)
      if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+U (View Source)
      if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        return false;
      }

      // Disable Print Screen (Windows/Linux) - Note: Limited effectiveness
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        alert('Screenshots are not allowed on this page.');
        return false;
      }

      // Disable Ctrl+S (Save Page)
      if (e.ctrlKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+P (Print)
      if (e.ctrlKey && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault();
        alert('Printing is not allowed on this page.');
        return false;
      }

      // Disable Ctrl+Shift+P (Command Palette in some browsers)
      if (e.ctrlKey && e.shiftKey && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault();
        return false;
      }
    };

    // Add event listener for keyboard shortcuts
    window.addEventListener('keydown', handleKeyDown, true);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isEditing]);

  const handleEdit = () => {
    setEditedData({ ...profileData });
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfileData({ ...editedData });
    setIsEditing(false);
    console.log('Profile saved:', editedData);
    // Here you would typically make an API call to save the data
  };

  const handleCancel = () => {
    setEditedData({ ...profileData });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-30">
        <div className="flex flex-row items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Profile
          </h1>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Edit profile"
            >
              <Edit style={{ fontSize: '20px' }} />
            </button>
          )}
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-20 shadow-sm">
        <div className="px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Profile
            </h1>
            <p className="text-gray-600 mt-1 text-sm">Your profile information</p>
          </div>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              <Edit style={{ fontSize: '18px' }} />
              <span>Edit</span>
            </button>
          )}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="px-4 lg:px-8 pt-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
            <Security style={{ fontSize: '20px', color: '#dc2626', marginTop: '2px' }} />
            <p className="text-sm text-yellow-800 flex-1">
              <strong>Privacy Notice:</strong> Screenshots and screen recording are not allowed. This page is protected to ensure your personal information remains confidential.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Display */}
      <div className="flex-1 px-4 lg:px-8 py-6 lg:py-8 pb-24 lg:pb-6">
        <div className="max-w-2xl mx-auto">
          <div 
            className="bg-white rounded-lg shadow-md p-6 lg:p-8 relative"
            style={{
              userSelect: isEditing ? 'auto' : 'none',
              WebkitUserSelect: isEditing ? 'auto' : 'none',
              msUserSelect: isEditing ? 'auto' : 'none',
              pointerEvents: 'auto'
            }}
            onContextMenu={(e) => {
              if (!isEditing) {
                e.preventDefault();
                alert('Right-click is disabled on this page for security reasons.');
                return false;
              }
            }}
            onDragStart={(e) => {
              if (!isEditing) {
                e.preventDefault();
                return false;
              }
            }}
            onCopy={(e) => {
              if (!isEditing) {
                e.preventDefault();
                alert('Copying is disabled on this page for security reasons.');
                return false;
              }
            }}
            onCut={(e) => {
              if (!isEditing) {
                e.preventDefault();
                return false;
              }
            }}
          >
            {/* Profile Avatar Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg border-4 border-red-500 p-2">
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              {!isEditing ? (
                <h2 
                  className="text-2xl font-bold text-gray-900"
                  style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                >
                  {profileData.name}
                </h2>
              ) : (
                <input
                  type="text"
                  name="name"
                  value={editedData.name}
                  onChange={handleChange}
                  className="text-2xl font-bold text-gray-900 text-center border-b-2 border-red-600 focus:outline-none focus:border-red-700 bg-transparent px-2"
                  placeholder="Enter name"
                />
              )}
            </div>

            {/* Profile Information */}
            <div className="space-y-6">
              {/* Name */}
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  <Person style={{ fontSize: '24px', color: '#dc2626' }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">Name</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editedData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
                      placeholder="Enter your name"
                    />
                  ) : (
                    <p 
                      className="text-lg text-gray-900"
                      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                    >
                      {profileData.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Mobile Number */}
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  <Phone style={{ fontSize: '24px', color: '#dc2626' }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">Mobile Number</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={editedData.mobileNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
                      placeholder="Enter your mobile number"
                    />
                  ) : (
                    <p 
                      className="text-lg text-gray-900"
                      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                    >
                      {profileData.mobileNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  <Email style={{ fontSize: '24px', color: '#dc2626' }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editedData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <p 
                      className="text-lg text-gray-900"
                      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                    >
                      {profileData.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  <LocationOn style={{ fontSize: '24px', color: '#dc2626' }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">Address</p>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={editedData.address}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none bg-white"
                      placeholder="Enter your address"
                    />
                  ) : (
                    <p 
                      className="text-lg text-gray-900"
                      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                    >
                      {profileData.address}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Edit Actions */}
            {isEditing && (
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  <Cancel style={{ fontSize: '18px' }} />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                >
                  <Save style={{ fontSize: '18px' }} />
                  <span>Save</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

