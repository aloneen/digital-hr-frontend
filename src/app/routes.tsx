import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '../features/auth/pages/LoginPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import EmployeesPage from '../features/employees/pages/EmployeesPage';
import DepartmentsPage from '../features/departments/pages/DepartmentsPage';
import VacanciesPage from '../features/vacancies/pages/VacanciesPage';
import CandidatesPage from '../features/candidates/pages/CandidatesPage';
import OnboardingPage from '../features/onboarding/pages/OnboardingPage';
import AnalyticsPage from '../features/analytics/pages/AnalyticsPage';
import ProfilePage from '../features/profile/pages/ProfilePage';
import RequestsPage from '../features/requests/pages/RequestsPage';
import AcademyPage from '../features/learning/pages/AcademyPage';
import AiJanaPage from '../features/ai/pages/AiJanaPage';
import AppLayout from './layout/AppLayout';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../features/auth/context/AuthContext';

function HomeRedirect() {
  const { user } = useAuth();
  if (user?.role === 'EMPLOYEE') {
    return <Navigate to="/profile" replace />;
  }
  return <Navigate to="/dashboard" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/academy" element={<AcademyPage />} />
          <Route path="/ai-assistant" element={<AiJanaPage />} />

          {/* Administrative / HR routes */}
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
