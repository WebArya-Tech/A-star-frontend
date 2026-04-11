import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function SignupModal({ isOpen, onClose, onOpenLogin }) {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match!')
      return
    }

    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setIsLoading(true)

    try {
      const result = signup(
        signupData.fullName,
        signupData.email,
        signupData.phone,
        signupData.password
      )

      if (result.success) {
        setSignupData({
          fullName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: ''
        })
        onClose()
        navigate('/student-dashboard')
      } else {
        setError(result.message || 'Failed to create account')
      }
    } catch (err) {
      setError('An error occurred during signup')
      console.error('Signup error:', err)
    } finally {
      setIsLoading(false)
    }
  }
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-blue-900/60 backdrop-blur-sm flex items-center justify-center z-[9999]" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="p-6 rounded-t-2xl sticky top-0 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-black text-white">Sign Up</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 text-3xl font-bold transition"
            >
              ×
            </button>
          </div>
          <p className="text-blue-200 mt-2">Create your iThinkLearn account</p>
        </div>
        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Full Name Field */}
            <div>
              <label htmlFor="signup-fullname" className="block text-sm font-semibold mb-2 text-blue-900">
                Full Name
              </label>
              <input
                type="text"
                id="signup-fullname"
                required
                value={signupData.fullName}
                onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 transition text-gray-800"
                placeholder="Enter your full name"
              />
            </div>
            {/* Email Field */}
            <div>
              <label htmlFor="signup-email" className="block text-sm font-semibold mb-2 text-blue-900">
                Email Address
              </label>
              <input
                type="email"
                id="signup-email"
                required
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 transition text-gray-800"
                placeholder="Enter your email"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="signup-phone" className="block text-sm font-semibold mb-2 text-blue-900">
                Phone Number
              </label>
              <input
                type="tel"
                id="signup-phone"
                required
                value={signupData.phone}
                onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 transition text-gray-800"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="signup-password" className="block text-sm font-semibold mb-2 text-blue-900">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="signup-password"
                  required
                  minLength="6"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 transition text-gray-800"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="signup-confirm-password" className="block text-sm font-semibold mb-2 text-blue-900">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="signup-confirm-password"
                  required
                  minLength="6"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 transition"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg font-bold text-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-blue-900 hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    onOpenLogin()
                  }}
                  className="font-semibold text-blue-900 hover:text-blue-700 hover:underline"
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
