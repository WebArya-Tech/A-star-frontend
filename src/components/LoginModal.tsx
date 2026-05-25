import React, { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { X, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});

    if (!isOpen) return null;

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        const validationErrors: { email?: string; password?: string } = {};

        if (!email.trim()) {
            validationErrors.email = 'Email Address is required.';
        }
        if (!password) {
            validationErrors.password = 'Password is required.';
        }

        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        setIsSubmitting(true);
        try {
            const result = await login(email.trim(), password);
            if (result.success) {
                toast.success('Logged in successfully!');
                onClose();
                navigate(result.isAdmin ? '/admin-dashboard' : '/');
            } else {
                setErrors({ form: result.message || 'Invalid credentials' });
            }
        } catch (error) {
            setErrors({ form: 'An error occurred. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="max-w-[480px] w-full bg-white shadow-2xl rounded-[32px] overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header with Gradient */}
                <div className="bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] p-10 pb-8 text-white relative">
                    <button 
                        onClick={onClose}
                        className="absolute top-6 right-6 p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <h2 className="text-[42px] font-black mb-1">Login</h2>
                    <p className="text-blue-100 text-[17px] font-medium opacity-80">Welcome back to iThinkLearn</p>
                </div>

                <div className="p-10 pt-8">
                    {errors.form && (
                        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 mb-6 border border-red-100 font-medium">
                            {errors.form}
                        </p>
                    )}

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block text-[15px] font-bold text-[#1e3a8a] mb-2.5">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full px-6 py-4 bg-white border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#1e3a8a] transition-all font-medium text-gray-600 placeholder:text-gray-400`}
                                placeholder="Enter your email"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-2 font-bold ml-2">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-[15px] font-bold text-[#1e3a8a] mb-2.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full px-6 py-4 bg-white border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#1e3a8a] transition-all font-medium text-gray-600 placeholder:text-gray-400`}
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
                            <div className="text-right mt-3">
                                <Link to="/reset-password" onClick={onClose} className="text-[14px] text-[#1e3a8a] font-bold hover:underline">
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4.5 bg-gradient-to-r from-[#ffb800] to-[#ff7a00] text-[#1e3a8a] rounded-xl font-black text-xl hover:shadow-xl hover:scale-[1.01] transition-all active:scale-95 disabled:opacity-50 mt-4 shadow-lg shadow-orange-500/20"
                        >
                            {isSubmitting ? 'Processing...' : 'Login'}
                        </button>

                        <p className="text-center text-[16px] font-medium text-gray-500 pt-4">
                            Don't have an account?{' '}
                            <Link to="/signup" onClick={onClose} className="text-[#1e3a8a] font-black hover:underline">
                                Sign Up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
