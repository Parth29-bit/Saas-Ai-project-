import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Search, Plus, Filter, ArrowRight, CheckCircle2, Ticket as TicketIcon } from 'lucide-react';
import api from '../services/api';
import { Ticket } from '../types';

export const Tickets: React.FC = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Create Ticket Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('Technical & API');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, priorityFilter, search]);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (priorityFilter) params.append('priority', priorityFilter);
      if (search) params.append('search', search);

      const res = await api.get(`/tickets?${params.toString()}`);
      setTickets(res.data.tickets || []);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject || !newDescription) return;

    try {
      setCreating(true);
      await api.post('/tickets', {
        subject: newSubject,
        description: newDescription,
        category: newCategory,
      });

      setIsModalOpen(false);
      setNewSubject('');
      setNewDescription('');
      fetchTickets();
    } catch (err) {
      console.error('Error creating ticket:', err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Ticket Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            View, filter, and process support tickets across all channels.
          </p>
        </div>

        <Button variant="primary" onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Submit New Ticket
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets by ID, subject, or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800 text-xs rounded-xl pl-9 pr-4 py-2.5 border-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 border-none text-xs rounded-xl px-3 py-2.5 font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="">All Statuses</option>
            <option value="NEW">NEW</option>
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="WAITING_ON_CUSTOMER">WAITING_ON_CUSTOMER</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 border-none text-xs rounded-xl px-3 py-2.5 font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="">All Priorities</option>
            <option value="URGENT">URGENT</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </Card>

      {/* Tickets Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-4">Ticket ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Status</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">Loading tickets...</td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">No tickets found matching filters.</td>
                </tr>
              ) : (
                tickets.map((t) => (
                  <tr
                    key={t._id}
                    onClick={() => navigate(`/agent/tickets/${t._id}`)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="p-4 font-bold text-brand-600">{t.ticketNumber}</td>
                    <td className="p-4 font-medium text-slate-900 dark:text-white">{t.customerId?.name || 'Customer'}</td>
                    <td className="p-4 max-w-xs truncate font-medium text-slate-800 dark:text-slate-200">{t.subject}</td>
                    <td className="p-4">
                      <Badge variant={t.status === 'RESOLVED' ? 'status-resolved' : 'status-open'}>{t.status}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={t.priority === 'URGENT' ? 'priority-urgent' : 'priority-medium'}>{t.priority}</Badge>
                    </td>
                    <td className="p-4 text-slate-500">{t.category}</td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        View Thread
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Ticket Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit New Ticket" maxWidth="lg">
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <Input
            label="Subject"
            placeholder="e.g., Cannot access billing receipt"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm rounded-xl p-2.5"
            >
              <option>Technical & API</option>
              <option>Billing & Account</option>
              <option>Feature Request</option>
              <option>General Inquiry</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
            <textarea
              rows={4}
              placeholder="Provide clear details regarding your issue..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm rounded-xl p-3 focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={creating}>Submit Ticket</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
