'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Loader2, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import {
  Review,
  getReviewsByUnit,
  getAverageRating,
  createReview,
  deleteReview,
} from '@/lib/api/reviews';

// ── Star renderer ─────────────────────────────────────────────────────────────

function StarRow({
  rating,
  size = 16,
  interactive = false,
  onChange,
}: {
  rating: number;
  size?: number;
  interactive?: boolean;
  onChange?: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const display = interactive ? (hovered || rating) : rating;

  // Non-interactive: render spans to avoid any form interference
  if (!interactive) {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <span key={s} style={{ display: 'inline-flex' }}>
            <Star
              size={size}
              className={display >= s ? 'text-amber-400' : 'text-gray-200'}
              fill={display >= s ? 'var(--color-status-star)' : 'none'}
            />
          </span>
        ))}
      </div>
    );
  }

  // Interactive: always type="button" so clicks never submit a parent form
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange?.(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          className="cursor-pointer transition-transform hover:scale-110"
          style={{ background: 'none', border: 'none', padding: 0 }}
          aria-label={`Rate ${s} star${s > 1 ? 's' : ''}`}
        >
          <Star
            size={size}
            className={display >= s ? 'text-amber-400' : 'text-gray-200'}
            fill={display >= s ? 'var(--color-status-star)' : 'none'}
          />
        </button>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface UnitReviewsProps {
  unitId: number;
}

export default function UnitReviews({ unitId }: UnitReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);

  // Session-based ownership — lost on page leave
  const [myReviewId, setMyReviewId] = useState<number | null>(null);

  // Add-review form
  const [form, setForm] = useState({ fullName: '', comment: '', rate: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete confirm
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Notification
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const notify = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [reviewsData, avgData] = await Promise.all([
        getReviewsByUnit(unitId),
        getAverageRating(unitId),
      ]);
      setReviews(reviewsData);
      setAvgRating(avgData?.averageRating ?? 0);
    } catch {
      // silently fail — non-critical
    } finally {
      setLoading(false);
    }
  }, [unitId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Submit new review ────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (form.rate === 0) {
      setFormError('Please select a star rating.');
      return;
    }
    setSubmitting(true);
    try {
      const created = await createReview({
        fullName: form.fullName,
        unitId,
        comment: form.comment,
        rate: form.rate,
      });
      setMyReviewId(created.id);
      setForm({ fullName: '', comment: '', rate: 0 });
      notify('success', 'Your review has been submitted!');
      fetchData();
    } catch (err: unknown) {
      notify('error', err instanceof Error ? err.message : 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete review ────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!myReviewId) return;
    setDeleting(true);
    try {
      await deleteReview(myReviewId, false);
      notify('success', 'Review deleted.');
      setMyReviewId(null);
      setConfirmDelete(false);
      fetchData();
    } catch (err: unknown) {
      notify('error', err instanceof Error ? err.message : 'Failed to delete review.');
    } finally {
      setDeleting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  const myReview = reviews.find((r) => r.id === myReviewId);
  const otherReviews = reviews.filter((r) => r.id !== myReviewId);

  const inputCls =
    'w-full border border-brand-divider rounded-[10px] px-4 py-3 text-[14px] placeholder:text-brand-muted-light outline-none focus:border-brand-primary transition-colors font-poppins bg-white';

  return (
    <div className="bg-white border border-brand-divider rounded-[24px] p-6 sm:p-8 shadow-sm">
      {/* Section heading */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-[20px] font-bold text-brand-primary font-poppins">Reviews</h2>
        <div className="h-px flex-1 bg-gray-100" />
      </div>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className={`mb-5 p-4 rounded-xl flex items-center gap-3 shadow-sm border text-[14px] font-medium ${
              notification.type === 'success'
                ? 'bg-green-50 border-green-100 text-green-700'
                : 'bg-red-50 border-red-100 text-red-700'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Rating Summary ── */}
      {!loading && reviews.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-brand-bg rounded-2xl p-5 mb-7"
        >
          <div className="flex flex-col items-center">
            <span className="text-[48px] font-bold text-brand-primary leading-none font-poppins">
              {avgRating.toFixed(1)}
            </span>
            <span className="text-[12px] text-gray-400 mt-1">out of 5</span>
          </div>
          <div className="flex flex-col justify-center gap-2">
            <StarRow rating={Math.round(avgRating)} size={22} />
            <p className="text-[13px] text-gray-500 font-poppins">
              Based on <strong className="text-brand-primary">{reviews.length}</strong>{' '}
              {reviews.length === 1 ? 'review' : 'reviews'}
            </p>
          </div>
        </motion.div>
      )}

      {/* ── Reviews List ── */}
      {loading ? (
        <div className="space-y-4 mb-7">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse bg-brand-bg rounded-2xl h-24" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-[14px] text-gray-400 italic font-poppins text-center py-6 mb-4">
          Be the first to review this property!
        </p>
      ) : (
        <div className="space-y-4 mb-7">
          {/* My review (pinned top) */}
          {myReview && (
            <motion.div
              key={myReview.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-2 border-brand-primary/10 bg-brand-primary/[0.02] rounded-2xl p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[15px] text-brand-primary font-poppins">
                      {myReview.fullName}
                    </span>
                    <span className="text-[11px] bg-brand-primary text-white px-2 py-0.5 rounded-full font-semibold">
                      You
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRow rating={myReview.rate} size={14} />
                    <span className="text-[12px] text-gray-400">
                      {new Date(myReview.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => { setConfirmDelete(!confirmDelete); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-red-500 bg-white border border-red-100 hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
              <p className="text-[14px] text-brand-muted font-poppins leading-relaxed">
                {myReview.comment}
              </p>


              <AnimatePresence>
                {confirmDelete && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                      <p className="text-[13px] text-red-700 font-medium flex-1">
                        Delete your review? This cannot be undone.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={handleDelete}
                          disabled={deleting}
                          className="flex items-center gap-1.5 bg-red-500 text-white px-5 py-2 rounded-full text-[12px] font-bold hover:bg-red-600 transition-all disabled:opacity-50"
                        >
                          {deleting && <Loader2 size={12} className="animate-spin" />}
                          Yes, Delete
                        </button>
                        <button
                          onClick={() => setConfirmDelete(false)}
                          className="px-5 py-2 rounded-full text-[12px] font-bold border border-red-200 text-red-500 hover:bg-red-100 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Other reviews */}
          {otherReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-brand-bg border border-brand-divider rounded-2xl p-5"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="font-bold text-[15px] text-brand-primary font-poppins">
                    {review.fullName}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRow rating={review.rate} size={13} />
                    <span className="text-[12px] text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[14px] text-brand-muted font-poppins leading-relaxed">
                {review.comment}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Add Review Form (hidden if visitor already submitted this session) ── */}
      {!myReviewId && (
        <div className="border-t border-brand-divider pt-6">
          <h3 className="text-[16px] font-bold text-brand-primary font-poppins mb-4">
            Write a Review
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-brand-primary">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className={inputCls}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-brand-primary">
                Rating <span className="text-red-500">*</span>
              </label>
              <StarRow
                rating={form.rate}
                size={26}
                interactive
                onChange={(r) => setForm({ ...form, rate: r })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-brand-primary">
                Comment <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Share your experience with this property…"
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                className={`${inputCls} resize-none`}
              />
            </div>

            {formError && (
              <p className="text-red-500 text-[12px] font-poppins flex items-center gap-1.5">
                <AlertCircle size={13} /> {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-primary text-white px-10 py-4 rounded-full text-[15px] font-semibold hover:bg-brand-primary transition-all disabled:opacity-50"
            >
              {submitting && <Loader2 size={18} className="animate-spin" />}
              Submit Review
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
