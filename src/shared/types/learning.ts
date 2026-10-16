export type CourseStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export type Course = {
  id: number;
  title: string;
  description: string;
  contentUrl?: string | null;
  durationHours: number;
  isActive: boolean;
  createdAt: string;
};

export type CourseAssignment = {
  id: number;
  courseId: number;
  courseTitle: string;
  courseDescription?: string | null;
  contentUrl?: string | null;
  durationHours?: number | null;
  employeeId: number;
  status: CourseStatus;
  progressPercent: number;
  assignedAt: string;
  completedAt?: string | null;
};

export type CourseProgressUpdateRequest = {
  progressPercent: number;
};

export type CourseAssignRequest = {
  courseId: number;
  employeeId: number;
};
