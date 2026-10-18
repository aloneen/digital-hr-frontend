export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
};

export type AuthUser = {
  id: number;
  email: string;
  role: string;
  departmentId?: number | null;
  employeeId?: number | null;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  role: string;
  userId: number;
  email: string;
  departmentId?: number | null;
};

export type GoogleLoginRequest = {
  idToken: string;
  email?: string;
  name?: string;
  picture?: string;
};
