import React, { useState } from 'react'
import { Eye, EyeOff, Mail } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { requestAdminLoginOTP, verifyAdminLoginOTP } from '../../api/api/authApi'
import toast from 'react-hot-toast'

export default function LoginModal({ isOpen, onClose, onOpenSignup, onOpenForgotPassword }) {
  const { login } = useAuth()
  const navigate = useNavigate()
  
  const [loginMode, setLoginMode] = useState('password') // 'password' or 'otp'
  const [otpSent, setOtpSent] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '', otp: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleRequestOTP = async () => {
    if (!loginData.email) {
      setError('Please enter your email first.')
      return
    }
    setError('')
    setIsLoading(true)
    try {
      await requestAdminLoginOTP(loginData.email)
      setOtpSent(true)
      toast.success('OTP sent to your email!')
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please check your email or try password login.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      let result;
      if (loginMode === 'password') {
         result = await login(loginData.email, loginData.password)
         if (result.success) {
            setLoginData({ email: '', password: '', otp: '' })
            onClose()
            if (result.isAdmin) navigate('/admin-dashboard')
            else navigate('/student-dashboard')
         } else {
            setError(result.message || 'Invalid email or password')
         }
      } else {
         // OTP Flow
         if (!otpSent) return handleRequestOTP();
         result = await verifyAdminLoginOTP({ email: loginData.email, otp: loginData.otp })
         if (result.token) {
            toast.success('Successfully logged in!')
            setLoginData({ email: '', password: '', otp: '' })
            onClose()
            navigate('/admin-dashboard')
            // Note: Since verifyAdminLoginOTP bypasses useAuth's state, a page refresh might be needed or we could update AuthContext manually.
            // For now, reload the window to hydrate context cleanly:
            window.location.reload()
         }
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-blue-900/60 backdrop-blur-sm flex items-center justify-center z-[9999]" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 relative">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-black text-white">Login</h2>
            <button onClick={onClose} className="text-white hover:text-blue-200 text-3xl font-bold transition">×</button>
          </div>
          <p className="text-blue-200 mt-2">Welcome back to iThinkLearn</p>
          
          <div className="flex gap-2 mt-6">
             <button type="button" onClick={() => { setLoginMode('password'); setOtpSent(false); setError(''); }}
                className={`flex-1 py-1.5 text-sm font-semibold rounded-t-lg transition border-b-2 ${loginMode === 'password' ? 'border-yellow-400 text-yellow-400 bg-white/10' : 'border-transparent text-blue-200 hover:bg-white/5'}`}>
                Password
             </button>
             <button type="button" onClick={() => { setLoginMode('otp'); setError(''); }}
                className={`flex-1 py-1.5 text-sm font-semibold rounded-t-lg transition border-b-2 ${loginMode === 'otp' ? 'border-yellow-400 text-yellow-400 bg-white/10' : 'border-transparent text-blue-200 hover:bg-white/5'}`}>
                Login with OTP (Admin)
             </button>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2 text-blue-900">Email or Username</label>
              <input
                type="text"
                required
                disabled={otpSent && loginMode === 'otp'}
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 transition text-gray-800 disabled:opacity-50 disabled:bg-gray-100"
                placeholder="Enter your email"
              />
            </div>

            {loginMode === 'password' && (
                <div>
                  <label className="block text-sm font-semibold mb-2 text-blue-900">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 transition"
                      placeholder="Enter your password"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <div className="text-right mt-2">
                    <button type="button" onClick={() => { onClose(); onOpenForgotPassword(); }} className="text-sm font-semibold text-blue-900 hover:underline">
                      Forgot Password?
                    </button>
                  </div>
                </div>
            )}

            {loginMode === 'otp' && otpSent && (
               <div>
                  <label className="block text-sm font-semibold mb-2 text-blue-900 flex justify-between">
                     <span>Enter 6-Digit OTP</span>
                     <button type="button" onClick={handleRequestOTP} className="text-xs text-blue-600 hover:underline">Resend OTP</button>
                  </label>
                  <input
                     type="text"
                     maxLength={6}
                     required
                     value={loginData.otp}
                     onChange={(e) => setLoginData({ ...loginData, otp: e.target.value.replace(/\D/g, '') })}
                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 text-center tracking-widest text-lg font-bold"
                     placeholder="• • • • • •"
                  />
               </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg font-bold text-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-blue-900 hover:from-yellow-300 hover:to-orange-400 transition-all shadow-lg disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : (loginMode === 'otp' && !otpSent ? 'Send OTP' : 'Login')}
            </button>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button type="button" onClick={() => { onClose(); onOpenSignup(); }} className="font-semibold text-blue-900 hover:underline">
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
