import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Lock, Sparkles } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        if (res.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(redirectPath);
        }
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-16 sm:py-24 text-[#000000] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-[#EAE3D9] shadow-md space-y-6">
        <div className="space-y-2 text-center border-b border-[#EAE3D9] pb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#14382B] text-[#000000] text-xs font-bold shadow-xs">
            <Lock className="w-3 h-3 text-[#C84B20]" />
            <span>Patron Access</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-[#000000] tracking-tight">
            Welcome Back!
          </h1>
          <p className="text-xs sm:text-sm text-[#555555] font-sans">
            Sign in to track orders, manage saved addresses, and enjoy rapid reorders.
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-800 p-3.5 rounded-2xl text-xs font-semibold border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-semibold text-[#555555] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@example.com"
              className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#000000] focus:outline-none focus:border-[#000000] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#555555] mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#000000] focus:outline-none focus:border-[#000000] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C84B20] hover:bg-[#A33A16] text-white py-3.5 px-6 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-[#C84B20]/25 active:scale-98"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In →'}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-[#EAE3D9] text-center text-xs sm:text-sm text-[#555555]">
          Don't have an account?{' '}
          <Link
            to={`/register?redirect=${encodeURIComponent(redirectPath)}`}
            className="font-heading font-bold text-[#000000] hover:text-[#C84B20] hover:underline ml-1"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
