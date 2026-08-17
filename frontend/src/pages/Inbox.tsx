import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import {
  Search,
  Filter,
  Bot,
  Send,
  Lock,
  Paperclip,
  Sparkles,
  User,
  Clock,
  CheckCircle2,
  Tag,
} from 'lucide-react';
import api from '../services/api';
import { Ticket, Message } from '../types';

export const Inbox: React.FC = () => {
  const [activeQueue, setActiveQueue] = useState('all');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [aiDrafting, setAiDrafting] = useState(false);

  useEffect(() => {
    fetchQueueTickets();
  }, [activeQueue]);

  const fetchQueueTickets = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/tickets?queue=${activeQueue}`);
      const data: Ticket[] = res.data.tickets || [];
      setTickets(data);
      if (data.length > 0) {
        loadTicketDetails(data[0]._id);
      } else {
        setSelectedTicket(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Error fetching inbox tickets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTicketDetails = async (ticketId: string) => {
    try {
      const res = await api.get(`/tickets/${ticketId}`);
      setSelectedTicket(res.data.ticket);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error('Error loading ticket details:', err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    try {
      const res = await api.post('/messages', {
        ticketId: selectedTicket._id,
        message: replyText,
        isInternalNote,
      });

      setMessages((prev) => [...prev, res.data.data]);
      setReplyText('');
      setIsInternalNote(false);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleGenerateAIDraft = async () => {
    if (!selectedTicket) return;
    try {
      setAiDrafting(true);
      const history = messages.map((m) => `${m.senderRole}: ${m.message}`).join('\n');
      const res = await api.post('/ai/generate-reply', {
        ticketSubject: selectedTicket.subject,
        messageHistory: history,
        ticketId: selectedTicket._id,
      });

      if (res.data.data?.content) {
        setReplyText(res.data.data.content);
      }
    } catch (err) {
      console.error('Error generating AI draft:', err);
    } finally {
      setAiDrafting(false);
    }
  };

  const queues = [
    { id: 'all', label: 'All Conversations' },
    { id: 'unassigned', label: 'Unassigned' },
    { id: 'mine', label: 'Assigned to Me' },
    { id: 'urgent', label: 'Urgent' },
    { id: 'resolved', label: 'Resolved' },
  ];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Queue Tabs Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-6 py-3 flex items-center gap-2 overflow-x-auto">
        {queues.map((q) => (
          <button
            key={q.id}
            onClick={() => setActiveQueue(q.id)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
              activeQueue === q.id
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* 3-Pane Unified Inbox View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane: Conversation List */}
        <div className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full bg-slate-100 dark:bg-slate-800 text-xs rounded-xl pl-9 pr-3 py-2 border-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              <div className="p-4 space-y-3">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            ) : tickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No tickets found in this queue.</div>
            ) : (
              tickets.map((t) => {
                const isSelected = selectedTicket?._id === t._id;
                return (
                  <div
                    key={t._id}
                    onClick={() => loadTicketDetails(t._id)}
                    className={`p-3.5 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-brand-50/70 dark:bg-brand-950/40 border-l-4 border-brand-600'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-brand-600">{t.ticketNumber}</span>
                      <Badge size="sm" variant={t.priority === 'URGENT' ? 'priority-urgent' : 'priority-medium'}>
                        {t.priority}
                      </Badge>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate mt-1">{t.subject}</h4>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{t.description}</p>
                    <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                      <span>{t.customerId?.name || 'Customer'}</span>
                      <span>{t.category}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Center Pane: Message Timeline & Composer */}
        <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
          {selectedTicket ? (
            <>
              {/* Ticket Header Bar */}
              <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-6 py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-brand-600">{selectedTicket.ticketNumber}</span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{selectedTicket.subject}</h3>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Category: {selectedTicket.category}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={selectedTicket.status === 'RESOLVED' ? 'status-resolved' : 'status-open'}>
                    {selectedTicket.status}
                  </Badge>
                  <Badge variant={selectedTicket.priority === 'URGENT' ? 'priority-urgent' : 'priority-medium'}>
                    {selectedTicket.priority}
                  </Badge>
                </div>
              </div>

              {/* Message Thread */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((m) => {
                  const isAgent = m.senderRole === 'AGENT' || m.senderRole === 'ADMIN';
                  const isInternal = m.isInternalNote;

                  return (
                    <div
                      key={m._id}
                      className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-2xl rounded-2xl p-4 space-y-1 text-xs shadow-xs ${
                          isInternal
                            ? 'bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200'
                            : isAgent
                            ? 'bg-brand-600 text-white'
                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-bold opacity-80 gap-4 mb-1">
                          <span>
                            {isInternal ? '🔒 Private Team Note by ' : ''}
                            {m.senderId?.name || 'User'} ({m.senderRole})
                          </span>
                          <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="whitespace-pre-wrap leading-relaxed">{m.message}</p>
                        {m.aiGenerated && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold opacity-90 mt-1">
                            <Sparkles className="w-3 h-3" /> AI Generated Draft
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Composer Bar */}
              <form onSubmit={handleSendMessage} className="bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsInternalNote(!isInternalNote)}
                      className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors ${
                        isInternalNote
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      {isInternalNote ? 'Private Internal Note' : 'Public Customer Reply'}
                    </button>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleGenerateAIDraft}
                    isLoading={aiDrafting}
                    leftIcon={<Sparkles className="w-3.5 h-3.5 text-brand-500" />}
                  >
                    Generate AI Draft
                  </Button>
                </div>

                <textarea
                  rows={3}
                  placeholder={isInternalNote ? 'Write private internal note for agents...' : 'Type response to customer...'}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-xs rounded-xl p-3 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Shift+Enter for line break</span>
                  <Button type="submit" variant="primary" size="sm" rightIcon={<Send className="w-3.5 h-3.5" />}>
                    {isInternalNote ? 'Post Internal Note' : 'Send Reply'}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
              Select a conversation from the left queue to view details.
            </div>
          )}
        </div>

        {/* Right Pane: Customer Details Sidebar */}
        {selectedTicket && (
          <div className="w-72 bg-white dark:bg-slate-900 border-l border-slate-200/80 dark:border-slate-800 p-4 space-y-5 overflow-y-auto hidden xl:block">
            <div className="text-center space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <img
                src={selectedTicket.customerId?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'}
                alt="Customer"
                className="w-14 h-14 rounded-full mx-auto object-cover ring-2 ring-brand-500/20"
              />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{selectedTicket.customerId?.name}</h4>
              <p className="text-xs text-slate-500">{selectedTicket.customerId?.email}</p>
              <span className="inline-block px-2.5 py-0.5 bg-brand-50 text-brand-700 text-[10px] font-bold rounded-full">
                {selectedTicket.customerId?.company || 'Enterprise Tier'}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] text-slate-400">
                Customer Insights
              </h5>
              <div className="flex justify-between">
                <span className="text-slate-500">Sentiment:</span>
                <span className="font-bold text-rose-600">{selectedTicket.sentiment || 'Neutral'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Urgency Score:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedTicket.urgencyScore}/10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">SLA Response Due:</span>
                <span className="font-bold text-amber-600">In 1h 42m</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
