import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Lock, Sparkles, ShieldCheck } from 'lucide-react';

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
    <div className="min-h-screen bg-[#FFF9F2] py-16 sm:py-24 text-[#21191A] flex items-center justify-center px-4 font-sans selection:bg-[#790B13] selection:text-white">
      <div className="max-w-md w-full bg-white p-8 sm:p-12 rounded-3xl border border-[#D6B77A]/30 shadow-2xl space-y-8 relative overflow-hidden">
        {/* Subtle decorative gold line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D6B77A] via-[#790B13] to-[#D6B77A]" />

        <div className="space-y-3 text-center border-b border-[#D6B77A]/20 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] text-xs font-mono uppercase tracking-widest">
            <Lock className="w-3 h-3 text-[#D6B77A]" />
            <span>Patron Portal</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-4xl text-[#21191A] uppercase tracking-tight">
            Welcome <span className="font-serif italic font-normal lowercase text-[#790B13]">back</span>
          </h1>
          <p className="text-xs text-[#21191A]/70 font-sans leading-relaxed">
            Sign in to track orders, manage saved addresses, and enjoy rapid reorders.
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-800 p-4 rounded-xl text-xs font-mono border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 font-sans text-xs">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@example.com"
              className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#790B13] hover:bg-[#50000D] text-[#FFF0DC] py-4 px-6 rounded-full text-xs font-mono uppercase tracking-widest font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#790B13]/25 active:scale-98 group"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In To Account'}</span>
            <ArrowRight className="w-4 h-4 text-[#D6B77A] group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#D6B77A]/20 text-center text-xs text-[#21191A]/70 font-sans">
          Don't have an account?{' '}
          <Link
            to={`/register?redirect=${encodeURIComponent(redirectPath)}`}
            className="font-mono uppercase font-bold text-[#790B13] hover:underline ml-1"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
