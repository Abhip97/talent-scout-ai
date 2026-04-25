import { callLLM, parseJSON } from './llmClient.js';

const SYSTEM_PROMPT = `You are a JD parser. Extract structured fields from this job description. Respond ONLY in valid JSON with no markdown formatting, no backticks, no explanation. Return exactly this structure:
{
  "title": "job title",
  "department": "department or null",
  "company": "company name or null",
  "requiredSkills": ["skill1", "skill2"],
  "niceToHaveSkills": ["skill1", "skill2"],
  "minExperience": 0,
  "maxExperience": 10,
  "educationRequired": "B.Tech/M.Tech/Any",
  "location": "city name",
  "workMode": "remote|hybrid|onsite",
  "salaryRange": {"min": 0, "max": 0, "currency": "LPA"},
  "responsibilities": ["resp1", "resp2"],
  "benefits": ["benefit1", "benefit2"]
}`;

export const parseJD = async (jdText, apiKey, provider = 'groq') => {
  if (!jdText || jdText.trim().length < 50) {
    throw new Error('Job description is too short. Please provide a more detailed JD.');
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: `Parse this job description:\n\n${jdText}` },
  ];

  let rawResponse;
  try {
    rawResponse = await callLLM(provider, apiKey, messages, 1500);
    const parsed = parseJSON(rawResponse);
    return sanitizeParsedJD(parsed);
  } catch (err) {
    if (err.message === 'JSON_PARSE_ERROR') {
      rawResponse = await callLLM(provider, apiKey, messages, 1500);
      const parsed = parseJSON(rawResponse);
      return sanitizeParsedJD(parsed);
    }
    throw err;
  }
};

const sanitizeParsedJD = (parsed) => {
  return {
    title: parsed.title || 'Software Engineer',
    department: parsed.department || null,
    company: parsed.company || null,
    requiredSkills: Array.isArray(parsed.requiredSkills) ? parsed.requiredSkills : [],
    niceToHaveSkills: Array.isArray(parsed.niceToHaveSkills) ? parsed.niceToHaveSkills : [],
    minExperience: Number(parsed.minExperience) || 0,
    maxExperience: Number(parsed.maxExperience) || 10,
    educationRequired: parsed.educationRequired || 'B.Tech',
    location: parsed.location || 'Bangalore',
    workMode: ['remote', 'hybrid', 'onsite'].includes(parsed.workMode) ? parsed.workMode : 'hybrid',
    salaryRange: {
      min: Number(parsed.salaryRange?.min) || 0,
      max: Number(parsed.salaryRange?.max) || 0,
      currency: parsed.salaryRange?.currency || 'LPA',
    },
    responsibilities: Array.isArray(parsed.responsibilities) ? parsed.responsibilities : [],
    benefits: Array.isArray(parsed.benefits) ? parsed.benefits : [],
  };
};
