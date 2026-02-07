import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Eye, EyeOff, Loader2, DollarSign, AlertCircle, Info } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@demo.com');
      setPassword('password123');
    } else {
      setEmail('dev@demo.com');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full animate-fadeIn">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-white rounded-2xl shadow-lg mb-4">
            <DollarSign className="w-12 h-12 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            API Cost Optimization
          </h1>
          <p className="text-gray-600">Track, analyze, and optimize your API costs</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="flex items-center justify-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <LogIn className="w-7 h-7 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Welcome Back
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm animate-fadeIn flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@company.com"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-12"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Quick Demo Access:
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="flex-1 px-3 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium"
              >
                Admin Demo
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('developer')}
                className="flex-1 px-3 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium"
              >
                Developer Demo
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          Secure authentication with httpOnly cookies
        </p>
      </div>
    </div>
  );
};

export default Login;
