import { Users, Github, Upload, Database } from 'lucide-react';
import { TabSwitcher } from '../UI/TabSwitcher.jsx';
import { useState } from 'react';
import { TalentPool } from './TalentPool.jsx';
import { GitHubSearch } from './GitHubSearch.jsx';
import { ResumeUpload } from './ResumeUpload.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { AnimatedCounter } from '../UI/AnimatedCounter.jsx';

export const CandidateDiscovery = () => {
  const { candidates, isRunning } = useApp();
  const [tab, setTab] = useState('pool');

  const githubCount = candidates.filter((c) => c.source === 'github').length;
  const resumeCount = candidates.filter((c) => c.source === 'resume_upload').length;
  const poolCount = candidates.filter((c) => c.source === 'talent_pool').length;

  const tabs = [
    { id: 'pool', label: 'Talent Pool', icon: <Database size={13} />, count: poolCount || 75 },
    { id: 'github', label: 'GitHub', icon: <Github size={13} />, count: githubCount },
    { id: 'resumes', label: 'Resumes', icon: <Upload size={13} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Candidate Discovery</h2>
          <p className="text-sm text-zinc-500 mt-0.5">Browse sources and configure which ones the agent searches</p>
        </div>
        {candidates.length > 0 && (
          <div className="text-right">
            <div className="text-2xl font-black text-white">
              <AnimatedCounter value={candidates.length} />
            </div>
            <div className="text-xs text-zinc-500">candidates found</div>
          </div>
        )}
      </div>

      {candidates.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Talent Pool', val: poolCount, icon: <Database size={14} />, color: 'text-violet-400' },
            { label: 'GitHub', val: githubCount, icon: <Github size={14} />, color: 'text-emerald-400' },
            { label: 'Resumes', val: resumeCount, icon: <Upload size={14} />, color: 'text-blue-400' },
          ].map(({ label, val, icon, color }) => (
            <div key={label} className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-3 text-center">
              <div className={`flex items-center justify-center gap-1.5 text-xs mb-1 ${color}`}>{icon}{label}</div>
              <div className="text-xl font-bold text-white"><AnimatedCounter value={val} /></div>
            </div>
          ))}
        </div>
      )}

      <TabSwitcher tabs={tabs} active={tab} onChange={setTab} />

      <div>
        {tab === 'pool' && <TalentPool />}
        {tab === 'github' && <GitHubSearch />}
        {tab === 'resumes' && <ResumeUpload />}
      </div>
    </div>
  );
};

export default CandidateDiscovery;
