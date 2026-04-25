const normalizeSkill = (s) => s.toLowerCase().trim().replace(/[.\s]/g, '');

const skillAliases = {
  'nodejs': ['node', 'node.js', 'nodejs'],
  'reactjs': ['react', 'react.js', 'reactjs'],
  'vuejs': ['vue', 'vue.js', 'vuejs'],
  'postgresql': ['postgres', 'postgresql', 'psql'],
  'mongodb': ['mongo', 'mongodb'],
  'javascript': ['js', 'javascript', 'es6', 'es2015'],
  'typescript': ['ts', 'typescript'],
  'kubernetes': ['k8s', 'kubernetes'],
  'cicd': ['ci/cd', 'cicd', 'ci-cd'],
  'restapi': ['rest', 'restapi', 'rest api'],
  'githubactions': ['github actions', 'githubactions'],
  'springboot': ['spring boot', 'springboot', 'spring'],
};

const expandSkill = (skill) => {
  const norm = normalizeSkill(skill);
  for (const [canonical, aliases] of Object.entries(skillAliases)) {
    if (aliases.includes(norm) || canonical === norm) return canonical;
  }
  return norm;
};

const scoreSkills = (candidate, parsedJD) => {
  const candidateSkills = (candidate.skills || []).map(expandSkill);
  const required = (parsedJD.requiredSkills || []).map(expandSkill);
  const niceToHave = (parsedJD.niceToHaveSkills || []).map(expandSkill);

  if (required.length === 0) return 50;

  const matchedRequired = required.filter((s) => candidateSkills.includes(s));
  const requiredScore = (matchedRequired.length / required.length) * 100;

  const matchedNice = niceToHave.filter((s) => candidateSkills.includes(s));
  const niceBonus = Math.min(15, matchedNice.length * 5);

  return {
    score: Math.min(100, Math.round(requiredScore + niceBonus)),
    matchedRequired,
    missingRequired: required.filter((s) => !candidateSkills.includes(s)),
    matchedNice,
    total: required.length,
  };
};

const scoreExperience = (candidate, parsedJD) => {
  const years = candidate.yearsExperience || 0;
  const min = parsedJD.minExperience || 0;
  const max = parsedJD.maxExperience || 20;

  if (years >= min && years <= max) return 100;
  const diff = years < min ? min - years : years - max;
  if (diff <= 1) return 80;
  if (diff <= 2) return 60;
  if (diff <= 3) return 40;
  return 20;
};

const scoreEducation = (candidate, parsedJD) => {
  const edu = candidate.education;
  if (!edu) return 30;

  const degree = (edu.degree || '').toLowerCase();
  const field = (edu.field || '').toLowerCase();
  const jdReq = (parsedJD.educationRequired || '').toLowerCase();

  const relevantFields = ['computer science', 'information technology', 'data science', 'electronics', 'mathematics', 'statistics', 'software'];
  const isRelevantField = relevantFields.some((f) => field.includes(f));

  if (degree.includes('phd') || degree.includes('ph.d')) return 100;
  if ((degree.includes('m.tech') || degree.includes('m.sc') || degree.includes('mtech') || degree.includes('msc')) && isRelevantField) return 90;
  if ((degree.includes('b.tech') || degree.includes('be') || degree.includes('btech')) && isRelevantField) return 80;
  if (degree.includes('mba') || degree.includes('mca')) return 65;
  if (degree.includes('b.sc') || degree.includes('bca') || degree.includes('bsc')) return 60;
  if (isRelevantField) return 60;
  return 40;
};

const scoreLocation = (candidate, parsedJD) => {
  const candLoc = (candidate.location || '').toLowerCase();
  const jdLoc = (parsedJD.location || '').toLowerCase();
  const workMode = (parsedJD.workMode || 'hybrid').toLowerCase();
  const openToRelocate = candidate.openToRelocate;

  if (workMode === 'remote') return 90;

  const sameCity = jdLoc && (candLoc.includes(jdLoc) || jdLoc.includes(candLoc) || candLoc === 'remote');

  if (sameCity) return 100;
  if (openToRelocate && workMode === 'hybrid') return 70;
  if (openToRelocate) return 80;
  if (candLoc === 'remote' && workMode === 'hybrid') return 60;
  return 20;
};

