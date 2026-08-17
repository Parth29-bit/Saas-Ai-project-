import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import {
  Sparkles,
  Zap,
  Bot,
  Inbox,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Star,
  Users,
  MessageSquare,
  Globe,
  Clock,
  Check,
} from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [billingAnnual, setBillingAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'inbox' | 'copilot' | 'analytics'>('copilot');

  const faqs = [
    {
      q: 'How does Supportly AI ground its responses?',
      a: 'Supportly AI indexes your Knowledge Base articles and past resolved tickets to ground responses with your specific company data. It never guesses or hallucinates unsupported facts.',
    },
    {
      q: 'Can agents edit AI-generated response drafts before sending?',
      a: 'Yes! Supportly AI enforces a strict human-in-the-loop workflow. AI drafts appear directly inside the agent composer, allowing 1-click review, quick editing, or tone adjustment before customer delivery.',
    },
    {
      q: 'What happens if we do not have an active Gemini API key?',
      a: 'Supportly AI comes equipped with a built-in Mock Fallback AI service. You can explore, demo, and test every single AI feature immediately out of the box without requiring API keys.',
    },
    {
      q: 'Is customer data kept private and secure?',
      a: 'Absolutely. We enforce enterprise security controls, HttpOnly cookie authentication, bcrypt hashing, and strict role-based access control (RBAC). Data is isolated per organization.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
              Supportly<span className="text-brand-500">.ai</span>
            </span>
          </NavLink>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-brand-600 transition-colors">Features</a>
            <a href="#copilot" className="hover:text-brand-600 transition-colors">AI Copilot</a>
            <a href="#pricing" className="hover:text-brand-600 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-brand-600 transition-colors">FAQ</a>
            <NavLink to="/help" className="hover:text-brand-600 transition-colors">Help Center</NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/login')}>Sign In</Button>
            <Button variant="primary" onClick={() => navigate('/register')} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Start Free
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-brand-500 animate-pulse" />
            <span>AI-Powered Customer Support Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            AI-powered customer support <br />
            <span className="bg-gradient-to-r from-brand-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
              that works for you.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
            Resolve customer issues faster, empower your support team, and deliver better experiences with intelligent automation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button variant="primary" size="lg" onClick={() => navigate('/register')} rightIcon={<ArrowRight className="w-5 h-5" />}>
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/admin')}>
              View Live Demo Dashboard
            </Button>
          </div>

          <div className="pt-6 flex items-center justify-center gap-6 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 1-Click Demo Launcher</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Grounded KB Grounding</span>
          </div>
        </div>

        {/* Product Interactive Mockup Preview */}
        <div className="max-w-6xl mx-auto mt-14">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-6 overflow-hidden">
            {/* Tab Switcher */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-slate-400 ml-2">Supportly AI Agent Workspace</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('copilot')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === 'copilot' ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  AI Copilot
                </button>
                <button
                  onClick={() => setActiveTab('inbox')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === 'inbox' ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Unified Inbox
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === 'analytics' ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Analytics
                </button>
              </div>
            </div>

            {/* Mockup Preview Graphic */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-brand-600">SUP-1084</span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Webhook integration returning HTTP 500 during peak volume</h4>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold bg-rose-100 text-rose-700 rounded-md">URGENT</span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-start gap-3">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80" alt="Customer" className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">David Vance <span className="text-[10px] text-slate-400 font-normal">• 10:04 AM</span></p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Our webhook endpoint stopped receiving event notifications. Logs show 500 error.</p>
                    </div>
                  </div>

                  <div className="bg-brand-50/70 dark:bg-brand-950/40 p-3 rounded-xl border border-brand-200 dark:border-brand-800 text-xs space-y-2">
                    <div className="flex items-center justify-between text-brand-700 dark:text-brand-300 font-bold">
                      <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> AI Copilot Draft</span>
                      <span className="text-[10px]">94% Confidence</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">"Hello David! Our engineering team monitored a brief rate spike between 10:00 - 10:15 AM UTC. We have automatically retried the failed event queue."</p>
                    <div className="flex gap-2 pt-1">
                      <button className="px-2.5 py-1 bg-brand-600 text-white rounded-md text-[10px] font-bold">Apply Draft to Reply</button>
                      <button className="px-2.5 py-1 bg-white text-slate-700 rounded-md text-[10px] font-bold border">Rewrite Friendlier</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-brand-500" /> AI Insights Panel
                  </h5>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Customer Sentiment:</span>
                      <span className="font-bold text-rose-600">Frustrated ⚡</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Suggested Category:</span>
                      <span className="font-bold text-slate-900 dark:text-white">API & Technical</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>KB Article Match:</span>
                      <span className="font-bold text-brand-600">Resetting API Keys #104</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            Trusted by modern customer support teams worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 opacity-70 font-extrabold text-lg text-slate-600 dark:text-slate-400">
            <span>TECHFLOW</span>
            <span>NEXUS SAAS</span>
            <span>ACME GLOBAL</span>
            <span>CLOUDSCALE</span>
            <span>DATAPULSE</span>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Why modern teams build support on Supportly AI
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            Combine human empathy with artificial intelligence to deliver instantaneous, accurate customer resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card hoverEffect className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 flex items-center justify-center text-brand-600">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI-Powered Support Copilot</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Generate grounded 1-click answers, auto-summarize long threads, detect customer sentiment, and rewrite replies in 10+ languages.
            </p>
          </Card>

          <Card hoverEffect className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Unified Support Inbox</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              3-pane view for high-throughput teams. Manage unassigned, assigned, and urgent queues with SLA breach warning countdown timers.
            </p>
          </Card>

          <Card hoverEffect className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Real-Time Analytics & CSAT</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Track CSAT satisfaction scores, AI deflection rate, average first response times, and agent productivity leaderboards.
            </p>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-slate-100/70 dark:bg-slate-900/50 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Simple, transparent pricing
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Start with our free tier, then scale seamlessly as your customer base expands.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <span className={`text-xs font-bold ${!billingAnnual ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Monthly</span>
              <button
                onClick={() => setBillingAnnual(!billingAnnual)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${billingAnnual ? 'bg-brand-600' : 'bg-slate-300'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${billingAnnual ? 'translate-x-6' : ''}`} />
              </button>
              <span className={`text-xs font-bold ${billingAnnual ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                Annual <span className="text-emerald-500 font-extrabold">(Save 20%)</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Tier */}
            <Card className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Starter</h3>
                <p className="text-xs text-slate-500 mt-1">For small teams testing AI support</p>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$0</span>
                  <span className="text-xs text-slate-400">/month</span>
                </div>
              </div>
              <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Up to 2 Support Agents</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 100 AI Copilot Smart Replies/mo</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Public Help Center</li>
              </ul>
              <Button variant="outline" className="w-full" onClick={() => navigate('/register')}>Get Started Free</Button>
            </Card>

            {/* Pro Tier (Featured) */}
            <Card className="space-y-6 border-2 border-brand-500 relative shadow-xl">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-600 text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                Most Popular
              </span>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Pro SaaS</h3>
                <p className="text-xs text-slate-500 mt-1">For growing SaaS platforms & startups</p>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{billingAnnual ? '$49' : '$59'}</span>
                  <span className="text-xs text-slate-400">/month</span>
                </div>
              </div>
              <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Up to 10 Support Agents</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Unlimited AI Copilot & Summaries</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Grounded KB RAG Grounding</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Automations & SLA Timers</li>
              </ul>
              <Button variant="primary" className="w-full" onClick={() => navigate('/register')}>Start 14-Day Free Trial</Button>
            </Card>

            {/* Enterprise Tier */}
            <Card className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Enterprise</h3>
                <p className="text-xs text-slate-500 mt-1">For scale-ups requiring advanced security</p>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{billingAnnual ? '$149' : '$179'}</span>
                  <span className="text-xs text-slate-400">/month</span>
                </div>
              </div>
              <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Unlimited Agents & Admins</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Dedicated Gemini AI Models</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Custom Webhooks & API Keys</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 24/7 Priority Dedicated Manager</li>
              </ul>
              <Button variant="outline" className="w-full" onClick={() => navigate('/register')}>Contact Sales</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-500">Everything you need to know about Supportly AI.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between text-left font-bold text-slate-900 dark:text-white text-base"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final High-Converting CTA */}
      <section className="py-20 px-6 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to transform your customer support?
          </h2>
          <p className="text-slate-300 text-base max-w-2xl mx-auto">
            Join modern SaaS teams resolving support tickets 90% faster with Supportly AI.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Button variant="primary" size="lg" onClick={() => navigate('/register')} rightIcon={<ArrowRight className="w-5 h-5" />}>
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      {/* SaaS Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xs">
                S
              </div>
              <span className="font-bold text-base text-slate-900 dark:text-white">Supportly.ai</span>
            </div>
            <p className="text-slate-500 max-w-xs">AI-powered customer support, built for modern teams.</p>
            <p className="text-[11px] text-slate-400">© 2026 Supportly AI Inc. All rights reserved.</p>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 dark:text-white mb-3">Product</h5>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-brand-500">AI Copilot</a></li>
              <li><a href="#features" className="hover:text-brand-500">Unified Inbox</a></li>
              <li><a href="#pricing" className="hover:text-brand-500">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 dark:text-white mb-3">Resources</h5>
            <ul className="space-y-2">
              <li><NavLink to="/help" className="hover:text-brand-500">Help Center</NavLink></li>
              <li><a href="#faq" className="hover:text-brand-500">API Documentation</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 dark:text-white mb-3">Legal & Security</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-brand-500">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-500">Terms of Service</a></li>
              <li><a href="#" className="hover:text-brand-500">Security & GDPR</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};
