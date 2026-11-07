import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, UserPlus } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must contain at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await register(name, email, password, phone);
      if (res.success) {
        navigate(redirectPath);
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-16 sm:py-24 text-[#000000] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-[#EAE3D9] shadow-md space-y-6">
        <div className="space-y-2 text-center border-b border-[#EAE3D9] pb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#14382B] text-[#000000] text-xs font-bold shadow-xs">
            <UserPlus className="w-3 h-3 text-[#C84B20]" />
            <span>Join Our Kitchen Family</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-[#000000] tracking-tight">
            Create an Account
          </h1>
          <p className="text-xs sm:text-sm text-[#555555] font-sans">
            Join Giriraj Snacks for fresh homemade namkeen delivered directly to your doorstep.
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
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rameshbhai Patel"
              className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#000000] focus:outline-none focus:border-[#000000] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#555555] mb-1.5">
              Email Address *
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
              Contact Phone *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="98250 12345"
              className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#000000] focus:outline-none focus:border-[#000000] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#555555] mb-1.5">
              Create Password (min. 6 chars) *
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
            <span>{loading ? 'Registering...' : 'Create Account →'}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-[#EAE3D9] text-center text-xs sm:text-sm text-[#555555]">
          Already have an account?{' '}
          <Link
            to={`/login?redirect=${encodeURIComponent(redirectPath)}`}
            className="font-heading font-bold text-[#000000] hover:text-[#C84B20] hover:underline ml-1"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
