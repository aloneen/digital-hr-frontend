import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '../features/auth/pages/LoginPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import EmployeesPage from '../features/employees/pages/EmployeesPage';
import DepartmentsPage from '../features/departments/pages/DepartmentsPage';
import VacanciesPage from '../features/vacancies/pages/VacanciesPage';
import CandidatesPage from '../features/candidates/pages/CandidatesPage';
import OnboardingPage from '../features/onboarding/pages/OnboardingPage';
import AnalyticsPage from '../features/analytics/pages/AnalyticsPage';
import AppLayout from './layout/AppLayout';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/vacancies" element={<VacanciesPage />} />
          <Route path="/candidates" element={<CandidatesPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
