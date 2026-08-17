import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { UserCheck, Plus, Mail, ShieldCheck, Trash2 } from 'lucide-react';
import api from '../services/api';

export const Team: React.FC = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('AGENT');
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await api.get('/team');
      setMembers(res.data.members || []);
    } catch (err) {
      console.error('Error fetching team:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    try {
      setInviting(true);
      await api.post('/team/invite', { name, email, role });
      setIsModalOpen(false);
      setName('');
      setEmail('');
      fetchTeam();
    } catch (err) {
      console.error('Invite error:', err);
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Team Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Invite agents, assign roles, and view support workload.
          </p>
        </div>

        <Button variant="primary" onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Invite Support Agent
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold">
            <tr>
              <th className="p-4">Agent Name</th>
              <th className="p-4">Role</th>
              <th className="p-4">Assigned Tickets</th>
              <th className="p-4">Resolved</th>
              <th className="p-4">Avg Response</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {members.map((m) => (
              <tr key={m._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-4 flex items-center gap-3">
                  <img src={m.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80'} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <span className="block font-bold text-slate-900 dark:text-white">{m.name}</span>
                    <span className="text-[10px] text-slate-400">{m.email}</span>
                  </div>
                </td>
                <td className="p-4"><Badge variant="brand">{m.role}</Badge></td>
                <td className="p-4 font-bold text-brand-600">{m.assignedTickets || 3}</td>
                <td className="p-4 font-bold text-emerald-600">{m.resolvedTickets || 42}</td>
                <td className="p-4 text-slate-500">{m.avgResponseTime || '12m'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Invite Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Invite Team Member">
        <form onSubmit={handleInvite} className="space-y-4">
          <Input label="Full Name" placeholder="Jordan Lee" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Work Email" type="email" placeholder="jordan@supportly.ai" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm rounded-xl p-2.5">
              <option value="AGENT">Support Agent</option>
              <option value="ADMIN">Organization Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={inviting}>Send Invitation</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
