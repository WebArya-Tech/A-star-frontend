import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { X, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      validationErrors.email = 'Admin email/username is required.';
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
      setErrors({ form: result.message || 'Login failed. Please check your admin credentials.' });
      return;
    }

    if (!result.isAdmin) {
      setErrors({ form: 'Access denied. This login is for administrators only.' });
      return;
    }

    navigate('/admin-dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e3a8a]/10 backdrop-blur-sm px-4">
      <div className="max-w-[480px] w-full bg-white shadow-2xl rounded-[32px] overflow-hidden border border-blue-100">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-[#1e3a8a] via-[#1e3a8a] to-[#2d4a8a] p-10 pb-12 text-white relative">
          <button 
            onClick={() => navigate('/')}
            className="absolute top-6 right-6 p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck size={32} className="text-blue-300" />
            <h2 className="text-[40px] font-black">Admin</h2>
          </div>
          <p className="text-blue-100 text-[17px] font-medium">Access A Star Classes Control Panel</p>
        </div>

        <div className="p-10 pt-12">
          {errors.form && (
            <div className="rounded-2xl bg-red-50 px-4 py-4 text-sm text-red-600 mb-8 border border-red-100 flex items-start gap-3">
              <span className="shrink-0 mt-0.5">⚠️</span>
              <p className="font-bold">{errors.form}</p>
            </div>
          )}

          <form className="space-y-8" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-[15px] font-bold text-[#1e3a8a] mb-3 uppercase tracking-wider">
                Admin Username
              </label>
              <input
                type="text"
                id="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-6 py-4.5 bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#1e3a8a] transition-all font-medium text-gray-700 placeholder:text-gray-400`}
                placeholder="Enter admin credentials"
              />
              {errors.email && <p className="text-red-500 text-xs mt-2 font-bold ml-2">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-[15px] font-bold text-[#1e3a8a] mb-3 uppercase tracking-wider">
                Secure Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-6 py-4.5 bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#1e3a8a] transition-all font-medium text-gray-700 placeholder:text-gray-400`}
                  placeholder="••••••••"
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
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-[#1e3a8a] text-white rounded-xl font-black text-xl hover:shadow-2xl hover:bg-[#162d6b] transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none mt-4 shadow-xl shadow-blue-900/20"
            >
              {isSubmitting ? 'Authenticating...' : 'Secure Login'}
            </button>

            <div className="text-center mt-8">
              <p className="text-[14px] font-medium text-gray-400 italic">
                Authorized Personnel Only
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
