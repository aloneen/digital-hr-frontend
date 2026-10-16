export type OnboardingTemplateItem = {
  id: number;
  templateId: number;
  title: string;
  description?: string | null;
  orderIndex: number;
};

export type OnboardingTemplate = {
  id: number;
  name: string;
  departmentId?: number | null;
  createdBy?: number | null;
  createdAt?: string | null;
  items: OnboardingTemplateItem[];
};

export type OnboardingTask = {
  id: number;
  checklistId: number;
  templateItemId?: number | null;
  title: string;
  description?: string | null;
  isCompleted: boolean;
  completedAt?: string | null;
  dueDate?: string | null;
};

export type OnboardingChecklist = {
  id: number;
  employeeId: number;
  templateId: number;
  status: string;
  createdAt?: string | null;
  completedAt?: string | null;
  tasks: OnboardingTask[];
};
