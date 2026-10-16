export type EmployeeProfile = {
  userId: number;
  employeeId?: number | null;
  email: string;
  role: string;

  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  middleName?: string | null;

  company?: string | null;
  position?: string | null;
  departmentId?: number | null;
  departmentName?: string | null;
  city?: string | null;
  managerName?: string | null;

  hireDate?: string | null;
  vacationDaysTotal?: number | null;
  vacationDaysUsed?: number | null;
  vacationDaysLeft?: number | null;

  activeCoursesCount?: number | null;
  completedCoursesCount?: number | null;
  unreadNotificationsCount?: number | null;
};
