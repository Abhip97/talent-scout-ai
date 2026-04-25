import { Github, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { CandidateGrid } from './CandidateGrid.jsx';

export const GitHubSearch = () => {
  const { candidates, parsedJD, isRunning, sources, setSources } = useApp();
  const githubCandidates = candidates.filter((c) => c.source === 'github');

  return (
    <div className="space-y-4">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex gap-3">
        <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-400 space-y-1 leading-relaxed">
          <p>GitHub search uses the <strong className="text-zinc-200">public GitHub API</strong> — no auth needed, but limited to 10 requests/minute.</p>
          <p>The agent builds a search query from required skills + location and fetches up to 15 candidate profiles with their top repos.</p>
          <p>Enable GitHub search in the JD panel sources, then Run Agent to trigger it.</p>
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={sources.github}
          onChange={(e) => setSources((p) => ({ ...p, github: e.target.checked }))}
          className="w-4 h-4 accent-blue-500 cursor-pointer"
          disabled={isRunning}
        />
        <div>
          <span className="text-sm font-medium text-zinc-200 flex items-center gap-1.5">
            <Github size={14} /> Enable GitHub Discovery
          </span>
          <span className="text-xs text-zinc-500">Searches public profiles by skills and location</span>
        </div>
      </label>

      {githubCandidates.length > 0 ? (
        <CandidateGrid
          candidates={githubCandidates}
          parsedJD={parsedJD}
          emptyMessage="No GitHub candidates found yet."
        />
      ) : (
        <div className="text-center py-12 text-zinc-600">
          <Github size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">GitHub candidates will appear here after the agent runs</p>
        </div>
      )}
    </div>
  );
};

export default GitHubSearch;
