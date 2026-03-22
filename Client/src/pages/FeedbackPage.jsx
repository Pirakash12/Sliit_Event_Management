import { useState } from "react";
import { Link } from "react-router-dom";

const categories = ["Event Experience", "Club Management", "Communication", "Venue & Logistics", "Other"];
const events = [
  "Annual Tech Summit 2025",
  "Photography Club Meetup",
  "Cultural Fest – Spring Edition",
  "Debate Championship Finals",
  "Music Night: Open Mic",
];

const StarRating = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between">
    <span className="text-xs text-slate-400 font-medium">{label}</span>
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-lg transition-all duration-100 hover:scale-125 focus:outline-none leading-none ${
            star <= value ? "text-violet-400 drop-shadow-[0_0_6px_rgba(167,139,250,0.9)]" : "text-slate-700 hover:text-slate-500"
          }`}
        >★</button>
      ))}
    </div>
  </div>
);

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [category, setCategory] = useState("");
  const [ratings, setRatings] = useState({ overall: 0, organization: 0, content: 0, venue: 0 });
  const [recommend, setRecommend] = useState(null);
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const allRated = Object.values(ratings).every((r) => r > 0);
  const canSubmit = selectedEvent && category && allRated && message.trim().length > 10;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1400);
  };

  const handleReset = () => {
    setSubmitted(false);
    setSelectedEvent(""); setCategory("");
    setRatings({ overall: 0, organization: 0, content: 0, venue: 0 });
    setRecommend(null); setMessage("");
    setAnonymous(false); setName(""); setEmail("");
  };

  return (
    <div className="h-screen w-screen bg-[#07080f] text-white overflow-hidden flex flex-col font-['Plus_Jakarta_Sans',sans-serif] relative">

      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-violet-700/8 blur-[110px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-700/7 blur-[110px]" />
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)",
          backgroundSize: "44px 44px"
        }} />
      </div>

      {/* Header */}
      <header className="relative z-10 shrink-0 border-b border-slate-800/60 bg-[#07080f]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-[0_0_14px_rgba(139,92,246,0.55)]">S</div>
            <div>
              <div className="text-white font-bold text-sm leading-none">SLIIT EMS</div>
              <div className="text-slate-600 text-[9px] tracking-widest uppercase mt-0.5">Event Management System</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-xs text-slate-500 font-medium tracking-wide">
            {["Home","Events","Clubs"].map(n => (
              <Link key={n} to={n === "Home" ? "/" : "#"} className="hover:text-slate-200 transition-colors">{n}</Link>
            ))}
            <span className="text-violet-400 border-b border-violet-500/50 pb-0.5">Feedback</span>
          </nav>
        </div>
      </header>

      {/* Body */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-4 min-h-0">
        {submitted ? (
          /* ── Success ── */
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="w-18 h-18 rounded-full bg-violet-600/10 border-2 border-violet-500 flex items-center justify-center text-4xl text-violet-400 shadow-[0_0_40px_rgba(139,92,246,0.45)] w-20 h-20">✓</div>
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight mb-1.5">Feedback Submitted!</h3>
              <p className="text-slate-500 text-sm max-w-xs leading-relaxed">Your insights help SLIIT clubs improve and deliver better experiences.</p>
            </div>
            <button onClick={handleReset} className="px-8 py-2 rounded-xl border border-slate-700 text-slate-400 text-sm hover:border-violet-500/60 hover:text-violet-300 transition-all">
              Submit Another
            </button>
          </div>
        ) : (
          /* ── Two-column form ── */
          <form onSubmit={handleSubmit} className="w-full max-w-5xl h-full flex flex-col gap-4 min-h-0">

            {/* Page title row */}
            <div className="shrink-0 flex items-end justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-[10px] font-bold tracking-[0.18em] uppercase mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                  Share Your Experience
                </div>
                <h1 className="text-3xl font-black tracking-tighter leading-tight">
                  Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400">Feedback</span>
                </h1>
              </div>
              <p className="text-slate-600 text-xs text-right max-w-xs leading-relaxed hidden md:block">
                Your voice shapes every event we run.<br/>Help our clubs grow and improve.
              </p>
            </div>

            {/* Two columns */}
            <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">

              {/* ── LEFT COLUMN ── */}
              <div className="flex flex-col gap-3 min-h-0">

                {/* Event select */}
                <div className="bg-slate-900/55 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-[9px] font-bold tracking-[0.2em] text-slate-600 uppercase mb-2.5">01 — Event</div>
                  <div className="relative">
                    <select
                      value={selectedEvent}
                      onChange={(e) => setSelectedEvent(e.target.value)}
                      className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-slate-900">— Choose an event —</option>
                      {events.map(ev => <option key={ev} value={ev} className="bg-slate-900">{ev}</option>)}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="bg-slate-900/55 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-[9px] font-bold tracking-[0.2em] text-slate-600 uppercase mb-2.5">02 — Category</div>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map(cat => (
                      <button key={cat} type="button" onClick={() => setCategory(cat)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border transition-all duration-200 ${
                          category === cat
                            ? "bg-violet-600/20 border-violet-500/60 text-violet-300 shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                            : "bg-slate-800/60 border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300"
                        }`}
                      >{cat}</button>
                    ))}
                  </div>
                </div>

                {/* Ratings */}
                <div className="bg-slate-900/55 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-sm flex-1">
                  <div className="text-[9px] font-bold tracking-[0.2em] text-slate-600 uppercase mb-3">03 — Ratings</div>
                  <div className="flex flex-col gap-3">
                    <StarRating label="Overall Experience" value={ratings.overall} onChange={v => setRatings(r => ({...r, overall: v}))} />
                    <StarRating label="Event Organization" value={ratings.organization} onChange={v => setRatings(r => ({...r, organization: v}))} />
                    <StarRating label="Content & Programme" value={ratings.content} onChange={v => setRatings(r => ({...r, content: v}))} />
                    <StarRating label="Venue & Logistics" value={ratings.venue} onChange={v => setRatings(r => ({...r, venue: v}))} />
                  </div>
                </div>

              </div>

              {/* ── RIGHT COLUMN ── */}
              <div className="flex flex-col gap-3 min-h-0">

                {/* Recommend */}
                <div className="bg-slate-900/55 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-[9px] font-bold tracking-[0.2em] text-slate-600 uppercase mb-2.5">04 — Would You Recommend?</div>
                  <div className="flex gap-2">
                    {[
                      { label: "Yes, definitely", active: "bg-violet-600/20 border-violet-500/60 text-violet-300 shadow-[0_0_10px_rgba(139,92,246,0.25)]" },
                      { label: "Maybe", active: "bg-indigo-600/20 border-indigo-500/60 text-indigo-300" },
                      { label: "No", active: "bg-rose-600/20 border-rose-500/60 text-rose-300" },
                    ].map(({ label, active }) => (
                      <button key={label} type="button" onClick={() => setRecommend(label)}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-bold tracking-wide border transition-all duration-200 ${
                          recommend === label ? active : "bg-slate-800/60 border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300"
                        }`}
                      >{label}</button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="bg-slate-900/55 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-sm flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="text-[9px] font-bold tracking-[0.2em] text-slate-600 uppercase">05 — Your Thoughts</div>
                    <span className={`text-[10px] font-medium ${message.length > 10 ? "text-violet-500" : "text-slate-700"}`}>{message.length} chars</span>
                  </div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what went well, what could be improved, or anything memorable..."
                    className="flex-1 w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all resize-none leading-relaxed min-h-0"
                  />
                </div>

                {/* Identity */}
                <div className="bg-slate-900/55 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-[9px] font-bold tracking-[0.2em] text-slate-600 uppercase">06 — Identity</div>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div onClick={() => setAnonymous(!anonymous)}
                        className={`w-9 h-4.5 rounded-full transition-all duration-300 relative flex items-center ${anonymous ? "bg-violet-600 shadow-[0_0_10px_rgba(139,92,246,0.5)]" : "bg-slate-700"}`}
                        style={{height:"18px", width:"36px"}}
                      >
                        <div className={`absolute w-3.5 h-3.5 rounded-full bg-white shadow transition-all duration-300 ${anonymous ? "left-[18px]" : "left-[2px]"}`} />
                      </div>
                      <span className="text-[10px] text-slate-500 group-hover:text-slate-300 transition-colors font-medium">Anonymous</span>
                    </label>
                  </div>
                  {!anonymous ? (
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full name"
                        className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all" />
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@sliit.lk"
                        className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all" />
                    </div>
                  ) : (
                    <div className="text-xs text-slate-600 italic">Your identity will be hidden from organizers.</div>
                  )}
                </div>

                {/* Submit */}
                <button type="submit" disabled={!canSubmit || loading}
                  className={`w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 shrink-0 ${
                    canSubmit && !loading
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_22px_rgba(139,92,246,0.4)] hover:shadow-[0_0_34px_rgba(139,92,246,0.6)] hover:scale-[1.01]"
                      : "bg-slate-800 text-slate-600 cursor-not-allowed"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Submitting…
                    </span>
                  ) : canSubmit ? "Submit Feedback →" : "Complete all fields to submit"}
                </button>

              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 text-center text-[9px] text-slate-700 tracking-widest uppercase">
              SLIIT Unified Schedule & Event Management System
            </div>

          </form>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
      `}</style>
    </div>
  );
}
