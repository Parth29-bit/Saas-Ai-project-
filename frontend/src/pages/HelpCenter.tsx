import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Sparkles, Search, BookOpen, MessageSquare, Bot, ArrowRight, Eye, ThumbsUp } from 'lucide-react';
import api from '../services/api';

export const HelpCenter: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [botOpen, setBotOpen] = useState(false);
  const [botQuery, setBotQuery] = useState('');
  const [botMessages, setBotMessages] = useState<{ role: string; text: string }[]>([
    { role: 'assistant', text: 'Hi! I am Supportly AI self-serve bot. Ask me any question about API keys, billing, or technical settings!' },
  ]);
  const [botLoading, setBotLoading] = useState(false);

  useEffect(() => {
    fetchPublicArticles();
  }, [search]);

  const fetchPublicArticles = async () => {
    try {
      const res = await api.get(`/kb/articles?search=${encodeURIComponent(search)}&publishedOnly=true`);
      setArticles(res.data.articles || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!botQuery.trim()) return;

    const userText = botQuery;
    setBotMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setBotQuery('');

    try {
      setBotLoading(true);
      const res = await api.post('/ai/chat', { query: userText });
      setBotMessages((prev) => [...prev, { role: 'assistant', text: res.data.data?.content || 'Here is what I found.' }]);
    } catch (err) {
      console.error(err);
    } finally {
      setBotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* Public Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg text-slate-900 dark:text-white">Supportly AI Help Center</span>
          </NavLink>

          <div className="flex gap-3">
            <NavLink to="/login">
              <Button variant="outline" size="sm">Agent Login</Button>
            </NavLink>
          </div>
        </div>
      </header>

      {/* Hero Search Section */}
      <section className="bg-gradient-to-b from-brand-50/50 to-transparent dark:from-brand-950/20 py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How can we help you today?
          </h1>
          <div className="relative max-w-xl mx-auto">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search guides, API docs, billing FAQs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 text-sm rounded-2xl pl-12 pr-4 py-3.5 border border-slate-200 dark:border-slate-800 shadow-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Popular Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((art) => (
            <Card key={art._id} hoverEffect className="space-y-3">
              <Badge variant="brand">{art.category}</Badge>
              <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2">{art.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-3">{art.content}</p>
              <div className="flex items-center gap-4 pt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {art.views} views</span>
                <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5 text-emerald-500" /> {art.helpfulVotes} helpful</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Grounded Interactive AI Chatbot Floating Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {botOpen ? (
          <div className="w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[480px]">
            <div className="bg-brand-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <span className="font-bold text-sm">Supportly AI Support Bot</span>
              </div>
              <button onClick={() => setBotOpen(false)} className="text-white text-xs font-bold">✕</button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {botMessages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-[85%] whitespace-pre-wrap ${m.role === 'user' ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleBotSubmit} className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Ask bot..."
                value={botQuery}
                onChange={(e) => setBotQuery(e.target.value)}
                className="flex-1 bg-white dark:bg-slate-900 text-xs rounded-xl px-3 py-2 border focus:ring-2 focus:ring-brand-500"
              />
              <Button type="submit" variant="primary" size="sm" isLoading={botLoading}>Ask</Button>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setBotOpen(true)}
            className="flex items-center gap-2 px-4 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-full shadow-2xl transition-all hover:scale-105"
          >
            <Bot className="w-5 h-5" /> Ask AI Bot
          </button>
        )}
      </div>
    </div>
  );
};
