import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Bot,
  Sparkles,
  Send,
  FileText,
  Smile,
  Globe,
  CheckCircle,
  HelpCircle,
  Zap,
  RotateCcw,
  Search,
  MessageSquare,
} from 'lucide-react';
import api from '../services/api';

export const AIWorkspace: React.FC = () => {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    {
      role: 'assistant',
      text: 'Hello! I am your Supportly AI Copilot. Select an AI action or ask me any question grounded in your Knowledge Base!',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    const userMsg = { role: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');

    try {
      setIsLoading(true);
      const res = await api.post('/ai/chat', { query: q });
      const aiReply = { role: 'assistant', text: res.data.data?.content || 'I completed your AI request.' };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error('Error running AI action:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = async (mode: string) => {
    const lastMsg = messages[messages.length - 1]?.text || 'Draft support response.';
    try {
      setIsLoading(true);
      const res = await api.post('/ai/rewrite', { text: lastMsg, mode });
      if (res.data.data?.content) {
        setMessages((prev) => [...prev, { role: 'assistant', text: res.data.data.content }]);
      }
    } catch (err) {
      console.error('Action error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Left Column: Conversation History */}
      <div className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-brand-500" /> AI Threads
          </h3>
          <Button variant="ghost" size="sm" onClick={() => setMessages([{ role: 'assistant', text: 'New AI thread started.' }])}>
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="space-y-2 flex-1 overflow-y-auto">
          <div className="p-3 bg-brand-50 dark:bg-brand-950/50 rounded-xl border border-brand-200 dark:border-brand-900 cursor-pointer">
            <span className="text-[10px] font-bold text-brand-600 uppercase">Active Copilot Session</span>
            <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">Webhook HTTP 500 Triage</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer opacity-70">
            <span className="text-[10px] font-bold text-slate-400">Yesterday</span>
            <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">Billing Inquiry Smart Draft</p>
          </div>
        </div>
      </div>

      {/* Center Column: AI Chat Stream & 8 One-Click Helpers */}
      <div className="flex-1 flex flex-col overflow-hidden border-r border-slate-200/80 dark:border-slate-800">
        {/* Quick Action Toolbar (8 Helpers) */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 p-3 flex flex-wrap gap-2 overflow-x-auto">
          <button onClick={() => handleSend('Generate suggested reply for Ticket SUP-1084')} className="px-3 py-1.5 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 text-xs font-bold rounded-xl border border-brand-200 dark:border-brand-900 hover:bg-brand-100 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Generate Reply
          </button>
          <button onClick={() => handleSend('Summarize the recent conversation thread into key action points')} className="px-3 py-1.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-200 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" /> Summarize
          </button>
          <button onClick={() => handleActionClick('professional')} className="px-3 py-1.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-200">
            Rewrite Professionally
          </button>
          <button onClick={() => handleActionClick('shorter')} className="px-3 py-1.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-200">
            Make Shorter
          </button>
          <button onClick={() => handleActionClick('friendlier')} className="px-3 py-1.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-200 flex items-center gap-1">
            <Smile className="w-3.5 h-3.5" /> Make Friendlier
          </button>
          <button onClick={() => handleActionClick('translate')} className="px-3 py-1.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-200 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" /> Translate
          </button>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed space-y-2 shadow-xs ${
                m.role === 'user' ? 'bg-brand-600 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100'
              }`}>
                <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-80">
                  {m.role === 'user' ? 'You' : <span className="flex items-center gap-1 text-brand-500"><Bot className="w-3.5 h-3.5" /> Supportly AI Copilot</span>}
                </div>
                <p className="whitespace-pre-wrap">{m.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2">
          <input
            type="text"
            placeholder="Ask AI Copilot anything about tickets or Knowledge Base articles..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-50 dark:bg-slate-950 text-xs rounded-xl px-4 py-2.5 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-brand-500"
          />
          <Button variant="primary" size="sm" onClick={() => handleSend()} isLoading={isLoading} rightIcon={<Send className="w-3.5 h-3.5" />}>
            Run AI
          </Button>
        </div>
      </div>

      {/* Right Column: Context Panel */}
      <div className="w-80 bg-white dark:bg-slate-900 p-5 space-y-6 overflow-y-auto hidden xl:block">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider text-slate-400">
          Ticket & Customer Context
        </h4>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Customer:</span>
            <span className="font-bold text-slate-900 dark:text-white">David Vance</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Sentiment:</span>
            <span className="font-bold text-rose-600">Frustrated ⚡</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Urgency Priority:</span>
            <Badge variant="priority-urgent">URGENT</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">AI Confidence:</span>
            <span className="font-bold text-emerald-600">94% Grounded</span>
          </div>
        </div>

        <div className="space-y-2">
          <h5 className="text-xs font-bold text-slate-900 dark:text-white">Relevant KB Article Grounding</h5>
          <div className="p-3 bg-brand-50/60 dark:bg-brand-950/40 rounded-xl border border-brand-200 dark:border-brand-900 text-xs space-y-1">
            <p className="font-bold text-brand-700 dark:text-brand-300">How to Reset Your API Key #104</p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">Contains instructions for webhook retries and secret keys.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
