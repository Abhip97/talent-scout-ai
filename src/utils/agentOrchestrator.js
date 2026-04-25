import { parseJD } from './jdParser.js';
import { scoreAllCandidates } from './matchingEngine.js';
import { searchGitHubCandidates } from './githubDiscovery.js';
import { parseMultipleResumes, resetResumeCounter } from './resumeParser.js';
import { runAutoConversation } from './outreachSimulator.js';
import { scoreInterest } from './interestScorer.js';
import candidatesData from '../data/candidates.json';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const makeLog = (emoji, message, status = 'complete') => ({
  id: `log_${Date.now()}_${Math.random()}`,
  timestamp: new Date().toLocaleTimeString(),
  emoji,
  message,
  status,
});

export const runAgentPipeline = async ({
  jdText,
  sources,
  apiKey,
  agentMode,
  onLog,
  onStateChange,
  onParsedJD,
  onCandidatesFound,
  onMatchResults,
  onConversationUpdate,
  onShortlist,
  onError,
}) => {
  resetResumeCounter();

  try {
    onStateChange('PARSING_JD');
    onLog(makeLog('🔍', 'Parsing job description with AI...', 'running'));
    await sleep(500);

    let parsedJD;
    try {
      parsedJD = await parseJD(jdText, apiKey);
      onParsedJD(parsedJD);
      onLog(makeLog('✅', `JD parsed — "${parsedJD.title}"${parsedJD.company ? ` at ${parsedJD.company}` : ''} | Requires: ${(parsedJD.requiredSkills || []).slice(0, 4).join(', ')}`));
    } catch (err) {
      onLog(makeLog('❌', `JD parsing failed: ${err.message}`, 'error'));
      onError(err.message);
      onStateChange('IDLE');
      return;
    }

    await sleep(600);

    onStateChange('DISCOVERING_CANDIDATES');
    let allCandidates = [];

    if (sources.talentPool) {
      onLog(makeLog('📂', 'Loading talent pool (75 candidates)...', 'running'));
      await sleep(400);
      const pool = candidatesData.map((c) => ({ ...c, source: 'talent_pool' }));
      allCandidates = [...allCandidates, ...pool];
      onLog(makeLog('✅', `Loaded ${pool.length} candidates from talent pool`));
      await sleep(300);
    }

    if (sources.resumes && sources.resumes.length > 0) {
      onLog(makeLog('📄', `Parsing ${sources.resumes.length} resume(s)...`, 'running'));
      await sleep(300);

      const parsedResumes = await parseMultipleResumes(
        sources.resumes,
        apiKey,
        ({ fileName, status, candidate, error }) => {
          if (status === 'parsing') {
            onLog(makeLog('📄', `Parsing resume: ${fileName}...`, 'running'));
          } else if (status === 'done') {
            onLog(makeLog('✅', `Parsed ${fileName} — ${candidate.name}, ${candidate.title}`));
          } else if (status === 'error') {
            onLog(makeLog('❌', `Failed to parse ${fileName}: ${error}`, 'error'));
          }
        }
      );

      allCandidates = [...allCandidates, ...parsedResumes];
      if (parsedResumes.length > 0) {
        onLog(makeLog('✅', `Added ${parsedResumes.length} candidate(s) from uploaded resumes`));
      }
    }

    if (sources.github) {
      const primarySkills = (parsedJD.requiredSkills || []).slice(0, 3).join(', ');
      const loc = parsedJD.location || 'Bangalore';
      onLog(makeLog('🌐', `Searching GitHub for ${primarySkills} developers in ${loc}...`, 'running'));
      await sleep(400);

      try {
        const githubCandidates = await searchGitHubCandidates(parsedJD, (msg) => {
          onLog(makeLog('ℹ️', msg));
        });
        allCandidates = [...allCandidates, ...githubCandidates];
        onLog(makeLog('✅', `Found ${githubCandidates.length} candidates on GitHub`));
      } catch (err) {
        if (err.message === 'GITHUB_RATE_LIMIT' || err.message?.includes('rate limit')) {
          onLog(makeLog('⚠️', `GitHub API rate limit reached (10 req/min without auth). Using ${allCandidates.filter((c) => c.source === 'github').length} GitHub candidates found so far.`, 'complete'));
        } else {
          onLog(makeLog('⚠️', `GitHub search skipped: ${err.message}`, 'error'));
        }
      }
      await sleep(300);
    }

    if (allCandidates.length === 0) {
      onLog(makeLog('⚠️', 'No candidates found. Please enable at least one discovery source.', 'error'));
      onStateChange('IDLE');
      return;
    }

    onCandidatesFound(allCandidates);
    onLog(makeLog('📊', `Total candidates discovered: ${allCandidates.length} from ${[sources.talentPool && 'talent pool', sources.resumes?.length > 0 && 'resumes', sources.github && 'GitHub'].filter(Boolean).join(', ')}`));
    await sleep(600);

    onStateChange('MATCHING');
    onLog(makeLog('⚡', `Scoring ${allCandidates.length} candidates against requirements...`, 'running'));
    await sleep(700);

    const scored = scoreAllCandidates(allCandidates, parsedJD);
    const strongMatches = scored.filter((c) => c.totalMatch >= 60);
    const goodMatches = scored.filter((c) => c.totalMatch >= 40);
    onMatchResults(scored);
    onLog(makeLog('✅', `Scoring complete — ${strongMatches.length} strong matches (≥60), ${goodMatches.length} good matches (≥40) out of ${scored.length} candidates`));
    await sleep(600);

    onStateChange('OUTREACH');
    const topCandidates = scored.slice(0, 8);
    onLog(makeLog('💬', `Initiating AI outreach to top ${topCandidates.length} candidates...`, 'running'));
    await sleep(500);

    const conversations = {};

    for (const candidate of topCandidates) {
      onLog(makeLog('💬', `Conversing with ${candidate.name} (${candidate.title} at ${candidate.currentCompany})...`, 'running'));
      await sleep(300);

      try {
        let msgs;
        if (agentMode === 'auto' || agentMode !== 'copilot') {
          msgs = await runAutoConversation(candidate, parsedJD, apiKey);
        } else {
          msgs = [];
        }
        conversations[candidate.id] = msgs;
        onConversationUpdate({ candidateId: candidate.id, messages: msgs });
        onLog(makeLog('✅', `${candidate.name} responded — processing conversation...`));
      } catch (err) {
        const isRateLimit = err.message === 'RATE_LIMIT';
        onLog(makeLog(isRateLimit ? '⏳' : '❌', isRateLimit ? `Rate limit hit — waiting 10s before retrying ${candidate.name}...` : `Failed to contact ${candidate.name}: ${err.message}`, isRateLimit ? 'running' : 'error'));
        if (isRateLimit) {
          await sleep(10000);
          try {
            const msgs = await runAutoConversation(candidate, parsedJD, apiKey);
            conversations[candidate.id] = msgs;
            onConversationUpdate({ candidateId: candidate.id, messages: msgs });
            onLog(makeLog('✅', `${candidate.name} responded (retry succeeded)`));
          } catch {
            onLog(makeLog('❌', `Skipping ${candidate.name} after retry failure`, 'error'));
          }
        }
      }
      await sleep(500);
    }

    onStateChange('SCORING_INTEREST');
    onLog(makeLog('🧠', 'Analyzing conversation outcomes and scoring interest...', 'running'));
    await sleep(400);

    const interestScores = {};
    for (const candidate of topCandidates) {
      const msgs = conversations[candidate.id];
      if (!msgs) continue;

      try {
        const interest = await scoreInterest(candidate, parsedJD, msgs, apiKey);
        interestScores[candidate.id] = interest;
        onLog(makeLog('✅', `${candidate.name}: Interest ${interest.totalInterest}/100 — ${interest.recommendedAction}`));
      } catch (err) {
        onLog(makeLog('⚠️', `Could not score interest for ${candidate.name}: ${err.message}`, 'error'));
        interestScores[candidate.id] = { totalInterest: 50, recommendedAction: 'Send Detailed Role Brief', breakdown: {}, overallSummary: '', redFlags: [], greenFlags: [] };
      }
      await sleep(300);
    }

    onLog(makeLog('📋', 'Compiling final ranked shortlist...', 'running'));
    await sleep(500);

    const shortlist = topCandidates
      .map((c) => {
        const interest = interestScores[c.id] || { totalInterest: 50 };
        const combined = Math.round(0.6 * c.totalMatch + 0.4 * interest.totalInterest);
        return {
          ...c,
          interestScore: interest.totalInterest,
          interestBreakdown: interest,
          combinedScore: combined,
          conversation: conversations[c.id] || [],
        };
      })
      .sort((a, b) => b.combinedScore - a.combinedScore);

    onShortlist(shortlist);

    const top = shortlist[0];
    onLog(makeLog('🎉', `Shortlist ready! Top pick: ${top?.name} — Combined Score: ${top?.combinedScore}/100 (${top?.interestBreakdown?.recommendedAction || 'Schedule Interview'})`));
    await sleep(300);

    const avgMatch = Math.round(shortlist.reduce((s, c) => s + c.totalMatch, 0) / shortlist.length);
    const avgInterest = Math.round(shortlist.reduce((s, c) => s + c.interestScore, 0) / shortlist.length);
    onLog(makeLog('📊', `Pipeline complete — ${allCandidates.length} discovered, ${strongMatches.length} strong matches, ${shortlist.length} outreach, Avg Match: ${avgMatch}, Avg Interest: ${avgInterest}`));

    onStateChange('COMPLETE');
    return shortlist;
  } catch (err) {
    onLog(makeLog('❌', `Pipeline error: ${err.message}`, 'error'));
    onError(err.message);
    onStateChange('IDLE');
  }
};
