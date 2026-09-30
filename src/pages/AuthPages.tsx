import React, { useState } from 'react';
import { PageView, UserProfile } from '../types/index.ts';
import { ApiService } from '../services/api.ts';

interface AuthPageProps {
  mode: 'login' | 'register';
  onAuthSuccess: (user: UserProfile) => void;
  onNavigate: (page: PageView) => void;
}

export const AuthPages: React.FC<AuthPageProps> = ({
  mode,
  onAuthSuccess,
  onNavigate,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (mode === 'register' && !fullName.trim()) {
      nextErrors.fullName = 'Full name is required.';
    }
    if (!email.trim()) {
      nextErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!password) {
      nextErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters long.';
    }
    if (mode === 'register') {
      if (!confirmPassword) {
        nextErrors.confirmPassword = 'Please confirm your password.';
      } else if (password !== confirmPassword) {
        nextErrors.confirmPassword = 'Passwords do not match.';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      if (mode === 'register') {
        const user = await ApiService.register(fullName, email, password);
        onAuthSuccess(user);
      } else {
        const user = await ApiService.login(email, password);
        onAuthSuccess(user);
      }
    } catch (err: any) {
      setServerError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setServerError(null);
    setLoading(true);
    try {
      const user = await ApiService.login('demo@pocketsmart.ai', 'demo1234');
      onAuthSuccess(user);
    } catch {
      const fallbackUser = await ApiService.getProfile();
      onAuthSuccess(fallbackUser);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 px-4">
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 space-y-6">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-slate-500">
            PocketSmart AI Account
          </p>
          <h1 className="font-display text-2xl font-semibold text-slate-900">
            {mode === 'register' ? 'Create Your Account' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-slate-600">
            {mode === 'register'
              ? 'Save your personalized budget plans and compare recommendations across devices.'
              : 'Sign in to access your saved budget plans and recommendation history.'}
          </p>
        </div>

        {serverError && (
          <div
            role="alert"
            className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-700"
          >
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label
                htmlFor="auth-fullname"
                className="block text-xs font-semibold text-slate-800"
              >
                Full Name
              </label>
              <input
                id="auth-fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Aarav Sharma"
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? 'err-fullname' : undefined}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
              />
              {errors.fullName && (
                <p id="err-fullname" className="text-xs text-red-600">
                  {errors.fullName}
                </p>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="auth-email"
              className="block text-xs font-semibold text-slate-800"
            >
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@pocketsmart.ai"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'err-email' : undefined}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
            />
            {errors.email && (
              <p id="err-email" className="text-xs text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="auth-password"
              className="block text-xs font-semibold text-slate-800"
            >
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'err-password' : undefined}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
            />
            {errors.password && (
              <p id="err-password" className="text-xs text-red-600">
                {errors.password}
              </p>
            )}
          </div>

          {mode === 'register' && (
            <div className="space-y-1.5">
              <label
                htmlFor="auth-confirm"
                className="block text-xs font-semibold text-slate-800"
              >
                Confirm Password
              </label>
              <input
                id="auth-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={errors.confirmPassword ? 'err-confirm' : undefined}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
              />
              {errors.confirmPassword && (
                <p id="err-confirm" className="text-xs text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading
              ? 'Processing...'
              : mode === 'register'
              ? 'Create Account'
              : 'Login'}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 space-y-3">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2 px-4 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
          >
            Continue with Instant Demo Account (Aarav Sharma)
          </button>

          <div className="text-center">
            {mode === 'register' ? (
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 underline cursor-pointer"
              >
                Already have an account? Login
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 underline cursor-pointer"
              >
                Create Account
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
