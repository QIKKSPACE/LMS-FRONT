import React, { useState, useEffect } from 'react';
import { Person, Phone, LocationOn, Edit, Save, Cancel, Security, Email } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import logo from '../assets/logo.png';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: '',
    mobileNumber: '',
    email: '',
    address: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSaving, setIsSaving] = useState(false);

  // Load user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      console.log('Loading user data:', user);
      setEditedData({
        name: user.name || '',
        mobileNumber: user.mobileNumber || '',
        email: user.email || '',
        address: user.address || ''
      });
    }
  }, [user]);

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
    };

    // Add event listener for keyboard shortcuts
    window.addEventListener('keydown', handleKeyDown, true);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    console.log('Attempting to save profile:', editedData);
    
    // Validation
    if (!editedData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setIsSaving(true);

    try {
      // Only send fields that can be updated (exclude email and uid)
      const updates = {
        name: editedData.name.trim(),
        mobileNumber: editedData.mobileNumber.trim(),
        address: editedData.address.trim()
      };

      console.log('Sending updates:', updates);

      const result = await updateProfile(updates);
      
      console.log('Update result:', result);

      if (result && result.success) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        const errorMessage = result?.error || 'Failed to update profile';
        console.error('Update failed:', errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Exception during save:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original user data
    if (user) {
      setEditedData({
        name: user.name || '',
        mobileNumber: user.mobileNumber || '',
        email: user.email || '',
        address: user.address || ''
      });
    }
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
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
                  {editedData.name || 'User'}
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
                      {editedData.name || 'Not provided'}
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
                  <p 
                    className="text-lg text-gray-900"
                    style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                  >
                    {editedData.email}
                  </p>
                  {isEditing && (
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
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
                      {editedData.mobileNumber || 'Not provided'}
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
                      {editedData.address || 'Not provided'}
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
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Cancel style={{ fontSize: '18px' }} />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save style={{ fontSize: '18px' }} />
                      <span>Save</span>
                    </>
                  )}
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