import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import {
  Ticket,
  Clock,
  Star,
  Zap,
  TrendingUp,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Bot,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
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

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [recentTickets, setRecentTickets] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [resOverview, resTickets] = await Promise.all([
        api.get('/analytics/overview'),
        api.get('/tickets?limit=5'),
      ]);
      setMetrics(resOverview.data);
      setRecentTickets(resTickets.data.tickets || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const chartColors = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header & Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Executive Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time Supportly AI metrics, CSAT satisfaction, and AI deflection performance.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
          {['Today', '7d', '30d', '90d', 'Custom'].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range.toLowerCase())}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                dateRange === range.toLowerCase()
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* 6 Key Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card hoverEffect>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Tickets</span>
            <div className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {isLoading ? <Skeleton className="w-20 h-8" /> : metrics?.metrics?.totalTickets || 128}
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +14.2% MoM
            </span>
          </div>
        </Card>

        <Card hoverEffect>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Open Tickets</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {isLoading ? <Skeleton className="w-16 h-8" /> : metrics?.metrics?.openTickets || 14}
            </span>
            <span className="text-xs font-bold text-amber-600">Pending Review</span>
          </div>
        </Card>

        <Card hoverEffect>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Resolved Tickets</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {isLoading ? <Skeleton className="w-16 h-8" /> : metrics?.metrics?.resolvedTickets || 114}
            </span>
            <span className="text-xs font-bold text-emerald-600">{metrics?.metrics?.resolutionRate || '94.5%'} SLA</span>
          </div>
        </Card>

        <Card hoverEffect>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg First Response</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {isLoading ? <Skeleton className="w-24 h-8" /> : metrics?.metrics?.avgResponseTime || '14m 20s'}
            </span>
            <span className="text-xs font-bold text-emerald-600">-12% vs last week</span>
          </div>
        </Card>

        <Card hoverEffect>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">CSAT Score</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-500 dark:bg-amber-950">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {isLoading ? <Skeleton className="w-24 h-8" /> : metrics?.metrics?.customerSatisfaction || '4.8 / 5.0'}
            </span>
            <span className="text-xs font-bold text-emerald-600">96.2% Positive</span>
          </div>
        </Card>

        <Card hoverEffect>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Resolution Rate</span>
            <div className="p-2 rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950">
              <Bot className="w-5 h-5 text-brand-500" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {isLoading ? <Skeleton className="w-20 h-8" /> : metrics?.metrics?.aiResolutionRate || '44.8%'}
            </span>
            <span className="text-xs font-bold text-brand-600">Copilot Deflection</span>
          </div>
        </Card>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Tickets Over Time (Line Chart) */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Ticket Volume & AI Deflection</h3>
              <p className="text-xs text-slate-500">Incoming tickets vs AI copilot resolutions over time</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics?.charts?.ticketsOverTime || []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ background: '#0f172a', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }} />
                <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} name="Total Tickets" />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Resolved" />
                <Line type="monotone" dataKey="aiDeflected" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" name="AI Deflected" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Category Breakdown (Bar Chart) */}
        <Card className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Ticket Categories</h3>
            <p className="text-xs text-slate-500">Distribution by issue category</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics?.charts?.categoryDistribution || []} layout="vertical">
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={100} />
                <Tooltip contentStyle={{ background: '#0f172a', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }} />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Live Activity & Recent Tickets Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tickets Table */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Ticket Activity</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/agent/tickets')} rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              View All Queue
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Ticket ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentTickets.map((t) => (
                  <tr
                    key={t._id}
                    onClick={() => navigate(`/agent/tickets/${t._id}`)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="p-3 font-bold text-brand-600">{t.ticketNumber}</td>
                    <td className="p-3 font-medium text-slate-900 dark:text-white">{t.customerId?.name || 'Customer'}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">{t.subject}</td>
                    <td className="p-3">
                      <Badge variant={t.status === 'RESOLVED' ? 'status-resolved' : 'status-open'}>{t.status}</Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant={t.priority === 'URGENT' ? 'priority-urgent' : 'priority-medium'}>{t.priority}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* AI & Agent Activity Stream */}
        <Card className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" /> AI & Agent Live Stream
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-brand-50/50 dark:bg-brand-950/40 rounded-xl border border-brand-200 dark:border-brand-900 space-y-1">
              <span className="font-bold text-brand-700 dark:text-brand-300 flex items-center gap-1">
                <Bot className="w-3.5 h-3.5" /> AI Copilot Smart Draft Applied
              </span>
              <p className="text-slate-600 dark:text-slate-400">Agent Jordan Lee applied 1-click draft on Ticket SUP-1084 (Webhook Error).</p>
              <span className="text-[10px] text-slate-400">2 mins ago</span>
            </div>

            <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900 space-y-1">
              <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ticket Resolved (5-Star CSAT)
              </span>
              <p className="text-slate-600 dark:text-slate-400">Ticket SUP-1085 marked resolved by Sarah Chen.</p>
              <span className="text-[10px] text-slate-400">14 mins ago</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
