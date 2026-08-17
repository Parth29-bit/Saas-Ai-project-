import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Zap, Plus, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import api from '../services/api';

export const Automations: React.FC = () => {
  const [automations, setAutomations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Rule Form State
  const [name, setName] = useState('');
  const [conditionField, setConditionField] = useState('priority');
  const [conditionValue, setConditionValue] = useState('URGENT');
  const [actionType, setActionType] = useState('assign_agent');
  const [actionValue, setActionValue] = useState('agent@supportly.ai');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAutomations();
  }, []);

  const fetchAutomations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/automations');
      setAutomations(res.data.automations || []);
    } catch (err) {
      console.error('Error fetching automations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      setSaving(true);
      await api.post('/automations', {
        name,
        conditions: [{ field: conditionField, operator: 'equals', value: conditionValue }],
        actions: [{ type: actionType, value: actionValue }],
      });
      setIsModalOpen(false);
      setName('');
      fetchAutomations();
    } catch (err) {
      console.error('Error creating automation:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await api.patch(`/automations/${id}/toggle`);
      fetchAutomations();
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/automations/${id}`);
      fetchAutomations();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Automations & SLA Triggers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Create IF-THEN rules to auto-assign agents, set category tags, and trigger SLA escalations.
          </p>
        </div>

        <Button variant="primary" onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          New Automation Rule
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {automations.map((rule) => (
          <Card key={rule._id} className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
                <Zap className="w-4 h-4 text-amber-500" /> {rule.name}
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => handleToggle(rule._id)} className="text-brand-600">
                  {rule.isEnabled ? <ToggleRight className="w-6 h-6 text-brand-600" /> : <ToggleLeft className="w-6 h-6 text-slate-400" />}
                </button>
                <button onClick={() => handleDelete(rule._id)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-2 text-xs">
              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px]">IF Conditions:</span>
                <p className="text-slate-700 dark:text-slate-300 font-mono mt-0.5">
                  {rule.conditions?.map((c: any) => `${c.field} = "${c.value}"`).join(' AND ')}
                </p>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-2">
                <span className="font-bold text-slate-400 uppercase text-[10px]">THEN Actions:</span>
                <p className="text-brand-600 font-mono mt-0.5">
                  {rule.actions?.map((a: any) => `${a.type} -> "${a.value}"`).join(', ')}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Rule Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Automation Rule">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Rule Name" placeholder="e.g. Auto-Assign Urgent Billing Tickets" value={name} onChange={(e) => setName(e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">IF Field</label>
              <select value={conditionField} onChange={(e) => setConditionField(e.target.value)} className="w-full bg-white dark:bg-slate-900 border text-xs rounded-xl p-2.5">
                <option value="priority">Priority</option>
                <option value="sentiment">Sentiment</option>
                <option value="contains_text">Contains Text</option>
              </select>
            </div>
            <Input label="IF Value" value={conditionValue} onChange={(e) => setConditionValue(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">THEN Action</label>
              <select value={actionType} onChange={(e) => setActionType(e.target.value)} className="w-full bg-white dark:bg-slate-900 border text-xs rounded-xl p-2.5">
                <option value="assign_agent">Assign Agent</option>
                <option value="set_priority">Set Priority</option>
                <option value="set_category">Set Category</option>
                <option value="add_tag">Add Tag</option>
              </select>
            </div>
            <Input label="THEN Target Value" value={actionValue} onChange={(e) => setActionValue(e.target.value)} required />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={saving}>Save Automation</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
