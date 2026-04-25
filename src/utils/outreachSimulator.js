import { callLLM, parseJSON } from './llmClient.js';

const buildAutoSystemPrompt = (candidate, parsedJD) => `You are simulating a realistic recruitment outreach conversation between a recruiter from ${parsedJD.company || 'our company'} and a candidate named ${candidate.name}.

CANDIDATE PROFILE:
${JSON.stringify(candidate, null, 2)}

JOB DETAILS:
Title: ${parsedJD.title}
Company: ${parsedJD.company || 'our company'}
Required Skills: ${(parsedJD.requiredSkills || []).join(', ')}
Experience: ${parsedJD.minExperience}-${parsedJD.maxExperience} years
Location: ${parsedJD.location} (${parsedJD.workMode})
Salary: ${parsedJD.salaryRange?.min || 0}-${parsedJD.salaryRange?.max || 0} ${parsedJD.salaryRange?.currency || 'LPA'}

SIMULATION RULES:
- Generate a 5-message conversation alternating recruiter/candidate (recruiter first, candidate last)
- The recruiter should be professional, personalized, mention specific things from the candidate's background
- The candidate's responses MUST be realistic based on their profile:
  * jobSeekingStatus='active': Enthusiastic, asks about team and growth, quick to show interest
  * jobSeekingStatus='passive': Cautious, leads with salary questions, needs to be sold on the opportunity
  * jobSeekingStatus='not-looking': Polite initial decline, might warm up if the offer is exceptional
  * If candidate salary expectation is ABOVE JD range: Raises salary concerns explicitly
  * If candidate salary expectation is BELOW JD range: Shows strong interest in financial upside
  * If location mismatch + not open to relocate: Asks about remote options, shows hesitation
  * If notice period is 60-90 days: Mentions timeline as a potential constraint
  * If candidate is from Google/Microsoft/Amazon: Needs strong sell, asks about equity/impact/team
  * If candidate is from TCS/Infosys/Wipro: More interested in stability, modern stack, product culture

Respond ONLY in JSON (no markdown, no backticks):
{"messages": [{"role": "recruiter", "message": "..."}, {"role": "candidate", "message": "..."}, {"role": "recruiter", "message": "..."}, {"role": "candidate", "message": "..."}, {"role": "recruiter", "message": "..."}]}`;

const buildCoPilotDraftPrompt = (candidate, parsedJD) => `You are a recruiter at ${parsedJD.company || 'our company'} drafting an outreach message to ${candidate.name}.

CANDIDATE PROFILE:
Name: ${candidate.name}
Title: ${candidate.title}
Company: ${candidate.currentCompany}
Skills: ${(candidate.skills || []).join(', ')}
Experience: ${candidate.yearsExperience} years
Education: ${candidate.education?.degree} from ${candidate.education?.college}
Location: ${candidate.location}

JOB: ${parsedJD.title} at ${parsedJD.company || 'our company'}
Required skills: ${(parsedJD.requiredSkills || []).join(', ')}
Salary: ${parsedJD.salaryRange?.min || 0}-${parsedJD.salaryRange?.max || 0} ${parsedJD.salaryRange?.currency || 'LPA'}
Location: ${parsedJD.location} (${parsedJD.workMode})

Draft a personalized, professional recruiter outreach message. Be specific about the candidate's background. 2-3 paragraphs. No subject line, just the message body.`;

const buildCandidateResponsePrompt = (candidate, recruiterMessage, conversationHistory) => `You are playing the role of ${candidate.name} in a recruitment conversation.

YOUR PROFILE:
${JSON.stringify({ name: candidate.name, title: candidate.title, currentCompany: candidate.currentCompany, skills: candidate.skills, yearsExperience: candidate.yearsExperience, jobSeekingStatus: candidate.jobSeekingStatus, expectedSalaryLPA: candidate.expectedSalaryLPA, noticePeriod: candidate.noticePeriod, location: candidate.location, openToRelocate: candidate.openToRelocate }, null, 2)}

CONVERSATION SO FAR:
${conversationHistory.map((m) => `${m.role === 'recruiter' ? 'Recruiter' : 'You'}: ${m.message}`).join('\n')}

The recruiter just said: "${recruiterMessage}"

Respond in character as ${candidate.name}. Be realistic — your response should reflect your job seeking status (${candidate.jobSeekingStatus}), salary expectations (${candidate.expectedSalaryLPA?.min || 0}-${candidate.expectedSalaryLPA?.max || 0} LPA), notice period (${candidate.noticePeriod}), and location preferences (${candidate.location}, ${candidate.openToRelocate ? 'open to relocate' : 'not open to relocate'}). Keep response to 2-4 sentences.

Respond with ONLY the candidate's message text, no JSON, no quotes, no formatting.`;

