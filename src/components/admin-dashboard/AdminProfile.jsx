import React, { useState, useEffect } from 'react'
import { Lock, Mail, Phone, MapPin, Save, X, Eye, EyeOff, Upload } from 'lucide-react'
import { getMe } from '../../api/api/accountApi.js'
import toast from 'react-hot-toast'

export default function AdminProfile({ adminData }) {
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    name: adminData.name || '',
    email: adminData.email || '',
    phone: '',
    address: '',
    position: adminData.role || 'Administrator'
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMe();
        setFormData({
          name: data.name || adminData.name || '',
          email: data.email || adminData.email || '',
          phone: data.mobile || '+91 98765 43210',
          address: data.address || 'New Delhi, India',
          position: data.role || adminData.role || 'Administrator'
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [adminData]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const [stats, setStats] = useState({
    totalStudents: 1542,
    totalCourses: 24,
    totalTeachers: 18,
    activeClasses: 12
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = () => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Please fill all required fields')
      return
    }
    alert('Profile updated successfully!')
    setIsEditing(false)
  }

  const handleUpdatePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Please fill all password fields')
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match')
      return
    }
    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long')
      return
    }
    alert('Password updated successfully!')
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setShowChangePasswordForm(false)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    // Simulate upload progress
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 30
      })
    }, 300)

    // Convert to base64 and store
    const reader = new FileReader()
    reader.onload = (event) => {
      setProfileImage(event.target.result)
      setTimeout(() => {
        setUploadProgress(0)
        alert('Profile picture uploaded successfully!')
      }, 1000)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border-b-2 border-blue-900 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-blue-900">Admin Profile</h2>
        <p className="text-gray-500 text-sm mt-1">Manage your admin account and settings</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 pb-8 border-b-2" style={{ borderColor: '#f0f0f0' }}>
          <div className="flex items-center gap-6">
            {/* Profile Picture Area */}
            <div className="relative group">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover shadow-lg"
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center font-bold text-white text-4xl shadow-lg bg-blue-900"
                >
                  {adminData.name.charAt(0)}
                </div>
              )}
              
              {/* Upload Overlay */}
              <label
                htmlFor="profile-image-input"
                className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100"
              >
                <div className="text-center">
                  <Upload size={24} className="text-white mx-auto mb-1" />
                  <span className="text-white text-xs font-semibold">Change</span>
                </div>
              </label>
              
              <input
                id="profile-image-input"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Upload Progress Bar */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="absolute bottom-0 left-0 right-0 rounded-full h-1" style={{ backgroundColor: '#e0e0e0' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      backgroundColor: '#28a745',
                      width: `${uploadProgress}%`
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <h3 className="text-2xl font-bold text-blue-900">{adminData.name}</h3>
              <p className="text-gray-600">{formData.position}</p>
              <p className="text-sm text-gray-500">ID: {adminData.adminId}</p>
              <p className="text-xs text-gray-400 mt-1">Hover on photo to change</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-6 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition-all ${isEditing ? 'bg-red-600' : 'bg-blue-900'}`}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile Form */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all"
                style={{ 
                  borderColor: isEditing ? '#1e3a8a' : '#e0e0e0',
                  backgroundColor: isEditing ? 'white' : '#ffffff'
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email (Read-only)</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 rounded-lg border-2 bg-gray-100"
                style={{ borderColor: '#e0e0e0' }}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
              <div className="flex items-center gap-2">
                <Phone size={20} className="text-gray-600 text-blue-900" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="flex-1 px-4 py-3 rounded-lg border-2 focus:outline-none transition-all"
                  style={{ 
                    borderColor: isEditing ? '#1e3a8a' : '#e0e0e0',
                    backgroundColor: isEditing ? 'white' : '#ffffff'
                  }}
                />
              </div>
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Position *</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all"
                style={{ 
                  borderColor: isEditing ? '#1e3a8a' : '#e0e0e0',
                  backgroundColor: isEditing ? 'white' : '#ffffff'
                }}
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
              <div className="flex items-start gap-2">
                <MapPin size={20} className="text-gray-600 mt-3 text-blue-900" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="flex-1 px-4 py-3 rounded-lg border-2 focus:outline-none transition-all"
                  style={{ 
                    borderColor: isEditing ? '#1e3a8a' : '#e0e0e0',
                    backgroundColor: isEditing ? 'white' : '#ffffff'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex gap-3 pt-6 border-t-2" style={{ borderColor: '#f0f0f0' }}>
              <button
                onClick={handleSaveProfile}
                className="flex-1 px-6 py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                style={{ backgroundColor: '#28a745' }}
              >
                <Save size={20} /> Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold flex items-center justify-center gap-2 hover:bg-gray-300 transition-all"
              >
                <X size={20} /> Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
        <h3 className="text-xl font-bold mb-6 text-blue-900">
          🔒 Security Settings
        </h3>

        <div className="space-y-4">
          <button
            onClick={() => setShowChangePasswordForm(!showChangePasswordForm)}
            className="w-full px-6 py-3 rounded-lg text-white font-semibold flex items-center justify-between hover:opacity-90 transition-all bg-blue-900"
          >
            <span className="flex items-center gap-2">
              <Lock size={20} /> Change Password
            </span>
            <span>{showChangePasswordForm ? '▲' : '▼'}</span>
          </button>

          {showChangePasswordForm && (
            <div className="mt-4 p-6 bg-gray-50 rounded-lg border-2" style={{ borderColor: '#1e3a8a' }}>
              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password *</label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 rounded-lg border-2 pr-10 focus:outline-none"
                      style={{ borderColor: '#1e3a8a' }}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      className="absolute right-3 top-3 text-gray-600"
                    >
                      {showPasswords.current ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">New Password *</label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 rounded-lg border-2 pr-10 focus:outline-none"
                      style={{ borderColor: '#1e3a8a' }}
                      placeholder="Enter new password (min. 8 characters)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-3 top-3 text-gray-600"
                    >
                      {showPasswords.new ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password *</label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 rounded-lg border-2 pr-10 focus:outline-none"
                      style={{ borderColor: '#1e3a8a' }}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-3 top-3 text-gray-600"
                    >
                      {showPasswords.confirm ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleUpdatePassword}
                    className="flex-1 px-6 py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                    style={{ backgroundColor: '#28a745' }}
                  >
                    <Save size={20} /> Update Password
                  </button>
                  <button
                    onClick={() => {
                      setShowChangePasswordForm(false)
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                    }}
                    className="flex-1 px-6 py-3 rounded-lg bg-gray-300 text-gray-700 font-semibold flex items-center justify-center gap-2 hover:bg-gray-400 transition-all"
                  >
                    <X size={20} /> Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
        <h3 className="text-xl font-bold mb-6 text-blue-900">
          ℹ️ Account Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 font-semibold mb-1">Admin ID</p>
            <p className="text-lg font-semibold">{adminData.adminId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-semibold mb-1">Role</p>
            <p className="text-lg font-semibold">{adminData.role}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-semibold mb-1">Account Status</p>
            <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
              Active
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-semibold mb-1">Member Since</p>
            <p className="text-lg font-semibold">January 2024</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-600 font-semibold mb-1">Last Login</p>
            <p className="text-lg font-semibold">Today at 10:45 AM IST</p>
          </div>
        </div>
      </div>
    </div>
  )
}
