export type HeadcountItem = {
  city: string;
  count: number;
};

export type VacancyStatsItem = {
  status: string;
  count: number;
};

export type TurnoverItem = {
  year: number;
  month: number;
  hired: number;
  terminated: number;
};

export type HiringStatsItem = {
  year: number;
  month: number;
  count: number;
};

export type DashboardSummary = {
  totalEmployees: number;
  activeEmployees: number;
  openVacancies: number;
  candidatesInProgress: number;
  onboardingInProgress: number;
  headcountByCity: HeadcountItem[];
};