const scoreAvailability = (candidate) => {
  const status = candidate.jobSeekingStatus || 'passive';
  const notice = (candidate.noticePeriod || '30 days').toLowerCase();

  const noticeDays = notice.includes('immediate') ? 0
    : notice.includes('15') ? 15
    : notice.includes('30') ? 30
    : notice.includes('45') ? 45
    : notice.includes('60') ? 60
    : notice.includes('90') ? 90
    : 30;

  let base = 0;
  if (status === 'active') {
    if (noticeDays === 0) base = 100;
    else if (noticeDays <= 15) base = 90;
    else if (noticeDays <= 30) base = 80;
    else base = 65;
  } else if (status === 'passive') {
    base = 50;
  } else {
    base = 15;
  }

  if (noticeDays > 60) base = Math.max(0, base - 20);
  return base;
};

const generateExplanations = (candidate, parsedJD, scores) => {
  const explanations = [];

  const { matchedRequired, missingRequired, matchedNice, total } = scores.skillDetails;
  explanations.push(
    `Matched ${matchedRequired.length}/${total} required skills: ${matchedRequired.slice(0, 6).join(', ') || 'none'}`
  );
  if (missingRequired.length > 0) {
    explanations.push(`Missing: ${missingRequired.slice(0, 4).join(', ')}`);
  }
  if (matchedNice.length > 0) {
    explanations.push(`Bonus: ${matchedNice.slice(0, 3).join(', ')} (nice-to-have)`);
  }

  const years = candidate.yearsExperience;
  const min = parsedJD.minExperience || 0;
  const max = parsedJD.maxExperience || 20;
  if (years >= min && years <= max) {
    explanations.push(`${years} years experience — fits ${min}-${max} year requirement perfectly`);
  } else if (years < min) {
    explanations.push(`${years} years experience — ${min - years} year(s) below ${min}-${max} year requirement`);
  } else {
    explanations.push(`${years} years experience — ${years - max} year(s) above ${min}-${max} year requirement`);
  }

  const edu = candidate.education;
  if (edu) {
    explanations.push(`${edu.degree} in ${edu.field} from ${edu.college}`);
  }

  const candLoc = candidate.location;
  const jdLoc = parsedJD.location;
  const workMode = parsedJD.workMode || 'hybrid';
  if (workMode === 'remote') {
    explanations.push('Role is remote — location no barrier');
  } else if (candLoc && jdLoc && (candLoc.toLowerCase().includes(jdLoc.toLowerCase()) || jdLoc.toLowerCase().includes(candLoc.toLowerCase()))) {
    explanations.push(`Based in ${candLoc} — exact location match for ${workMode} role`);
  } else if (candidate.openToRelocate) {
    explanations.push(`Based in ${candLoc} but open to relocate to ${jdLoc}`);
  } else {
    explanations.push(`Based in ${candLoc} — not open to relocate; JD requires ${jdLoc}`);
  }

  const status = candidate.jobSeekingStatus;
  const notice = candidate.noticePeriod;
  const statusLabel = status === 'active' ? 'Actively looking' : status === 'passive' ? 'Open to opportunities' : 'Not actively looking';
  explanations.push(`${statusLabel} — ${notice} notice period`);

  return explanations;
};

export const scoreAllCandidates = (candidates, parsedJD) => {
  return candidates
    .map((candidate) => {
      const skillResult = scoreSkills(candidate, parsedJD);
      const skillScore = typeof skillResult === 'object' ? skillResult.score : skillResult;
      const experienceScore = scoreExperience(candidate, parsedJD);
      const educationScore = scoreEducation(candidate, parsedJD);
      const locationScore = scoreLocation(candidate, parsedJD);
      const availScore = scoreAvailability(candidate);

      const totalMatch = Math.round(
        skillScore * 0.4 +
        experienceScore * 0.25 +
        educationScore * 0.15 +
        locationScore * 0.1 +
        availScore * 0.1
      );

      const scores = {
        skill: skillScore,
        experience: experienceScore,
        education: educationScore,
        location: locationScore,
        availability: availScore,
        skillDetails: typeof skillResult === 'object' ? skillResult : { matchedRequired: [], missingRequired: [], matchedNice: [], total: 0 },
      };

      const explanations = generateExplanations(candidate, parsedJD, { ...scores, skillDetails: scores.skillDetails });

      return {
        ...candidate,
        scores,
        totalMatch,
        explanations,
        recommendedForOutreach: totalMatch >= 55,
      };
    })
    .sort((a, b) => b.totalMatch - a.totalMatch);
};

export const getMatchedSkills = (candidate, parsedJD) => {
  const candidateSkills = (candidate.skills || []).map(expandSkill);
  const required = (parsedJD.requiredSkills || []).map(expandSkill);
  const niceToHave = (parsedJD.niceToHaveSkills || []).map(expandSkill);
  return {
    matched: required.filter((s) => candidateSkills.includes(s)),
    missing: required.filter((s) => !candidateSkills.includes(s)),
    niceMatched: niceToHave.filter((s) => candidateSkills.includes(s)),
  };
};
