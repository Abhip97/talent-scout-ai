export const PROVIDERS = {
  groq: {
    id: 'groq',
    name: 'Groq',
    description: 'Llama 3.3 70B — Free, ultra-fast inference',
    model: 'llama-3.3-70b-versatile',
    keyPrefix: 'gsk_',
    placeholder: 'gsk_...',
    docsUrl: 'https://console.groq.com/keys',
    badge: 'Free',
    badgeStyle: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: '⚡',
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4o Mini — Reliable, widely tested',
    model: 'gpt-4o-mini',
    keyPrefix: 'sk-',
    placeholder: 'sk-...',
    docsUrl: 'https://platform.openai.com/api-keys',
    badge: 'Paid',
    badgeStyle: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    icon: '🤖',
  },
  anthropic: {
    id: 'anthropic',
    name: 'Claude',
    description: 'Claude 3.5 Haiku — Smart, nuanced reasoning',
    model: 'claude-3-5-haiku-20241022',
    keyPrefix: 'sk-ant-',
    placeholder: 'sk-ant-...',
    docsUrl: 'https://console.anthropic.com/settings/keys',
    badge: 'Paid',
    badgeStyle: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    icon: '🧠',
  },
  google: {
    id: 'google',
    name: 'Gemini',
    description: 'Gemini 1.5 Flash — Free, fast multimodal',
    model: 'gemini-1.5-flash',
    keyPrefix: 'AIza',
    placeholder: 'AIza...',
    docsUrl: 'https://aistudio.google.com/app/apikey',
    badge: 'Free',
    badgeStyle: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    icon: '✨',
  },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const callOpenAICompat = async (url, model, apiKey, messages, maxTokens) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: maxTokens }),
  });
  if (res.status === 429) throw new Error('RATE_LIMIT');
  if (res.status === 401) throw new Error('INVALID_API_KEY');
  if (!res.ok) throw new Error(`API_ERROR:${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content;
};

const callAnthropic = async (model, apiKey, messages, maxTokens) => {
  const system = messages.find((m) => m.role === 'system')?.content || '';
  const userMsgs = messages.filter((m) => m.role !== 'system');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model, system, messages: userMsgs, max_tokens: maxTokens }),
  });
  if (res.status === 429) throw new Error('RATE_LIMIT');
  if (res.status === 401 || res.status === 403) throw new Error('INVALID_API_KEY');
  if (!res.ok) throw new Error(`API_ERROR:${res.status}`);
  const data = await res.json();
  return data.content[0].text;
};

const callGemini = async (model, apiKey, messages, maxTokens) => {
  const systemMsg = messages.find((m) => m.role === 'system')?.content || '';
  const userMsgs = messages.filter((m) => m.role !== 'system');
  const contents = userMsgs.map((m, i) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: i === 0 && systemMsg ? `${systemMsg}\n\n${m.content}` : m.content }],
  }));
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents, generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 } }),
  });
  if (res.status === 429) throw new Error('RATE_LIMIT');
  if (res.status === 400 || res.status === 403) throw new Error('INVALID_API_KEY');
  if (!res.ok) throw new Error(`API_ERROR:${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
};

export const callLLM = async (provider, apiKey, messages, maxTokens = 2048, retries = 2) => {
  if (!apiKey) throw new Error('NO_API_KEY');
  const cfg = PROVIDERS[provider];
  if (!cfg) throw new Error(`Unknown provider: ${provider}`);

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (provider === 'anthropic') return await callAnthropic(cfg.model, apiKey, messages, maxTokens);
      if (provider === 'google') return await callGemini(cfg.model, apiKey, messages, maxTokens);
      const url = provider === 'groq'
        ? 'https://api.groq.com/openai/v1/chat/completions'
        : 'https://api.openai.com/v1/chat/completions';
      return await callOpenAICompat(url, cfg.model, apiKey, messages, maxTokens);
    } catch (err) {
      if (err.message === 'RATE_LIMIT') {
        if (attempt < retries) { await sleep(10000); continue; }
        throw err;
      }
      if (['INVALID_API_KEY', 'NO_API_KEY'].includes(err.message)) throw err;
      if (err.name === 'TypeError' && err.message.includes('fetch')) throw new Error('NETWORK_ERROR');
      if (attempt === retries) throw err;
      await sleep(1000 * (attempt + 1));
    }
  }
};

export const parseJSON = (text) => {
  let cleaned = text.trim()
    .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```\s*$/i, '')
    .replace(/^`/g, '').replace(/`$/g, '');
  try { return JSON.parse(cleaned); } catch {
    const match = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (match) {
      try { return JSON.parse(match[0]); } catch { /* fall through */ }
    }
    throw new Error('JSON_PARSE_ERROR');
  }
};

export const getErrorMessage = (err) => {
  if (!err) return 'Unknown error';
  const msg = err.message || String(err);
  if (msg === 'NO_API_KEY') return 'No API key configured. Add your key in Settings.';
  if (msg === 'INVALID_API_KEY') return 'Invalid API key. Check your key in Settings.';
  if (msg === 'RATE_LIMIT') return 'Rate limit reached. Retrying in 10s...';
  if (msg === 'NETWORK_ERROR') return 'Network error. Check your internet connection.';
  if (msg === 'JSON_PARSE_ERROR') return 'AI response parse failed. Retrying...';
  return msg;
};

// Backwards compat alias
export const callGroq = (apiKey, messages, maxTokens, retries) => callLLM('groq', apiKey, messages, maxTokens, retries);
