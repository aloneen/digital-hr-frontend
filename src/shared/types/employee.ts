export type EmployeeStatus = 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';

export type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  position: string;
  departmentId: number;
  city?: string | null;
  status: EmployeeStatus;
  hireDate?: string | null;
  terminationDate?: string | null;
  email?: string | null;
  phone?: string | null;
  birthDate?: string | null;
  iin?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type EmployeeCreateRequest = {
  firstName: string;
  lastName: string;
  middleName?: string | null;
  position: string;
  departmentId: number;
  city?: string | null;
  status?: EmployeeStatus;
  hireDate: string;
  terminationDate?: string | null;
  email?: string | null;
  phone?: string | null;
  birthDate?: string | null;
  iin?: string | null;
};

export type EmployeesPageResponse = {
  content: Employee[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};
