# TalentScout AI 🎯

An autonomous AI recruiting agent that takes a job description and — in under 5 minutes — discovers candidates, scores their fit, simulates personalised recruiter outreach, and produces a ranked shortlist. Runs entirely in the browser; no backend or server required.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)

Deployed on Vercel: https://talent-scout-ai-pi.vercel.app/

---

## Demo

> Paste a JD → configure sources → click **Run Agent** → watch the 5-stage pipeline execute live.

The app starts with a marketing landing page. Click **Launch TalentScout AI** (or the navbar logo to return to it). Your "visited" state is saved in `localStorage` so repeat visits open the app directly.

---

## Features

- **AI-powered JD parsing** — extracts title, required skills, nice-to-have skills, experience range, salary, location, and work mode from any free-form job description
- **Multi-source candidate discovery** — 75-candidate built-in talent pool, live GitHub profile search (real URLs, public API), and PDF/DOCX resume uploads — all configurable before you run the agent
- **Weighted match scoring** — deterministic 5-dimension scoring (skills 40 %, experience 25 %, location 15 %, salary 10 %, education 10 %) with skill alias expansion (`node` = `nodejs` = `node.js`)
- **Auto & Co-Pilot outreach modes** — Auto runs the full conversation pipeline hands-free; Co-Pilot pauses for you to review and edit each recruiter message
- **Interest scoring** — 4-dimension LLM analysis of the simulated conversation (enthusiasm · availability · salary alignment · willingness to proceed)
- **Ranked shortlist** — combined score (60 % match + 40 % interest), sortable table, full candidate report modal, CSV and JSON export
- **4 AI providers** — Groq (free), OpenAI, Anthropic Claude, Google Gemini — switch from the navbar dropdown at any time
- **Dark & light theme** — persisted, with distinct design language per theme
- **No backend** — all API calls go directly from your browser to the AI provider of your choice

---

## Architecture & System Design

### 1. High-level system architecture

The entire application runs **client-side**. There is no backend server. All compute happens in the browser; the only outbound traffic is LLM API calls and the GitHub Search API.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Browser  (Client-Side Only)                        │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  React SPA  (Vite 5 + Tailwind v4 + Framer Motion)                  │    │
│  │                                                                     │    │
│  │   Landing Page  ──►  Main App (5-Stage Pipeline UI)                 │    │
│  │                              │                                      │    │
│  │              ┌───────────────▼───────────────────┐                  │    │
│  │              │        AppContext (State)          │                 │    │
│  │              │  jdText · parsedJD · candidates   │◄──localStorage   │    │
│  │              │  matchResults · conversations     │   (API keys,     │    │
│  │              │  shortlist · agentState · logs    │    theme,        │    │
│  │              └───────────────┬───────────────────┘    provider)     │    │
│  │                              │                                      │    │
│  │              ┌───────────────▼───────────────────┐                  │    │
│  │              │    agentOrchestrator.js            │                 │    │
│  │              │    (5-stage pipeline runner)       │                 │    │
│  │              └──┬────────┬────────┬────────┬──────┘                 │    │
│  │                 │        │        │        │                        │    │ 
│  │           jdParser  matchingEngine  outreachSimulator  interestScorer    │
│  │           resumeParser  fileReader  githubDiscovery  exportUtils    │    │
│  │                 │                             │                     │    │
│  │              ┌──▼─────────────────────────────▼──┐                  │    │
│  │              │        llmClient.js               │                  │    │
│  │              │   (unified multi-provider router)  │                 │    │
│  └──────────────┴──────────────┬────────────────────┴─────────────────┘     │
└─────────────────────────────────┼───────────────────────────────────────────┘
                                  │  HTTPS
          ┌───────────────────────┼───────────────────────┐
          ▼                       ▼                       ▼                   ▼
   ⚡ Groq API            🤖 OpenAI API         🧠 Anthropic API     ✨ Gemini API
  Llama 3.3 70B           GPT-4o Mini          Claude Haiku 3.5     1.5 Flash
  (Free tier)             (Paid)               (Paid)               (Free tier)

                    🐙 GitHub Search API  (public, no auth required)
