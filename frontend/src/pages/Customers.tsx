import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Search, Star, Users, Building, Mail, Clock, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { CustomerProfile } from '../types';

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/customers?search=${encodeURIComponent(search)}`);
      const data = res.data.customers || [];
      setCustomers(data);
      if (data.length > 0) setSelectedCustomer(data[0]);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Customer Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            View customer accounts, lifetime value, ticket history, and CSAT scores.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Directory Table */}
        <Card className="lg:col-span-2 p-0 overflow-hidden space-y-4">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search customers by name, email, or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-xs rounded-xl pl-9 pr-4 py-2.5 border-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Company</th>
                  <th className="p-4">Tickets</th>
                  <th className="p-4">CSAT</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">Loading directory...</td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr
                      key={c._id}
                      onClick={() => setSelectedCustomer(c)}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors ${
                        selectedCustomer?._id === c._id ? 'bg-brand-50/60 dark:bg-brand-950/40 font-bold' : ''
                      }`}
                    >
                      <td className="p-4">
                        <span className="block text-slate-900 dark:text-white font-bold">{c.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{c.email}</span>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">{c.company}</td>
                      <td className="p-4 font-bold text-brand-600">{c.ticketCount || 1}</td>
                      <td className="p-4 font-bold text-amber-500 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {c.satisfactionScore || 5.0}
                      </td>
                      <td className="p-4">
                        <Badge variant="status-resolved">{c.status}</Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Customer Profile Workspace Drawer */}
        {selectedCustomer && (
          <Card className="space-y-6">
            <div className="text-center space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-700 font-extrabold text-xl flex items-center justify-center mx-auto">
                {selectedCustomer.name.charAt(0)}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedCustomer.name}</h3>
              <p className="text-xs text-slate-500">{selectedCustomer.email}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Company:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedCustomer.company}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Lifetime Value:</span>
                <span className="font-bold text-emerald-600">${selectedCustomer.lifetimeValue || 18500}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Satisfaction CSAT:</span>
                <span className="font-bold text-amber-500">4.9 / 5.0</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Internal Account Notes</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed">
                {selectedCustomer.notes || 'VIP Enterprise Customer. Requires sub-1 hour response times for production tickets.'}
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
