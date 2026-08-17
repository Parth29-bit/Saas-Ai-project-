import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BarChart3, TrendingUp, Star, Bot, Clock, Users } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import api from '../services/api';

export const Analytics: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/analytics/overview');
      setData(res.data);
    } catch (err) {
      console.error('Analytics load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const csatData = [
    { name: '5 Stars', value: 82, fill: '#10b981' },
    { name: '4 Stars', value: 14, fill: '#3b82f6' },
    { name: '3 Stars', value: 3, fill: '#f59e0b' },
    { name: '1-2 Stars', value: 1, fill: '#ef4444' },
  ];

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Advanced Analytics & SLA Reporting
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          In-depth metrics on team performance, customer satisfaction, and AI automation efficiency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card hoverEffect className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">CSAT Score</span>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">4.8 / 5.0</p>
          <p className="text-xs text-emerald-600 font-bold">96.2% Positive Feedback</p>
        </Card>

        <Card hoverEffect className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Resolution Rate</span>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">44.8%</p>
          <p className="text-xs text-brand-600 font-bold">Deflected without Human Intervention</p>
        </Card>

        <Card hoverEffect className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Mean Resolution Time</span>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">1h 14m</p>
          <p className="text-xs text-emerald-600 font-bold">Within 4-hour SLA Target</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CSAT Rating Distribution */}
        <Card className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Customer Satisfaction Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={csatData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {csatData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Agent Leaderboard */}
        <Card className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Agent Productivity Leaderboard</h3>
          <div className="space-y-3">
            {(data?.charts?.agentPerformance || [
              { name: 'Jordan Lee', resolvedCount: 45, csat: '4.9' },
              { name: 'Sarah Chen', resolvedCount: 38, csat: '4.8' },
            ]).map((agent: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{agent.name}</span>
                  <span className="block text-[10px] text-slate-400">{agent.resolvedCount} tickets resolved</span>
                </div>
                <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {agent.csat}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
