export interface Submission {
  id: string;
  type: 'photo' | 'video';
  data: string;
  overlay?: string;
  filter?: string;
  nickname: string;
  eventType: string;
  caption: string;
  socialConsent: boolean;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
}

const SUBMISSIONS_KEY = 'singshot_submissions';
const GALLERY_KEY = 'singshot_gallery';

const safeParse = <T>(value: string | null): T[] => {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
};

export const localDb = {
  getSubmissions(): Submission[] {
    return safeParse<Submission>(localStorage.getItem(SUBMISSIONS_KEY));
  },

  saveSubmissions(submissions: Submission[]): void {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
    const approved = submissions.filter((submission) => submission.status === 'approved');
    localStorage.setItem(GALLERY_KEY, JSON.stringify(approved));
  },

  addSubmission(submission: Submission): Submission[] {
    const submissions = this.getSubmissions();
    submissions.push(submission);
    this.saveSubmissions(submissions);
    return submissions;
  },

  getApprovedSubmissions(): Submission[] {
    return safeParse<Submission>(localStorage.getItem(GALLERY_KEY));
  },
};
