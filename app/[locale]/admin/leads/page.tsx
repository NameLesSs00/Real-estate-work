'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getLeads, Lead } from '@/lib/api/leads';
import { Search, Loader2, AlertCircle, Eye, Mail, Phone, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Detail Modal
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = useCallback(async (page: number) => {
    setLoading(true);
    setError('');
    try {
      const data = await getLeads(page, 10);
      setLeads(data.items);
      setCurrentPage(data.pageNumber || page);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      setError('Failed to fetch property leads');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads(1);
  }, [fetchLeads]);

  const filteredLeads = leads.filter(l => 
    l.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.phone.includes(searchQuery) ||
    (l.projectName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 md:p-12 min-h-screen bg-[#FDFCFB] font-inter">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-[36px] font-bold text-[#1B2134] mb-2">Property Leads</h1>
            <p className="text-[#64748B] text-lg">Manage inquiries received for specific properties and projects.</p>
          </div>
          <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="text-right">
              <p className="text-[13px] text-gray-400 font-medium uppercase tracking-wider">Total Leads</p>
              <p className="text-2xl font-bold text-[#1B2134]">{totalCount}</p>
            </div>
            <div className="w-12 h-12 bg-[#F0EBE3] rounded-xl flex items-center justify-center text-[#1B2134]">
              <Eye size={24} />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-2xl">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, email, phone or project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-[16px] outline-none focus:ring-4 focus:ring-[#1B2134]/5 shadow-sm transition-all"
          />
        </div>

        {/* List */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="animate-spin text-[#1B2134]" size={48} />
              <p className="text-gray-400 font-medium">Loading leads...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <AlertCircle className="text-red-400" size={48} />
              <p className="text-red-500 font-medium">{error}</p>
              <button onClick={() => fetchLeads(currentPage)} className="bg-[#1B2134] text-white px-8 py-3 rounded-xl font-bold cursor-pointer hover:bg-[#2d3555] transition-all">Retry</button>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4 text-gray-300">
              <Search size={48} />
              <p className="text-[#64748B] text-lg font-medium">No leads found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[1000px]">
                <thead className="bg-gray-50/50">
                  <tr className="text-[#1B2134] text-[14px] font-bold uppercase tracking-wider">
                    <th className="px-8 py-6">Applicant</th>
                    <th className="px-8 py-6">Property / Project</th>
                    <th className="px-8 py-6">Status</th>
                    <th className="px-8 py-6">Date</th>
                    <th className="px-8 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-8 py-6">
                        <div className="font-bold text-[#1B2134]">{lead.fullName}</div>
                        <div className="text-[13px] text-gray-400">{lead.email}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-[14px] font-semibold text-[#1B2134]">{lead.propertyName || 'General Inquiry'}</div>
                        {lead.projectName && <div className="text-[12px] text-gray-400">{lead.projectName}</div>}
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[12px] font-bold border ${
                          lead.statusLead === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-green-50 text-green-700 border-green-100'
                        }`}>
                          {lead.statusLead}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-[14px] text-gray-500">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => setSelectedLead(lead)}
                          className="p-2.5 text-[#1B2134] hover:bg-[#1B2134]/5 rounded-xl transition-all"
                        >
                          <Eye size={18} />
                        </button>
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
              <p className="text-[14px] text-[#94A3B8] font-medium">Page {currentPage} of {totalPages}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => fetchLeads(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-6 py-2.5 rounded-xl border border-gray-200 text-[14px] font-bold text-[#1B2134] bg-white hover:bg-gray-50 disabled:opacity-40 transition-all shadow-sm cursor-pointer"
                >Previous</button>
                <button
                  onClick={() => fetchLeads(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-6 py-2.5 rounded-xl border border-gray-200 text-[14px] font-bold text-[#1B2134] bg-white hover:bg-gray-50 disabled:opacity-40 transition-all shadow-sm cursor-pointer"
                >Next</button>
              </div>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedLead && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" 
              onClick={() => setSelectedLead(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-[40px] w-full max-w-xl shadow-2xl overflow-hidden" 
                onClick={e => e.stopPropagation()}
              >
                <div className="bg-[#1B2134] p-10 text-white relative">
                  <h2 className="text-[32px] font-bold leading-tight">{selectedLead.fullName}</h2>
                  <p className="text-white/60 mt-2 flex items-center gap-2"><Calendar size={16} /> Submitted on {new Date(selectedLead.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="p-10 space-y-6">
                  <div className="flex items-center gap-4 text-[#1B2134]">
                    <div className="w-12 h-12 bg-[#F0EBE3] rounded-2xl flex items-center justify-center shrink-0"><Mail size={20} /></div>
                    <div><p className="text-[13px] text-gray-400 font-bold uppercase tracking-widest">Email</p><p className="font-semibold">{selectedLead.email}</p></div>
                  </div>
                  <div className="flex items-center gap-4 text-[#1B2134]">
                    <div className="w-12 h-12 bg-[#F0EBE3] rounded-2xl flex items-center justify-center shrink-0"><Phone size={20} /></div>
                    <div><p className="text-[13px] text-gray-400 font-bold uppercase tracking-widest">Phone</p><p className="font-semibold">{selectedLead.phone}</p></div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <p className="text-[13px] text-gray-400 font-bold uppercase tracking-widest mb-3">Property Interest</p>
                    <p className="text-[#1B2134] font-bold text-lg">{selectedLead.propertyName || 'N/A'}</p>
                    {selectedLead.projectName && <p className="text-gray-500 font-medium mt-1">{selectedLead.projectName}</p>}
                  </div>
                  {selectedLead.notes && (
                    <div className="space-y-2">
                      <p className="text-[13px] text-gray-400 font-bold uppercase tracking-widest">Message</p>
                      <p className="text-[#1B2134] leading-relaxed italic">&quot;{selectedLead.notes}&quot;</p>
                    </div>
                  )}
                  <button 
                    onClick={() => setSelectedLead(null)}
                    className="w-full bg-[#1B2134] text-white py-4 rounded-2xl font-bold mt-4 hover:bg-[#2d3555] transition-all"
                  >Close</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
