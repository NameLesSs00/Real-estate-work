'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import {
  createProjectImagePricelist,
  deleteProjectImagePricelist,
  getProjectImagePricelists,
  Project,
  ProjectImagePricelist,
  resolveProjectImageUrl,
  updateProjectImagePricelist,
} from '@/lib/api/projects';

interface ProjectPriceListsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

type FormMode = 'create' | 'edit';

interface PriceListForm {
  id: number | null;
  name: string;
  displayOrder: string;
  image: File | null;
  imagePreview: string | null;
  currentImageUrl: string | null;
}

const EMPTY_FORM: PriceListForm = {
  id: null,
  name: '',
  displayOrder: '1',
  image: null,
  imagePreview: null,
  currentImageUrl: null,
};

export default function ProjectPriceListsModal({ isOpen, onClose, project }: ProjectPriceListsModalProps) {
  useBodyScrollLock(isOpen);
  useEscapeKey(onClose, isOpen);

  const [priceLists, setPriceLists] = useState<ProjectImagePricelist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [form, setForm] = useState<PriceListForm>(EMPTY_FORM);
  const [error, setError] = useState('');
  const [formKey, setFormKey] = useState(0);

  const sortedPriceLists = useMemo(
    () => [...priceLists].sort((a, b) => a.displayOrder - b.displayOrder || a.id - b.id),
    [priceLists]
  );

  const nextDisplayOrder = useCallback(() => {
    if (!priceLists.length) return 1;
    return Math.max(...priceLists.map((item) => item.displayOrder || 0)) + 1;
  }, [priceLists]);

  const revokePreview = useCallback((preview: string | null) => {
    if (preview) URL.revokeObjectURL(preview);
  }, []);

  const resetForm = useCallback((order?: number) => {
    setForm((current) => {
      revokePreview(current.imagePreview);
      return {
        ...EMPTY_FORM,
        displayOrder: String(order ?? nextDisplayOrder()),
      };
    });
    setFormMode('create');
    setFormKey((key) => key + 1);
  }, [nextDisplayOrder, revokePreview]);

  const fetchPriceLists = useCallback(async () => {
    if (!project?.id) return;
    setIsLoading(true);
    setError('');
    try {
      const data = await getProjectImagePricelists(project.id);
      setPriceLists(data);
    } catch (err) {
      console.error('[ProjectPriceListsModal] Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load price list images.');
    } finally {
      setIsLoading(false);
    }
  }, [project?.id]);

  useEffect(() => {
    if (!isOpen || !project?.id) return;
    fetchPriceLists();
  }, [fetchPriceLists, isOpen, project?.id]);

  useEffect(() => {
    if (!isOpen) return;
    resetForm();
    setConfirmDeleteId(null);
    setError('');
  }, [isOpen, resetForm]);

  useEffect(() => {
    return () => {
      revokePreview(form.imagePreview);
    };
  }, [form.imagePreview, revokePreview]);

  useEffect(() => {
    if (formMode === 'create' && !form.name && !form.image && form.displayOrder === '1') {
      setForm((current) => ({ ...current, displayOrder: String(nextDisplayOrder()) }));
    }
  }, [form.displayOrder, form.image, form.name, formMode, nextDisplayOrder]);

  if (!isOpen || !project) return null;

  const imageSource = form.imagePreview || resolveProjectImageUrl(form.currentImageUrl);

  const updateForm = (patch: Partial<PriceListForm>) => {
    setForm((current) => ({ ...current, ...patch }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((current) => {
      revokePreview(current.imagePreview);
      return {
        ...current,
        image: file,
        imagePreview: file ? URL.createObjectURL(file) : null,
      };
    });
  };

  const handleEdit = (item: ProjectImagePricelist) => {
    setForm((current) => {
      revokePreview(current.imagePreview);
      return {
        id: item.id,
        name: item.name,
        displayOrder: String(item.displayOrder),
        image: null,
        imagePreview: null,
        currentImageUrl: item.imageUrl,
      };
    });
    setFormMode('edit');
    setConfirmDeleteId(null);
    setError('');
    setFormKey((key) => key + 1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!project?.id) return;

    const name = form.name.trim();
    const displayOrder = Number(form.displayOrder);

    if (!name) {
      setError('Price list name is required.');
      return;
    }

    if (!Number.isInteger(displayOrder) || displayOrder < 1) {
      setError('Display order must be a positive whole number.');
      return;
    }

    if (formMode === 'create' && !form.image) {
      setError('Price list image is required.');
      return;
    }

    const duplicateOrder = priceLists.some((item) => item.displayOrder === displayOrder && item.id !== form.id);
    if (duplicateOrder) {
      setError('Another price list already uses this display order.');
      return;
    }

    setIsSaving(true);
    setError('');
    try {
      if (formMode === 'edit' && form.id) {
        await updateProjectImagePricelist(project.id, form.id, {
          name,
          displayOrder,
          image: form.image,
        });
      } else {
        await createProjectImagePricelist(project.id, {
          name,
          displayOrder,
          image: form.image,
        });
      }

      await fetchPriceLists();
      resetForm(displayOrder + 1);
    } catch (err) {
      console.error('[ProjectPriceListsModal] Save error:', err);
      setError(err instanceof Error ? err.message : 'Failed to save price list image.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (item: ProjectImagePricelist) => {
    if (!project?.id) return;

    if (confirmDeleteId !== item.id) {
      setConfirmDeleteId(item.id);
      return;
    }

    setDeletingId(item.id);
    setError('');
    try {
      await deleteProjectImagePricelist(project.id, item.id);
      await fetchPriceLists();
      if (form.id === item.id) resetForm();
      setConfirmDeleteId(null);
    } catch (err) {
      console.error('[ProjectPriceListsModal] Delete error:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete price list image.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-inter">
      <div className="bg-white rounded-[32px] w-full max-w-[1040px] max-h-[92vh] flex flex-col shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#000000] px-8 py-5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-white text-[20px] font-bold">Project Price Lists</h2>
            <p className="text-white/60 text-[13px] mt-1">{project.name}</p>
          </div>
          <button onClick={onClose} className="hover:opacity-80 transition-opacity cursor-pointer border-none bg-transparent outline-none">
            <Image src="/admin/units/addUnit/close-square.png" alt="Close" width={26} height={26} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide p-8 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8">
          <form onSubmit={handleSubmit} className="bg-[#F8F9FA] border border-gray-100 rounded-[24px] p-6 h-fit space-y-5">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-[18px] font-bold text-[#000000]">
                {formMode === 'edit' ? 'Edit Price List' : 'Add Price List'}
              </h3>
              {formMode === 'edit' && (
                <button
                  type="button"
                  onClick={() => resetForm()}
                  className="text-[13px] font-bold text-[#64748B] hover:text-[#000000] cursor-pointer"
                >
                  New
                </button>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[#000000] font-bold text-[14px]">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateForm({ name: e.target.value })}
                className="w-full border border-gray-200 bg-white rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-[#000000]/5 text-[#000000] placeholder-gray-400 font-medium"
                placeholder="Price list name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[#000000] font-bold text-[14px]">Display Order *</label>
              <input
                type="number"
                min={1}
                step={1}
                value={form.displayOrder}
                onChange={(e) => updateForm({ displayOrder: e.target.value })}
                className="w-full border border-gray-200 bg-white rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-[#000000]/5 text-[#000000] placeholder-gray-400 font-medium"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[#000000] font-bold text-[14px]">Image {formMode === 'create' ? '*' : ''}</label>
              {imageSource && (
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
                  <Image src={imageSource} alt={form.name || 'Price list image'} fill className="object-cover" />
                </div>
              )}
              <label htmlFor={`price-list-image-${project.id}-${formKey}`} className="border-2 border-dashed border-gray-200 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                <Image src="/admin/units/addUnit/upload.png" alt="Upload" width={28} height={28} className="opacity-50" />
                <span className="text-[#475467] font-semibold text-[14px]">
                  {imageSource ? 'Replace image' : 'Upload image'}
                </span>
              </label>
              <input
                key={formKey}
                type="file"
                id={`price-list-image-${project.id}-${formKey}`}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            {error && <p className="text-red-500 text-[13px] leading-relaxed">{error}</p>}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-4 rounded-2xl bg-[#000000] hover:bg-[#1a304a] text-white font-bold transition-all cursor-pointer shadow-lg shadow-[#000000]/15 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isSaving ? 'Saving...' : formMode === 'edit' ? 'Save Price List' : 'Create Price List'}
            </button>
          </form>

          <div className="min-w-0">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[18px] font-bold text-[#000000]">
                Price Lists <span className="text-[14px] font-normal text-gray-400">({priceLists.length})</span>
              </h3>
              <button
                type="button"
                onClick={fetchPriceLists}
                disabled={isLoading}
                className="text-[13px] font-bold text-[#000000] border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
              >
                Refresh
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-24">
                <div className="w-10 h-10 border-4 border-[#000000] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : sortedPriceLists.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 rounded-[24px] p-12 text-center text-gray-400">
                <p className="text-[15px] font-semibold">No price lists yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedPriceLists.map((item) => {
                  const resolvedImage = resolveProjectImageUrl(item.imageUrl);
                  const isEditing = form.id === item.id;
                  const isConfirmingDelete = confirmDeleteId === item.id;

                  return (
                    <div key={item.id} className={`border rounded-[20px] overflow-hidden bg-white transition-all ${isEditing ? 'border-[#000000] shadow-md' : 'border-gray-100 hover:shadow-md'}`}>
                      <div className="relative aspect-video bg-gray-100">
                        {resolvedImage ? (
                          <Image src={resolvedImage} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-[13px]">No image</div>
                        )}
                        <div className="absolute top-3 left-3 bg-white/95 text-[#000000] rounded-full px-3 py-1 text-[12px] font-black shadow-sm">
                          #{item.displayOrder}
                        </div>
                      </div>
                      <div className="p-4 space-y-4">
                        <div>
                          <h4 className="text-[#000000] text-[16px] font-bold truncate">{item.name}</h4>
                          <p className="text-[#94A3B8] text-[12px] mt-1">ID {item.id}</p>
                        </div>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[#000000] font-bold text-[13px] hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            disabled={deletingId === item.id}
                            className={`flex-1 py-2.5 rounded-xl font-bold text-[13px] cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                              isConfirmingDelete
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'border border-red-200 text-red-500 hover:bg-red-50'
                            }`}
                          >
                            {deletingId === item.id ? 'Deleting...' : isConfirmingDelete ? 'Confirm' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="px-8 py-5 border-t border-gray-100 shrink-0 flex justify-end bg-white">
          <button onClick={onClose} className="bg-[#000000] hover:bg-[#1a304a] text-white font-bold px-16 py-3.5 rounded-2xl transition-all cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
