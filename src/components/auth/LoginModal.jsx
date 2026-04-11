import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function LoginModal({ isOpen, onClose, onOpenSignup, onOpenForgotPassword }) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await login(loginData.email, loginData.password)

      if (result.success) {
        setLoginData({ email: '', password: '' })
        onClose()
        if (result.isAdmin) {
          navigate('/admin-dashboard')
        } else {
          navigate('/student-dashboard')
        }
      } else {
        setError(result.message || 'Invalid email or password')
      }
    } catch (err) {
      setError('An error occurred during login')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-blue-900/60 backdrop-blur-sm flex items-center justify-center z-[9999]" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="p-6 rounded-t-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-black text-white">Login</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 text-3xl font-bold transition"
            >
              ×
            </button>
          </div>
          <p className="text-blue-200 mt-2">Welcome back to iThinkLearn</p>
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

            {/* Email Field */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-semibold mb-2 text-blue-900">
                Email or Username
              </label>
              <input
                type="text"
                id="login-email"
                autoComplete="username"
                required
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 transition text-gray-800"
                placeholder="Enter your email or username"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="login-password" className="block text-sm font-semibold mb-2 text-blue-900">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="login-password"
                  autoComplete="current-password"
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 transition text-gray-800"
                  placeholder="Enter your password"
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
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onOpenForgotPassword()
                }}
                className="text-sm font-semibold text-blue-900 hover:text-blue-700 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg font-bold text-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-blue-900 hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    onOpenSignup()
                  }}
                  className="font-semibold text-blue-900 hover:text-blue-700 hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
