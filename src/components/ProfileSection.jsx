import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, User, Mail, Save, Upload, X, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

const ProfileSection = ({ onBack }) => {
  const { user, updateUser, uploadProfileImage } = useAuth();
  const { isDark } = useTheme();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const result = await updateUser({ name: name.trim(), email: email.trim() });
      
      if (result.success) {
        setIsEditing(false);
      } else {
        alert(result.message || 'Failed to update profile');
      }
    } catch (error) {
      alert('An error occurred while updating your profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    try {
      const result = await uploadProfileImage(file);
      
      if (result.success) {
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 2000);
      } else {
        alert(result.message || 'Failed to upload image');
      }
    } catch (error) {
      alert('An error occurred while uploading the image');
    }
  };

  const handleRemoveImage = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/profile-image', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        updateUser({ profileImage: null });
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 2000);
      } else {
        alert('Failed to remove profile image');
      }
    } catch (error) {
      alert('An error occurred while removing the image');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Profile Settings</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account information</p>
            </div>
          </div>
          {isEditing && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Profile Image Section */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Profile Picture</h2>
            
            <div className="flex items-center space-x-6">
              {/* Current Profile Image */}
              <div className="relative">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
                  />
                ) : user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-24 h-24 rounded-full border-4 border-gray-200 dark:border-gray-600"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center border-4 border-gray-200 dark:border-gray-600">
                    <User className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                  </div>
                )}
                
                {uploadSuccess && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>

              {/* Upload Area */}
              <div className="flex-1">
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                    dragActive
                      ? 'border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Camera className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                      placeholder="Enter your full name"
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{user?.name || 'Not set'}</span>
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                      placeholder="Enter your email address"
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{user?.email || 'Not set'}</span>
                  </div>
                )}
              </div>

              {/* Cancel/Save Buttons for Editing */}
              {isEditing && (
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setName(user?.name || '');
                      setEmail(user?.email || '');
                    }}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Stats */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Account Statistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Messages Sent</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">5</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Files Uploaded</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Days Active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;