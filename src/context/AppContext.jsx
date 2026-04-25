import { createContext, useContext, useState, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

const AppContext = createContext(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export const AppProvider = ({ children }) => {
  const [apiKey, setApiKey] = useLocalStorage('talentscout_api_key', '');
  const [theme, setTheme] = useLocalStorage('talentscout_theme', 'dark');

  const [jdText, setJdText] = useState('');
  const [parsedJD, setParsedJD] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [matchResults, setMatchResults] = useState([]);
  const [conversations, setConversations] = useState({});
  const [shortlist, setShortlist] = useState([]);
  const [agentState, setAgentState] = useState('IDLE');
  const [agentLogs, setAgentLogs] = useState([]);
  const [activeStage, setActiveStage] = useState('jd');
  const [agentMode, setAgentMode] = useState('auto');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);
  const [sources, setSources] = useState({
    talentPool: true,
    github: false,
    resumes: [],
  });

  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const addLog = useCallback((entry) => {
    setAgentLogs((prev) => [...prev, { ...entry, id: entry.id || `log_${Date.now()}` }]);
  }, []);

  const clearLogs = useCallback(() => setAgentLogs([]), []);

  const updateConversation = useCallback((candidateId, messages) => {
    setConversations((prev) => ({ ...prev, [candidateId]: messages }));
  }, []);

  const resetPipeline = useCallback(() => {
    setParsedJD(null);
    setCandidates([]);
    setMatchResults([]);
    setConversations({});
    setShortlist([]);
    setAgentState('IDLE');
    setAgentLogs([]);
    setActiveStage('jd');
    setError(null);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, [setTheme]);

  const value = {
    apiKey, setApiKey,
    theme, toggleTheme,
    jdText, setJdText,
    parsedJD, setParsedJD,
    candidates, setCandidates,
    matchResults, setMatchResults,
    conversations, updateConversation,
    shortlist, setShortlist,
    agentState, setAgentState,
    agentLogs, addLog, clearLogs,
    activeStage, setActiveStage,
    agentMode, setAgentMode,
    isRunning, setIsRunning,
    error, setError,
    sources, setSources,
    showApiKeyModal, setShowApiKeyModal,
    showAboutModal, setShowAboutModal,
    resetPipeline,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
