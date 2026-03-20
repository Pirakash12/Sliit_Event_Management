import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const FACULTIES = [
  'Faculty of Computing',
  'Faculty of Engineering',
  'Faculty of Business',
  'Faculty of Architecture',
  'Faculty of Humanities & Sciences',
  'Faculty of Law',
];

const ROLES = [
  { value: 'student',   label: 'Student',         desc: 'Browse & register for events',    icon: '🎓' },
  { value: 'organizer', label: 'Club Organizer',   desc: 'Create & manage events',           icon: '📋' },
  { value: 'finance',   label: 'Finance Officer',  desc: 'Manage budgets & payments',        icon: '💰' },
];

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep]       = useState(1);   // 2-step form
  const [form, setForm]       = useState({
    name: '', email: '', studentId: '',
    faculty: '', batch: '',
    role: 'student',
    password: '', confirmPassword: '',
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // Step 1 validation
  const nextStep = () => {
    setError('');
    if (!form.name.trim())       return setError('Full name is required');
    if (!form.email.trim())      return setError('Email is required');
    if (!form.email.includes('@')) return setError('Enter a valid email');
    if (!form.studentId.trim())  return setError('Student / Staff ID is required');
    setStep(2);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (form.password.length < 8)
      return setError('Password must be at least 8 characters');
    if (form.password !== form.confirmPassword)
      return setError('Passwords do not match');

    setLoading(true);
    try {
      await api.post('/auth/register', {
        name:      form.name,
        email:     form.email,
        studentId: form.studentId,
        faculty:   form.faculty,
        batch:     form.batch,
        role:      form.role,
        password:  form.password,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── SUCCESS STATE ──
  if (success) {
    return (
      <div className="min-h-screen bg-[#060810] flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Account Created!</h2>
          <p className="text-white/50 text-sm mb-2">
            Welcome to SLIIT EMS, <span className="text-white font-medium">{form.name}</span>.
          </p>
          <p className="text-white/40 text-sm mb-8">
            Your account has been created successfully. You can now sign in.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all text-sm"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060810] flex">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-14 overflow-hidden">
        <div className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-violet-600/20 rounded-full blur-[90px]" />
        <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-indigo-600/15 rounded-full blur-[70px]" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-black text-white text-lg">S</div>
          <div>
            <div className="text-white font-bold text-lg leading-none">SLIIT EMS</div>
            <div className="text-white/40 text-xs">Event Management System</div>
          </div>
        </div>

        {/* Center */}
        <div className="relative">
          <div className="inline-block text-xs tracking-widest uppercase text-violet-400 bg-violet-400/10 border border-violet-400/20 px-3 py-1 rounded-full mb-6">
            Join the community
          </div>
          <h1 className="text-5xl font-black text-white leading-tight mb-4"
              style={{ fontFamily: "'Georgia', serif" }}>
            Start your<br />
            <span className="text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(135deg, #a78bfa, #818cf8)' }}>
              SLIIT journey.
            </span>
          </h1>
          <p className="text-white/40 text-base leading-relaxed max-w-sm">
            Register once. Access all campus events, club meetings,
            quizzes, certificates, and more.
          </p>

          {/* Feature list */}
          <div className="mt-10 space-y-4">
            {[
              ['📅', 'Browse & register for all SLIIT events'],
              ['🏆', 'Earn certificates after events & quizzes'],
              ['📊', 'Track your event history & performance'],
              ['🔔', 'Get notified about upcoming events'],
            ].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-sm">
                  {icon}
                </div>
                <span className="text-white/50 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative text-white/20 text-xs">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300">Sign in here</Link>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-black text-white">S</div>
            <span className="text-white font-bold text-lg">SLIIT EMS</span>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s
                    ? 'bg-indigo-600 text-white'
                    : step > s
                    ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                    : 'bg-white/[0.05] border border-white/10 text-white/30'
                }`}>
                  {step > s ? (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                    </svg>
                  ) : s}
                </div>
                <span className={`text-xs ${step === s ? 'text-white/70' : 'text-white/30'}`}>
                  {s === 1 ? 'Personal Info' : 'Security'}
                </span>
                {s < 2 && <div className="w-8 h-px bg-white/10 ml-1" />}
              </div>
            ))}
          </div>

          <h2 className="text-3xl font-bold text-white mb-1">
            {step === 1 ? 'Create account' : 'Set your password'}
          </h2>
          <p className="text-white/40 text-sm mb-7">
            {step === 1
              ? 'Fill in your details to get started'
              : 'Choose your role and secure your account'}
          </p>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-5">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">Full Name</label>
                <input
                  type="text" name="name" value={form.name}
                  onChange={handleChange} placeholder="e.g. Perera P D N"
                  className="w-full bg-white/[0.05] border border-white/10 focus:border-indigo-500/60 text-white placeholder-white/20 text-sm rounded-xl px-4 py-3 outline-none transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">SLIIT Email</label>
                <input
                  type="email" name="email" value={form.email}
                  onChange={handleChange} placeholder="it23312876@my.sliit.lk"
                  className="w-full bg-white/[0.05] border border-white/10 focus:border-indigo-500/60 text-white placeholder-white/20 text-sm rounded-xl px-4 py-3 outline-none transition-colors"
                />
              </div>

              {/* Student ID + Batch */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">Student ID</label>
                  <input
                    type="text" name="studentId" value={form.studentId}
                    onChange={handleChange} placeholder="IT23312876"
                    className="w-full bg-white/[0.05] border border-white/10 focus:border-indigo-500/60 text-white placeholder-white/20 text-sm rounded-xl px-4 py-3 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">Batch</label>
                  <input
                    type="text" name="batch" value={form.batch}
                    onChange={handleChange} placeholder="2023"
                    className="w-full bg-white/[0.05] border border-white/10 focus:border-indigo-500/60 text-white placeholder-white/20 text-sm rounded-xl px-4 py-3 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Faculty */}
              <div>
                <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">Faculty</label>
                <select
                  name="faculty" value={form.faculty} onChange={handleChange}
                  className="w-full bg-white/[0.05] border border-white/10 focus:border-indigo-500/60 text-white text-sm rounded-xl px-4 py-3 outline-none transition-colors appearance-none"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="" disabled className="bg-[#0f1117]">Select your faculty</option>
                  {FACULTIES.map(f => (
                    <option key={f} value={f} className="bg-[#0f1117]">{f}</option>
                  ))}
                </select>
              </div>

              <button
                type="button" onClick={nextStep}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all text-sm mt-2"
              >
                Continue →
              </button>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Role selector */}
              <div>
                <label className="block text-white/60 text-xs font-medium mb-3 uppercase tracking-wider">Select Your Role</label>
                <div className="space-y-2">
                  {ROLES.map(r => (
                    <label key={r.value} className={`flex items-center gap-4 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      form.role === r.value
                        ? 'border-indigo-500/60 bg-indigo-600/10'
                        : 'border-white/[0.08] bg-white/[0.03] hover:border-white/20'
                    }`}>
                      <input
                        type="radio" name="role" value={r.value}
                        checked={form.role === r.value}
                        onChange={handleChange} className="hidden"
                      />
                      <span className="text-xl">{r.icon}</span>
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">{r.label}</div>
                        <div className="text-white/40 text-xs">{r.desc}</div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        form.role === r.value ? 'border-indigo-500' : 'border-white/20'
                      }`}>
                        {form.role === r.value && (
                          <div className="w-2 h-2 rounded-full bg-indigo-500" />
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password" value={form.password}
                    onChange={handleChange} placeholder="Min. 8 characters"
                    required
                    className="w-full bg-white/[0.05] border border-white/10 focus:border-indigo-500/60 text-white placeholder-white/20 text-sm rounded-xl px-4 py-3 pr-11 outline-none transition-colors"
                  />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d={showPass
                          ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          : "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"}
                      />
                    </svg>
                  </button>
                </div>
                {/* Password strength */}
                {form.password && (
                  <div className="flex gap-1 mt-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                        form.password.length >= i * 3
                          ? form.password.length >= 10 ? 'bg-green-500' : form.password.length >= 7 ? 'bg-amber-500' : 'bg-red-500'
                          : 'bg-white/10'
                      }`} />
                    ))}
                    <span className="text-xs text-white/30 ml-1">
                      {form.password.length >= 10 ? 'Strong' : form.password.length >= 7 ? 'Fair' : 'Weak'}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword" value={form.confirmPassword}
                    onChange={handleChange} placeholder="Re-enter password"
                    required
                    className={`w-full bg-white/[0.05] border text-white placeholder-white/20 text-sm rounded-xl px-4 py-3 pr-11 outline-none transition-colors ${
                      form.confirmPassword && form.password !== form.confirmPassword
                        ? 'border-red-500/50' : 'border-white/10 focus:border-indigo-500/60'
                    }`}
                  />
                  <button type="button" onClick={() => setShowConfirm(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d={showConfirm
                          ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          : "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"}
                      />
                    </svg>
                  </button>
                </div>
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-2">
                <button
                  type="button" onClick={() => { setStep(1); setError(''); }}
                  className="flex-1 bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 text-white/70 font-medium py-3 rounded-xl transition-all text-sm"
                >
                  ← Back
                </button>
                <button
                  type="submit" disabled={loading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Creating...
                    </>
                  ) : 'Create Account'}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-white/40 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}