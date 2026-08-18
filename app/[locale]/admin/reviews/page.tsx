'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2, Loader2, AlertCircle, CheckCircle2,
  ChevronLeft, ChevronRight, Star, Search, BarChart2,
} from 'lucide-react';
import { Review, getReviews, deleteReview } from '@/lib/api/reviews';

const PAGE_SIZE = 10;

function StarDisplay({ rate }: { rate: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={13}
          className={rate >= s ? 'text-amber-400' : 'text-gray-200'}
          fill={rate >= s ? '#FBBF24' : 'none'}
        />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const notify = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getReviews(1, 500);
      setReviews(data.reviews ?? []);
    } catch (err: unknown) {
      notify('error', err instanceof Error ? err.message : 'Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = async (id: number) => {
    setDeleting(true);
    try {
      await deleteReview(id, true);
      notify('success', 'Review deleted successfully.');
      setDeletingId(null);
      fetchReviews();
    } catch (err: unknown) {
      notify('error', err instanceof Error ? err.message : 'Failed to delete review.');
    } finally {
      setDeleting(false);
    }
  };

  // ── Filtering & Pagination ────────────────────────────────────────────────

  const filtered = reviews.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.fullName.toLowerCase().includes(q) ||
      r.unitName?.toLowerCase().includes(q) ||
      r.comment.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rate, 0) / reviews.length
      : 0;

  // Reset to page 1 when search changes
  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-4 md:p-8 pt-10">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-bold text-[#000000] font-radley mb-1">
              Reviews Management
            </h1>
            <p className="text-[#666] font-poppins text-sm">
              View and moderate all property reviews submitted by visitors.
            </p>
          </div>
        </div>

        {/* Stats Strip */}
        {!loading && reviews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-7">
            <div className="bg-white border border-[#BBDEFB] rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-[#000000]/5 rounded-xl flex items-center justify-center">
                <BarChart2 size={20} className="text-[#000000]" />
              </div>
              <div>
                <p className="text-[24px] font-bold text-[#000000] leading-none">{reviews.length}</p>
                <p className="text-[12px] text-gray-400 mt-0.5 uppercase tracking-wider">Total Reviews</p>
              </div>
            </div>
            <div className="bg-white border border-[#BBDEFB] rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <Star size={20} className="text-amber-400" fill="#FBBF24" />
              </div>
              <div>
                <p className="text-[24px] font-bold text-[#000000] leading-none">
                  {avgRating.toFixed(1)}
                </p>
                <p className="text-[12px] text-gray-400 mt-0.5 uppercase tracking-wider">Avg Rating</p>
              </div>
            </div>
            <div className="bg-white border border-[#BBDEFB] rounded-2xl p-5 flex items-center gap-4 col-span-2 sm:col-span-1">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, unit, or comment…"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#E3F2FD] rounded-xl text-[13px] font-poppins text-[#000000] outline-none focus:ring-2 focus:ring-[#000000]/10 placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-xl flex items-center gap-3 shadow-sm border ${
                notification.type === 'success'
                  ? 'bg-green-50 border-green-100 text-green-700'
                  : 'bg-red-50 border-red-100 text-red-700'
              }`}
            >
              {notification.type === 'success' ? (
                <CheckCircle2 size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <span className="font-medium text-[15px]">{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table */}
        <div className="bg-white rounded-[32px] border border-[#BBDEFB] shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-16">
              <Loader2 className="animate-spin text-[#000000]" size={36} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center p-16 text-[#000000]/40 font-medium">
              {search ? 'No reviews match your search.' : 'No reviews yet.'}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#BBDEFB] text-[#000000]/50 text-[11px] font-bold uppercase tracking-wider">
                      <th className="px-6 py-5 w-10">#</th>
                      <th className="px-6 py-5">Reviewer</th>
                      <th className="px-6 py-5">Unit</th>
                      <th className="px-6 py-5 w-32">Rating</th>
                      <th className="px-6 py-5">Comment</th>
                      <th className="px-6 py-5 w-32">Date</th>
                      <th className="px-6 py-5 w-20 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#BBDEFB]">
                    {paginated.map((review, idx) => (
                      <React.Fragment key={review.id}>
                        <tr className="text-[#000000] hover:bg-[#FDFCFB] transition-colors">
                          <td className="px-6 py-5 text-[#000000]/40 font-semibold text-sm">
                            {(page - 1) * PAGE_SIZE + idx + 1}
                          </td>
                          <td className="px-6 py-5">
                            <span className="font-semibold text-[14px]">{review.fullName}</span>
                          </td>
                          <td className="px-6 py-5 text-[#888] text-[13px]">
                            {review.unitName || `Unit #${review.unitId}`}
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col gap-0.5">
                              <StarDisplay rate={review.rate} />
                              <span className="text-[11px] text-gray-400">{review.rate}/5</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 max-w-[260px]">
                            <p className="text-[13px] text-[#555] line-clamp-2 leading-relaxed">
                              {review.comment}
                            </p>
                          </td>
                          <td className="px-6 py-5 text-[#888] text-[12px] whitespace-nowrap">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex justify-end">
                              <button
                                onClick={() =>
                                  setDeletingId(deletingId === review.id ? null : review.id)
                                }
                                title="Delete review"
                                className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Delete Confirm Row */}
                        <AnimatePresence>
                          {deletingId === review.id && (
                            <tr>
                              <td colSpan={7} className="px-6 pb-5">
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mt-1 flex items-center gap-4 flex-wrap">
                                    <AlertCircle size={18} className="text-red-500 shrink-0" />
                                    <p className="text-red-700 font-medium text-[13px] flex-1">
                                      Delete review by{' '}
                                      <strong>&quot;{review.fullName}&quot;</strong>? This cannot
                                      be undone.
                                    </p>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleDelete(review.id)}
                                        disabled={deleting}
                                        className="flex items-center gap-1.5 bg-red-500 text-white px-5 py-2 rounded-full text-[12px] font-bold hover:bg-red-600 transition-all disabled:opacity-50"
                                      >
                                        {deleting && (
                                          <Loader2 className="animate-spin" size={12} />
                                        )}
                                        Yes, Delete
                                      </button>
                                      <button
                                        onClick={() => setDeletingId(null)}
                                        className="px-5 py-2 rounded-full text-[12px] font-bold border border-red-200 text-red-500 hover:bg-red-100 transition-all"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                </motion.div>
                              </td>
                            </tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 p-6 border-t border-[#BBDEFB]">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="p-2 rounded-full border border-[#BBDEFB] text-[#000000] disabled:opacity-30 hover:bg-[#E3F2FD] transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="font-semibold text-[15px] text-[#000000]">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="p-2 rounded-full border border-[#BBDEFB] text-[#000000] disabled:opacity-30 hover:bg-[#E3F2FD] transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}
