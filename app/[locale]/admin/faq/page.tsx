'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, X, Loader2, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight
} from 'lucide-react';
import {
  getQuestions, createQuestion, updateQuestion, deleteQuestion, Question,
} from '@/lib/api/questions';

const PAGE_SIZE = 10;

export default function AdminFAQPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ title: '', description: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const totalPages = Math.ceil(questions.length / PAGE_SIZE);
  const paginated = questions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const notify = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      setQuestions(await getQuestions());
    } catch (err: unknown) {
      notify('error', err instanceof Error ? err.message : 'Failed to load FAQs.');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createQuestion(addForm);
      notify('success', 'FAQ added successfully.');
      setAddForm({ title: '', description: '' });
      setShowAdd(false);
      fetchQuestions();
    } catch (err: unknown) {
      notify('error', err instanceof Error ? err.message : 'Failed to add FAQ.');
    } finally { setSaving(false); }
  };

  const startEdit = (q: Question) => {
    setEditingId(q.id);
    setEditForm({ title: q.title, description: q.description });
    setDeletingId(null);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId === null) return;
    setSaving(true);
    try {
      await updateQuestion({ id: editingId, ...editForm });
      notify('success', 'FAQ updated successfully.');
      setEditingId(null);
      fetchQuestions();
    } catch (err: unknown) {
      notify('error', err instanceof Error ? err.message : 'Failed to update FAQ.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    setSaving(true);
    try {
      await deleteQuestion(id);
      notify('success', 'FAQ deleted successfully.');
      setDeletingId(null);
      fetchQuestions();
    } catch (err: unknown) {
      notify('error', err instanceof Error ? err.message : 'Failed to delete FAQ.');
    } finally { setSaving(false); }
  };

  const inputCls = 'w-full bg-[#F8F5F0] border-none rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#000000]/10 transition-all font-medium text-[#000000]';
  const inlineInputCls = 'w-full bg-white border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#000000]/10 font-medium text-[#000000]';

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-4 md:p-8 pt-10">
      <div className="max-w-[1100px] mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-[32px] font-bold text-[#000000] font-radley mb-1">FAQ Management</h1>
            <p className="text-[#666] font-poppins text-sm">Add, edit, and remove frequently asked questions.</p>
          </div>
          <button
            onClick={() => { setShowAdd(!showAdd); setEditingId(null); setDeletingId(null); }}
            className="flex items-center gap-2 bg-[#000000] text-white px-6 py-3 rounded-full font-semibold text-[14px] shadow-md hover:scale-105 transition-all"
          >
            {showAdd ? <X size={16} /> : <Plus size={16} />}
            {showAdd ? 'Cancel' : 'Add New FAQ'}
          </button>
        </div>

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-xl flex items-center gap-3 shadow-sm border ${
                notification.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
              }`}
            >
              {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="font-medium text-[15px]">{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Form */}
        <AnimatePresence>
          {showAdd && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-6">
              <div className="bg-white rounded-[24px] border border-[#F0EDE8] shadow-sm p-8">
                <h2 className="text-xl font-bold text-[#000000] mb-6 font-radley">New FAQ</h2>
                <form onSubmit={handleAdd} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-[#000000] ml-1">Question (Title)</label>
                    <input type="text" value={addForm.title} onChange={(e) => setAddForm({ ...addForm, title: e.target.value })} placeholder="e.g. How do I schedule a property visit?" className={inputCls} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-[#000000] ml-1">Answer (Description)</label>
                    <textarea value={addForm.description} onChange={(e) => setAddForm({ ...addForm, description: e.target.value })} placeholder="Type the answer here…" rows={4} className={`${inputCls} resize-none`} required />
                  </div>
                  <button type="submit" disabled={saving} className="bg-[#000000] text-white px-10 py-4 rounded-full font-bold text-[15px] shadow-lg hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2">
                    {saving && <Loader2 className="animate-spin" size={18} />}
                    Save FAQ
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table */}
        <div className="bg-white rounded-[32px] border border-[#F0EDE8] shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-16"><Loader2 className="animate-spin text-[#000000]" size={36} /></div>
          ) : questions.length === 0 ? (
            <div className="text-center p-16 text-[#000000]/40 font-medium">No FAQs yet. Click &quot;Add New FAQ&quot; to create the first one.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#F0EDE8] text-[#000000]/50 text-[12px] font-bold uppercase tracking-wider">
                      <th className="px-6 py-5 w-10">#</th>
                      <th className="px-6 py-5">Question</th>
                      <th className="px-6 py-5 w-40">Added</th>
                      <th className="px-6 py-5 w-32 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EDE8]">
                    {paginated.map((q, idx) => (
                      <React.Fragment key={q.id}>
                        <tr className="text-[#000000] hover:bg-[#FDFCFB] transition-colors">
                          <td className="px-6 py-5 text-[#000000]/40 font-semibold text-sm">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                          <td className="px-6 py-5">
                            <span className="font-semibold text-[15px]">{q.title}</span>
                            <p className="text-[#888] text-sm mt-0.5 line-clamp-1">{q.description}</p>
                          </td>
                          <td className="px-6 py-5 text-[#888] text-sm">{new Date(q.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-5">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => startEdit(q)} title="Edit" className="p-2 rounded-lg hover:bg-[#F0EDE8] text-[#000000] transition-colors"><Pencil size={16} /></button>
                              <button onClick={() => setDeletingId(deletingId === q.id ? null : q.id)} title="Delete" className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>

                        {/* Edit Row */}
                        <AnimatePresence>
                          {editingId === q.id && (
                            <tr><td colSpan={4} className="px-6 pb-6">
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="bg-[#F8F5F0] rounded-2xl p-6 mt-2">
                                  <h3 className="font-bold text-[#000000] mb-4 text-[15px]">Edit FAQ</h3>
                                  <form onSubmit={handleEdit} className="space-y-4">
                                    <div className="space-y-1"><label className="text-[12px] font-bold text-[#000000] ml-1">Question</label><input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className={inlineInputCls} required /></div>
                                    <div className="space-y-1"><label className="text-[12px] font-bold text-[#000000] ml-1">Answer</label><textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={3} className={`${inlineInputCls} resize-none`} required /></div>
                                    <div className="flex gap-3">
                                      <button type="submit" disabled={saving} className="bg-[#000000] text-white px-8 py-3 rounded-full font-bold text-[14px] hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2">{saving && <Loader2 className="animate-spin" size={16} />}Save Changes</button>
                                      <button type="button" onClick={() => setEditingId(null)} className="px-8 py-3 rounded-full font-bold text-[14px] border border-[#E0DBD4] text-[#000000] hover:bg-[#F0EDE8] transition-all">Cancel</button>
                                    </div>
                                  </form>
                                </div>
                              </motion.div>
                            </td></tr>
                          )}
                        </AnimatePresence>

                        {/* Delete Confirm Row */}
                        <AnimatePresence>
                          {deletingId === q.id && (
                            <tr><td colSpan={4} className="px-6 pb-6">
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mt-2 flex items-center gap-4 flex-wrap">
                                  <AlertCircle size={20} className="text-red-500 shrink-0" />
                                  <p className="text-red-700 font-medium text-[14px] flex-1">Delete <strong>&quot;{q.title}&quot;</strong>? This cannot be undone.</p>
                                  <div className="flex gap-3">
                                    <button onClick={() => handleDelete(q.id)} disabled={saving} className="bg-red-500 text-white px-6 py-2.5 rounded-full font-bold text-[13px] hover:bg-red-600 transition-all disabled:opacity-50 flex items-center gap-2">{saving && <Loader2 className="animate-spin" size={14} />}Yes, Delete</button>
                                    <button onClick={() => setDeletingId(null)} className="px-6 py-2.5 rounded-full font-bold text-[13px] border border-red-200 text-red-500 hover:bg-red-100 transition-all">Cancel</button>
                                  </div>
                                </div>
                              </motion.div>
                            </td></tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 p-6 border-t border-[#F0EDE8]">
                  <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-2 rounded-full border border-[#F0EDE8] text-[#000000] disabled:opacity-30 hover:bg-[#F8F5F0] transition-colors"><ChevronLeft size={20} /></button>
                  <span className="font-semibold text-[15px] text-[#000000]">Page {page} of {totalPages}</span>
                  <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="p-2 rounded-full border border-[#F0EDE8] text-[#000000] disabled:opacity-30 hover:bg-[#F8F5F0] transition-colors"><ChevronRight size={20} /></button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
