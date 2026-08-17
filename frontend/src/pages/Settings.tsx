import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Building, Shield, Bot, Key, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api';

export const Settings: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'organization' | 'ai' | 'api'>('profile');

  // Profile Form
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  // Org Form
  const [companyName, setCompanyName] = useState('Acme SaaS Corp');
  const [supportEmail, setSupportEmail] = useState('support@acmesaas.com');

  // AI Form
  const [aiName, setAiName] = useState('SupportlyBot AI');
  const [aiTone, setAiTone] = useState('Professional');

  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.patch('/settings/profile', { name, email });
      setUser(res.data.user);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.patch('/settings/organization', {
        name: companyName,
        supportEmail,
        aiSettings: { name: aiName, tone: aiTone },
      });
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          System Settings & Customization
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage profile details, organization branding, AI assistant prompt rules, and API Keys.
        </p>
      </div>

      {savedMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Settings saved successfully!
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {['profile', 'organization', 'ai', 'api'].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t as any)}
            className={`px-4 py-2 text-xs font-bold rounded-xl capitalize transition-colors ${
              activeTab === t ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {t === 'ai' ? 'AI Assistant' : t === 'api' ? 'API Keys' : t}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-brand-500" /> User Profile
          </h3>
          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Button type="submit" variant="primary" isLoading={saving}>Save Profile</Button>
          </form>
        </Card>
      )}

      {activeTab === 'organization' && (
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-brand-500" /> Organization & Support Defaults
          </h3>
          <form onSubmit={handleSaveOrg} className="space-y-4 max-w-md">
            <Input label="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
            <Input label="Support Email" type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} required />
            <Button type="submit" variant="primary" isLoading={saving}>Save Organization</Button>
          </form>
        </Card>
      )}

      {activeTab === 'ai' && (
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bot className="w-4 h-4 text-brand-500" /> AI Assistant Tuning
          </h3>
          <form onSubmit={handleSaveOrg} className="space-y-4 max-w-md">
            <Input label="AI Assistant Name" value={aiName} onChange={(e) => setAiName(e.target.value)} required />
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Default Tone</label>
              <select value={aiTone} onChange={(e) => setAiTone(e.target.value)} className="w-full bg-white dark:bg-slate-900 border text-xs rounded-xl p-2.5">
                <option>Professional</option>
                <option>Friendly</option>
                <option>Empathic</option>
                <option>Concise</option>
              </select>
            </div>
            <Button type="submit" variant="primary" isLoading={saving}>Save AI Configuration</Button>
          </form>
        </Card>
      )}

      {activeTab === 'api' && (
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-brand-500" /> Developer Secret Keys & Webhooks
          </h3>
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <p className="text-xs font-bold text-slate-900 dark:text-white">Live Secret Key</p>
            <p className="font-mono text-xs text-brand-600 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
              sup_live_9f8d7a6b5c4e3d2a10
            </p>
          </div>
          <Button variant="outline" size="sm">Generate New Key</Button>
        </Card>
      )}
    </div>
  );
};
