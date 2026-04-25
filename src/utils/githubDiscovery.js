const GITHUB_API = 'https://api.github.com';
const MAX_CANDIDATES = 15;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const buildSearchQuery = (parsedJD) => {
  const skills = (parsedJD.requiredSkills || []).slice(0, 3);
  const location = parsedJD.location || '';
  const langSkills = skills.map((s) => s.toLowerCase());

  const langMap = {
    python: 'python', java: 'java', javascript: 'javascript', typescript: 'typescript',
    golang: 'go', go: 'go', rust: 'rust', 'c++': 'cpp', kotlin: 'kotlin', swift: 'swift',
    ruby: 'ruby', php: 'php', scala: 'scala',
  };

  const languages = langSkills.filter((s) => langMap[s]).map((s) => `language:${langMap[s]}`).slice(0, 2);
  const locationPart = location ? `location:${location.split(' ')[0].toLowerCase()}` : '';

  return [locationPart, ...languages].filter(Boolean).join(' ');
};

const inferSkillsFromRepos = (repos) => {
  const languageMap = {};
  for (const repo of repos) {
    if (repo.language) {
      languageMap[repo.language] = (languageMap[repo.language] || 0) + 1;
    }
    const topics = repo.topics || [];
    for (const topic of topics) {
      if (topic.length > 2) languageMap[topic] = (languageMap[topic] || 0) + 1;
    }
  }
  return Object.entries(languageMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1));
};

const userToCandidate = (user, repos) => {
  const skills = inferSkillsFromRepos(repos);
  return {
    id: `GH_${user.login}`,
    name: user.name || user.login,
    title: user.bio ? user.bio.split('.')[0].slice(0, 60) : 'Software Engineer',
    skills: skills.length > 0 ? skills : ['Git'],
    yearsExperience: Math.min(20, Math.floor(user.public_repos / 8) + 1),
    education: { degree: 'B.Tech', field: 'Computer Science', college: 'Unknown' },
    location: user.location || 'Unknown',
    currentCompany: user.company ? user.company.replace(/^@/, '') : 'Unknown',
    jobSeekingStatus: 'passive',
    expectedSalaryLPA: { min: 15, max: 30 },
    noticePeriod: '30 days',
    bio: user.bio || `GitHub developer with ${user.public_repos} public repositories and ${user.followers} followers.`,
    preferredRole: 'Software Engineer',
    openToRelocate: false,
    githubUrl: user.html_url,
    linkedinUrl: null,
    email: user.email || null,
    phone: null,
    avatarUrl: user.avatar_url,
    followers: user.followers,
    publicRepos: user.public_repos,
    source: 'github',
  };
};

export const searchGitHubCandidates = async (parsedJD, onLog) => {
  const query = buildSearchQuery(parsedJD);
  if (!query) {
    onLog?.('No searchable skills found for GitHub query');
    return [];
  }

  try {
    const searchUrl = `${GITHUB_API}/search/users?q=${encodeURIComponent(query)}&per_page=20&sort=followers`;
    const searchRes = await fetch(searchUrl, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });

    if (searchRes.status === 403) {
      throw new Error('GITHUB_RATE_LIMIT');
    }
    if (!searchRes.ok) {
      throw new Error(`GitHub API error: ${searchRes.status}`);
    }

    const searchData = await searchRes.json();
    const users = (searchData.items || []).filter((u) => u.type === 'User').slice(0, MAX_CANDIDATES);

    const candidates = [];
    for (const user of users) {
      try {
        await sleep(200);
        const [profileRes, reposRes] = await Promise.all([
          fetch(`${GITHUB_API}/users/${user.login}`, { headers: { Accept: 'application/vnd.github.v3+json' } }),
          fetch(`${GITHUB_API}/users/${user.login}/repos?sort=stars&per_page=5`, { headers: { Accept: 'application/vnd.github.v3+json' } }),
        ]);

        if (profileRes.status === 403 || reposRes.status === 403) {
          onLog?.('GitHub rate limit reached. Using candidates found so far.');
          break;
        }

        if (!profileRes.ok) continue;

        const profile = await profileRes.json();
        const repos = reposRes.ok ? await reposRes.json() : [];

        if (profile.name || profile.bio) {
          candidates.push(userToCandidate(profile, repos));
        }
      } catch {
        continue;
      }
    }

    return candidates;
  } catch (err) {
    if (err.message === 'GITHUB_RATE_LIMIT' || err.message?.includes('rate limit')) {
      throw new Error('GITHUB_RATE_LIMIT');
    }
    throw err;
  }
};
