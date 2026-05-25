import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function MyProfile({ studentData }) {
  const { updateProfile, changePassword } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    assignmentReminders: true,
    gradeUpdates: true,
    classReminders: true
  })
  
  const [formData, setFormData] = useState({
    name: studentData.name,
    email: studentData.email,
    phone: studentData.phone || '+91 98765 43210',
    address: 'Mumbai, Maharashtra, India',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    pincode: '400001',
    dateOfBirth: '2003-05-15',
    guardianName: 'Mr. Rajesh Sharma',
    guardianPhone: '+91 98765 43211',
    educationLevel: 'Undergraduate',
    institution: 'Mumbai University',
    semester: '4th Semester',
    major: 'Computer Science'
  })

  const [originalFormData, setOriginalFormData] = useState({ ...formData })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    const result = updateProfile({
      fullName: formData.name,
      email: formData.email,
      phone: formData.phone
    })
    
    if (result.success) {
      setOriginalFormData({ ...formData })
      setIsEditing(false)
      alert('✅ Profile updated successfully!')
    } else {
      alert('❌ Failed to update profile. Please try again.')
    }
  }

  const handleCancel = () => {
    setFormData({ ...originalFormData })
    setIsEditing(false)
  }

  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('⚠️ Please fill all password fields')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('⚠️ New passwords do not match!')
      return
    }

    if (passwordData.newPassword.length < 6) {
      alert('⚠️ Password must be at least 6 characters long')
      return
    }

    const result = changePassword(passwordData.currentPassword, passwordData.newPassword)
    
    if (result.success) {
      setShowPasswordModal(false)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      alert('✅ Password changed successfully!')
    } else {
      alert('❌ ' + (result.message || 'Failed to change password'))
    }
  }

  const handleSaveNotifications = () => {
    setShowNotificationModal(false)
    alert('✅ Notification preferences updated!')
  }

  const handleDeactivateAccount = () => {
    if (confirm('⚠️ Are you sure you want to deactivate your account? This action cannot be undone.')) {
      if (confirm('This will permanently delete all your data. Are you absolutely sure?')) {
        alert('Account deactivation requested. Please contact support to complete this process.')
      }
    }
  }

  const handleChangePhoto = () => {
    alert('📸 Photo upload feature coming soon! You can upload your profile picture here.')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border-b-2 border-blue-900 rounded-xl p-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">My Profile</h2>
          <p className="text-gray-500 text-sm">Manage your personal information and settings</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 rounded-lg font-semibold shadow-md hover:opacity-90 transition-all bg-blue-900 text-white"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-lg text-white font-semibold shadow-md hover:opacity-90 transition-all bg-green-600"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-3 rounded-lg font-semibold transition-all border-2 border-gray-400 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex items-start gap-6 mb-8">
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center font-black text-white text-5xl border-4 shadow-lg bg-blue-900 border-yellow-400"
          >
            {studentData.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <h3 className="text-3xl font-bold mb-2 text-blue-900">
              {formData.name}
            </h3>
            <p className="text-gray-600 mb-2">Student ID: {studentData.studentId}</p>
            <p className="text-gray-600 mb-2">{formData.email}</p>
            <div className="flex gap-2 mt-4">
              <span className="px-4 py-2 rounded-full text-sm font-bold text-white bg-blue-900">
                {formData.educationLevel}
              </span>
              <span className="px-4 py-2 rounded-full text-sm font-bold text-white bg-blue-900">
                {formData.semester}
              </span>
            </div>
          </div>
          <button 
            onClick={handleChangePhoto}
            className="px-4 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition-all" 
            style={{ backgroundColor: '#1e3a8a' }}
          >
            Change Photo
          </button>
        </div>

        {/* Personal Information */}
        <div className="border-t-2 pt-6" style={{ borderColor: '#f0f0f0' }}>
          <h4 className="text-xl font-bold mb-6" style={{ color: '#1e3a8a' }}>Personal Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-opacity-70"
                  style={{ borderColor: '#1e3a8a' }}
                />
              ) : (
                <p className="px-4 py-3 rounded-lg bg-white text-gray-800">{formData.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-opacity-70"
                  style={{ borderColor: '#1e3a8a' }}
                />
              ) : (
                <p className="px-4 py-3 rounded-lg bg-white text-gray-800">{formData.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-opacity-70"
                  style={{ borderColor: '#1e3a8a' }}
                />
              ) : (
                <p className="px-4 py-3 rounded-lg bg-white text-gray-800">{formData.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-opacity-70"
                  style={{ borderColor: '#1e3a8a' }}
                />
              ) : (
                <p className="px-4 py-3 rounded-lg bg-white text-gray-800">{formData.dateOfBirth}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-opacity-70"
                  style={{ borderColor: '#1e3a8a' }}
                />
              ) : (
                <p className="px-4 py-3 rounded-lg bg-white text-gray-800">{formData.address}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
              {isEditing ? (
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-opacity-70"
                  style={{ borderColor: '#1e3a8a' }}
                />
              ) : (
                <p className="px-4 py-3 rounded-lg bg-white text-gray-800">{formData.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
              {isEditing ? (
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-opacity-70"
                  style={{ borderColor: '#1e3a8a' }}
                />
              ) : (
                <p className="px-4 py-3 rounded-lg bg-white text-gray-800">{formData.state}</p>
              )}
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="border-t-2 pt-6 mt-8" style={{ borderColor: '#f0f0f0' }}>
          <h4 className="text-xl font-bold mb-6" style={{ color: '#1e3a8a' }}>Academic Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Education Level</label>
              {isEditing ? (
                <select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-opacity-70"
                  style={{ borderColor: '#1e3a8a' }}
                >
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="Diploma">Diploma</option>
                </select>
              ) : (
                <p className="px-4 py-3 rounded-lg bg-white text-gray-800">{formData.educationLevel}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Institution</label>
              {isEditing ? (
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-opacity-70"
                  style={{ borderColor: '#1e3a8a' }}
                />
              ) : (
                <p className="px-4 py-3 rounded-lg bg-white text-gray-800">{formData.institution}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Current Semester</label>
              {isEditing ? (
                <input
                  type="text"
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-opacity-70"
                  style={{ borderColor: '#1e3a8a' }}
                />
              ) : (
                <p className="px-4 py-3 rounded-lg bg-white text-gray-800">{formData.semester}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Major/Field of Study</label>
              {isEditing ? (
                <input
                  type="text"
                  name="major"
                  value={formData.major}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-opacity-70"
                  style={{ borderColor: '#1e3a8a' }}
                />
              ) : (
                <p className="px-4 py-3 rounded-lg bg-white text-gray-800">{formData.major}</p>
              )}
            </div>
          </div>
        </div>

        {/* Guardian Information */}
        <div className="border-t-2 pt-6 mt-8" style={{ borderColor: '#f0f0f0' }}>
          <h4 className="text-xl font-bold mb-6" style={{ color: '#1e3a8a' }}>Guardian Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Guardian Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-opacity-70"
                  style={{ borderColor: '#1e3a8a' }}
                />
              ) : (
                <p className="px-4 py-3 rounded-lg bg-white text-gray-800">{formData.guardianName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Guardian Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-opacity-70"
                  style={{ borderColor: '#1e3a8a' }}
                />
              ) : (
                <p className="px-4 py-3 rounded-lg bg-white text-gray-800">{formData.guardianPhone}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h4 className="text-xl font-bold mb-6" style={{ color: '#1e3a8a' }}>Account Settings</h4>
        <div className="space-y-4">
          <button 
            onClick={() => setShowPasswordModal(true)}
            className="w-full px-6 py-4 rounded-lg text-left font-semibold hover:shadow-md transition-all border-2" 
            style={{ borderColor: '#1e3a8a', color: '#1e3a8a' }}
          >
            🔒 Change Password
          </button>
          <button 
            onClick={() => setShowNotificationModal(true)}
            className="w-full px-6 py-4 rounded-lg text-left font-semibold hover:shadow-md transition-all border-2" 
            style={{ borderColor: '#f59e0b', color: '#f59e0b' }}
          >
            Notification Preferences
          </button>
          <button 
            onClick={handleDeactivateAccount}
            className="w-full px-6 py-4 rounded-lg text-left font-semibold hover:shadow-md transition-all border-2" 
            style={{ borderColor: '#dc3545', color: '#dc3545' }}
          >
            Deactivate Account
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowPasswordModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold" style={{ color: '#1e3a8a' }}>🔒 Change Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none"
                  style={{ borderColor: '#1e3a8a' }}
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none"
                  style={{ borderColor: '#1e3a8a' }}
                  placeholder="Enter new password"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none"
                  style={{ borderColor: '#1e3a8a' }}
                  placeholder="Confirm new password"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleChangePassword}
                  className="flex-1 px-6 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition-all"
                  style={{ backgroundColor: '#28a745' }}
                >
                  Update Password
                </button>
                <button
                  onClick={() => {
                    setShowPasswordModal(false)
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                  }}
                  className="flex-1 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all border-2"
                  style={{ borderColor: '#dc3545', color: '#dc3545' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Preferences Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowNotificationModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold" style={{ color: '#1e3a8a' }}>Notification Preferences</h3>
              <button
                onClick={() => setShowNotificationModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="font-semibold text-gray-700">Email Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#28a745]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="font-semibold text-gray-700">Push Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.pushNotifications}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, pushNotifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#28a745]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="font-semibold text-gray-700">SMS Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.smsNotifications}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, smsNotifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#28a745]"></div>
                </label>
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="font-bold text-gray-700 mb-3">Notification Types</h4>
                
                <div className="flex items-center justify-between p-3 bg-white rounded-lg mb-2">
                  <span className="text-gray-700">Assignment Reminders</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.assignmentReminders}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, assignmentReminders: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#28a745]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg mb-2">
                  <span className="text-gray-700">Grade Updates</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.gradeUpdates}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, gradeUpdates: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#28a745]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-gray-700">Class Reminders</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.classReminders}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, classReminders: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#28a745]"></div>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveNotifications}
                  className="flex-1 px-6 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition-all"
                  style={{ backgroundColor: '#28a745' }}
                >
                  Save Preferences
                </button>
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="flex-1 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all border-2"
                  style={{ borderColor: '#dc3545', color: '#dc3545' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
