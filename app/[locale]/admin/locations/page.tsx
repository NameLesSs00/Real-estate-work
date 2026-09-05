'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Camera, Check, Edit2, ImageIcon, Loader2, MapPin, Plus, Search, Star, Trash2, X } from 'lucide-react';
import {
  createLocation,
  deleteLocation,
  getLocationById,
  getLocations,
  Location,
  resolveLocationImageUrl,
  updateLocation,
  UpdateLocationPayload,
} from '@/lib/api/locations';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import Toast from '@/components/admin/Toast';

type LanguageKey = 'en' | 'de' | 'it';

interface LocationForm {
  mainLocation: Record<LanguageKey, string>;
  subLocation: Record<LanguageKey, string>;
  locationImage: File | null;
  locationImagePreview: string | null;
  currentImageUrl: string | null;
  isFeature: boolean;
}

const EMPTY_FORM: LocationForm = {
  mainLocation: { en: '', de: '', it: '' },
  subLocation: { en: '', de: '', it: '' },
  locationImage: null,
  locationImagePreview: null,
  currentImageUrl: null,
  isFeature: false,
};

const LANGUAGES: { key: LanguageKey; label: string; required?: boolean }[] = [
  { key: 'en', label: 'English', required: true },
  { key: 'de', label: 'German' },
  { key: 'it', label: 'Italian' },
];

