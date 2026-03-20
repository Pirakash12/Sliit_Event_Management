import { useState, useEffect } from "react";

const events = [
  {
    id: 1,
    title: "Tech Summit 2025",
    date: "Apr 12, 2025",
    location: "Colombo, LK",
    category: "Technology",
    seats: 240,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
  },
  {
    id: 2,
    title: "Music Fest Night",
    date: "May 3, 2025",
    location: "Kandy, LK",
    category: "Music",
    seats: 500,
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80",
  },
  {
    id: 3,
    title: "Startup Pitch Day",
    date: "May 18, 2025",
    location: "Galle, LK",
    category: "Business",
    seats: 120,
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&q=80",
  },
  {
    id: 4,
    title: "Art & Design Expo",
    date: "Jun 7, 2025",
    location: "Colombo, LK",
    category: "Art",
    seats: 180,
    image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&q=80",
  },
  {
    id: 5,
    title: "Food & Culture Fair",
    date: "Jun 21, 2025",
    location: "Negombo, LK",
    category: "Lifestyle",
    seats: 350,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
  },
  {
    id: 6,
    title: "Photography Workshop",
    date: "Jul 5, 2025",
    location: "Colombo, LK",
    category: "Art",
    seats: 60,
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&q=80",
  },
];

const categories = ["All", "Technology", "Music", "Business", "Art", "Lifestyle"];

const categoryColors = {
  Technology: "bg-blue-100 text-blue-700",
  Music: "bg-purple-100 text-purple-700",
  Business: "bg-amber-100 text-amber-700",
  Art: "bg-rose-100 text-rose-700",
  Lifestyle: "bg-green-100 text-green-700",
};

const stats = [
  { label: "Events Hosted", value: "1,200+" },
  { label: "Happy Attendees", value: "85K+" },
  { label: "Cities Covered", value: "24" },
  { label: "Organizers", value: "340+" },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const filtered = events.filter((e) => {
    const matchCat = activeCategory === "All" || e.category === activeCategory;
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm font-bold">E</div>
          <span className="text-lg font-semibold tracking-tight">Eventify</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
          <a href="#" className="hover:text-white transition-colors">Browse</a>
          <a href="#" className="hover:text-white transition-colors">Organizers</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
          <a href="#" className="hover:text-white transition-colors">About</a>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2">Login</button>
          <button className="text-sm bg-violet-600 hover:bg-violet-500 transition-colors px-4 py-2 rounded-lg font-medium">
            Get Started
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 px-6 text-center overflow-hidden">
        {/* background glow blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-fuchsia-600/10 rounded-full blur-[80px] pointer-events-none" />

        <div className={`relative transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <span className="inline-block text-xs font-medium tracking-widest uppercase text-violet-400 bg-violet-400/10 px-4 py-1.5 rounded-full mb-6 border border-violet-400/20">
            Sri Lanka's #1 Event Platform
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
            Discover &amp; Book<br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Unforgettable Events
            </span>
          </h1>

          <p className="text-white/50 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Find concerts, conferences, workshops, and more — all in one place. Create and manage your own events effortlessly.
          </p>

          {/* Search bar */}
          <div className="flex items-center max-w-lg mx-auto bg-white/5 border border-white/10 rounded-2xl px-5 py-3 gap-3 focus-within:border-violet-500/60 transition-colors">
            <svg className="w-5 h-5 text-white/30 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search events or locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-white/30 text-sm outline-none"
            />
            <button className="bg-violet-600 hover:bg-violet-500 transition-colors text-sm font-medium px-4 py-1.5 rounded-xl">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 text-center"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-sm text-white/40">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── EVENTS SECTION ── */}
      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold">Upcoming Events</h2>
            <p className="text-white/40 text-sm mt-1">Browse what's happening near you</p>
          </div>
          <a href="#" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
            View all events →
          </a>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-sm px-4 py-1.5 rounded-full border transition-all font-medium ${
                activeCategory === cat
                  ? "bg-violet-600 border-violet-600 text-white"
                  : "border-white/10 text-white/50 hover:border-white/30 hover:text-white/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-white/30">No events found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((event) => (
              <div
                key={event.id}
                className="group bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-violet-500/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
                  <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[event.category]}`}>
                    {event.category}
                  </span>
                </div>

                {/* Body */}
                <div className="p-5">
                  <h3 className="font-semibold text-white text-base mb-3 group-hover:text-violet-300 transition-colors">
                    {event.title}
                  </h3>
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-white/40 text-xs">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2 text-white/40 text-xs">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/30">{event.seats} seats available</span>
                    <button className="text-xs bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white border border-violet-500/30 hover:border-violet-500 px-3 py-1.5 rounded-lg transition-all font-medium">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── CTA BANNER ── */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto relative rounded-3xl overflow-hidden bg-gradient-to-br from-violet-900/60 to-fuchsia-900/40 border border-violet-500/20 p-12 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-600/20 via-transparent to-transparent pointer-events-none" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative">
            Ready to host your own event?
          </h2>
          <p className="text-white/50 mb-8 max-w-md mx-auto relative">
            Create, promote, and manage events with powerful tools built for modern organizers.
          </p>
          <button className="relative bg-white text-[#0a0a0f] font-semibold px-8 py-3 rounded-xl hover:bg-violet-100 transition-colors text-sm">
            Start for Free →
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 px-8 py-8 text-center text-white/20 text-sm">
        © 2025 Eventify · Built with MERN Stack
      </footer>
    </div>
  );
}