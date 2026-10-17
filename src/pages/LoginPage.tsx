import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  Zap, 
  KeyRound, 
  CheckCircle2, 
  X,
  Loader2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { requestPasswordReset, resetStudentPassword } from '../auth/api';

interface LoginPageProps {
  onNavigate: (tab: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Forgot password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState<'request' | 'reset'>('request');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      // Redirect to student dashboard
      onNavigate('dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotMessage(null);

    if (!forgotEmail.trim()) {
      setForgotError('Please enter your account email.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await requestPasswordReset(forgotEmail.trim());
      setForgotMessage(res.message);
      if (res.reset_token_dev) {
        setResetToken(res.reset_token_dev);
      }
      setForgotStep('reset');
    } catch (err: any) {
      setForgotError(err.message || 'Failed to request reset token.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleCompleteReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotMessage(null);

    if (!resetToken.trim() || !newPassword) {
      setForgotError('Please enter both the reset token and your new password.');
      return;
    }

    if (newPassword.length < 6) {
      setForgotError('New password must be at least 6 characters.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await resetStudentPassword(resetToken.trim(), newPassword);
      setForgotMessage(res.message);
      setTimeout(() => {
        setIsForgotModalOpen(false);
        setForgotStep('request');
        setForgotEmail('');
        setResetToken('');
        setNewPassword('');
        setForgotMessage(null);
      }, 2500);
    } catch (err: any) {
      setForgotError(err.message || 'Failed to update password.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#070A11]">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-xl shadow-blue-500/20 mb-4">
            <div className="w-full h-full bg-[#0B101E] rounded-[14px] flex items-center justify-center">
              <Zap className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back to AlgoMotion
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Log in to sync your coding drafts, daily streak, and test-case progress.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0D1326]/90 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/40">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-400 text-sm animate-fade-in">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Authentication Error</p>
                <p className="text-xs text-rose-300 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  id="login-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <button
                  id="login-forgot-password-link"
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setIsForgotModalOpen(true);
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-900/80 border border-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/30"
                />
                <span className="text-xs text-slate-400">Remember session for 30 days</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              New to AlgoMotion?{' '}
              <button
                id="login-goto-register-btn"
                type="button"
                onClick={() => onNavigate('register')}
                className="font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
              >
                Create a student account
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0D1326] border border-slate-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Reset Account Password</h3>
                <p className="text-xs text-slate-400">Secure self-service password recovery</p>
              </div>
            </div>

            {forgotMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{forgotMessage}</span>
              </div>
            )}

            {forgotError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotStep === 'request' ? (
              <form onSubmit={handleRequestReset} className="space-y-4">
                <p className="text-xs text-slate-300">
                  Enter your student account email address below. A verification reset token will be generated for your account.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Student Email
                  </label>
                  <input
                    id="forgot-email-input"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="student@example.com"
                    required
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  id="forgot-request-btn"
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {forgotLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Request Reset Token'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleCompleteReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Reset Token
                  </label>
                  <input
                    id="reset-token-input"
                    type="text"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="Paste reset token"
                    required
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    New Password
                  </label>
                  <input
                    id="reset-newpassword-input"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep('request')}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 bg-slate-800 hover:bg-slate-700"
                  >
                    Back
                  </button>
                  <button
                    id="reset-submit-btn"
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {forgotLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Set New Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
