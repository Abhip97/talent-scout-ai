import Papa from 'papaparse';

const getDateString = () => new Date().toISOString().split('T')[0];

export const exportToCSV = (shortlist) => {
  const rows = shortlist.map((c, i) => ({
    Rank: i + 1,
    Name: c.name,
    Title: c.title,
    'Current Company': c.currentCompany,
    Source: c.source === 'github' ? 'GitHub' : c.source === 'resume_upload' ? 'Resume Upload' : 'Talent Pool',
    'Match Score': c.totalMatch,
    'Interest Score': c.interestScore || '',
    'Combined Score': c.combinedScore || '',
    'Skill Score': c.scores?.skill || '',
    'Experience Score': c.scores?.experience || '',
    'Education Score': c.scores?.education || '',
    'Location Score': c.scores?.location || '',
    'Availability Score': c.scores?.availability || '',
    Skills: (c.skills || []).join('; '),
    'Years Experience': c.yearsExperience,
    Education: c.education ? `${c.education.degree} in ${c.education.field} from ${c.education.college}` : '',
    Location: c.location,
    'Job Seeking Status': c.jobSeekingStatus,
    'Notice Period': c.noticePeriod,
    'Expected Salary (LPA Min)': c.expectedSalaryLPA?.min || '',
    'Expected Salary (LPA Max)': c.expectedSalaryLPA?.max || '',
    'Open to Relocate': c.openToRelocate ? 'Yes' : 'No',
    Email: c.email || '',
    'LinkedIn': c.linkedinUrl || '',
    'GitHub URL': c.githubUrl || '',
    'Recommended Action': c.interestBreakdown?.recommendedAction || '',
    'Overall Summary': c.interestBreakdown?.overallSummary || '',
  }));

  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `talentscout_shortlist_${getDateString()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToJSON = (shortlist) => {
  const data = {
    exportedAt: new Date().toISOString(),
    totalCandidates: shortlist.length,
    shortlist: shortlist.map((c, i) => ({
      rank: i + 1,
      candidate: {
        id: c.id,
        name: c.name,
        title: c.title,
        currentCompany: c.currentCompany,
        source: c.source,
        skills: c.skills,
        yearsExperience: c.yearsExperience,
        education: c.education,
        location: c.location,
        jobSeekingStatus: c.jobSeekingStatus,
        noticePeriod: c.noticePeriod,
        expectedSalaryLPA: c.expectedSalaryLPA,
        openToRelocate: c.openToRelocate,
        email: c.email,
        linkedinUrl: c.linkedinUrl,
        githubUrl: c.githubUrl,
      },
      scores: {
        match: c.totalMatch,
        interest: c.interestScore,
        combined: c.combinedScore,
        breakdown: c.scores,
      },
      matchExplanations: c.explanations,
      interest: c.interestBreakdown,
      conversation: c.conversation || [],
    })),
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `talentscout_shortlist_${getDateString()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
