import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { UserRole } from '../../types';
import { ShieldCheck, UserCheck, User, Sparkles } from 'lucide-react';

export const DemoRoleSwitcher: React.FC = () => {
  const { user, switchRole, isLoading } = useAuthStore();

  const roles: { role: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    { role: 'ADMIN', label: 'Admin', icon: <ShieldCheck className="w-3.5 h-3.5" />, color: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' },
    { role: 'AGENT', label: 'Agent', icon: <UserCheck className="w-3.5 h-3.5" />, color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
    { role: 'CUSTOMER', label: 'Customer', icon: <User className="w-3.5 h-3.5" />, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
  ];

  return (
    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
      <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-2">
        <Sparkles className="w-3 h-3 text-brand-500" />
        Demo Switch:
      </span>
      {roles.map((r) => {
        const isActive = user?.role === r.role;
        return (
          <button
            key={r.role}
            onClick={() => switchRole(r.role)}
            disabled={isLoading}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              isActive
                ? `${r.color} shadow-sm font-bold scale-[1.02]`
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {r.icon}
            {r.label}
          </button>
        );
      })}
    </div>
  );
};
