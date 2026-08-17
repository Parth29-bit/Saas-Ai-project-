import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Sparkles, Building, Mail, Bot, BookOpen, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import api from '../services/api';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [companyName, setCompanyName] = useState('Acme SaaS Corp');
  const [industry, setIndustry] = useState('Software & SaaS');
  const [companySize, setCompanySize] = useState('11-50');

  const [supportEmail, setSupportEmail] = useState('support@company.com');
  const [defaultPriority, setDefaultPriority] = useState('MEDIUM');
  const [timezone, setTimezone] = useState('UTC');

  const [aiName, setAiName] = useState('SupportlyBot');
  const [aiTone, setAiTone] = useState('Professional');
  const [responseStyle, setResponseStyle] = useState('Direct & Quick');

  const [kbTitle, setKbTitle] = useState('How to Reset Your Account Password and API Key');
  const [kbContent, setKbContent] = useState('Navigate to your user settings page and click Reset Password. Secret tokens are never revealed again after creation.');

  const handleNext = () => {
    if (step < 6) setStep(step + 1);
    else handleComplete();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = async () => {
    try {
      setLoading(true);
      await api.patch('/settings/organization', {
        name: companyName,
        industry,
        companySize,
        supportEmail,
        defaultPriority,
        timezone,
        aiSettings: {
          name: aiName,
          tone: aiTone,
          responseStyle,
        },
      });

      if (kbTitle && kbContent) {
        await api.post('/kb/articles', {
          title: kbTitle,
          content: kbContent,
          category: 'Getting Started',
          tags: ['setup', 'onboarding'],
        });
      }

      navigate('/admin');
    } catch (e) {
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto w-full space-y-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xs">
              {step}
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Step {step} of 6
              </span>
              <span className="text-[11px] text-slate-400">
                {step === 1 && 'Welcome'}
                {step === 2 && 'Company Information'}
                {step === 3 && 'Support Setup'}
                {step === 4 && 'AI Assistant Tuning'}
                {step === 5 && 'Seed Knowledge Base'}
                {step === 6 && 'Finish & Redirect'}
              </span>
            </div>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div
                key={s}
                className={`w-6 h-1.5 rounded-full transition-all ${
                  s <= step ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Wizard Card Content */}
        <Card className="p-8 space-y-6 shadow-xl">
          {step === 1 && (
            <div className="text-center space-y-4 py-6">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/80 flex items-center justify-center text-brand-600 mx-auto shadow-md">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Welcome to Supportly AI</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Let's configure your organization, support channel defaults, and AI assistant settings in less than 2 minutes.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-brand-500" /> Company Information
              </h3>
              <Input label="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm rounded-xl p-2.5"
                >
                  <option>Software & SaaS</option>
                  <option>E-commerce & Retail</option>
                  <option>Fintech & Banking</option>
                  <option>Healthcare & Biotech</option>
                  <option>EdTech & Education</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Company Size</label>
                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm rounded-xl p-2.5"
                >
                  <option>1-10 employees</option>
                  <option>11-50 employees</option>
                  <option>51-200 employees</option>
                  <option>200+ employees</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-brand-500" /> Support Configuration
              </h3>
              <Input label="Support Email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Default Ticket Priority</label>
                <select
                  value={defaultPriority}
                  onChange={(e) => setDefaultPriority(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm rounded-xl p-2.5"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-brand-500" /> AI Assistant Tuning
              </h3>
              <Input label="AI Assistant Name" value={aiName} onChange={(e) => setAiName(e.target.value)} />
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Tone of Voice</label>
                <select
                  value={aiTone}
                  onChange={(e) => setAiTone(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm rounded-xl p-2.5"
                >
                  <option>Professional</option>
                  <option>Friendly</option>
                  <option>Empathic</option>
                  <option>Concise</option>
                </select>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-500" /> Seed Knowledge Base
              </h3>
              <p className="text-xs text-slate-500">Create your first Knowledge Base article to instantly seed AI answers.</p>
              <Input label="Article Title" value={kbTitle} onChange={(e) => setKbTitle(e.target.value)} />
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Article Content</label>
                <textarea
                  rows={4}
                  value={kbContent}
                  onChange={(e) => setKbContent(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="text-center space-y-4 py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">You're All Set!</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Your Supportly AI workspace is fully configured and ready for live support.
              </p>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
            {step > 1 ? (
              <Button variant="outline" onClick={handleBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
            ) : (
              <div />
            )}

            <Button
              variant="primary"
              onClick={step === 6 ? handleComplete : handleNext}
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {step === 6 ? 'Go to Admin Dashboard' : 'Next Step'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
