import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { LoginPage } from '@/pages/login/LoginPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { AttackExecutionPage } from '@/pages/attack/AttackExecutionPage';
import { ResultsPage } from '@/pages/results/ResultsPage';
import { ProjectManagementPage } from '@/pages/projects/ProjectManagementPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthLayout />,
    children: [{ index: true, element: <LoginPage /> }],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'attack', element: <AttackExecutionPage /> },
      { path: 'results', element: <ResultsPage /> },
      { path: 'results/:id', element: <ResultsPage /> },
      { path: 'projects', element: <ProjectManagementPage /> },
    ],
  },
]);
