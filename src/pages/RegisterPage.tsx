import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  AtSign, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  ShieldCheck,
  Loader2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface RegisterPageProps {
  onNavigate: (tab: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters.';
    }

    if (!username.trim() || username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters.';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      errors.username = 'Username can only contain letters, numbers, and underscores.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password || password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        full_name: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
        confirm_password: confirmPassword,
      });
      // Redirect to dashboard on successful registration
      onNavigate('dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#070A11]">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-xl shadow-blue-500/20 mb-4">
            <div className="w-full h-full bg-[#0B101E] rounded-[14px] flex items-center justify-center">
              <Zap className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Create your Student Account
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Track solved problems, retain code drafts, and build your daily streak on AlgoMotion.
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-[#0D1326]/90 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/40">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-400 text-sm animate-fade-in">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Registration Error</p>
                <p className="text-xs text-rose-300 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="register-fullname-input"
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (fieldErrors.fullName) setFieldErrors(prev => ({ ...prev, fullName: '' }));
                  }}
                  placeholder="e.g. Alex Turing"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border ${
                    fieldErrors.fullName ? 'border-rose-500/80 focus:ring-rose-500' : 'border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/20'
                  } rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all`}
                />
              </div>
              {fieldErrors.fullName && (
                <p className="text-xs text-rose-400 mt-1 pl-1">{fieldErrors.fullName}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <AtSign className="w-4 h-4" />
                </div>
                <input
                  id="register-username-input"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (fieldErrors.username) setFieldErrors(prev => ({ ...prev, username: '' }));
                  }}
                  placeholder="e.g. coder_alex"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border ${
                    fieldErrors.username ? 'border-rose-500/80 focus:ring-rose-500' : 'border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/20'
                  } rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all`}
                />
              </div>
              {fieldErrors.username && (
                <p className="text-xs text-rose-400 mt-1 pl-1">{fieldErrors.username}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="register-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
                  }}
                  placeholder="alex@university.edu"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border ${
                    fieldErrors.email ? 'border-rose-500/80 focus:ring-rose-500' : 'border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/20'
                  } rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-rose-400 mt-1 pl-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="register-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                  }}
                  placeholder="At least 6 characters"
                  className={`w-full pl-10 pr-11 py-2.5 bg-slate-900/80 border ${
                    fieldErrors.password ? 'border-rose-500/80 focus:ring-rose-500' : 'border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/20'
                  } rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-rose-400 mt-1 pl-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <input
                  id="register-confirm-password-input"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (fieldErrors.confirmPassword) setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }}
                  placeholder="Repeat your password"
                  className={`w-full pl-10 pr-11 py-2.5 bg-slate-900/80 border ${
                    fieldErrors.confirmPassword ? 'border-rose-500/80 focus:ring-rose-500' : 'border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/20'
                  } rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-xs text-rose-400 mt-1 pl-1">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {/* Password strength tips */}
            <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-400">
              <CheckCircle2 className={`w-3.5 h-3.5 ${password.length >= 6 ? 'text-emerald-400' : 'text-slate-600'}`} />
              <span>Minimum 6 characters</span>
              <CheckCircle2 className={`w-3.5 h-3.5 ml-2 ${password && password === confirmPassword ? 'text-emerald-400' : 'text-slate-600'}`} />
              <span>Passwords match</span>
            </div>

            {/* Submit Button */}
            <button
              id="register-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Student Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <button
                id="register-goto-login-btn"
                type="button"
                onClick={() => onNavigate('login')}
                className="font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
              >
                Log In here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
