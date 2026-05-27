import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userForgotPassword, userResetPassword, adminForgotPassword, adminResetPassword } from '../api/api/authApi.js';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState<1 | 2>(1);
    const [errors, setErrors] = useState<{ email?: string; otp?: string; password?: string; confirmPassword?: string; form?: string }>({});
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [isForAdmin, setIsForAdmin] = useState(false);

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

    const handleSendResetOtp = async (e: FormEvent) => {
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
        try {
            // Try user forgot password first
            let result;
            try {
                result = await userForgotPassword(email.trim());
                setIsForAdmin(false);
            } catch (userError) {
                // If student fails, try admin
                result = await adminForgotPassword(email.trim());
                setIsForAdmin(true);
            }

            const isSuccess = result.success !== false;
            if (!isSuccess) {
                const errorMsg = result.message || 'Unable to send reset OTP. Please try again.';
                setErrors({ form: errorMsg });
                toast.error(errorMsg);
            } else {
                const successMsg = result.message || 'OTP sent to your email.';
                setMessage(successMsg);
                toast.success(successMsg);
                setStep(2);
                setResendTimer(300); // 5 minutes
            }
        } catch (error: any) {
            const errorMsg = error?.message || 'Unable to send reset OTP. Please try again.';
            setErrors({ form: errorMsg });
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetPassword = async (e: FormEvent) => {
        e.preventDefault();
        setMessage('');

        const validationErrors: { otp?: string; password?: string; confirmPassword?: string } = {};
        if (!otp.trim()) {
            validationErrors.otp = 'OTP is required.';
        } else if (!/^\d{6}$/.test(otp.trim())) {
            validationErrors.otp = 'OTP must be a 6-digit number.';
            toast.error("Please enter a valid 6-digit OTP.");
        }

        if (!newPassword) {
            validationErrors.password = 'New password is required.';
        } else if (newPassword.length < 6) {
            validationErrors.password = 'Password must be at least 6 characters.';
        }

        if (confirmPassword !== newPassword) {
            validationErrors.confirmPassword = 'Passwords do not match.';
        }

        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        setIsSubmitting(true);
        try {
            const data = { email: email.trim(), otp: otp.trim(), newPassword };
            const result = isForAdmin 
                ? await adminResetPassword(data)
                : await userResetPassword(data);
            
            const isSuccess = result.success !== false;
            if (!isSuccess) {
                const errorMsg = result.message || 'Unable to reset password. Please try again.';
                setErrors({ form: errorMsg });
                toast.error(errorMsg);
            } else {
                const successMsg = result.message || 'Password reset successfully.';
                setMessage(successMsg);
                toast.success(successMsg);
                setTimeout(() => navigate('/login'), 1200);
            }
        } catch (error: any) {
            const errorMsg = error?.message || 'Unable to reset password. Please try again.';
            setErrors({ form: errorMsg });
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 overflow-x-hidden">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-bold text-center text-blue-800">Reset Password</h2>
                <p className="text-center text-sm text-gray-600 mb-6">
                    {step === 1 ? 'Enter your email to receive a reset OTP.' : 'Enter the OTP and set a new password.'}
                </p>

                {errors.form && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 mb-4">{errors.form}</p>}
                {message && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 mb-4">{message}</p>}

                {step === 1 ? (
                    <form className="space-y-4" onSubmit={handleSendResetOtp}>
                        <div>
                            <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="reset-email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                placeholder="Enter your email"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-800 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
                        >
                            {isSubmitting ? 'Sending OTP...' : 'Send reset OTP'}
                        </button>
                    </form>
                ) : (
                    <form className="space-y-4" onSubmit={handleResetPassword}>
                        <div>
                            <label htmlFor="reset-otp" className="block text-sm font-medium text-gray-700">
                                OTP Code
                            </label>
                            <input
                                type="text"
                                id="reset-otp"
                                value={otp}
                                maxLength={6}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                className={`mt-1 block w-full px-3 py-2 border ${errors.otp ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                placeholder="Enter the 6-digit OTP"
                            />
                            {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                        </div>

                        <div className="flex justify-between items-center px-1">
                            <button
                                type="button"
                                onClick={handleSendResetOtp}
                                disabled={isSubmitting || resendTimer > 0}
                                className={`text-xs font-semibold transition-colors ${resendTimer > 0 ? 'text-gray-400' : 'text-blue-700 hover:underline'}`}
                            >
                                {resendTimer > 0 ? `Resend OTP in ${formatTime(resendTimer)}` : 'Resend OTP'}
                            </button>
                        </div>
                        <div>
                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                placeholder="Enter new password"
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`mt-1 block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                placeholder="Confirm new password"
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-800 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
                        >
                            {isSubmitting ? 'Resetting password...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                <div className="mt-4 text-sm text-center text-gray-600">
                    <Link to="/login" className="text-blue-800 hover:underline">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
