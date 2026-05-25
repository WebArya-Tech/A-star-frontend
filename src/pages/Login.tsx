import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { X, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

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
    <div className="min-h-screen flex items-center justify-center bg-[#1e3a8a]/10 backdrop-blur-sm px-4">
      <div className="max-w-[480px] w-full bg-white shadow-2xl rounded-[32px] overflow-hidden">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-[#1e3a8a] via-[#1e3a8a] to-[#2d4a8a] p-10 pb-12 text-white relative">
          <button 
            onClick={() => navigate('/')}
            className="absolute top-6 right-6 p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
          <h2 className="text-[42px] font-black mb-1">Login</h2>
          <p className="text-blue-100 text-[17px] font-medium">Student Login • A Star Classes</p>
        </div>

        <div className="p-10 pt-12">
          {errors.form && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600 mb-6 border border-red-100">{errors.form}</p>}
          {message && <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700 mb-6 border border-green-100">{message}</p>}

          <form className="space-y-8" onSubmit={useOtpLogin ? (otpStep ? handleVerifyOtp : handleSendOtp) : handlePasswordLogin}>
            <div>
              <label htmlFor="email" className="block text-[15px] font-bold text-[#1e3a8a] mb-3">
                {useOtpLogin ? 'Email Address' : 'Email Address'}
              </label>
              <input
                type={useOtpLogin ? "email" : "text"}
                id="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-6 py-4.5 bg-white border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#1e3a8a] transition-all font-medium text-gray-600 placeholder:text-gray-400`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-2 font-bold ml-2">{errors.email}</p>}
            </div>

            {useOtpLogin ? (
              <>
                {otpStep && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="otp" className="block text-[15px] font-bold text-[#1e3a8a] mb-3">
                        OTP Code
                      </label>
                      <input
                        type="text"
                        id="otp"
                        value={otp}
                        maxLength={6}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className={`w-full px-6 py-4.5 bg-white border ${errors.otp ? 'border-red-500' : 'border-gray-200'} rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#1e3a8a] transition-all font-medium text-center text-xl tracking-[0.5em]`}
                        placeholder="000000"
                      />
                      {errors.otp && <p className="text-red-500 text-xs mt-2 font-bold ml-2">{errors.otp}</p>}
                    </div>
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isSubmitting || resendTimer > 0}
                        className={`text-sm font-bold transition-colors ${resendTimer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-[#1e3a8a] hover:underline'}`}
                      >
                        {resendTimer > 0 ? `Resend OTP in ${formatTime(resendTimer)}` : 'Resend OTP'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div>
                <label htmlFor="password" className="block text-[15px] font-bold text-[#1e3a8a] mb-3">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-6 py-4.5 bg-white border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#1e3a8a] transition-all font-medium text-gray-600 placeholder:text-gray-400`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1e3a8a] transition-colors"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-2 font-bold ml-2">{errors.password}</p>}
                <div className="text-right mt-4">
                  <Link to="/reset-password" id="forgot-password" className="text-[15px] text-[#1e3a8a] font-bold hover:underline">
                    Forgot Password?
                  </Link>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-gradient-to-r from-[#ffb800] to-[#ff7a00] text-white rounded-xl font-black text-xl hover:shadow-xl hover:scale-[1.01] transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none mt-4 shadow-lg shadow-orange-500/20"
            >
              {isSubmitting ? 'Processing...' : 'Login'}
            </button>

            <div className="flex flex-col items-center gap-6 mt-10">
              <button
                type="button"
                onClick={() => {
                  setUseOtpLogin((prev) => !prev);
                  setErrors({});
                  setMessage('');
                  setOtpStep(false);
                  setOtp('');
                }}
                className="text-[15px] text-[#1e3a8a] font-bold hover:underline"
              >
                {useOtpLogin ? 'Use password login' : 'Use OTP login for Students'}
              </button>

              <p className="text-[16px] font-medium text-gray-500">
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