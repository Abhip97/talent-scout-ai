import { motion } from 'framer-motion';
import { ArrowRight, Zap, Search, Brain, MessageSquare, BarChart3, Star, Github, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

/* ── Real brand SVG logos ────────────────────────────────────────── */
const GroqLogo = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="currentColor">
    <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="6"/>
    <path d="M50 20C33.43 20 20 33.43 20 50s13.43 30 30 30c9.48 0 17.94-4.4 23.5-11.28V52H50v8h15.6c-3.1 5.16-8.8 8.6-15.6 8.6C38.73 68.6 31.4 61.27 31.4 50S38.73 31.4 50 31.4c6.3 0 11.94 2.72 15.9 7.06l5.9-5.9C66.38 26.5 58.64 20 50 20z"/>
  </svg>
);

const OpenAILogo = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
  </svg>
);

const AnthropicLogo = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.304 2.529H13.698L8 21.471h3.606l1.44-4.411h4.797l-1.598-4.947h-2.277l1.549-4.858L20.186 21.471h3.607L17.304 2.529ZM6.208 2.529H.208L6.696 21.471H.208V24h9.898L6.208 2.529Z"/>
  </svg>
);

const GeminiLogo = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2c0 0 2.163 6.676 2.163 10S12 22 12 22c0 0-2.163-6.676-2.163-10S12 2 12 2z"/>
    <path d="M2 12c0 0 6.676-2.163 10-2.163S22 12 22 12c0 0-6.676 2.163-10 2.163S2 12 2 12z"/>
  </svg>
);

