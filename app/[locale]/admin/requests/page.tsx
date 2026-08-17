'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getRequests, approveRequest, rejectRequest, getRequestById, RequestItem, RequestDetail } from '@/lib/api/requests';
import { CheckCircle2, XCircle, Eye, Loader2, AlertCircle } from 'lucide-react';

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

const STATUS_MAP: Record<StatusFilter, number | undefined> = {
  all: undefined,
  pending: 0,
  approved: 1,
  rejected: 2,
};

export default function RequestsPage() {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('pending');
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Detail modal
  const [selectedRequest, setSelectedRequest] = useState<RequestDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const showNotif = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchRequests = useCallback(async (page: number, filter: StatusFilter) => {
    setLoading(true);
    setError('');
    try {
      const data = await getRequests(page, 10, STATUS_MAP[filter]);
      setRequests(data.items);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount);
      setCurrentPage(data.pageNumber || page);
    } catch (err) {
      console.error('[Requests]', err);
      setError('Failed to load requests. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests(1, activeFilter);
  }, [activeFilter, fetchRequests]);

  const handleFilterChange = (filter: StatusFilter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    try {
      await approveRequest({ id, paymentPlans: [] });
      showNotif('success', 'Request approved successfully.');
      fetchRequests(currentPage, activeFilter);
    } catch (err) {
      showNotif('error', err instanceof Error ? err.message : 'Failed to approve request.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    setActionLoading(id);
    try {
      await rejectRequest(id);
      showNotif('success', 'Request rejected.');
      fetchRequests(currentPage, activeFilter);
    } catch (err) {
      showNotif('error', err instanceof Error ? err.message : 'Failed to reject request.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetail = async (id: number) => {
    setDetailLoading(true);
    try {
      const detail = await getRequestById(id);
      setSelectedRequest(detail);
    } catch {
      showNotif('error', 'Failed to load request details.');
    } finally {
      setDetailLoading(false);
    }
  };

  const statusBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'approved' || s === '1') return 'bg-green-50 text-green-700';
    if (s === 'rejected' || s === '2') return 'bg-red-50 text-red-700';
    return 'bg-amber-50 text-amber-700';
  };

  return (
    <div className="p-8 md:p-10 min-h-screen bg-[#FDFCFB] font-inter">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-[#000000] mb-1">Unit Requests</h1>
          <p className="text-[#64748B]">{totalCount} request{totalCount !== 1 ? 's' : ''} total</p>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 border ${notification.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
            {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="text-[14px] font-medium">{notification.message}</span>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 bg-[#F0EBE3] p-1.5 rounded-2xl w-fit">
          {(['all', 'pending', 'approved', 'rejected'] as StatusFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`px-6 py-2.5 rounded-xl text-[14px] font-semibold capitalize transition-all duration-200 cursor-pointer ${activeFilter === filter ? 'bg-[#000000] text-white shadow-md' : 'text-[#000000] hover:bg-white/50'}`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="animate-spin text-[#000000]" size={36} />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <p className="text-red-500">{error}</p>
              <button onClick={() => fetchRequests(currentPage, activeFilter)} className="bg-[#000000] text-white px-6 py-2 rounded-full text-sm cursor-pointer">Retry</button>
            </div>
          ) : requests.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-[#64748B] text-[16px]">No {activeFilter === 'all' ? '' : activeFilter} requests found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-50 text-[13px] font-bold text-[#64748B]">
                    <th className="py-5 px-6">Unit</th>
                    <th className="py-5 px-6">Applicant</th>
                    <th className="py-5 px-6">Status</th>
                    <th className="py-5 px-6">Created</th>
                    <th className="py-5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {requests.map((req) => (
                    <tr key={req.id} className="text-[14px] hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-semibold text-[#000000]">{req.unitName}</td>
                      <td className="py-4 px-6 text-[#64748B]">{req.applicantName}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-[12px] font-semibold capitalize ${statusBadge(req.status)}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[#94A3B8]">{new Date(req.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewDetail(req.id)}
                            disabled={detailLoading}
                            className="p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer text-[#64748B] hover:text-[#000000]"
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>
                          {req.status?.toLowerCase() === 'pending' || req.status === '0' ? (
                            <>
                              <button
                                onClick={() => handleApprove(req.id)}
                                disabled={actionLoading === req.id}
                                className="flex items-center gap-1.5 px-4 py-1.5 bg-green-50 text-green-700 rounded-xl text-[13px] font-semibold hover:bg-green-100 transition-colors cursor-pointer disabled:opacity-50"
                              >
                                {actionLoading === req.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={13} />}
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(req.id)}
                                disabled={actionLoading === req.id}
                                className="flex items-center gap-1.5 px-4 py-1.5 bg-red-50 text-red-600 rounded-xl text-[13px] font-semibold hover:bg-red-100 transition-colors cursor-pointer disabled:opacity-50"
                              >
                                {actionLoading === req.id ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={13} />}
                                Reject
                              </button>
                            </>
                          ) : null}
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
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-50">
              <p className="text-[13px] text-[#94A3B8]">Page {currentPage} of {totalPages}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { fetchRequests(currentPage - 1, activeFilter); setCurrentPage(p => p - 1); }}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-[13px] font-medium text-[#000000] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >Previous</button>
                <button
                  onClick={() => { fetchRequests(currentPage + 1, activeFilter); setCurrentPage(p => p + 1); }}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-[13px] font-medium text-[#000000] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >Next</button>
              </div>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelectedRequest(null)}>
            <div className="bg-white rounded-[28px] w-full max-w-lg shadow-2xl p-8" onClick={e => e.stopPropagation()}>
              <h2 className="text-[22px] font-bold text-[#000000] mb-6">Request Details</h2>
              <div className="space-y-3 text-[14px]">
                <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500 font-medium">Unit</span><span className="font-semibold text-[#000000]">{selectedRequest.unitName}</span></div>
                <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500 font-medium">Unit Price</span><span className="font-semibold text-[#000000]">EGP {selectedRequest.unitPrice?.toLocaleString()}</span></div>
                <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500 font-medium">Unit Area</span><span className="font-semibold text-[#000000]">{selectedRequest.unitArea} m²</span></div>
                <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500 font-medium">Applicant</span><span className="font-semibold text-[#000000]">{selectedRequest.applicantName}</span></div>
                <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500 font-medium">Email</span><span className="text-[#000000]">{selectedRequest.applicantEmail}</span></div>
                <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500 font-medium">Phone</span><span className="text-[#000000]">{selectedRequest.applicantPhone}</span></div>
                <div className="flex justify-between py-2"><span className="text-gray-500 font-medium">Status</span>
                  <span className={`px-3 py-0.5 rounded-full text-[12px] font-semibold capitalize ${statusBadge(selectedRequest.status)}`}>{selectedRequest.status}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="mt-8 w-full bg-[#000000] text-white py-3 rounded-2xl font-semibold hover:bg-[#2a3347] transition-colors cursor-pointer"
              >Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
