export type DepartmentType = 'HEAD_OFFICE' | 'BLOCK' | 'CITY' | 'FRANCHISE';

export type Department = {
  id: number;
  name: string;
  type: DepartmentType;
  parentId?: number | null;
  city?: string | null;
  level?: number | null;
  isActive?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type DepartmentTree = Department & {
  children: DepartmentTree[];
};

export type DepartmentCreateRequest = {
  name: string;
  type: DepartmentType;
  parentId?: number | null;
  city?: string;
};

export type DepartmentUpdateRequest = {
  name?: string;
  type?: DepartmentType;
  parentId?: number | null;
  city?: string;
  isActive?: boolean;
};
