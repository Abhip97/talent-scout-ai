import { callLLM, parseJSON } from './llmClient.js';

const buildScoringPrompt = (candidate, parsedJD, messages) => `Analyze this recruitment conversation and score the candidate's genuine interest level.

CANDIDATE PROFILE:
Name: ${candidate.name}
Title: ${candidate.title}
Company: ${candidate.currentCompany}
Job Seeking Status: ${candidate.jobSeekingStatus}
Expected Salary: ${candidate.expectedSalaryLPA?.min || 0}-${candidate.expectedSalaryLPA?.max || 0} LPA
Notice Period: ${candidate.noticePeriod}
Location: ${candidate.location}, Open to Relocate: ${candidate.openToRelocate}

JD SUMMARY:
Title: ${parsedJD.title}
Company: ${parsedJD.company || 'our company'}
Salary: ${parsedJD.salaryRange?.min || 0}-${parsedJD.salaryRange?.max || 0} ${parsedJD.salaryRange?.currency || 'LPA'}
Location: ${parsedJD.location} (${parsedJD.workMode})

CONVERSATION:
${messages.map((m) => `${m.role === 'recruiter' ? 'Recruiter' : candidate.name}: ${m.message}`).join('\n\n')}

Score these dimensions (each 0-25, total 0-100):
1. ENTHUSIASM (0-25): Engaged questions about role/team/product? Positive language? Or dismissive?
2. AVAILABILITY (0-25): Timeline compatible? Willing to work with notice period? Personal constraints?
3. SALARY ALIGNMENT (0-25): Expectations match JD range? Satisfaction or concern about compensation?
4. WILLINGNESS TO PROCEED (0-25): Agreed to next steps? Requested interview? Or ended conversation?

Respond ONLY in JSON (no markdown, no backticks):
{
  "totalInterest": 0,
  "breakdown": {
    "enthusiasm": {"score": 0, "reason": "brief explanation"},
    "availability": {"score": 0, "reason": "brief explanation"},
    "salaryAlignment": {"score": 0, "reason": "brief explanation"},
    "willingnessToProceed": {"score": 0, "reason": "brief explanation"}
  },
  "overallSummary": "2-3 sentence summary of candidate's interest level and key signals",
  "recommendedAction": "Schedule Interview|Send Detailed Role Brief|Negotiate Compensation|Fast-Track (High Interest)|Add to Talent Pipeline|Do Not Pursue",
  "redFlags": ["concern1"],
  "greenFlags": ["positive signal1"]
}`;

export const scoreInterest = async (candidate, parsedJD, messages, apiKey, provider = 'groq') => {
  if (!messages || messages.length === 0) {
    return generateDefaultScore(candidate, parsedJD);
  }

  const systemMessages = [
    { role: 'system', content: buildScoringPrompt(candidate, parsedJD, messages) },
    { role: 'user', content: 'Score the candidate interest now.' },
  ];

  try {
    const raw = await callLLM(provider, apiKey, systemMessages, 1800);
    const parsed = parseJSON(raw);
    return sanitizeInterestScore(parsed, candidate, parsedJD);
  } catch (err) {
    if (err.message === 'JSON_PARSE_ERROR') {
      return generateDefaultScore(candidate, parsedJD);
    }
    throw err;
  }
};

const sanitizeInterestScore = (parsed, candidate) => {
  const breakdown = parsed.breakdown || {};
  const enthusiasm = Number(breakdown.enthusiasm?.score) || 12;
  const availability = Number(breakdown.availability?.score) || 12;
  const salary = Number(breakdown.salaryAlignment?.score) || 12;
  const willingness = Number(breakdown.willingnessToProceed?.score) || 12;
  const total = parsed.totalInterest || (enthusiasm + availability + salary + willingness);

  const validActions = ['Schedule Interview', 'Send Detailed Role Brief', 'Negotiate Compensation', 'Fast-Track (High Interest)', 'Add to Talent Pipeline', 'Do Not Pursue'];
  const action = validActions.includes(parsed.recommendedAction)
    ? parsed.recommendedAction
    : total >= 70 ? 'Schedule Interview' : total >= 50 ? 'Send Detailed Role Brief' : 'Add to Talent Pipeline';

  return {
    totalInterest: Math.min(100, Math.max(0, total)),
    breakdown: {
      enthusiasm: { score: enthusiasm, reason: breakdown.enthusiasm?.reason || '' },
      availability: { score: availability, reason: breakdown.availability?.reason || '' },
      salaryAlignment: { score: salary, reason: breakdown.salaryAlignment?.reason || '' },
      willingnessToProceed: { score: willingness, reason: breakdown.willingnessToProceed?.reason || '' },
    },
    overallSummary: parsed.overallSummary || `${candidate.name} showed ${total >= 70 ? 'strong' : total >= 50 ? 'moderate' : 'limited'} interest in the role.`,
    recommendedAction: action,
    redFlags: Array.isArray(parsed.redFlags) ? parsed.redFlags : [],
    greenFlags: Array.isArray(parsed.greenFlags) ? parsed.greenFlags : [],
  };
};

const generateDefaultScore = (candidate, parsedJD) => {
  const statusScore = candidate.jobSeekingStatus === 'active' ? 20 : candidate.jobSeekingStatus === 'passive' ? 13 : 5;
  const salaryMin = candidate.expectedSalaryLPA?.min || 0;
  const salaryMax = candidate.expectedSalaryLPA?.max || 0;
  const jdMin = parsedJD.salaryRange?.min || 0;
  const jdMax = parsedJD.salaryRange?.max || 0;
  const salaryScore = (salaryMin <= jdMax && salaryMax >= jdMin) ? 20 : 10;
  const total = statusScore + salaryScore + 15 + 15;

  return {
    totalInterest: total,
    breakdown: {
      enthusiasm: { score: 15, reason: 'Based on job seeking status and profile' },
      availability: { score: 15, reason: 'Based on notice period' },
      salaryAlignment: { score: salaryScore, reason: 'Based on salary expectations vs JD range' },
      willingnessToProceed: { score: statusScore, reason: 'Based on job seeking status' },
    },
    overallSummary: `${candidate.name} is ${candidate.jobSeekingStatus === 'active' ? 'actively seeking opportunities' : 'passively open'}. Salary alignment ${(salaryMin <= jdMax && salaryMax >= jdMin) ? 'looks good' : 'may need discussion'}.`,
    recommendedAction: total >= 65 ? 'Schedule Interview' : total >= 45 ? 'Send Detailed Role Brief' : 'Add to Talent Pipeline',
    redFlags: [],
    greenFlags: candidate.jobSeekingStatus === 'active' ? ['Actively looking'] : [],
  };
};
