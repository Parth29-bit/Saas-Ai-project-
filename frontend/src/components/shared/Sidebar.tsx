import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import {
  LayoutDashboard,
  Inbox,
  Ticket,
  Users,
  Bot,
  BookOpen,
  BarChart3,
  UserCheck,
  Zap,
  Bell,
  Settings,
  HelpCircle,
  X,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, setMobileOpen }) => {
  const { user } = useAuthStore();
  const role = user?.role || 'AGENT';

  const navItems = [
    { label: 'Overview', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" />, roles: ['SUPER_ADMIN', 'ADMIN'] },
    { label: 'Inbox', path: '/agent/inbox', icon: <Inbox className="w-4 h-4" />, roles: ['SUPER_ADMIN', 'ADMIN', 'AGENT'] },
    { label: 'Tickets', path: '/agent/tickets', icon: <Ticket className="w-4 h-4" />, roles: ['SUPER_ADMIN', 'ADMIN', 'AGENT', 'CUSTOMER'] },
    { label: 'Customers', path: '/admin/customers', icon: <Users className="w-4 h-4" />, roles: ['SUPER_ADMIN', 'ADMIN', 'AGENT'] },
    { label: 'AI Assistant', path: '/admin/ai-assistant', icon: <Bot className="w-4 h-4 text-brand-500" />, roles: ['SUPER_ADMIN', 'ADMIN', 'AGENT'] },
    { label: 'Knowledge Base', path: '/admin/kb', icon: <BookOpen className="w-4 h-4" />, roles: ['SUPER_ADMIN', 'ADMIN', 'AGENT'] },
    { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" />, roles: ['SUPER_ADMIN', 'ADMIN'] },
    { label: 'Team', path: '/admin/team', icon: <UserCheck className="w-4 h-4" />, roles: ['SUPER_ADMIN', 'ADMIN'] },
    { label: 'Automations', path: '/admin/automations', icon: <Zap className="w-4 h-4 text-amber-500" />, roles: ['SUPER_ADMIN', 'ADMIN'] },
    { label: 'Notifications', path: '/notifications', icon: <Bell className="w-4 h-4" />, roles: ['SUPER_ADMIN', 'ADMIN', 'AGENT', 'CUSTOMER'] },
    { label: 'Settings', path: '/settings', icon: <Settings className="w-4 h-4" />, roles: ['SUPER_ADMIN', 'ADMIN', 'AGENT', 'CUSTOMER'] },
  ];

  const filteredNav = navItems.filter((item) => item.roles.includes(role));

  const content = (
    <aside className="w-64 h-full bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between p-4 selection:bg-brand-500">
      <div>
        {/* Brand Logo Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 px-2">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">Supportly<span className="text-brand-500">.ai</span></span>
              <span className="block text-[10px] text-slate-400 font-medium">Enterprise AI Copilot</span>
            </div>
          </NavLink>
          {setMobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 space-y-1">
          {filteredNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Support Link */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <NavLink
          to="/help"
          className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Public Help Center</span>
        </NavLink>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block h-screen sticky top-0">{content}</div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileOpen && setMobileOpen(false)}
          />
          <div className="relative z-10 w-64 h-full">{content}</div>
        </div>
      )}
    </>
  );
};
