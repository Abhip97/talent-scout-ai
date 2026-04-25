import { useRef, Fragment } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight, Zap, Search, Brain, MessageSquare, BarChart3,
  Star, Github, ChevronRight, FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { LogoMark } from '../UI/LogoMark.jsx';
import { AnimatedCounter } from '../UI/AnimatedCounter.jsx';

/* ── Pipeline steps ──────────────────────────────────────────────── */
const PIPELINE_STEPS = [
  {
    num: '01', icon: <FileText size={18} />, label: 'Parse JD',
    desc: 'Extracts skills, experience, location and salary from any JD format',
    color: 'from-blue-500 to-cyan-500', borderColor: '#3b82f6', shadow: 'shadow-blue-500/25',
  },
  {
    num: '02', icon: <Search size={18} />, label: 'Discover',
    desc: 'Searches talent pool, GitHub profiles and uploaded resumes',
    color: 'from-purple-500 to-violet-600', borderColor: '#7c3aed', shadow: 'shadow-purple-500/25',
  },
  {
    num: '03', icon: <Zap size={18} />, label: 'Match & Score',
    desc: 'Semantic scoring across skills, experience, salary and culture fit',
    color: 'from-violet-500 to-indigo-600', borderColor: '#6366f1', shadow: 'shadow-violet-500/25',
  },
  {
    num: '04', icon: <MessageSquare size={18} />, label: 'Outreach',
    desc: 'AI-crafted, personalised recruiter messages for each candidate',
    color: 'from-indigo-500 to-blue-600', borderColor: '#4f46e5', shadow: 'shadow-indigo-500/25',
  },
  {
    num: '05', icon: <BarChart3 size={18} />, label: 'Shortlist',
    desc: 'Final ranked report combining match and interest scores',
    color: 'from-emerald-500 to-teal-500', borderColor: '#10b981', shadow: 'shadow-emerald-500/25',
  },
];

/* ── Features ────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: <Brain size={22} />, title: 'AI-Powered JD Parsing',
    desc: 'Instantly extracts skills, experience, location, salary and role requirements from any job description format.',
    color: 'from-violet-500 to-purple-600', glow: 'shadow-violet-500/20',
  },
  {
    icon: <Search size={22} />, title: 'Multi-Source Discovery',
    desc: 'Search across 75+ talent pool candidates and real GitHub profiles with public contributions and activity.',
    color: 'from-blue-500 to-cyan-500', glow: 'shadow-blue-500/20',
  },
  {
    icon: <BarChart3 size={22} />, title: 'Smart AI Matching',
    desc: 'Semantic skill matching with weighted scoring across skills, experience, location, salary, and cultural fit.',
    color: 'from-orange-500 to-amber-500', glow: 'shadow-orange-500/20',
  },
  {
    icon: <MessageSquare size={22} />, title: 'Personalised Outreach',
    desc: "AI-crafted recruiter messages tailored to each candidate's background and the specific role requirements.",
    color: 'from-emerald-500 to-teal-500', glow: 'shadow-emerald-500/20',
  },
  {
    icon: <Star size={22} />, title: 'Interest Scoring',
    desc: 'Simulates realistic candidate responses and scores enthusiasm, availability, salary fit and willingness.',
    color: 'from-rose-500 to-pink-500', glow: 'shadow-rose-500/20',
  },
  {
    icon: <Github size={22} />, title: 'GitHub Intelligence',
    desc: 'Discovers candidates via GitHub search with verified profile links, repos, and contribution signals.',
    color: 'from-slate-500 to-zinc-600', glow: 'shadow-slate-500/20',
  },
];

/* ── Providers — clean text badges, no SVG logos ─────────────────── */
const PROVIDERS = [
  {
    name: 'Groq', initial: 'G', model: 'Llama 3.3 70B', badge: 'Free', badgeFree: true,
    circleGrad: 'from-emerald-500 to-teal-500',
    heroDark: 'bg-emerald-700/80 border-emerald-500/35 text-white',
    heroLight: 'bg-emerald-600 border-emerald-500/50 text-white',
  },
  {
    name: 'OpenAI', initial: 'O', model: 'GPT-4o Mini', badge: 'Paid', badgeFree: false,
    circleGrad: 'from-gray-600 to-gray-800',
    heroDark: 'bg-gray-700/80 border-gray-500/35 text-white',
    heroLight: 'bg-gray-700 border-gray-600/50 text-white',
  },
  {
    name: 'Claude', initial: 'C', model: 'Haiku 3.5', badge: 'Paid', badgeFree: false,
    circleGrad: 'from-amber-500 to-orange-500',
    heroDark: 'bg-amber-700/80 border-amber-500/35 text-white',
    heroLight: 'bg-amber-600 border-amber-500/50 text-white',
  },
  {
    name: 'Gemini', initial: 'G', model: '1.5 Flash', badge: 'Free', badgeFree: true,
    circleGrad: 'from-blue-500 to-indigo-600',
    heroDark: 'bg-blue-700/80 border-blue-500/35 text-white',
    heroLight: 'bg-blue-600 border-blue-500/50 text-white',
  },
];

