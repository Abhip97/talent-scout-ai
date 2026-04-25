import Modal from '../UI/Modal.jsx';
import { useApp } from '../../context/AppContext.jsx';

const weights = [
  { label: 'Skill Match', pct: 40, color: 'bg-blue-500' },
  { label: 'Experience', pct: 25, color: 'bg-violet-500' },
  { label: 'Education', pct: 15, color: 'bg-cyan-500' },
  { label: 'Location', pct: 10, color: 'bg-emerald-500' },
  { label: 'Availability', pct: 10, color: 'bg-amber-500' },
];

const matchDimensions = [
  { name: 'Skill Match (40%)', desc: 'Jaccard intersection of candidate skills and required skills. Each matched nice-to-have adds 5 bonus points (max +15). Example: 7/9 required skills matched = 77 + 10 bonus = 87.' },
  { name: 'Experience Fit (25%)', desc: 'Proximity to required range. Exact range = 100, ±1yr = 80, ±2yr = 60, ±3yr = 40, beyond = 20.' },
  { name: 'Education (15%)', desc: 'Degree relevance: PhD = 100, M.Tech relevant = 90, B.Tech relevant = 80, MBA/MCA = 65, B.Sc relevant = 60, unrelated = 40.' },
  { name: 'Location (10%)', desc: 'Remote roles = 90 for all. Exact city match = 100. Open to relocate = 70-80. No match, no relocation = 20.' },
  { name: 'Availability (10%)', desc: 'Active + immediate = 100, active + 30d = 80, passive = 50, not-looking = 15. >60d notice: −20.' },
];

const interestDimensions = [
  { name: 'Enthusiasm (0-25)', desc: 'Did the candidate ask engaged questions? Use positive language? Show excitement about the role?' },
  { name: 'Availability (0-25)', desc: 'Is their timeline compatible? Did they confirm they can meet the notice period requirements?' },
  { name: 'Salary Alignment (0-25)', desc: 'Do their salary expectations match the JD range? Did they express satisfaction or concern about compensation?' },
  { name: 'Willingness to Proceed (0-25)', desc: 'Did they agree to next steps? Request an interview? Ask for more details? Or try to end the conversation?' },
];

export const AboutModal = () => {
  const { showAboutModal, setShowAboutModal } = useApp();

  return (
    <Modal open={showAboutModal} onClose={() => setShowAboutModal(false)} title="How TalentScout AI Scores Candidates" size="lg">
      <div className="p-6 space-y-8">
        <div>
          <h3 className="font-semibold text-white mb-3">Match Score Weights</h3>
          <div className="flex rounded-xl overflow-hidden h-8 mb-3">
            {weights.map((w) => (
              <div key={w.label} className={`${w.color} flex items-center justify-center text-xs font-bold text-white`} style={{ width: `${w.pct}%` }}>
                {w.pct}%
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {weights.map((w) => (
              <div key={w.label} className="flex items-center gap-1.5 text-xs text-zinc-300">
                <div className={`w-2.5 h-2.5 rounded-full ${w.color}`} />
                {w.label} ({w.pct}%)
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-3">Match Score Dimensions</h3>
          <div className="space-y-3">
            {matchDimensions.map((d) => (
              <div key={d.name} className="bg-zinc-900 rounded-xl p-3">
                <p className="text-sm font-medium text-zinc-200 mb-1">{d.name}</p>
                <p className="text-xs text-zinc-500 leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-3">Interest Score Dimensions</h3>
          <div className="space-y-3">
            {interestDimensions.map((d) => (
              <div key={d.name} className="bg-zinc-900 rounded-xl p-3">
                <p className="text-sm font-medium text-zinc-200 mb-1">{d.name}</p>
                <p className="text-xs text-zinc-500 leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/20 rounded-xl p-4">
          <h3 className="font-semibold text-white mb-2">Final Combined Score</h3>
          <code className="text-lg font-mono text-blue-300">Combined = 0.6 × Match + 0.4 × Interest</code>
          <p className="text-xs text-zinc-400 mt-2">
            Match score is weighted higher (60%) because it's deterministic and based on objective facts.
            Interest score (40%) adds signal from the AI-simulated conversation to gauge candidate enthusiasm and fit.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default AboutModal;
