import { callLLM, parseJSON } from './llmClient.js';

const SYSTEM_PROMPT = `You are a resume parser. Extract candidate information from this resume. Respond ONLY in valid JSON with no markdown, no backticks. Return exactly this structure:
{
  "name": "Full Name",
  "title": "Current or most recent job title",
  "skills": ["skill1", "skill2"],
  "yearsExperience": 0,
  "education": {"degree": "B.Tech", "field": "Computer Science", "college": "College Name"},
  "location": "City",
  "currentCompany": "Company Name",
  "jobSeekingStatus": "active",
  "expectedSalaryLPA": {"min": 0, "max": 0},
  "noticePeriod": "30 days",
  "bio": "2-3 sentence summary",
  "preferredRole": "What they want next",
  "openToRelocate": true,
  "email": "email or null",
  "phone": "phone or null",
  "githubUrl": "github url or null",
  "linkedinUrl": "linkedin url or null"
}`;

let resumeCounter = 0;

export const parseResume = async (resumeText, fileName, apiKey, provider = 'groq') => {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: `Parse this resume:\n\n${resumeText.slice(0, 6000)}` },
  ];

  try {
    const raw = await callLLM(provider, apiKey, messages, 1500);
    const parsed = parseJSON(raw);
    resumeCounter++;
    const id = `R${String(resumeCounter).padStart(3, '0')}`;
    return { id, ...sanitizeResumeParsed(parsed), source: 'resume_upload', originalFileName: fileName };
  } catch (err) {
    if (err.message === 'JSON_PARSE_ERROR') {
      const raw = await callLLM(provider, apiKey, messages, 1500);
      const parsed = parseJSON(raw);
      resumeCounter++;
      const id = `R${String(resumeCounter).padStart(3, '0')}`;
      return { id, ...sanitizeResumeParsed(parsed), source: 'resume_upload', originalFileName: fileName };
    }
    throw err;
  }
};

export const parseMultipleResumes = async (files, apiKey, onProgress, provider = 'groq') => {
  const results = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress?.({ current: i + 1, total: files.length, fileName: file.name, status: 'parsing' });
    try {
      const { extractTextFromFile } = await import('./fileReader.js');
      const text = await extractTextFromFile(file);
      const candidate = await parseResume(text, file.name, apiKey, provider);
      results.push(candidate);
      onProgress?.({ current: i + 1, total: files.length, fileName: file.name, status: 'done', candidate });
    } catch (err) {
      onProgress?.({ current: i + 1, total: files.length, fileName: file.name, status: 'error', error: err.message });
    }
  }
  return results;
};

const sanitizeResumeParsed = (parsed) => ({
  name: parsed.name || 'Unknown Candidate',
  title: parsed.title || 'Software Engineer',
  skills: Array.isArray(parsed.skills) ? parsed.skills.slice(0, 15) : [],
  yearsExperience: Number(parsed.yearsExperience) || 0,
  education: parsed.education || { degree: 'B.Tech', field: 'Computer Science', college: 'Unknown' },
  location: parsed.location || 'Unknown',
  currentCompany: parsed.currentCompany || 'Unknown',
  jobSeekingStatus: ['active', 'passive', 'not-looking'].includes(parsed.jobSeekingStatus) ? parsed.jobSeekingStatus : 'active',
  expectedSalaryLPA: { min: Number(parsed.expectedSalaryLPA?.min) || 0, max: Number(parsed.expectedSalaryLPA?.max) || 0 },
  noticePeriod: parsed.noticePeriod || '30 days',
  bio: parsed.bio || '',
  preferredRole: parsed.preferredRole || '',
  openToRelocate: Boolean(parsed.openToRelocate),
  email: parsed.email || null,
  phone: parsed.phone || null,
  githubUrl: parsed.githubUrl || null,
  linkedinUrl: parsed.linkedinUrl || null,
});

export const resetResumeCounter = () => { resumeCounter = 0; };
