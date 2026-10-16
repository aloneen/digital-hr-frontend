export type VacancyStatus = 'OPEN' | 'CLOSED' | 'ON_HOLD';

export type Vacancy = {
  id: number;
  title: string;
  description?: string | null;
  departmentId: number;
  city?: string | null;
  status: VacancyStatus;
  requirements?: string | null;
  salaryRange?: string | null;
  createdBy?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};