const buildFollowUpDraftPrompt = (candidate, parsedJD, conversationHistory) => `You are a recruiter at ${parsedJD.company || 'our company'} drafting a follow-up message to ${candidate.name}.

CONVERSATION SO FAR:
${conversationHistory.map((m) => `${m.role === 'recruiter' ? 'Recruiter' : candidate.name}: ${m.message}`).join('\n')}

Draft the recruiter's next message. Be natural, responsive to what the candidate said, keep momentum going. 2-3 sentences. No formatting.`;

export const runAutoConversation = async (candidate, parsedJD, apiKey, provider = 'groq') => {
  const messages = [
    { role: 'system', content: buildAutoSystemPrompt(candidate, parsedJD) },
    { role: 'user', content: 'Generate the conversation now.' },
  ];

  try {
    const raw = await callLLM(provider, apiKey, messages, 2000);
    const parsed = parseJSON(raw);
    if (!Array.isArray(parsed.messages)) throw new Error('JSON_PARSE_ERROR');
    return parsed.messages;
  } catch (err) {
    if (err.message === 'JSON_PARSE_ERROR') {
      const raw = await callLLM(provider, apiKey, messages, 2000);
      const parsed = parseJSON(raw);
      if (!Array.isArray(parsed.messages)) return generateFallbackConversation(candidate, parsedJD);
      return parsed.messages;
    }
    throw err;
  }
};

export const draftInitialMessage = async (candidate, parsedJD, apiKey, provider = 'groq') => {
  const messages = [
    { role: 'system', content: buildCoPilotDraftPrompt(candidate, parsedJD) },
    { role: 'user', content: 'Draft the outreach message now.' },
  ];
  return callLLM(provider, apiKey, messages, 800);
};

export const getCandidateResponse = async (candidate, recruiterMessage, conversationHistory, apiKey, provider = 'groq') => {
  const messages = [
    { role: 'system', content: buildCandidateResponsePrompt(candidate, recruiterMessage, conversationHistory) },
    { role: 'user', content: 'Respond as the candidate.' },
  ];
  return callLLM(provider, apiKey, messages, 400);
};

export const draftFollowUp = async (candidate, parsedJD, conversationHistory, apiKey, provider = 'groq') => {
  const messages = [
    { role: 'system', content: buildFollowUpDraftPrompt(candidate, parsedJD, conversationHistory) },
    { role: 'user', content: 'Draft the follow-up message.' },
  ];
  return callLLM(provider, apiKey, messages, 400);
};

const generateFallbackConversation = (candidate, parsedJD) => {
  const isActive = candidate.jobSeekingStatus === 'active';
  return [
    {
      role: 'recruiter',
      message: `Hi ${candidate.name.split(' ')[0]}, I came across your profile and was impressed by your ${candidate.yearsExperience} years of experience with ${(candidate.skills || []).slice(0, 2).join(' and ')}. We have an exciting ${parsedJD.title} role at ${parsedJD.company || 'our company'} that seems like a great fit. Would you be open to a quick conversation?`,
    },
    {
      role: 'candidate',
      message: isActive
        ? `Hi! Thanks for reaching out. The role sounds interesting — I'm actively exploring opportunities. Could you share more about the team and the technical challenges involved?`
        : `Hi, thanks for the message. I'm not actively looking but I'm always open to hearing about interesting opportunities. What makes this role stand out?`,
    },
    {
      role: 'recruiter',
      message: `Great to hear from you! The role is on our ${parsedJD.department || 'platform'} team — you'd be working on ${(parsedJD.responsibilities || ['core infrastructure'])[0]}. The compensation is ${parsedJD.salaryRange?.min || 0}-${parsedJD.salaryRange?.max || 0} ${parsedJD.salaryRange?.currency || 'LPA'} + ESOPs. We're ${parsedJD.workMode || 'hybrid'} in ${parsedJD.location}.`,
    },
    {
      role: 'candidate',
      message: `That's a compelling opportunity. The salary range aligns with my expectations. What does the interview process look like and what's the expected timeline?`,
    },
    {
      role: 'recruiter',
      message: `The process is 3 rounds: system design, coding, and a culture fit with the CTO. We can move quickly — within 2 weeks. Can I schedule an initial 30-minute call this week to discuss further?`,
    },
  ];
};
