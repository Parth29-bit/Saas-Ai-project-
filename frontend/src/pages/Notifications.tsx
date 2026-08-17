import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Bell, Check, Ticket, UserCheck, AlertTriangle } from 'lucide-react';
import api from '../services/api';

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error('Notification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/all/read');
      fetchNotifications();
    } catch (err) {
      console.error('Mark read error:', err);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Notifications Center</h1>
          <p className="text-xs text-slate-500">In-app alerts for ticket assignments, SLA warnings, and AI copilot suggestions.</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleMarkAllRead} leftIcon={<Check className="w-3.5 h-3.5" />}>
          Mark All as Read
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <Card key={n._id} className={`flex items-start gap-4 p-4 ${!n.isRead ? 'bg-brand-50/40 dark:bg-brand-950/30 border-brand-200' : ''}`}>
            <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</h4>
                <span className="text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">{n.message}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