```

---

### 2. Five-stage pipeline data flow

Each stage produces a typed output that feeds directly into the next stage.

```mermaid
flowchart TD
    START(["▶  User clicks Run Agent"]):::start --> S1

    subgraph S1["① JD Parsing  •  jdParser.js + LLM"]
        J1["Input: raw JD text\npaste · PDF · DOCX"]
        J2["LLM prompt:\nextract structured requirements"]
        J3["Output: ParsedJD\n{ title, company, requiredSkills[],\n  niceToHaveSkills[], yearsExp,\n  salaryRange, location, workMode }"]
        J1 --> J2 --> J3
    end

    S1 --> S2

    subgraph S2["② Candidate Discovery  •  3 parallel sources"]
        D1["📂 Talent Pool\ncandidates.json\n75 pre-built profiles"]
        D2["🐙 GitHub Search API\nquery by skills + location\nreal profile URLs"]
        D3["📄 Resume Upload\npdfjs / mammoth → text\nresumeParser.js + LLM"]
        D4["Merge & normalise\n→ Candidate[]"]
        D1 & D2 & D3 --> D4
    end

    S2 --> S3

    subgraph S3["③ Match Scoring  •  matchingEngine.js  (deterministic)"]
        M1["Input: Candidate[] + ParsedJD"]
        M2["Weighted engine\nSkills 40%  ·  Experience 25%\nLocation 15%  ·  Salary 10%\nEducation 10%"]
        M3["Output: ScoredCandidate[]\n{ totalMatch 0-100,\n  skillScore, expScore, … }"]
        M4["Sort ↓ by totalMatch\nSelect top 8 for outreach"]
        M1 --> M2 --> M3 --> M4
    end

    S3 --> S4

    subgraph S4["④ AI Outreach  •  outreachSimulator.js"]
        O1["Auto Mode\nLLM drafts recruiter message\n→ LLM simulates candidate reply\n→ 2-3 conversation turns"]
        O2["Co-Pilot Mode\nLLM drafts message\n→ Recruiter edits / approves\n→ LLM simulates reply"]
        O3["Output: Conversation[]\n{ role, message, timestamp }[]"]
        O1 & O2 --> O3
    end

    S4 --> S5

    subgraph S5["⑤ Interest Scoring  •  interestScorer.js + LLM"]
        I1["Input: Conversation + Candidate + ParsedJD"]
        I2["LLM analysis\nEnthusiasm · Availability\nSalary Alignment · Willingness"]
        I3["Output: InterestScore\n{ totalInterest 0-100,\n  breakdown{}, recommendedAction }"]
        I1 --> I2 --> I3
    end

    S5 --> FINAL

    subgraph FINAL["⑥ Final Ranking  •  RankedShortlist component"]
        F1["Combined = Match × 0.6 + Interest × 0.4"]
        F2["Sort descending → ShortlistedCandidate[]"]
        F3["Render ranked table\n+ candidate report modal"]
        F4["Export CSV  /  Export JSON"]
        F1 --> F2 --> F3 --> F4
    end

    classDef start fill:#f97316,color:#fff,stroke:none
```

---

### 3. LLM client — multi-provider routing & retry

```mermaid
flowchart LR
    IN["callLLM(provider, apiKey,\nmessages, maxTokens)"]

    IN --> R{provider?}

    R -- groq --> A["callOpenAICompat()\napi.groq.com/openai/v1/chat/completions\nmodel: llama-3.3-70b-versatile\nAuthorization: Bearer {key}"]
    R -- openai --> B["callOpenAICompat()\napi.openai.com/v1/chat/completions\nmodel: gpt-4o-mini\nAuthorization: Bearer {key}"]
    R -- anthropic --> C["callAnthropic()\napi.anthropic.com/v1/messages\nmodel: claude-3-5-haiku-20241022\nx-api-key · anthropic-version: 2023-06-01"]
    R -- google --> D["callGemini()\ngenerativelanguage.googleapis.com/…\nmodel: gemini-1.5-flash\n?key={apiKey}"]

    A & B & C & D --> E{HTTP status}

    E -- "429 Rate Limit" --> F["sleep 10 s\nretry ≤ 2 ×"]
    E -- "401 / 403 Auth" --> G["throw INVALID_API_KEY\n(no retry)"]
    E -- "Network error" --> H["throw NETWORK_ERROR\n(no retry)"]
    E -- "5xx / other" --> I["sleep 1s × attempt\nretry ≤ 2 ×"]
    E -- "200 OK" --> J["parseJSON(raw)\nstrip fences · regex fallback"]

    F --> R
    I --> R

    J -- "valid JSON" --> K["✅ return parsed object\nto caller"]
    J -- "JSON_PARSE_ERROR" --> L["⚠️ caller fallback\n(e.g. generateDefaultScore)"]
