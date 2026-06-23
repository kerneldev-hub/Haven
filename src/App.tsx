/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { cn } from './lib/utils';
import { Layout } from './components/layout/Layout';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy loaded pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const ProjectPage = lazy(() => import('./pages/ProjectPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const SuccessPage = lazy(() => import('./pages/SuccessPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const IntegrationsPage = lazy(() => import('./pages/IntegrationsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DocsPage = lazy(() => import('./pages/DocsPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const DownloadPage = lazy(() => import('./pages/DownloadPage'));

function TopProgressBar() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] bg-primary/20 z-50 overflow-hidden">
      <div className="h-full bg-primary" style={{
        animation: 'progress-loading 1.5s infinite ease-in-out',
        width: '33.333%',
        borderRadius: '9999px'
      }} />
      <style>{`
        @keyframes progress-loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(150%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<TopProgressBar />}>
          <Routes>
            <Route path="/workspace" element={
              <ProtectedRoute>
                <Layout>
                  <HomePage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/welcome" element={<OnboardingPage />} />
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/download" element={<DownloadPage />} />
                  <Route path="/u/:username" element={<ProfilePage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/p/:projectId" element={<ProjectPage />} />
                  <Route path="/community" element={<CommunityPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/checkout/success" element={<SuccessPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/integrations" element={<IntegrationsPage />} />
                  <Route path="/docs/*" element={<DocsPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Layout>
            } />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}



