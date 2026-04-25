import { useCallback } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { runAgentPipeline } from '../utils/agentOrchestrator.js';

export const useAgent = () => {
  const {
    apiKey, provider,
    jdText, agentMode, sources,
    setAgentState, addLog,
    setParsedJD, setCandidates, setMatchResults,
    updateConversation, setShortlist,
    setActiveStage, setError,
    isRunning, setIsRunning,
  } = useApp();

  const run = useCallback(async () => {
    if (isRunning) return;
    if (!jdText.trim()) { setError('Please provide a job description first.'); return; }
    if (!apiKey) { setError('Please add your API key in Settings to run the agent.'); return; }

    setIsRunning(true);
    setError(null);

    await runAgentPipeline({
      jdText, sources, apiKey, provider, agentMode,
      onLog: (entry) => addLog(entry),
      onStateChange: (state) => {
        setAgentState(state);
        const stageMap = {
          PARSING_JD: 'jd',
          DISCOVERING_CANDIDATES: 'discovery',
          MATCHING: 'matching',
          OUTREACH: 'outreach',
          SCORING_INTEREST: 'outreach',
          COMPLETE: 'shortlist',
        };
        if (stageMap[state]) setActiveStage(stageMap[state]);
      },
      onParsedJD: (jd) => setParsedJD(jd),
      onCandidatesFound: (candidates) => setCandidates(candidates),
      onMatchResults: (results) => setMatchResults(results),
      onConversationUpdate: ({ candidateId, messages }) => updateConversation(candidateId, messages),
      onShortlist: (list) => setShortlist(list),
      onError: (msg) => setError(msg),
    });

    setIsRunning(false);
  }, [apiKey, provider, jdText, agentMode, sources, isRunning, setIsRunning, setAgentState, addLog, setParsedJD, setCandidates, setMatchResults, updateConversation, setShortlist, setActiveStage, setError]);

  return { run };
};
