import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { BookOpen, Plus, Search, Eye, ThumbsUp, Trash2, Edit3 } from 'lucide-react';
import api from '../services/api';
import { KnowledgeArticle } from '../types';

export const KnowledgeBase: React.FC = () => {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Technical & API');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, [search, categoryFilter]);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (categoryFilter) params.append('category', categoryFilter);
      params.append('publishedOnly', 'false');

      const res = await api.get(`/kb/articles?${params.toString()}`);
      setArticles(res.data.articles || []);
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      setSaving(true);
      await api.post('/kb/articles', { title, content, category });
      setIsModalOpen(false);
      setTitle('');
      setContent('');
      fetchArticles();
    } catch (err) {
      console.error('Error creating article:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await api.delete(`/kb/articles/${id}`);
      fetchArticles();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Knowledge Base CMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage public Help Center articles and ground AI assistant responses.
          </p>
        </div>

        <Button variant="primary" onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          New Knowledge Article
        </Button>
      </div>

      <Card className="p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search articles by title or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800 text-xs rounded-xl pl-9 pr-4 py-2.5 border-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-slate-100 dark:bg-slate-800 border-none text-xs rounded-xl px-3 py-2.5 font-semibold text-slate-700 dark:text-slate-300"
        >
          <option value="">All Categories</option>
          <option value="Technical & API">Technical & API</option>
          <option value="Billing & Account">Billing & Account</option>
          <option value="Getting Started">Getting Started</option>
        </select>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="col-span-3 text-center text-xs text-slate-400 p-8">Loading Knowledge Base...</p>
        ) : (
          articles.map((art) => (
            <Card key={art._id} hoverEffect className="space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="brand">{art.category}</Badge>
                  <span className="text-[10px] text-emerald-600 font-bold">Published</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2">{art.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{art.content}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {art.views}</span>
                  <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5 text-emerald-500" /> {art.helpfulVotes}</span>
                </div>
                <button onClick={() => handleDelete(art._id)} className="text-red-500 hover:text-red-700 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Knowledge Base Article">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Article Title" placeholder="e.g. Setting up Webhook Webhooks" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm rounded-xl p-2.5">
              <option>Technical & API</option>
              <option>Billing & Account</option>
              <option>Getting Started</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Content</label>
            <textarea rows={6} placeholder="Full article markdown/text..." value={content} onChange={(e) => setContent(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm rounded-xl p-3 focus:ring-2 focus:ring-brand-500" required />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={saving}>Publish Article</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
