export type CandidateStage = 'NEW' | 'SCREENING' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED';

export type Candidate = {
  id: number;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  resumeUrl?: string | null;
  vacancyId: number;
  stage: CandidateStage;
  notes?: string | null;
  assignedTo?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};