```

---

### 4. React component tree

```
App.jsx  (BrowserRouter + AppProvider)
└── MainLayout
    ├── Navbar              ← provider dropdown · API key · theme toggle · logo→home
    │
    ├── [AnimatePresence]
    │   ├── LandingPage     ← hero · stats · pipeline viz · feature cards · CTA
    │   │
    │   └── App view  (h-screen flex layout)
    │       ├── Sidebar     ← pipeline stage nav · stats · recent activity · run indicator
    │       └── main  (scrollable)
    │           ├── AgentDashboard
    │           │   ├── AgentControls   ← Auto/Co-Pilot toggle · Run Agent button
    │           │   ├── AgentStatusBar  ← progress bar · stage dots · percentage
    │           │   │
    │           │   ├── [AnimatePresence — active stage]
    │           │   │   ├── JDInput          stage: jd
    │           │   │   │   └── DragDropZone (resume upload, inline)
    │           │   │   ├── CandidateDiscovery  stage: discovery
    │           │   │   │   ├── TalentPool
    │           │   │   │   ├── GitHubSearch
    │           │   │   │   └── ResumeUpload
    │           │   │   ├── MatchResults     stage: matching
    │           │   │   │   ├── MatchFilters
    │           │   │   │   ├── CandidateCard  ×N
    │           │   │   │   │   └── ScoreBreakdown (expand)
    │           │   │   │   └── CompareView (modal)
    │           │   │   ├── OutreachPanel    stage: outreach
    │           │   │   │   ├── AutoModeRunner
    │           │   │   │   ├── CoPilotMode
    │           │   │   │   └── ConversationView  ×N
    │           │   │   └── RankedShortlist  stage: shortlist
    │           │   │       ├── ShortlistStats
    │           │   │       ├── ExportButtons
    │           │   │       └── Modal → CandidateReport
    │           │   │
    │           │   └── AgentActivityLog    ← live terminal log
    │           │
    │           └── Footer
    │
    ├── ApiKeyModal         ← tabs: Groq · OpenAI · Claude · Gemini
    └── AboutModal          ← scoring methodology explainer
```

---

### 5. State management & data flow

```mermaid
flowchart TD
    LS[("localStorage\napi_keys · provider\ntheme · visited")]

    subgraph CTX["AppContext  —  single source of truth"]
        direction LR
        C1["provider · apiKeys\n(active LLM provider + keys)"]
        C2["jdText · parsedJD\n(JD input + parsed struct)"]
        C3["candidates[]\n(all discovered)"]
        C4["matchResults[]\n(scored + ranked)"]
        C5["conversations{}\n(per candidateId)"]
        C6["shortlist[]\n(final combined rank)"]
        C7["agentState\nIDLE › PARSING_JD\n› DISCOVERING › MATCHING\n› OUTREACH › SCORING\n› COMPLETE"]
        C8["agentLogs[]\n(live activity feed)"]
        C9["sources{}\ntalentPool · github · resumes[]"]
    end

    CTX <--> LS

    UA["useAgent.js\ncalls runAgentPipeline()"]
    UA --> ORCH["agentOrchestrator.js"]

    ORCH -- "onParsedJD(jd)" --> C2
    ORCH -- "onCandidatesFound([])" --> C3
    ORCH -- "onMatchResults([])" --> C4
    ORCH -- "onConversationUpdate()" --> C5
    ORCH -- "onShortlist([])" --> C6
    ORCH -- "onStateChange(state)" --> C7
    ORCH -- "onLog(entry)" --> C8

    C7 -- "PARSING_JD → 'jd'\nDISCOVERING → 'discovery'\nMATCHING → 'matching'\nOUTREACH → 'outreach'\nCOMPLETE → 'shortlist'" --> ACTIVE["activeStage\n(controls which component renders)"]

    ACTIVE --> SB["Sidebar highlights active stage"]
    ACTIVE --> DB["AgentDashboard renders\ncorresponding stage component"]
```

---

## Quick start

### Prerequisites

- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- An API key from at least one provider:

| Provider | Model | Free? | Get key |
|---|---|---|---|
| **Groq** | Llama 3.3 70B | ✅ Free | [console.groq.com/keys](https://console.groq.com/keys) |
| **Google Gemini** | 1.5 Flash | ✅ Free | [aistudio.google.com](https://aistudio.google.com/app/apikey) |
| **OpenAI** | GPT-4o Mini | 💳 Paid | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| **Anthropic Claude** | Haiku 3.5 | 💳 Paid | [console.anthropic.com](https://console.anthropic.com/settings/keys) |

### Install & run

```bash
cd talent-scout-ai
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173), click **Add API Key** in the navbar, and paste your key.

### Production build

```bash
npm run build     # outputs to ./dist
npm run preview   # preview locally
```

---

## Usage walkthrough

**1. Add your API key** — Click **Add API Key** in the navbar. Keys for all 4 providers can be stored simultaneously; switch the active provider from the dropdown.

**2. Paste or upload a JD** — Paste text, upload a PDF/DOCX, or click *Try sample* to load a pre-built Senior Backend Engineer JD.

