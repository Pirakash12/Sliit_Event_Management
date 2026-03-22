import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      // Redirect based on role
      const routes = {
        student:   '/',
        organizer: '/',
        finance:   '/',
        admin:     '/admindashboard',
      };
      navigate(routes[user.role] || '/admindashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060810] flex">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-14 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />
        {/* Glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-violet-600/15 rounded-full blur-[80px]" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-black text-white text-lg">S</div>
          <div>
            <div className="text-white font-bold text-lg leading-none">SLIIT EMS</div>
            <div className="text-white/40 text-xs">Event Management System</div>
          </div>
        </div>

        {/* Center content */}
        <div className="relative">
          <div className="inline-block text-xs tracking-widest uppercase text-indigo-400 bg-indigo-400/10 border border-indigo-400/20 px-3 py-1 rounded-full mb-6">
            Unified Schedule Platform
          </div>
          <h1 className="text-5xl font-black text-white leading-tight mb-4"
              style={{ fontFamily: "'Georgia', serif" }}>
            Your campus.<br />
            <span className="text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(135deg, #818cf8, #c084fc)' }}>
              All in one place.
            </span>
          </h1>
          <p className="text-white/40 text-base leading-relaxed max-w-sm">
            Discover events, manage clubs, track budgets, and earn certificates —
            built exclusively for SLIIT students and staff.
          </p>

          {/* Stats row */}
          <div className="flex gap-8 mt-10">
            {[['1,200+', 'Events Hosted'], ['85K+', 'Attendees'], ['340+', 'Organizers']].map(([v, l]) => (
              <div key={l}>
                <div className="text-2xl font-bold text-white">{v}</div>
                <div className="text-xs text-white/40 mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom testimonial */}
        <div className="relative bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white/60 text-sm leading-relaxed italic">
            "Managing our tech society events went from chaos to effortless."
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-8 h-8 rounded-full bg-indigo-600/40 flex items-center justify-center text-white text-xs font-bold">K</div>
            <div>
              <div className="text-white/80 text-sm font-medium">Pirakash R.</div>
              <div className="text-white/30 text-xs">Club President, IEEE SLIIT</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-black text-white">S</div>
            <span className="text-white font-bold text-lg">SLIIT EMS</span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-white/40 text-sm mb-8">Sign in to your account to continue</p>

          {/* Google login */}
          <button className="w-full flex items-center justify-center gap-3 bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 text-white/80 text-sm font-medium py-3 rounded-xl transition-all mb-6">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs">or sign in with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-5">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@sliit.lk"
                required
                className="w-full bg-white/[0.05] border border-white/10 focus:border-indigo-500/60 text-white placeholder-white/20 text-sm rounded-xl px-4 py-3 outline-none transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-white/60 text-xs font-medium uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-white/[0.05] border border-white/10 focus:border-indigo-500/60 text-white placeholder-white/20 text-sm rounded-xl px-4 py-3 pr-11 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPass ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all text-sm mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Create one
            </Link>
          </p>

          <p className="text-center text-white/20 text-xs mt-8">
            SLIIT Unified Schedule & Event Management System
          </p>
        </div>
      </div>
    </div>
  );
}