const getDisplayImage = (location: Location) => resolveLocationImageUrl(location.locationImageUrl || location.imageUrl);
const getMainLocation = (location: Location) => location.mainLocation || location.city || '-';
const getSubLocation = (location: Location) => location.subLocation || location.district || '';

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [featureFilter, setFeatureFilter] = useState<'all' | 'featured'>('all');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string; isVisible: boolean }>({
    type: 'success',
    message: '',
    isVisible: false,
  });

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [isFetchingDetails, setIsFetchingDetails] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<LocationForm>(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchLocationsList = useCallback(async (nextPage: number) => {
    setLoading(true);
    try {
      const data = await getLocations({
        pageNumber: nextPage,
        pageSize: 10,
        isFeature: featureFilter === 'featured' ? true : undefined,
      });
      setLocations(data.items || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
      setPage(data.pageNumber || nextPage);
    } catch {
      notify('error', 'Failed to load locations.');
    } finally {
      setLoading(false);
    }
  }, [featureFilter]);

  useEffect(() => {
    fetchLocationsList(page);
  }, [page, fetchLocationsList]);

  const filteredLocations = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return locations;

    return locations.filter((location) => (
      getMainLocation(location).toLowerCase().includes(term) ||
      getSubLocation(location).toLowerCase().includes(term) ||
      location.country?.toLowerCase().includes(term)
    ));
  }, [locations, searchQuery]);

  const notify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message, isVisible: true });
  };

  const resetForm = () => {
    if (formData.locationImagePreview) URL.revokeObjectURL(formData.locationImagePreview);
    setFormData(EMPTY_FORM);
    setFormError('');
  };

  const openAdd = () => {
    resetForm();
    setIsEditing(false);
    setCurrentId(null);
    setShowModal(true);
  };

  const openEdit = async (location: Location) => {
    resetForm();
    setIsFetchingDetails(location.id);
    try {
      const [enRes, deRes, itRes] = await Promise.all([
        getLocationById(location.id, 'en'),
        getLocationById(location.id, 'de'),
        getLocationById(location.id, 'it'),
      ]);

      setFormData({
        mainLocation: {
          en: getMainLocation(enRes),
          de: getMainLocation(deRes),
          it: getMainLocation(itRes),
        },
        subLocation: {
          en: getSubLocation(enRes),
          de: getSubLocation(deRes),
          it: getSubLocation(itRes),
        },
        locationImage: null,
        locationImagePreview: null,
        currentImageUrl: location.locationImageUrl || location.imageUrl,
        isFeature: location.isFeature,
      });
      setIsEditing(true);
      setCurrentId(location.id);
      setShowModal(true);
    } catch (error) {
      console.error('[LocationsPage] Failed to fetch location details:', error);
      notify('error', 'Failed to load location details.');
    } finally {
      setIsFetchingDetails(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const updateLocalizedField = (field: 'mainLocation' | 'subLocation', lang: LanguageKey, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }));
    setFormError('');
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setFormData((prev) => {
      if (prev.locationImagePreview) URL.revokeObjectURL(prev.locationImagePreview);
      return {
        ...prev,
        locationImage: file,
        locationImagePreview: file ? URL.createObjectURL(file) : null,
      };
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const mainEn = formData.mainLocation.en.trim();

    if (!mainEn) {
      setFormError('Main Location in English is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        mainLocation: {
          en: mainEn,
          de: formData.mainLocation.de.trim() || mainEn,
          it: formData.mainLocation.it.trim() || mainEn,
        },
        subLocation: {
          en: formData.subLocation.en.trim(),
          de: formData.subLocation.de.trim(),
          it: formData.subLocation.it.trim(),
        },
        locationImage: formData.locationImage,
        isFeature: formData.isFeature,
      };

      if (isEditing && currentId) {
        await updateLocation({ id: currentId, ...payload } as UpdateLocationPayload);
        notify('success', 'Location updated successfully.');
      } else {
        await createLocation(payload);
        notify('success', 'Location created successfully.');
      }

      closeModal();
      fetchLocationsList(page);
    } catch (error) {
      console.error('[LocationsPage] Submit failed:', error);
      notify('error', `Failed to ${isEditing ? 'update' : 'create'} location.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;
    setIsDeleting(true);
    try {
      await deleteLocation(deleteId);
      notify('success', 'Location deleted successfully.');
      fetchLocationsList(page);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete location.';
      notify('error', message);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const imagePreview = formData.locationImagePreview || resolveLocationImageUrl(formData.currentImageUrl);

  return (
    <div className="min-h-screen bg-admin-bg p-8 font-inter md:p-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="mb-2 text-[36px] font-bold text-brand-primary">Locations</h1>
            <p className="text-lg text-admin-muted">Manage main locations, optional sub locations, and featured areas.</p>
          </div>
          <button
            type="button"
            onClick={openAdd}
            className="flex items-center gap-3 rounded-2xl bg-brand-primary px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-brand-primary-hover active:scale-95"
          >
            <Plus size={20} />
            Add Location
          </button>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl">
              <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-7 py-5">
                <div>
                  <h2 className="text-[22px] font-bold text-brand-primary">{isEditing ? 'Edit Location' : 'Add Location'}</h2>
                  <p className="mt-1 text-[13px] font-medium text-gray-400">Main location is required. Sub location is optional.</p>
                </div>
                <button type="button" onClick={closeModal} className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-50 hover:text-brand-primary">
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto bg-admin-bg p-6">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px]">
                  <div className="space-y-5">
                    <section className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
                      <div className="mb-5 flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary-soft text-brand-primary">
                          <MapPin size={19} />
                        </span>
                        <div>
                          <h3 className="text-[17px] font-bold text-brand-primary">Main Location</h3>
                          <p className="text-[12px] font-medium text-gray-400">English is required. Other languages fallback to English.</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {LANGUAGES.map((language) => (
                          <div key={language.key} className="space-y-2">
                            <label className="text-[13px] font-bold text-brand-primary">{language.label}{language.required ? ' *' : ''}</label>
                            <input
                              type="text"
                              value={formData.mainLocation[language.key]}
                              onChange={(event) => updateLocalizedField('mainLocation', language.key, event.target.value)}
                              className={`w-full rounded-xl border bg-white px-4 py-3 text-[14px] font-semibold text-brand-primary outline-none transition focus:ring-4 focus:ring-brand-primary/5 ${
                                formError && language.key === 'en' ? 'border-red-200' : 'border-gray-200 focus:border-brand-primary/30'
                              }`}
                              placeholder="e.g. New Cairo"
                            />
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
                      <div className="mb-5 flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-brand-primary">
                          <MapPin size={19} />
                        </span>
                        <div>
                          <h3 className="text-[17px] font-bold text-brand-primary">Sub Location</h3>
                          <p className="text-[12px] font-medium text-gray-400">Optional neighborhood or district name.</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {LANGUAGES.map((language) => (
                          <div key={language.key} className="space-y-2">
                            <label className="text-[13px] font-bold text-brand-primary">{language.label}</label>
                            <input
                              type="text"
                              value={formData.subLocation[language.key]}
                              onChange={(event) => updateLocalizedField('subLocation', language.key, event.target.value)}
                              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[14px] font-semibold text-brand-primary outline-none transition focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/5"
                              placeholder="e.g. Downtown"
                            />
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  <aside className="space-y-5">
                    <section className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
                      <div className="mb-4 flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-brand-primary">
                          <ImageIcon size={19} />
                        </span>
                        <div>
                          <h3 className="text-[17px] font-bold text-brand-primary">Main Image</h3>
                          <p className="text-[12px] font-medium text-gray-400">Sub image is not used.</p>
                        </div>
                      </div>

                      {imagePreview ? (
                        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                          <Image src={imagePreview} alt="Location preview" fill className="object-cover" />
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, locationImage: null, locationImagePreview: null, currentImageUrl: null }))}
                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-red-500 shadow"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label htmlFor="location-image-upload" className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-center transition hover:bg-white">
                          <Camera size={26} className="text-gray-400" />
                          <span className="text-[13px] font-bold text-brand-primary">Upload main image</span>
                        </label>
                      )}
                      <input id="location-image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </section>

                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, isFeature: !prev.isFeature }))}
                      className={`flex w-full items-center justify-between rounded-[20px] border px-5 py-4 text-[14px] font-bold transition ${
                        formData.isFeature ? 'border-amber-400 bg-amber-400 text-white' : 'border-gray-100 bg-white text-brand-primary hover:bg-gray-50'
                      }`}
                    >
                      <span className="flex items-center gap-2"><Star size={17} /> Featured Location</span>
                      {formData.isFeature && <Check size={17} />}
                    </button>
                  </aside>
                </div>

                {formError && <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">{formError}</p>}

                <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-5">
                  <button type="button" onClick={closeModal} className="rounded-xl border border-gray-200 px-6 py-3 text-[14px] font-bold text-brand-primary transition hover:bg-white">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-8 py-3 text-[14px] font-bold text-white shadow-lg shadow-brand-primary/15 transition hover:bg-brand-primary-hover disabled:opacity-50"
                  >
                    {isSubmitting && <Loader2 className="animate-spin" size={18} />}
                    {isEditing ? 'Save Changes' : 'Create Location'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="mb-8 flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by main or sub location..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-2xl border border-gray-100 bg-white py-4 pl-14 pr-6 text-[16px] shadow-sm outline-none transition-all focus:ring-4 focus:ring-brand-primary/5"
            />
          </div>
          <select
            value={featureFilter}
            onChange={(event) => {
              setFeatureFilter(event.target.value as 'all' | 'featured');
              setPage(1);
            }}
            className="rounded-2xl border border-gray-100 bg-white px-5 py-4 text-[15px] font-bold text-brand-primary shadow-sm outline-none focus:ring-4 focus:ring-brand-primary/5"
          >
            <option value="all">All locations</option>
            <option value="featured">Featured only</option>
          </select>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead className="bg-gray-50/50">
                <tr className="text-[13px] font-black uppercase text-brand-primary">
                  <th className="px-8 py-5">Image</th>
                  <th className="px-8 py-5">Main Location</th>
                  <th className="px-8 py-5">Sub Location</th>
                  <th className="px-8 py-5">Featured</th>
                  <th className="px-8 py-5">Created</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading && locations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-16 text-center">
                      <Loader2 className="mx-auto animate-spin text-gray-400" size={32} />
                    </td>
                  </tr>
                ) : filteredLocations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center text-gray-400">
                      <p className="text-lg">No locations found.</p>
                    </td>
                  </tr>
                ) : filteredLocations.map((location) => {
                  const imageUrl = getDisplayImage(location);
                  return (
                    <tr key={location.id} className="group transition-colors hover:bg-gray-50/40">
                      <td className="px-8 py-5">
                        <div className="relative flex h-14 w-20 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                          {imageUrl ? (
                            <Image src={imageUrl} alt={getMainLocation(location)} fill className="object-cover" />
                          ) : (
                            <ImageIcon size={20} className="text-gray-300" />
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-[15px] font-black text-brand-primary">{getMainLocation(location)}</p>
                        <p className="mt-1 text-[12px] font-mono text-gray-400">#{location.id}</p>
                      </td>
                      <td className="px-8 py-5 text-[14px] font-semibold text-gray-500">{getSubLocation(location) || '-'}</td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-black ${location.isFeature ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-400'}`}>
                          {location.isFeature ? 'Featured' : 'Normal'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-[13px] font-semibold text-gray-400">
                        {location.createdAt ? new Date(location.createdAt).toLocaleDateString('en-GB') : '-'}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(location)}
                            disabled={isFetchingDetails === location.id}
                            className="flex items-center justify-center rounded-xl p-2.5 text-brand-primary/70 transition-all hover:bg-gray-100 hover:text-brand-primary disabled:opacity-50"
                            title="Edit location"
                          >
                            {isFetchingDetails === location.id ? <Loader2 size={18} className="animate-spin" /> : <Edit2 size={18} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteId(location.id)}
                            className="rounded-xl p-2.5 text-red-400 transition-all hover:bg-red-50 hover:text-red-500"
                            title="Delete location"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 p-4">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-brand-primary disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm font-semibold text-gray-500">Page {page} of {totalPages} - {totalCount} total</span>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page === totalPages}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-brand-primary disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>

        <ConfirmDialog
          isOpen={deleteId !== null}
          title="Delete Location"
          message="Are you sure you want to delete this location? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
          isLoading={isDeleting}
        />

        <Toast
          isVisible={notification.isVisible}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, isVisible: false })}
        />
      </div>
    </div>
  );
}
