const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const callGroq = async (apiKey, messages, maxTokens = 2048, retries = 2) => {
  if (!apiKey) throw new Error('NO_API_KEY');

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL,
          messages,
          temperature: 0.7,
          max_tokens: maxTokens,
        }),
      });

      if (response.status === 429) {
        if (attempt < retries) {
          await sleep(10000);
          continue;
        }
        throw new Error('RATE_LIMIT');
      }

      if (response.status === 401) throw new Error('INVALID_API_KEY');
      if (!response.ok) {
        const err = await response.text().catch(() => response.statusText);
        throw new Error(`API_ERROR:${response.status}:${err}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (err) {
      if (err.message === 'RATE_LIMIT' || err.message === 'INVALID_API_KEY' || err.message === 'NO_API_KEY') throw err;
      if (err.name === 'TypeError' && err.message.includes('fetch')) throw new Error('NETWORK_ERROR');
      if (attempt === retries) throw err;
      await sleep(1000 * (attempt + 1));
    }
  }
};

export const parseJSON = (text) => {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```\s*$/i, '');
  cleaned = cleaned.replace(/^`/g, '').replace(/`$/g, '');
  try {
    return JSON.parse(cleaned);
  } catch {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error('JSON_PARSE_ERROR');
  }
};

export const getErrorMessage = (err) => {
  if (!err) return 'Unknown error';
  const msg = err.message || String(err);
  if (msg === 'NO_API_KEY') return 'No API key configured. Please add your Groq API key in Settings.';
  if (msg === 'INVALID_API_KEY') return 'Invalid API key. Please check your Groq API key in Settings.';
  if (msg === 'RATE_LIMIT') return 'Groq rate limit reached. Waiting 10 seconds before retrying...';
  if (msg === 'NETWORK_ERROR') return 'Network error. Please check your internet connection.';
  if (msg === 'JSON_PARSE_ERROR') return 'AI response could not be parsed. Retrying...';
  return msg;
};
