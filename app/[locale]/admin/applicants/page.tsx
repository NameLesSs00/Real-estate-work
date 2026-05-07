'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getApplicants, createApplicant, updateApplicant, deleteApplicant, Applicant } from '@/lib/api/applicants';
import { Search, Plus, Loader2, Edit2, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Forms
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', notes: '' });

  const fetchApplicants = useCallback(async (page: number) => {
    setLoading(true);
    setError('');
    try {
      const data = await getApplicants(page, 10);
      setApplicants(data.items);
      setCurrentPage(data.pageNumber);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (err) {
      setError('Failed to fetch applicants');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplicants(1);
  }, [fetchApplicants]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) return;
    try {
      await createApplicant(formData);
      setFormData({ fullName: '', email: '', phone: '', notes: '' });
      setShowAddForm(false);
      fetchApplicants(currentPage);
    } catch {
      alert('Failed to add applicant');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !formData.fullName || !formData.email || !formData.phone) return;
    try {
      await updateApplicant({ id: editingId, ...formData });
      setEditingId(null);
      setFormData({ fullName: '', email: '', phone: '', notes: '' });
      fetchApplicants(currentPage);
    } catch {
      alert('Failed to update applicant');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this applicant?')) return;
    try {
      await deleteApplicant(id);
      fetchApplicants(currentPage);
    } catch {
      alert('Failed to delete applicant');
    }
  };

  const startEdit = (applicant: Applicant) => {
    setEditingId(applicant.id);
    setFormData({
      fullName: applicant.fullName,
      email: applicant.email,
      phone: applicant.phone,
      notes: applicant.notes || ''
    });
    setShowAddForm(false);
  };

  const filteredApplicants = applicants.filter(a => 
    a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.phone.includes(searchQuery)
  );

  return (
    <div className="p-10 lg:p-14 font-inter bg-[#F8F9FA] min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-[36px] font-bold text-[#16273B] mb-1">Applicants</h1>
          <p className="text-[#64748B] text-[17px]">{totalCount} applicant{totalCount !== 1 ? 's' : ''} total</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (editingId) {
              setEditingId(null);
              setFormData({ fullName: '', email: '', phone: '', notes: '' });
            }
          }}
          className="bg-[#16273B] text-white px-8 py-4 rounded-full flex items-center gap-3 hover:bg-[#1e324d] transition-all shadow-md cursor-pointer"
        >
          {showAddForm ? <X size={20} /> : <Plus size={20} />}
          <span className="text-[16px] font-semibold">{showAddForm ? 'Cancel' : 'Add Applicant'}</span>
        </button>
      </div>

      <AnimatePresence>
        {(showAddForm || editingId) && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-8"
          >
            <form onSubmit={editingId ? handleUpdate : handleAdd} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[14px] font-bold text-[#16273B]">Full Name</label>
                <input 
                  type="text" 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-[#F8F9FA] border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#16273B]/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[14px] font-bold text-[#16273B]">Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-[#F8F9FA] border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#16273B]/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[14px] font-bold text-[#16273B]">Phone</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-[#F8F9FA] border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#16273B]/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[14px] font-bold text-[#16273B]">Notes</label>
                <input 
                  type="text" 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full bg-[#F8F9FA] border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#16273B]/20"
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                {editingId && (
                  <button type="button" onClick={() => setEditingId(null)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">
                    Cancel
                  </button>
                )}
                <button type="submit" className="bg-[#16273B] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-[#1e324d] transition-colors">
                  {editingId ? 'Save Changes' : 'Create Applicant'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative max-w-full mb-8">
        <div className="absolute left-8 top-1/2 -translate-y-1/2">
          <Search size={20} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search applicants..."
          className="w-full bg-white border border-gray-100 rounded-[28px] py-5 pl-16 pr-10 text-[17px] text-[#16273B] focus:outline-none focus:ring-4 focus:ring-[#16273B]/5 transition-all shadow-sm placeholder:text-[#94A3B8]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
             <Loader2 className="w-8 h-8 animate-spin text-[#16273B]" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="text-red-500">{error}</p>
            <button onClick={() => fetchApplicants(currentPage)} className="bg-[#16273B] text-white px-6 py-2 rounded-full text-sm">Retry</button>
          </div>
        ) : filteredApplicants.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-[#64748B]">
            No applicants found.
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full min-w-[800px] text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50 text-[14px] font-bold text-[#16273B]">
                  <th className="py-6 px-8">Name</th>
                  <th className="py-6 px-4">Email</th>
                  <th className="py-6 px-4">Phone</th>
                  <th className="py-6 px-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredApplicants.map(applicant => (
                  <tr key={applicant.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-5 px-8 font-semibold text-[#16273B]">{applicant.fullName}</td>
                    <td className="py-5 px-4 text-gray-500">{applicant.email}</td>
                    <td className="py-5 px-4 text-gray-500">{applicant.phone}</td>
                    <td className="py-5 px-8 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => startEdit(applicant)} className="p-2 text-gray-500 hover:text-[#16273B] hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(applicant.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
        
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-between px-8 py-5 border-t border-gray-50">
            <p className="text-[14px] text-[#94A3B8]">Page {currentPage} of {totalPages}</p>
            <div className="flex gap-3">
              <button onClick={() => fetchApplicants(currentPage - 1)} disabled={currentPage === 1} className="px-5 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 disabled:opacity-50">Previous</button>
              <button onClick={() => fetchApplicants(currentPage + 1)} disabled={currentPage === totalPages} className="px-5 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