/* ── Data ────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: <Brain size={22} />,
    title: 'AI-Powered JD Parsing',
    desc: 'Instantly extracts skills, experience, location, salary and role requirements from any job description format.',
    color: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-500/20',
  },
  {
    icon: <Search size={22} />,
    title: 'Multi-Source Discovery',
    desc: 'Search across 75+ talent pool candidates and real GitHub profiles with public contributions and activity.',
    color: 'from-blue-500 to-cyan-500',
    glow: 'shadow-blue-500/20',
  },
  {
    icon: <BarChart3 size={22} />,
    title: 'Smart AI Matching',
    desc: 'Semantic skill matching with weighted scoring across skills, experience, location, salary, and cultural fit.',
    color: 'from-orange-500 to-amber-500',
    glow: 'shadow-orange-500/20',
  },
  {
    icon: <MessageSquare size={22} />,
    title: 'Personalised Outreach',
    desc: "AI-crafted recruiter messages tailored to each candidate's background and the specific role requirements.",
    color: 'from-emerald-500 to-teal-500',
    glow: 'shadow-emerald-500/20',
  },
  {
    icon: <Star size={22} />,
    title: 'Interest Scoring',
    desc: 'Simulates realistic candidate responses and scores enthusiasm, availability, salary fit and willingness.',
    color: 'from-rose-500 to-pink-500',
    glow: 'shadow-rose-500/20',
  },
  {
    icon: <Github size={22} />,
    title: 'GitHub Intelligence',
    desc: 'Discovers candidates via GitHub search with verified profile links, repos, and contribution signals.',
    color: 'from-slate-500 to-zinc-600',
    glow: 'shadow-slate-500/20',
  },
];

const PIPELINE_STEPS = [
  { emoji: '📄', label: 'Parse JD', desc: 'Extract role requirements' },
  { emoji: '🔍', label: 'Discover', desc: 'Find matching candidates' },
  { emoji: '⚡', label: 'Match & Score', desc: 'Rank by fit score' },
  { emoji: '💬', label: 'Outreach', desc: 'AI-crafted messages' },
  { emoji: '📊', label: 'Shortlist', desc: 'Final ranked report' },
];

const PROVIDERS = [
  {
    name: 'Groq',
    model: 'Llama 3.3 70B',
    badge: 'Free',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/25',
    badgeCls: 'bg-emerald-500/20 text-emerald-300',
    Logo: GroqLogo,
    gridBg: isDark => isDark ? 'border-emerald-500/15 bg-emerald-500/5' : 'border-emerald-200 bg-emerald-50',
    gridColor: isDark => isDark ? 'text-emerald-400' : 'text-emerald-600',
  },
  {
    name: 'OpenAI',
    model: 'GPT-4o Mini',
    badge: 'Paid',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/25',
    badgeCls: 'bg-amber-500/20 text-amber-300',
    Logo: OpenAILogo,
    gridBg: isDark => isDark ? 'border-blue-500/15 bg-blue-500/5' : 'border-blue-200 bg-blue-50',
    gridColor: isDark => isDark ? 'text-blue-400' : 'text-blue-600',
  },
  {
    name: 'Claude',
    model: 'Haiku 3.5',
    badge: 'Paid',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/25',
    badgeCls: 'bg-amber-500/20 text-amber-300',
    Logo: AnthropicLogo,
    gridBg: isDark => isDark ? 'border-violet-500/15 bg-violet-500/5' : 'border-violet-200 bg-violet-50',
    gridColor: isDark => isDark ? 'text-violet-400' : 'text-violet-600',
  },
  {
    name: 'Gemini',
    model: '1.5 Flash',
    badge: 'Free',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10 border-sky-500/25',
    badgeCls: 'bg-emerald-500/20 text-emerald-300',
    Logo: GeminiLogo,
    gridBg: isDark => isDark ? 'border-sky-500/15 bg-sky-500/5' : 'border-sky-200 bg-sky-50',
    gridColor: isDark => isDark ? 'text-sky-400' : 'text-sky-600',
  },
];

const STATS = [
  { value: '75+', label: 'Candidates in Pool' },
  { value: '4', label: 'AI Providers' },
  { value: '5', label: 'Pipeline Stages' },
  { value: '<5 min', label: 'Full Pipeline Run' },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

/* ── Component ───────────────────────────────────────────────────── */
export const LandingPage = ({ onGetStarted }) => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen overflow-x-hidden ${isDark ? 'text-white' : 'text-slate-800'}`}>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-28 px-6 text-center overflow-hidden">

        {/* Dot-grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: isDark
              ? 'radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)'
              : 'radial-gradient(circle, rgba(99,102,241,0.10) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Edge vignette over grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, #0d0800 100%)'
              : 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, #eef2ff 100%)',
          }}
        />

        {/* Animated ambient orbs */}
        <motion.div
          className="absolute rounded-full blur-[110px] pointer-events-none"
          style={{ width: 560, height: 560, top: '-12%', left: '10%',
            background: isDark ? 'rgba(249,115,22,0.13)' : 'rgba(99,102,241,0.15)' }}
          animate={{ x: [0, 55, -35, 0], y: [0, -30, 50, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full blur-[90px] pointer-events-none"
          style={{ width: 380, height: 380, top: '15%', right: '5%',
            background: isDark ? 'rgba(251,191,36,0.08)' : 'rgba(139,92,246,0.12)' }}
          animate={{ x: [0, -45, 25, 0], y: [0, 40, -25, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />
        <motion.div
          className="absolute rounded-full blur-[80px] pointer-events-none"
          style={{ width: 280, height: 280, bottom: '5%', left: '30%',
            background: isDark ? 'rgba(249,115,22,0.07)' : 'rgba(59,130,246,0.10)' }}
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />

        {/* Hero content */}
        <motion.div
          initial="initial"
          animate="animate"
          transition={{ staggerChildren: 0.12 }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Top badge */}
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="flex justify-center mb-6">
            <span className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-1.5 rounded-full border ${
              isDark ? 'bg-orange-500/10 border-orange-500/25 text-orange-300' : 'bg-indigo-100 border-indigo-200 text-indigo-600'
            }`}>
              <Zap size={11} className="fill-current" />
              AI-Powered Recruitment Pipeline
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeUp} transition={{ duration: 0.5 }} className="text-5xl md:text-6xl font-black leading-tight mb-5">
            Recruit Smarter with{' '}
            <span className={`bg-clip-text text-transparent bg-gradient-to-r ${
              isDark ? 'from-orange-300 via-amber-300 to-orange-400' : 'from-indigo-600 via-violet-600 to-indigo-500'
            }`}>
              AI Talent Scout
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p variants={fadeUp} transition={{ duration: 0.5 }} className={`text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed ${
            isDark ? 'text-orange-100/55' : 'text-slate-500'
          }`}>
            Paste a job description and watch AI discover, score, and reach out to top candidates
            across your talent pool and GitHub — in under 5 minutes.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <motion.button
              onClick={onGetStarted}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-2.5 px-8 py-4 rounded-2xl font-black text-base text-white shadow-xl transition-all ${
                isDark
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 shadow-orange-500/30'
                  : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-500/30'
              }`}
            >
              Start Recruiting <ArrowRight size={18} />
            </motion.button>
            <motion.a
              href="#features"
              whileHover={{ scale: 1.02 }}
              className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-semibold text-sm border transition-all ${
                isDark
                  ? 'border-orange-500/20 text-orange-200/80 hover:bg-orange-500/8'
                  : 'border-slate-200 text-slate-600 hover:bg-white'
              }`}
            >
              See how it works <ChevronRight size={15} />
            </motion.a>
          </motion.div>

          {/* Provider badges — larger, real logos */}
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <span className={`text-sm font-medium mr-1 ${isDark ? 'text-white/35' : 'text-slate-400'}`}>
              Powered by
            </span>
            {PROVIDERS.map((p) => (
              <motion.span
                key={p.name}
                whileHover={{ scale: 1.06, y: -2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`inline-flex items-center gap-2.5 text-sm font-bold px-4 py-2 rounded-xl border cursor-default select-none ${p.bg} ${p.color}`}
              >
                <p.Logo size={17} />
                {p.name}
                <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${p.badgeCls}`}>
                  {p.badge}
                </span>
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────── */}
      <section className={`border-y ${isDark ? 'border-white/8 bg-white/3' : 'border-slate-200/80 bg-white/50'}`}>
        <div className="max-w-4xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="text-center"
            >
              <div className={`text-3xl font-black mb-1 ${isDark ? 'text-orange-300' : 'text-indigo-600'}`}>{value}</div>
              <div className={`text-xs font-medium ${isDark ? 'text-white/40' : 'text-slate-500'}`}>{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Pipeline visualization ───────────────────────────────── */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl font-black mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              5-Stage Automated Pipeline
            </h2>
            <p className={`text-sm ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
              From job description to ranked shortlist — fully automated, AI-driven
            </p>
          </motion.div>

          <div className="relative flex flex-col md:flex-row items-stretch gap-0">
            {PIPELINE_STEPS.map((step, i) => (
              <div key={step.label} className="flex md:flex-col items-center md:items-stretch flex-1 relative">
                {i < PIPELINE_STEPS.length - 1 && (
                  <>
                    <div className={`hidden md:block absolute top-8 left-1/2 w-full h-px ${isDark ? 'bg-gradient-to-r from-orange-500/40 to-orange-500/10' : 'bg-gradient-to-r from-indigo-300/60 to-indigo-100'}`} style={{ zIndex: 0 }} />
                    <div className={`md:hidden absolute left-4 top-full w-px h-4 ${isDark ? 'bg-orange-500/30' : 'bg-indigo-200'}`} />
                  </>
                )}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className={`relative z-10 flex md:flex-col items-center gap-3 md:gap-2 p-4 rounded-2xl text-center flex-1 border transition-all ${
                    isDark
                      ? 'bg-[#1c0f04]/60 border-orange-500/10 hover:border-orange-500/25 hover:bg-[#1c0f04]'
                      : 'bg-white border-slate-100 hover:border-indigo-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${isDark ? 'bg-orange-500/10' : 'bg-indigo-50'}`}>
                    {step.emoji}
                  </div>
                  <div className="text-left md:text-center">
                    <div className={`text-sm font-bold ${isDark ? 'text-white/90' : 'text-slate-700'}`}>{step.label}</div>
                    <div className={`text-[11px] mt-0.5 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>{step.desc}</div>
                  </div>
                  <div className={`md:hidden ml-auto text-[10px] font-black px-2 py-0.5 rounded-full ${isDark ? 'bg-orange-500/15 text-orange-300' : 'bg-indigo-100 text-indigo-500'}`}>{i + 1}</div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature cards ────────────────────────────────────────── */}
      <section className={`py-20 px-6 ${isDark ? 'bg-white/2' : 'bg-white/40'}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl font-black mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Everything You Need to Hire Faster
            </h2>
            <p className={`text-sm ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
              Production-grade features built for modern recruiting teams
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                whileHover={{ y: -3 }}
                className={`p-5 rounded-2xl border transition-all ${
                  isDark
                    ? `bg-[#1c0f04]/80 border-orange-500/10 hover:border-orange-500/20 shadow-lg ${f.glow}`
                    : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${f.color} text-white shadow-lg`}>
                  {f.icon}
                </div>
                <h3 className={`font-bold text-sm mb-1.5 ${isDark ? 'text-white/90' : 'text-slate-800'}`}>{f.title}</h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-white/45' : 'text-slate-500'}`}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Provider grid ────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className={`text-3xl font-black mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Your Choice of AI Provider
            </h2>
            <p className={`text-sm ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
              Use your own API key — we never store it on a server
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PROVIDERS.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`p-5 rounded-2xl border text-center transition-all ${
                  isDark ? 'bg-[#1c0f04]/60 border-orange-500/10 hover:border-orange-500/20' : 'bg-white border-slate-100 shadow-sm hover:shadow-md'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 border ${p.gridBg(isDark)} ${p.gridColor(isDark)}`}>
                  <p.Logo size={24} />
                </div>
                <div className={`font-bold text-sm ${isDark ? 'text-white/90' : 'text-slate-800'}`}>{p.name}</div>
                <div className={`text-[11px] mb-2.5 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>{p.model}</div>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${p.badgeCls}`}>{p.badge}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA footer ───────────────────────────────────────────── */}
      <section className={`relative py-24 px-6 border-t overflow-hidden ${isDark ? 'border-white/8' : 'border-slate-200/80'}`}>
        {/* Background glow for CTA section */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: isDark
              ? 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)'
              : 'radial-gradient(circle, rgba(99,102,241,0.08) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(249,115,22,0.07) 0%, transparent 70%)'
              : 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(99,102,241,0.08) 0%, transparent 70%)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-2xl mx-auto text-center"
        >
          <div className="text-5xl mb-5">🚀</div>
          <h2 className={`text-3xl font-black mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Ready to Find Your Next Hire?
          </h2>
          <p className={`text-sm mb-8 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
            Add your API key, paste a job description, and let AI do the sourcing, matching, and outreach.
          </p>
          <motion.button
            onClick={onGetStarted}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`inline-flex items-center gap-2.5 px-9 py-4 rounded-2xl font-black text-lg text-white shadow-2xl transition-all ${
              isDark
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 shadow-orange-500/30'
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-500/25'
            }`}
          >
            Launch TalentScout AI <ArrowRight size={20} />
          </motion.button>
          <p className={`text-xs mt-5 ${isDark ? 'text-white/25' : 'text-slate-400'}`}>
            No data leaves your browser · Open source · Free for Groq + Gemini
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