/* ── Stats ───────────────────────────────────────────────────────── */
const STATS = [
  { numValue: 75, suffix: '+', label: 'Candidates in Pool' },
  { numValue: 4,  suffix: '',  label: 'AI Providers' },
  { numValue: 5,  suffix: '',  label: 'Pipeline Stages' },
  { numValue: null, display: '<5 min', label: 'Full Pipeline Run' },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

/* ── Component ───────────────────────────────────────────────────── */
export const LandingPage = ({ onGetStarted }) => {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-60px' });

  const pipelineConnectorColor = '#818cf8';

  return (
    <div className={`min-h-screen overflow-x-hidden ${isDark ? 'text-white' : 'text-gray-900'}`}>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-28 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: isDark
            ? 'radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)'
            : 'radial-gradient(circle, rgba(99,102,241,0.10) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: isDark
            ? 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, #0d0800 100%)'
            : 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, #eef2ff 100%)',
        }} />
        <motion.div className="absolute rounded-full blur-[110px] pointer-events-none"
          style={{ width: 560, height: 560, top: '-12%', left: '10%',
            background: isDark ? 'rgba(249,115,22,0.13)' : 'rgba(99,102,241,0.15)' }}
          animate={{ x: [0, 55, -35, 0], y: [0, -30, 50, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute rounded-full blur-[90px] pointer-events-none"
          style={{ width: 380, height: 380, top: '15%', right: '5%',
            background: isDark ? 'rgba(251,191,36,0.08)' : 'rgba(139,92,246,0.12)' }}
          animate={{ x: [0, -45, 25, 0], y: [0, 40, -25, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }} />
        <motion.div className="absolute rounded-full blur-[80px] pointer-events-none"
          style={{ width: 280, height: 280, bottom: '5%', left: '30%',
            background: isDark ? 'rgba(249,115,22,0.07)' : 'rgba(59,130,246,0.10)' }}
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 3 }} />

        <motion.div
          initial="initial" animate="animate"
          transition={{ staggerChildren: 0.12 }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Hero logo */}
          <motion.div variants={fadeUp} transition={{ duration: 0.55 }} className="flex justify-center mb-8">
            <div className="relative flex items-center justify-center">
              <div className="absolute rounded-[32px] pointer-events-none" style={{
                width: 108, height: 108,
                background: isDark
                  ? 'radial-gradient(ellipse, rgba(249,115,22,0.28) 0%, transparent 70%)'
                  : 'radial-gradient(ellipse, rgba(99,102,241,0.22) 0%, transparent 70%)',
                filter: 'blur(18px)',
              }} />
              <LogoMark size={88} isDark={isDark} animated />
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="flex justify-center mb-6">
            <span className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-1.5 rounded-full border ${
              isDark ? 'bg-orange-500/10 border-orange-500/25 text-orange-300' : 'bg-indigo-100 border-indigo-200 text-indigo-700'
            }`}>
              <Zap size={11} className="fill-current" /> AI-Powered Recruitment Pipeline
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeUp} transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-black leading-tight mb-5"
          >
            Recruit Smarter with{' '}
            <span className={`bg-clip-text text-transparent bg-gradient-to-r ${
              isDark ? 'from-orange-300 via-amber-300 to-orange-400' : 'from-indigo-600 via-violet-600 to-indigo-500'
            }`}>
              AI Talent Scout
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p variants={fadeUp} transition={{ duration: 0.5 }}
            className={`text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed ${
              isDark ? 'text-orange-100/60' : 'text-gray-600'
            }`}
          >
            Paste a job description and watch AI discover, score, and reach out to top candidates
            across your talent pool and GitHub — in under 5 minutes.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
          >
            <motion.button onClick={onGetStarted} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-2.5 px-8 py-4 rounded-2xl font-black text-base text-white shadow-xl transition-all ${
                isDark
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 shadow-orange-500/30'
                  : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-500/30'
              }`}
            >
              Start Recruiting <ArrowRight size={18} />
            </motion.button>
            <motion.a href="#pipeline" whileHover={{ scale: 1.02 }}
              className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-semibold text-sm border transition-all ${
                isDark
                  ? 'border-orange-500/20 text-orange-200/80 hover:bg-orange-500/8'
                  : 'border-slate-200 text-gray-600 hover:bg-white'
              }`}
            >
              See how it works <ChevronRight size={15} />
            </motion.a>
          </motion.div>

          {/* Divider */}
          <div className={`w-48 h-px mx-auto mb-6 ${
            isDark ? 'bg-gradient-to-r from-transparent via-orange-500/30 to-transparent'
                   : 'bg-gradient-to-r from-transparent via-indigo-300/50 to-transparent'
          }`} />

          {/* Provider badges — clean text, no logos */}
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-2.5"
          >
            <span className={`text-xs font-semibold mr-1 ${isDark ? 'text-white/35' : 'text-gray-500'}`}>
              Powered by
            </span>
            {PROVIDERS.map((p) => (
              <motion.span
                key={p.name}
                whileHover={{ scale: 1.06, y: -2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl border cursor-default select-none ${
                  isDark ? p.heroDark : p.heroLight
                }`}
              >
                {p.name}
                <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                  p.badgeFree
                    ? 'bg-white/20 text-white'
                    : 'bg-black/15 text-white'
                }`}>
                  {p.badge}
                </span>
              </motion.span>
            ))}
          </motion.div>

          <div className={`w-48 h-px mx-auto mt-8 ${
            isDark ? 'bg-gradient-to-r from-transparent via-orange-500/20 to-transparent'
                   : 'bg-gradient-to-r from-transparent via-indigo-200/60 to-transparent'
          }`} />
        </motion.div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────── */}
      <section ref={statsRef} className={`border-y ${
        isDark ? 'border-white/8 bg-white/3' : 'border-slate-200/80 bg-white/70'
      }`}>
        <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ numValue, suffix, display, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="text-center"
            >
              <div className={`text-3xl font-black mb-1 ${isDark ? 'text-orange-300' : 'text-indigo-600'}`}>
                {numValue !== null
                  ? <><AnimatedCounter value={statsInView ? numValue : 0} />{suffix}</>
                  : display}
              </div>
              <div className={`text-xs font-semibold ${isDark ? 'text-white/45' : 'text-gray-600'}`}>{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Pipeline visualization ───────────────────────────────── */}
      <section id="pipeline" className={`py-20 px-6 relative overflow-hidden ${
        isDark ? '' : 'bg-gradient-to-br from-slate-50 via-indigo-50/40 to-violet-50/20'
      }`}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: isDark
            ? 'radial-gradient(circle, rgba(99,102,241,0.055) 1px, transparent 1px)'
            : 'radial-gradient(circle, rgba(99,102,241,0.09) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: isDark
            ? 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 50%, #0d0800 100%)'
            : 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 55%, #f0eeff 100%)',
        }} />

        <div className="relative max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl font-black mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              5-Stage Automated Pipeline
            </h2>
            <p className={`text-sm ${isDark ? 'text-white/45' : 'text-gray-600'}`}>
              From job description to ranked shortlist — fully automated, AI-driven
            </p>
          </motion.div>

          {/* Pipeline row */}
          <div className="flex flex-col md:flex-row items-stretch gap-0">
            {PIPELINE_STEPS.map((step, i) => (
              <Fragment key={step.label}>
                {/* Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  whileHover={{ y: -4 }}
                  className={`flex-1 p-5 rounded-2xl border transition-all relative cursor-default ${
                    isDark
                      ? 'bg-[#1c0f04]/70 border-white/8 hover:border-white/16 shadow-lg'
                      : 'bg-white border-slate-200 hover:border-indigo-200 shadow-sm hover:shadow-md'
                  }`}
                  style={{ borderLeft: `3px solid ${step.borderColor}` }}
                >
                  {/* Stage number */}
                  <div className={`absolute top-3 right-3 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                    isDark ? 'bg-white/8 text-white/50' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {step.num}
                  </div>
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${step.color} mb-3 shadow-lg ${step.shadow}`}>
                    {step.icon}
                  </div>
                  <h3 className={`font-bold text-sm mb-1.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>{step.label}</h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-white/45' : 'text-gray-600'}`}>{step.desc}</p>
                </motion.div>

                {/* Connectors between cards */}
                {i < PIPELINE_STEPS.length - 1 && (
                  <>
                    {/* Desktop horizontal */}
                    <div className="hidden md:flex items-center justify-center w-9 shrink-0">
                      <div className="flex items-center gap-0.5">
                        <div className="relative h-0.5 w-6 overflow-hidden rounded-full"
                          style={{ background: isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.2)' }}>
                          <motion.div
                            className="absolute inset-y-0 rounded-full"
                            style={{ width: '60%', background: `linear-gradient(90deg, transparent, ${pipelineConnectorColor}, transparent)` }}
                            animate={{ x: ['-100%', '250%'] }}
                            transition={{ duration: 1.3, repeat: Infinity, ease: 'linear', delay: i * 0.18 }}
                          />
                        </div>
                        <svg width="5" height="9" viewBox="0 0 5 9" fill="none">
                          <path d="M0 0L5 4.5L0 9V0Z" fill={pipelineConnectorColor} fillOpacity="0.65" />
                        </svg>
                      </div>
                    </div>

                    {/* Mobile vertical */}
                    <div className="md:hidden flex justify-center py-2">
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="relative w-0.5 h-5 overflow-hidden rounded-full"
                          style={{ background: isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.2)' }}>
                          <motion.div
                            className="absolute inset-x-0 rounded-full"
                            style={{ height: '50%', background: `linear-gradient(180deg, transparent, ${pipelineConnectorColor}, transparent)` }}
                            animate={{ y: ['-100%', '250%'] }}
                            transition={{ duration: 1.3, repeat: Infinity, ease: 'linear', delay: i * 0.18 }}
                          />
                        </div>
                        <svg width="9" height="5" viewBox="0 0 9 5" fill="none">
                          <path d="M0 0H9L4.5 5L0 0Z" fill={pipelineConnectorColor} fillOpacity="0.65" />
                        </svg>
                      </div>
                    </div>
                  </>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature cards ────────────────────────────────────────── */}
      <section className={`py-20 px-6 ${isDark ? 'bg-white/2' : 'bg-white/60'}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl font-black mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Everything You Need to Hire Faster
            </h2>
            <p className={`text-sm ${isDark ? 'text-white/45' : 'text-gray-600'}`}>
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
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${f.color} text-white shadow-lg`}>
                  {f.icon}
                </div>
                <h3 className={`font-bold text-sm mb-1.5 ${isDark ? 'text-white/90' : 'text-gray-900'}`}>{f.title}</h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-white/50' : 'text-gray-600'}`}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Provider grid ────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className={`text-3xl font-black mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Your Choice of AI Provider
            </h2>
            <p className={`text-sm ${isDark ? 'text-white/45' : 'text-gray-600'}`}>
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
                  isDark
                    ? 'bg-[#1c0f04]/60 border-orange-500/10 hover:border-orange-500/20'
                    : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-gradient-to-br ${p.circleGrad} text-white font-black text-xl shadow-md`}>
                  {p.initial}
                </div>
                <div className={`font-bold text-sm mb-0.5 ${isDark ? 'text-white/90' : 'text-gray-900'}`}>{p.name}</div>
                <div className={`text-[11px] mb-2.5 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>{p.model}</div>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                  p.badgeFree
                    ? isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                    : isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700'
                }`}>
                  {p.badge}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA footer ───────────────────────────────────────────── */}
      <section className={`relative py-24 px-6 border-t overflow-hidden ${
        isDark ? 'border-white/8' : 'border-slate-200/80'
      }`}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: isDark
            ? 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)'
            : 'radial-gradient(circle, rgba(99,102,241,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: isDark
            ? 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(249,115,22,0.07) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(99,102,241,0.08) 0%, transparent 70%)',
        }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative max-w-2xl mx-auto text-center"
        >
          <div className="text-5xl mb-5">🚀</div>
          <h2 className={`text-3xl font-black mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Ready to Find Your Next Hire?
          </h2>
          <p className={`text-sm mb-8 ${isDark ? 'text-white/45' : 'text-gray-600'}`}>
            Add your API key, paste a job description, and let AI do the sourcing, matching, and outreach.
          </p>
          <motion.button
            onClick={onGetStarted} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className={`inline-flex items-center gap-2.5 px-9 py-4 rounded-2xl font-black text-lg text-white shadow-2xl transition-all ${
              isDark
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 shadow-orange-500/30'
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-500/25'
            }`}
          >
            Launch TalentScout AI <ArrowRight size={20} />
          </motion.button>
          <p className={`text-xs mt-5 ${isDark ? 'text-white/25' : 'text-gray-500'}`}>
            No data leaves your browser · Open source · Free for Groq + Gemini
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
