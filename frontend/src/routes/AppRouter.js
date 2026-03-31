import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';

// Pages
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import RecordPage from '../pages/RecordPage';
import HistoryPage from '../pages/HistoryPage';
import NotFoundPage from '../pages/NotFoundPage';

// Route guard
import ProtectedRoute from './ProtectedRoute';

/**
 * Application router with auth and protected route groups.
 */
const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes — Auth layout */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      </Route>

      {/* Protected routes — Main layout */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route path={ROUTES.RECORD} element={<RecordPage />} />
        <Route path={ROUTES.HISTORY} element={<HistoryPage />} />
      </Route>

      {/* Redirect root to dashboard */}
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />

      {/* 404 */}
      <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
