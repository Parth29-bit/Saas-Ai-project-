import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import { Sidebar } from './components/shared/Sidebar';
import { Topbar } from './components/shared/Topbar';

// Page Imports
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Inbox } from './pages/Inbox';
import { Tickets } from './pages/Tickets';
import { AIWorkspace } from './pages/AIWorkspace';
import { Customers } from './pages/Customers';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { Analytics } from './pages/Analytics';
import { Team } from './pages/Team';
import { Automations } from './pages/Automations';
import { Notifications } from './pages/Notifications';
import { Settings } from './pages/Settings';
import { HelpCenter } from './pages/HelpCenter';

const DashboardLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const ProtectedRoute: React.FC<{ allowedRoles?: string[] }> = ({ allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-400">
        Loading Supportly AI Session...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/agent/tickets" replace />;
  }

  return <Outlet />;
};

export const App: React.FC = () => {
  const { fetchMe } = useAuthStore();
  const { isDark } = useThemeStore();

  useEffect(() => {
    fetchMe();
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Marketing Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/agent/inbox" element={<Inbox />} />
            <Route path="/agent/tickets" element={<Tickets />} />
            <Route path="/agent/tickets/:id" element={<Inbox />} />
            <Route path="/admin/ai-assistant" element={<AIWorkspace />} />
            <Route path="/admin/customers" element={<Customers />} />
            <Route path="/admin/kb" element={<KnowledgeBase />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/team" element={<Team />} />
            <Route path="/admin/automations" element={<Automations />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
