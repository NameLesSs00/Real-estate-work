'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Edit2, Loader2, Plus, Search, Trash2, X } from 'lucide-react';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import IconPicker from '@/components/admin/IconPicker';
import {
  createProjectType,
  deleteProjectType,
  getProjectTypeById,
  getProjectTypes,
  ProjectType,
  updateProjectType,
} from '@/lib/api/projectTypes';
import {
  DEFAULT_PROJECT_TYPE_ICON_NAME,
  PROJECT_TYPE_ICON_CATEGORIES,
  PROJECT_TYPE_ICON_OPTIONS,
  getProjectTypeIcon,
} from '@/lib/icons/projectTypeIcons';

const EMPTY_FORM = {
  name: { en: '', de: '', it: '' },
  icon: null as string | null,
};

export default function ProjectTypesPage() {
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isFetchingDetails, setIsFetchingDetails] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const notify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchProjectTypes = useCallback(async (nextPage: number, searchTerm = searchQuery) => {
    setLoading(true);
    try {
      const data = await getProjectTypes({
        pageNumber: nextPage,
        pageSize: 10,
        searchTerm: searchTerm.trim() || undefined,
      });
      setProjectTypes(data.items);
      setPage(data.pageNumber || nextPage);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
    } catch {
      notify('error', 'Failed to load project types.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchProjectTypes(1);
  }, [fetchProjectTypes]);

  const openAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = async (projectType: ProjectType) => {
    setIsFetchingDetails(projectType.id);
    setCurrentId(projectType.id);
    setIsEditing(true);

    const fallbackName = typeof projectType.name === 'object'
      ? projectType.name
      : { en: projectType.name, de: projectType.name, it: projectType.name };

    setFormData({
      name: {
        en: fallbackName.en || '',
        de: fallbackName.de || '',
        it: fallbackName.it || '',
      },
      icon: projectType.icon ?? null,
    });

    try {
      const [enRes, deRes, itRes] = await Promise.all([
        getProjectTypeById(projectType.id, 'en'),
        getProjectTypeById(projectType.id, 'de'),
        getProjectTypeById(projectType.id, 'it'),
      ]);

      setFormData({
        name: {
          en: typeof enRes.name === 'string' ? enRes.name : enRes.name.en || '',
          de: typeof deRes.name === 'string' ? deRes.name : deRes.name.de || '',
          it: typeof itRes.name === 'string' ? itRes.name : itRes.name.it || '',
        },
        icon: enRes.icon ?? projectType.icon ?? null,
      });
    } catch (error) {
      console.error('Failed to fetch project type details:', error);
      notify('error', 'Failed to load full project type details.');
    } finally {
      setIsFetchingDetails(null);
      setShowModal(true);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.name.en.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: {
          en: formData.name.en.trim(),
          de: formData.name.de.trim() || formData.name.en.trim(),
          it: formData.name.it.trim() || formData.name.en.trim(),
        },
        icon: formData.icon,
      };

      if (isEditing && currentId) {
        await updateProjectType({ id: currentId, ...payload });
        notify('success', 'Project type updated successfully!');
      } else {
        await createProjectType(payload);
        notify('success', 'Project type created successfully!');
      }

      setShowModal(false);
      setFormData(EMPTY_FORM);
      fetchProjectTypes(page);
    } catch {
      notify('error', `Failed to ${isEditing ? 'update' : 'create'} project type.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;

    setIsDeleting(true);
    try {
      await deleteProjectType(deleteId);
      notify('success', 'Project type deleted successfully!');
      fetchProjectTypes(page);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete project type.';
      notify('error', message);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    fetchProjectTypes(1, searchQuery);
  };

  const getDisplayName = (projectType: ProjectType) => {
    if (typeof projectType.name === 'object' && projectType.name !== null) {
      return projectType.name.en || projectType.name.de || projectType.name.it || 'Unknown';
    }
    return projectType.name;
  };

  return (
    <div className="min-h-screen bg-admin-bg p-8 font-inter md:p-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="mb-2 text-[36px] font-bold text-brand-primary">Project Types</h1>
            <p className="text-lg text-admin-muted">Manage unit and property type labels used across the platform.</p>
          </div>
          <button
            type="button"
            onClick={openAdd}
            className="flex items-center gap-3 rounded-2xl bg-brand-primary px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-brand-primary-hover active:scale-95"
          >
            <Plus size={20} />
            Add New Project Type
          </button>
        </div>

        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-8 flex items-center gap-3 rounded-2xl border p-4 shadow-sm ${
                notification.type === 'success'
                  ? 'border-green-100 bg-green-50 text-green-700'
                  : 'border-red-100 bg-red-50 text-red-700'
              }`}
            >
              <CheckCircle2 size={20} />
              <span className="font-semibold">{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSearch} className="mb-8 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search project types..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-2xl border border-gray-100 bg-white py-4 pl-14 pr-6 text-[16px] shadow-sm outline-none transition-all focus:ring-4 focus:ring-brand-primary/5"
            />
          </div>
          <button
            type="submit"
            className="rounded-2xl bg-white px-7 py-4 text-[14px] font-bold text-brand-primary shadow-sm transition-all hover:bg-brand-primary hover:text-white"
          >
            Search
          </button>
        </form>

        <div className="overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr className="text-[14px] font-bold uppercase tracking-wider text-brand-primary">
                <th className="w-24 px-8 py-6">ID</th>
                <th className="w-56 px-8 py-6">Icon</th>
                <th className="px-8 py-6">Name</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && projectTypes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center">
                    <Loader2 className="mx-auto animate-spin text-gray-400" size={32} />
                  </td>
                </tr>
              ) : (
                projectTypes.map((projectType) => {
                  const ProjectTypeIcon = getProjectTypeIcon(projectType.icon);

                  return (
                    <tr key={projectType.id} className="transition-colors hover:bg-gray-50/30">
                      <td className="px-8 py-6 font-mono text-sm text-gray-400">#{projectType.id}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary-soft text-brand-primary">
                            <ProjectTypeIcon size={20} />
                          </span>
                          <span className="text-[12px] font-semibold text-gray-400">{projectType.icon ?? 'Default'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[16px] font-bold text-brand-primary">{getDisplayName(projectType)}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(projectType)}
                            disabled={isFetchingDetails === projectType.id}
                            className="flex items-center justify-center rounded-xl p-2.5 text-brand-primary/70 transition-all hover:bg-gray-100 hover:text-brand-primary disabled:opacity-50"
                          >
                            {isFetchingDetails === projectType.id ? <Loader2 size={18} className="animate-spin" /> : <Edit2 size={18} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteId(projectType.id)}
                            className="rounded-xl p-2.5 text-red-400 transition-all hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
              {!loading && projectTypes.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-gray-400">
                    <p className="text-lg">No project types found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex flex-col gap-3 border-t border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-medium text-gray-500">
              {totalCount} project type{totalCount === 1 ? '' : 's'}
            </span>
            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <button
                type="button"
                onClick={() => fetchProjectTypes(Math.max(1, page - 1))}
                disabled={page === 1 || loading}
                className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
              <button
                type="button"
                onClick={() => fetchProjectTypes(Math.min(totalPages, page + 1))}
                disabled={page === totalPages || loading}
                className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[32px] bg-white shadow-xl"
              >
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/80 p-8 backdrop-blur-md">
                  <h2 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Project Type' : 'Add Project Type'}</h2>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-full p-2 transition-colors hover:bg-gray-100"
                  >
                    <X size={24} className="text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 p-8">
                  <div className="space-y-4">
                    <h3 className="border-b pb-2 text-lg font-bold text-brand-primary">Name</h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      <div className="space-y-2">
                        <label className="ml-1 text-sm font-bold text-gray-700">English *</label>
                        <input
                          type="text"
                          required
                          value={formData.name.en}
                          onChange={(event) => setFormData({ ...formData, name: { ...formData.name, en: event.target.value } })}
                          className="w-full rounded-xl border border-gray-100 bg-admin-bg px-4 py-3 outline-none focus:ring-2 focus:ring-brand-primary/10"
                          placeholder="e.g. Apartment"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="ml-1 text-sm font-bold text-gray-700">German</label>
                        <input
                          type="text"
                          value={formData.name.de}
                          onChange={(event) => setFormData({ ...formData, name: { ...formData.name, de: event.target.value } })}
                          className="w-full rounded-xl border border-gray-100 bg-admin-bg px-4 py-3 outline-none focus:ring-2 focus:ring-brand-primary/10"
                          placeholder="e.g. Wohnung"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="ml-1 text-sm font-bold text-gray-700">Italian</label>
                        <input
                          type="text"
                          value={formData.name.it}
                          onChange={(event) => setFormData({ ...formData, name: { ...formData.name, it: event.target.value } })}
                          className="w-full rounded-xl border border-gray-100 bg-admin-bg px-4 py-3 outline-none focus:ring-2 focus:ring-brand-primary/10"
                          placeholder="e.g. Appartamento"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="border-b pb-2 text-lg font-bold text-brand-primary">Icon</h3>
                    <IconPicker
                      value={formData.icon}
                      onChange={(icon) => setFormData({ ...formData, icon })}
                      options={PROJECT_TYPE_ICON_OPTIONS}
                      categories={PROJECT_TYPE_ICON_CATEGORIES}
                      getIcon={getProjectTypeIcon}
                      defaultIconName={DEFAULT_PROJECT_TYPE_ICON_NAME}
                      title="Choose Project Type Icon"
                      searchPlaceholder="Search apartment, bedroom, duplex..."
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-3 font-medium text-gray-500 transition-colors hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={isSubmitting}
                      className="flex items-center gap-2 rounded-xl bg-brand-primary px-8 py-3 font-bold text-white shadow-md transition-all hover:bg-gray-800 disabled:opacity-50"
                    >
                      {isSubmitting && <Loader2 className="animate-spin" size={18} />}
                      {isEditing ? 'Save Changes' : 'Create Project Type'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <ConfirmDialog
          isOpen={deleteId !== null}
          title="Delete Project Type"
          message="Are you sure you want to delete this project type? Existing units may still depend on it."
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
}
