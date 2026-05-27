import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { X, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import logoImage from '../assets/AStarClasses logo (31 March).png';

const Login = () => {
  const navigate = useNavigate();
  const { login, requestOtp, verifyOtp } = useAuth();
  const [useOtpLogin, setUseOtpLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; otp?: string; form?: string }>({});
  const [message, setMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const validateEmail = (value: string) => {
    if (!value.trim()) return 'Email is required.';
    if (!/\S+@\S+\.\S+/.test(value.trim())) return 'Please enter a valid email address.';
    return undefined;
  };

  const handlePasswordLogin = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    const validationErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      validationErrors.email = 'Email is required.';
    }

    if (!password) {
      validationErrors.password = 'Password is required.';
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    const result = await login(email.trim(), password);
    setIsSubmitting(false);

    if (!result.success) {
      const errorMsg = result.message || 'Login failed. Please check your credentials.';
      setErrors({ form: errorMsg });
      toast.error(`❌ ${errorMsg}`);
      return;
    }

    toast.success('✅ Login successful! Welcome back.');
    navigate(result.isAdmin ? '/admin-dashboard' : '/');
  };

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    const emailError = validateEmail(email);
    const validationErrors: { email?: string } = {};

    if (emailError) {
      validationErrors.email = emailError;
    }

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    const result = await requestOtp(email.trim(), false);
    setIsSubmitting(false);

    if (!result.success) {
      const errorMsg = result.message || 'Unable to send OTP. Please try again.';
      setErrors({ form: errorMsg });
      toast.error(`❌ ${errorMsg}`);
      return;
    }

    const successMsg = result.message || '✅ OTP sent. Check your email.'; 
    setMessage(successMsg);
    toast.success(successMsg);
    setOtpStep(true);
    setResendTimer(300); // 5 minutes
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setErrors({});
    setMessage('');
    setIsSubmitting(true);
    const result = await requestOtp(email.trim(), true);
    setIsSubmitting(false);

    if (!result.success) {
      const errorMsg = result.message || 'Unable to resend OTP. Please try again.';
      setErrors({ form: errorMsg });
      toast.error(errorMsg);
      return;
    }

    const successMsg = result.message || 'OTP resent. Check your email.';
    setMessage(successMsg);
    toast.success(successMsg);
    setResendTimer(300); // 5 minutes
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setErrors({ otp: 'Please enter a valid OTP.' });
      return;
    }

    setIsSubmitting(true);
    const result = await verifyOtp(email.trim(), otp);
    setIsSubmitting(false);

    if (!result.success) {
      const errorMsg = result.message || 'Invalid OTP. Please try again.';
      setErrors({ otp: errorMsg });
      toast.error(`❌ ${errorMsg}`);
      return;
    }

    toast.success('✅ Login successful!');
    navigate(result.isAdmin ? '/admin-dashboard' : '/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-3 sm:px-4 py-8 overflow-x-hidden">
      <div className="w-full max-w-sm sm:max-w-md bg-white shadow-[0_8px_40px_-8px_rgba(30,58,138,0.2)] rounded-2xl sm:rounded-[32px] overflow-hidden border border-blue-100/50">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-br from-[#1e3a8a] via-[#1e4a9a] to-[#2563eb] p-6 sm:p-10 pb-8 sm:pb-12 text-white relative">
          <button 
            onClick={() => navigate('/')}
            className="absolute top-4 sm:top-6 right-4 sm:right-6 p-1.5 hover:bg-white/20 rounded-full transition-all hover:scale-105"
          >
            <X size={20} />
          </button>
          <div className="flex flex-col items-center">
            <div className="bg-white p-3 sm:p-4 rounded-full mb-3 ring-2 ring-white/20">
              <img src={logoImage} alt="A Star Classes" className="h-14 w-14 sm:h-16 sm:w-16 object-contain" />
            </div>
            <h2 className="text-3xl sm:text-[42px] font-black mb-1 tracking-tight">Login</h2>
            <p className="text-sm sm:text-[17px] text-blue-200 font-medium text-center">Welcome back to A Star Classes</p>
          </div>
        </div>

        <div className="p-6 sm:p-10 pt-8 sm:pt-12">
          {errors.form && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600 mb-6 border border-red-100">{errors.form}</p>}
          {message && <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700 mb-6 border border-green-100">{message}</p>}

          <form className="space-y-5 sm:space-y-8" onSubmit={useOtpLogin ? (otpStep ? handleVerifyOtp : handleSendOtp) : handlePasswordLogin}>
            <div>
              <label htmlFor="email" className="block text-sm sm:text-[15px] font-bold text-[#1e3a8a] mb-2 sm:mb-3">
                {useOtpLogin ? 'Email Address' : 'Email Address'}
              </label>
              <input
                type={useOtpLogin ? "email" : "text"}
                id="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 sm:px-6 py-3 sm:py-4.5 bg-white border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#1e3a8a] transition-all font-medium text-sm sm:text-base text-gray-600 placeholder:text-gray-400`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-2 font-bold ml-2">{errors.email}</p>}
            </div>

            {useOtpLogin ? (
              <>
                {otpStep && (
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label htmlFor="otp" className="block text-sm sm:text-[15px] font-bold text-[#1e3a8a] mb-2 sm:mb-3">
                        OTP Code
                      </label>
                      <input
                        type="text"
                        id="otp"
                        value={otp}
                        maxLength={6}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className={`w-full px-4 sm:px-6 py-3 sm:py-4.5 bg-white border ${errors.otp ? 'border-red-500' : 'border-gray-200'} rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#1e3a8a] transition-all font-medium text-center text-lg sm:text-xl tracking-[0.5em]`}
                        placeholder="000000"
                      />
                      {errors.otp && <p className="text-red-500 text-xs mt-2 font-bold ml-2">{errors.otp}</p>}
                    </div>
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isSubmitting || resendTimer > 0}
                        className={`text-xs sm:text-sm font-bold transition-colors ${resendTimer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-[#1e3a8a] hover:underline'}`}
                      >
                        {resendTimer > 0 ? `Resend OTP in ${formatTime(resendTimer)}` : 'Resend OTP'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div>
                <label htmlFor="password" className="block text-sm sm:text-[15px] font-bold text-[#1e3a8a] mb-2 sm:mb-3">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 sm:px-6 py-3 sm:py-4.5 bg-white border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#1e3a8a] transition-all font-medium text-sm sm:text-base text-gray-600 placeholder:text-gray-400`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1e3a8a] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-2 font-bold ml-2">{errors.password}</p>}
                <div className="text-right mt-3 sm:mt-4">
                  <Link to="/reset-password" id="forgot-password" className="text-sm sm:text-[15px] text-[#1e3a8a] font-bold hover:underline">
                    Forgot Password?
                  </Link>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 sm:py-5 bg-gradient-to-r from-[#ffb800] to-[#ff7a00] text-white rounded-xl font-black text-base sm:text-xl hover:shadow-xl hover:scale-[1.01] transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none mt-3 sm:mt-4 shadow-lg shadow-orange-500/20"
            >
              {isSubmitting ? 'Processing...' : 'Login'}
            </button>

            <div className="flex flex-col items-center gap-4 sm:gap-6 mt-6 sm:mt-10">
              <button
                type="button"
                onClick={() => {
                  setUseOtpLogin((prev) => !prev);
                  setErrors({});
                  setMessage('');
                  setOtpStep(false);
                  setOtp('');
                }}
                className="text-sm sm:text-[15px] text-[#1e3a8a] font-bold hover:underline"
              >
                {useOtpLogin ? 'Use password login' : 'Use OTP login for Students'}
              </button>

              <p className="text-sm sm:text-[16px] font-medium text-gray-500">
                Don't have an account?{' '}
                <Link to="/signup" className="text-[#1e3a8a] font-black hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;