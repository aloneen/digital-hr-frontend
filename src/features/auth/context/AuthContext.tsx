import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import apiClient from '../../../shared/api/client';
import type { ApiResponse, AuthUser, GoogleLoginRequest, LoginRequest, LoginResponse } from '../../../shared/types/api';

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  loginWithGoogle: (payload: GoogleLoginRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const writeUserSession = useCallback((authUser: AuthUser | null, token?: string) => {
    setUser(authUser);

    if (authUser) {
      localStorage.setItem('digital-hr-user', JSON.stringify(authUser));
    } else {
      localStorage.removeItem('digital-hr-user');
    }

    if (token) {
      localStorage.setItem('digital-hr-token', token);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('digital-hr-token');

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await apiClient.get<ApiResponse<AuthUser>>('/auth/me');

      if (data?.success && data.data) {
        writeUserSession(data.data);
      } else {
        throw new Error('Invalid session');
      }
    } catch (error) {
      localStorage.removeItem('digital-hr-token');
      localStorage.removeItem('digital-hr-user');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [writeUserSession]);

  useEffect(() => {
    const savedUser = localStorage.getItem('digital-hr-user');

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser) as AuthUser);
      } catch {
        localStorage.removeItem('digital-hr-user');
      }
    }

    void refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (payload: LoginRequest) => {
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', payload);

    if (!data.success || !data.data?.token) {
      throw new Error(data.message || 'Login failed');
    }

    const nextUser: AuthUser = {
      id: data.data.userId,
      email: data.data.email,
      role: data.data.role,
      departmentId: data.data.departmentId ?? null,
      employeeId: null,
    };

    writeUserSession(nextUser, data.data.token);

    const meResponse = await apiClient.get<ApiResponse<AuthUser>>('/auth/me');
    if (meResponse.data.success && meResponse.data.data) {
      writeUserSession(meResponse.data.data);
    }
  }, [writeUserSession]);

  const loginWithGoogle = useCallback(async (payload: GoogleLoginRequest) => {
    try {
      const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/auth/google', payload);

      if (!data.success || !data.data?.token) {
        throw new Error(data.message || 'Google login failed');
      }

      const nextUser: AuthUser = {
        id: data.data.userId,
        email: data.data.email,
        role: data.data.role,
        departmentId: data.data.departmentId ?? null,
        employeeId: null,
      };

      writeUserSession(nextUser, data.data.token);

      const meResponse = await apiClient.get<ApiResponse<AuthUser>>('/auth/me');
      if (meResponse.data.success && meResponse.data.data) {
        writeUserSession(meResponse.data.data);
      }
    } catch (err: any) {
      const serverMessage = err?.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      throw err;
    }
  }, [writeUserSession]);

  const logout = useCallback(() => {
    localStorage.removeItem('digital-hr-token');
    localStorage.removeItem('digital-hr-user');
    setUser(null);
    window.location.href = '/login';
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      loginWithGoogle,
      logout,
      refreshUser,
    }),
    [isLoading, login, loginWithGoogle, logout, refreshUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