**3. Configure sources** — Check the discovery sources you want:
- 📂 **Talent Pool** — instant, 75 built-in candidates
- 🐙 **GitHub Search** — real GitHub profiles found by skill keywords
- 📄 **Upload Resumes** — drag-and-drop PDFs/DOCXs directly on the JD page

**4. Choose agent mode** — *Auto* (hands-free) or *Co-Pilot* (review each message).

**5. Click Run Agent** — watch the live activity log. Navigate between pipeline stages using the left sidebar at any point.

**6. Review the shortlist** — Click any candidate row for a full report. Sort by match, interest, or combined score. Export as CSV or JSON.

---

## Scoring methodology

### Match score (0–100)

| Dimension | Weight | Logic |
|---|---|---|
| Skills | 40% | Required skills weighted 3×, nice-to-have 1×; alias-aware matching |
| Experience | 25% | Candidate years vs JD minimum; capped at 100 |
| Location | 15% | Exact city > same region > open to relocate + work-mode bonus |
| Salary | 10% | Candidate range vs JD range overlap |
| Education | 10% | Degree level and field relevance |

### Interest score (0–100)

Scored by the LLM after reading the full simulated conversation:

| Dimension | Weight |
|---|---|
| Enthusiasm | 25% |
| Availability / notice period | 25% |
| Salary alignment | 25% |
| Willingness to proceed | 25% |

### Combined score

```
Combined = (Match × 0.6) + (Interest × 0.4)
```

---

## Project structure

```
talent-scout-ai/
├── src/
│   ├── App.jsx                      # Root — landing page ↔ main app routing
│   ├── context/
│   │   └── AppContext.jsx           # All global state (pipeline, theme, API keys, provider)
│   ├── hooks/
│   │   ├── useAgent.js              # Triggers the full 5-stage pipeline
│   │   ├── useLocalStorage.js       # Persistent state helper
│   │   └── useFileExtractor.js      # File reading hook
│   ├── utils/
│   │   ├── llmClient.js             # Unified LLM client — Groq / OpenAI / Claude / Gemini
│   │   ├── agentOrchestrator.js     # Orchestrates all 5 stages
│   │   ├── jdParser.js              # JD text → structured JSON via LLM
│   │   ├── matchingEngine.js        # Deterministic weighted match scoring
│   │   ├── outreachSimulator.js     # Recruiter message + candidate reply simulation
│   │   ├── interestScorer.js        # 4-dimension interest analysis via LLM
│   │   ├── resumeParser.js          # PDF/DOCX text → candidate profile via LLM
│   │   ├── fileReader.js            # pdfjs-dist (local worker) + mammoth text extraction
│   │   ├── githubDiscovery.js       # GitHub Search API integration
│   │   └── exportUtils.js          # CSV and JSON export helpers
│   ├── components/
│   │   ├── Landing/                 # Marketing landing page + in-app welcome screen
│   │   ├── Layout/                  # Navbar, Sidebar, Footer
│   │   ├── Agent/                   # Dashboard, controls, status bar, activity log
│   │   ├── JD/                      # JD input, file upload, parsed JD view
│   │   ├── Discovery/               # Talent pool browser, GitHub search, resume upload
│   │   ├── Matching/                # Results table, score breakdown, compare view
│   │   ├── Outreach/                # Auto mode runner, co-pilot mode, conversation view
│   │   ├── Shortlist/               # Ranked table, stats, export, candidate report modal
│   │   ├── Settings/                # API key modal (multi-provider), about modal
│   │   └── UI/                      # Shared primitives — ScoreBar, SkillTag, Modal, etc.
│   └── data/
│       └── candidates.json          # 75-candidate built-in talent pool
├── index.html
├── vite.config.js
├── package.json
└── requirements.txt
```

---

## Tech stack

| Layer | Technology |
|---|---|
| UI framework | React 18 |
| Build tool | Vite 5 |
| Styling | Tailwind CSS v4 (no config file — `@tailwindcss/vite` plugin) |
| Animations | Framer Motion |
| Icons | Lucide React |
| PDF parsing | pdfjs-dist 4.x (local worker via `?url` import — version-safe) |
| DOCX parsing | mammoth |
| CSV export | PapaParse |
| Routing | React Router v6 |

---

## Deployment

### Netlify / Vercel

```
Build command:  npm run build
Publish dir:    dist
```

No server-side environment variables are required — users enter their own API keys in the UI. To optionally pre-fill a Groq key:

```
VITE_GROQ_API_KEY=gsk_your_key_here
```

---

## Privacy

- **Everything runs in your browser.** No candidate data, resumes, or job descriptions are sent to any server other than the AI provider you choose.
- API keys are stored only in your browser's `localStorage` and never leave your device.
- GitHub search uses the public GitHub Search API — no token or authentication required.

---

## License

MIT — free to use, modify, and deploy.
