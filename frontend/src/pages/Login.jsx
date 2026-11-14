import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Lock, ShieldCheck, ArrowLeft } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
          setError('Access Denied: Only store administrators can access this portal. Customers can order directly without login.');
        }
      }
    } catch (err) {
      setError(err.message || 'Invalid administrator email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] py-16 sm:py-24 text-[#21191A] flex items-center justify-center px-4 font-sans selection:bg-[#790B13] selection:text-white">
      <div className="max-w-md w-full bg-white p-8 sm:p-12 rounded-3xl border border-[#D6B77A]/30 shadow-2xl space-y-8 relative overflow-hidden">
        {/* Decorative gold line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D6B77A] via-[#790B13] to-[#D6B77A]" />

        <div className="space-y-3 text-center border-b border-[#D6B77A]/20 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] text-xs font-mono uppercase tracking-widest">
            <Lock className="w-3 h-3 text-[#D6B77A]" />
            <span>Staff & Management</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-[#21191A] uppercase tracking-tight">
            Administrator <span className="font-serif italic font-normal lowercase text-[#790B13]">portal</span>
          </h1>
          <p className="text-xs text-[#21191A]/70 font-sans leading-relaxed">
            Authorized administrative access for managing orders, kitchen stock, and dispatch operations.
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-800 p-4 rounded-xl text-xs font-mono border border-rose-200 leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 font-sans text-xs">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
              Administrator Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gujaratinasta.com"
              className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
              Security Key / Password
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
            <span>{loading ? 'Authenticating...' : 'Sign In To Admin Console'}</span>
            <ArrowRight className="w-4 h-4 text-[#D6B77A] group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#D6B77A]/20 flex flex-col items-center gap-3 text-xs text-[#21191A]/70 font-sans text-center">
          <p className="text-[11px] text-[#21191A]/60">
            Shopping as a customer? No account or login is required.
          </p>
          <Link
            to="/snacks"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-[#790B13] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Snack Store</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
