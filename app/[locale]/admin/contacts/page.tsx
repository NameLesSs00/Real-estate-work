'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getContacts, deleteContact, updateContactStatus, Contact, ContactStatus } from '@/lib/api/contacts';
import { CheckCircle2, XCircle, Eye, Loader2, AlertCircle, Trash2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type StatusFilter = 'all' | 'Pending' | 'Viewed';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [activeFilter, setActiveFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Detail state
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const showNotif = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchContacts = useCallback(async (page: number) => {
    setLoading(true);
    setError('');
    try {
      const data = await getContacts(page, 10);
      console.log('[Admin] Contacts Data:', data);

      const items = Array.isArray(data.items) ? data.items : [];
      setContacts(items);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || items.length || 0);
      setCurrentPage(data.pageNumber || page);
    } catch (err) {
      console.error('[Contacts] Fetch Error:', err);
      setError('Failed to load contacts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts(1);
  }, [fetchContacts]);

  const handleStatusUpdate = async (id: number, status: ContactStatus) => {
    setActionLoading(id);
    try {
      await updateContactStatus(id, status);
      showNotif('success', `Status updated to ${status}.`);
      fetchContacts(currentPage);
      if (selectedContact?.id === id) {
        setSelectedContact(prev => prev ? { ...prev, status } : null);
      }
    } catch (err) {
      showNotif('error', err instanceof Error ? err.message : 'Failed to update status.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this contact inquiry?')) return;
    setActionLoading(id);
    try {
      await deleteContact(id);
      showNotif('success', 'Contact inquiry deleted.');
      fetchContacts(currentPage);
    } catch (err) {
      showNotif('error', err instanceof Error ? err.message : 'Failed to delete contact.');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredContacts = (contacts || []).filter(c => {
    const fullName = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = activeFilter === 'all' || c.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Viewed':  return 'bg-brand-secondary-soft text-brand-primary border-brand-divider';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-100';
      default:        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="p-8 md:p-12 min-h-screen bg-brand-bg font-inter">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-[36px] font-bold text-brand-primary mb-2">Contact Inquiries</h1>
            <p className="text-admin-muted text-lg">Manage leads and general inquiries from the Contact Us form.</p>
          </div>
          <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="text-right">
              <p className="text-[13px] text-gray-400 font-medium uppercase tracking-wider">Total Leads</p>
              <p className="text-2xl font-bold text-brand-primary">{totalCount}</p>
            </div>
            <div className="w-12 h-12 bg-brand-secondary-soft rounded-xl flex items-center justify-center">
              <Eye className="text-brand-primary" size={24} />
            </div>
          </div>
        </div>

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-8 p-5 rounded-[20px] flex items-center gap-4 shadow-sm border ${
                notification.type === 'success'
                  ? 'bg-green-50 border-green-100 text-green-700'
                  : 'bg-red-50 border-red-100 text-red-700'
              }`}
            >
              {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="font-semibold">{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-[16px] outline-none focus:ring-4 focus:ring-brand-primary/5 shadow-sm transition-all"
            />
          </div>

          <div className="flex gap-2 bg-brand-secondary-soft p-1.5 rounded-2xl w-fit shrink-0">
            {(['all', 'Pending', 'Viewed'] as StatusFilter[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2.5 rounded-xl text-[14px] font-semibold transition-all duration-200 cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'text-brand-primary hover:bg-white/50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="animate-spin text-brand-primary" size={48} />
              <p className="text-gray-400 font-medium">Loading inquiries...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <AlertCircle className="text-red-400" size={48} />
              <p className="text-red-500 font-medium">{error}</p>
              <button onClick={() => fetchContacts(currentPage)} className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold cursor-pointer hover:bg-brand-primary-hover transition-all">Retry</button>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                <Search size={40} />
              </div>
              <p className="text-admin-muted text-lg font-medium">No inquiries found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[1000px]">
                <thead className="bg-gray-50/50">
                  <tr className="text-brand-primary text-[14px] font-bold uppercase tracking-wider">
                    <th className="px-8 py-6">Name</th>
                    <th className="px-8 py-6">Contact Info</th>
                    <th className="px-8 py-6">Type</th>
                    <th className="px-8 py-6">Source</th>
                    <th className="px-8 py-6">Status</th>
                    <th className="px-8 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredContacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-gray-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand-primary/5 flex items-center justify-center text-brand-primary font-bold text-sm">
                            {contact.firstName[0]}{contact.lastName[0]}
                          </div>
                          <div>
                            <p className="font-bold text-brand-primary">{contact.firstName} {contact.lastName}</p>
                            <p className="text-[12px] text-gray-400 font-medium uppercase tracking-tighter">#{contact.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-[14px] text-brand-primary font-medium">{contact.email}</p>
                        <p className="text-[13px] text-gray-400">{contact.phone}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-gray-100 rounded-lg text-[13px] font-semibold text-gray-600">
                          {contact.type}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[14px] text-admin-muted font-medium">
                          {contact.hearFrom}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[12px] font-bold border ${getStatusColor(contact.status)}`}>
                          {contact.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedContact(contact)}
                            className="p-2.5 text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>

                          {contact.status === 'Pending' && (
                            <button
                              onClick={() => handleStatusUpdate(contact.id, 'Viewed')}
                              disabled={actionLoading === contact.id}
                              className="p-2.5 text-brand-secondary hover:bg-brand-secondary-soft rounded-xl transition-all"
                              title="Mark as Viewed"
                            >
                              <CheckCircle2 size={18} />
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(contact.id)}
                            className="p-2.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className="flex items-center justify-between px-10 py-6 border-t border-gray-50 bg-gray-50/30">
              <p className="text-[14px] text-brand-muted-light font-medium">Page {currentPage} of {totalPages}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => fetchContacts(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-6 py-2.5 rounded-xl border border-gray-200 text-[14px] font-bold text-brand-primary bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchContacts(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-6 py-2.5 rounded-xl border border-gray-200 text-[14px] font-bold text-brand-primary bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedContact && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
              onClick={() => setSelectedContact(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="bg-brand-primary p-10 text-white relative">
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="absolute top-8 right-8 text-white/60 hover:text-white transition-colors"
                  >
                    <XCircle size={28} />
                  </button>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center text-3xl font-bold">
                      {selectedContact.firstName[0]}{selectedContact.lastName[0]}
                    </div>
                    <div>
                      <h2 className="text-[32px] font-bold leading-tight">{selectedContact.firstName} {selectedContact.lastName}</h2>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`px-4 py-1 rounded-full text-[12px] font-bold border border-white/20 bg-white/10`}>
                          {selectedContact.status}
                        </span>
                        <span className="text-white/40 text-[14px]">• {new Date(selectedContact.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-10 space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[13px] text-gray-400 font-bold uppercase tracking-widest mb-2">Email Address</p>
                      <p className="text-[16px] text-brand-primary font-semibold">{selectedContact.email}</p>
                    </div>
                    <div>
                      <p className="text-[13px] text-gray-400 font-bold uppercase tracking-widest mb-2">Phone Number</p>
                      <p className="text-[16px] text-brand-primary font-semibold">{selectedContact.phone}</p>
                    </div>
                    <div>
                      <p className="text-[13px] text-gray-400 font-bold uppercase tracking-widest mb-2">Inquiry Type</p>
                      <span className="px-3 py-1 bg-brand-primary/5 text-brand-primary rounded-lg text-[14px] font-bold inline-block">
                        {selectedContact.type}
                      </span>
                    </div>
                    <div>
                      <p className="text-[13px] text-gray-400 font-bold uppercase tracking-widest mb-2">Source</p>
                      <p className="text-[16px] text-brand-primary font-semibold">{selectedContact.hearFrom}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[13px] text-gray-400 font-bold uppercase tracking-widest mb-2">Message / Notes</p>
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <p className="text-[15px] text-brand-primary leading-relaxed whitespace-pre-wrap italic">
                        &quot;{selectedContact.notes || 'No message provided.'}&quot;
                      </p>
                    </div>
                  </div>

                  {/* Actions in Modal */}
                  <div className="flex gap-4 pt-4">
                    {selectedContact.status === 'Pending' && (
                      <button
                        onClick={() => handleStatusUpdate(selectedContact.id, 'Viewed')}
                        className="flex-1 bg-brand-secondary text-white py-4 rounded-2xl font-bold shadow-lg shadow-brand-secondary/20 hover:bg-brand-secondary-hover transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={20} />
                        Mark Viewed
                      </button>
                    )}
                    <button
                      onClick={() => {
                        handleDelete(selectedContact.id);
                        setSelectedContact(null);
                      }}
                      className="w-16 h-16 flex items-center justify-center bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
