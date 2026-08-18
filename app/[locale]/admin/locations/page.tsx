'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, X, Edit2, Trash2, Loader2, 
  Search 
} from 'lucide-react';
import { 
  getLocations, 
  getLocationById,
  createLocation, 
  updateLocation, 
  deleteLocation, 
  Location,
  CreateLocationPayload,
  UpdateLocationPayload
} from '@/lib/api/locations';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import Toast from '@/components/admin/Toast';

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string, isVisible: boolean }>({ type: 'success', message: '', isVisible: false });
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [isFetchingDetails, setIsFetchingDetails] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<CreateLocationPayload>({
    city: { en: '', de: '', pl: '' },
    district: { en: '', de: '', pl: '' },
    street: '',
    country: '',
    latitude: '',
    longitude: ''
  });

  // Delete state
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchLocationsList = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const data = await getLocations(p);
      setLocations(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      notify('error', 'Failed to load locations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocationsList(page);
  }, [page, fetchLocationsList]);

  const notify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message, isVisible: true });
  };

  const openAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      city: { en: '', de: '', pl: '' },
      district: { en: '', de: '', pl: '' },
      street: '',
      country: '',
      latitude: '',
      longitude: ''
    });
    setShowModal(true);
  };

  const openEdit = async (loc: Location) => {
    setIsFetchingDetails(loc.id);
    try {
      const [enRes, deRes, plRes] = await Promise.all([
        getLocationById(loc.id, 'en'),
        getLocationById(loc.id, 'de'),
        getLocationById(loc.id, 'pl')
      ]);

      setFormData({
        city: { 
          en: typeof enRes.city === 'string' ? enRes.city : '', 
          de: typeof deRes.city === 'string' ? deRes.city : '', 
          pl: typeof plRes.city === 'string' ? plRes.city : '' 
        },
        district: { 
          en: typeof enRes.district === 'string' ? enRes.district : '', 
          de: typeof deRes.district === 'string' ? deRes.district : '', 
          pl: typeof plRes.district === 'string' ? plRes.district : '' 
        },
        street: loc.street || '',
        country: loc.country || '',
        latitude: loc.latitude || '',
        longitude: loc.longitude || ''
      });
      setIsEditing(true);
      setCurrentId(loc.id);
      setShowModal(true);
    } catch (e) {
      console.error('Failed to fetch full location details:', e);
      notify('error', 'Failed to load location details.');
    } finally {
      setIsFetchingDetails(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.city.en || !formData.district.en) return;
    
    setIsSubmitting(true);
    try {
      if (isEditing && currentId) {
        await updateLocation({ id: currentId, ...formData } as UpdateLocationPayload);
        notify('success', 'Location updated successfully!');
      } else {
        await createLocation(formData);
        notify('success', 'Location created successfully!');
      }
      setShowModal(false);
      fetchLocationsList(page);
    } catch {
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
      notify('success', 'Location deleted successfully!');
      fetchLocationsList(page);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to delete location.';
      notify('error', msg);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const filteredLocations = locations.filter(loc => {
    const term = searchQuery.toLowerCase();
    return (
      loc.city?.toLowerCase().includes(term) ||
      loc.district?.toLowerCase().includes(term) ||
      loc.country?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-8 md:p-12 min-h-screen font-inter bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-[36px] font-bold text-[#000000] mb-2">Locations</h1>
            <p className="text-[#64748B] text-lg">Manage cities, districts, and coordinates.</p>
          </div>
          <button 
            onClick={openAdd}
            className="bg-[#000000] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-[#1e324d] transition-all shadow-lg active:scale-95"
          >
            <Plus size={20} />
            Add New Location
          </button>
        </div>

        {/* Modal Form */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[32px] shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              >
                <div className="p-8 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10">
                  <h2 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Location' : 'Add New Location'}</h2>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={24} className="text-gray-500" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                  
                  {/* City Translations */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold border-b pb-2">City Name</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">English *</label>
                        <input type="text" required value={formData.city.en} onChange={e => setFormData({...formData, city: {...formData.city, en: e.target.value}})} className="w-full bg-[#F8F9FA] border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#000000]/10" placeholder="e.g. Dubai" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">German *</label>
                        <input type="text" required value={formData.city.de} onChange={e => setFormData({...formData, city: {...formData.city, de: e.target.value}})} className="w-full bg-[#F8F9FA] border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#000000]/10" placeholder="e.g. Dubai" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Polish *</label>
                        <input type="text" required value={formData.city.pl} onChange={e => setFormData({...formData, city: {...formData.city, pl: e.target.value}})} className="w-full bg-[#F8F9FA] border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#000000]/10" placeholder="e.g. Dubaj" />
                      </div>
                    </div>
                  </div>

                  {/* District Translations */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold border-b pb-2">District Name</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">English *</label>
                        <input type="text" required value={formData.district.en} onChange={e => setFormData({...formData, district: {...formData.district, en: e.target.value}})} className="w-full bg-[#F8F9FA] border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#000000]/10" placeholder="e.g. Downtown" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">German *</label>
                        <input type="text" required value={formData.district.de} onChange={e => setFormData({...formData, district: {...formData.district, de: e.target.value}})} className="w-full bg-[#F8F9FA] border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#000000]/10" placeholder="e.g. Innenstadt" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Polish *</label>
                        <input type="text" required value={formData.district.pl} onChange={e => setFormData({...formData, district: {...formData.district, pl: e.target.value}})} className="w-full bg-[#F8F9FA] border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#000000]/10" placeholder="e.g. Śródmieście" />
                      </div>
                    </div>
                  </div>

                  {/* Other Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold border-b pb-2">General Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Country</label>
                        <input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full bg-[#F8F9FA] border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#000000]/10" placeholder="e.g. UAE" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Street</label>
                        <input type="text" value={formData.street || ''} onChange={e => setFormData({...formData, street: e.target.value})} className="w-full bg-[#F8F9FA] border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#000000]/10" placeholder="e.g. Sheikh Zayed Road" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Latitude</label>
                        <input type="text" value={formData.latitude} onChange={e => setFormData({...formData, latitude: e.target.value})} className="w-full bg-[#F8F9FA] border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#000000]/10" placeholder="e.g. 25.2048" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Longitude</label>
                        <input type="text" value={formData.longitude} onChange={e => setFormData({...formData, longitude: e.target.value})} className="w-full bg-[#F8F9FA] border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#000000]/10" placeholder="e.g. 55.2708" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-6 gap-4">
                    <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 font-medium text-gray-500 hover:text-gray-900 transition-colors">
                      Cancel
                    </button>
                    <button 
                      disabled={isSubmitting}
                      className="bg-[#000000] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSubmitting && <Loader2 className="animate-spin" size={18} />}
                      {isEditing ? 'Save Changes' : 'Create Location'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search locations by city or district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-[16px] outline-none focus:ring-4 focus:ring-[#000000]/5 shadow-sm transition-all"
          />
        </div>

        {/* List */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr className="text-[#000000] text-[14px] font-bold uppercase tracking-wider">
                <th className="px-8 py-6 w-24">ID</th>
                <th className="px-8 py-6">City</th>
                <th className="px-8 py-6">District</th>
                <th className="px-8 py-6">Country</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && locations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center">
                    <Loader2 className="animate-spin mx-auto text-gray-400" size={32} />
                  </td>
                </tr>
              ) : filteredLocations.map((loc) => (
                <tr key={loc.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-8 py-6 font-mono text-sm text-gray-400">#{loc.id}</td>
                  <td className="px-8 py-6 font-bold text-[#000000]">{loc.city}</td>
                  <td className="px-8 py-6 text-gray-600">{loc.district}</td>
                  <td className="px-8 py-6 text-gray-500">{loc.country || '-'}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openEdit(loc)}
                        disabled={isFetchingDetails === loc.id}
                        className="p-2.5 text-[#000000]/70 hover:text-[#000000] hover:bg-gray-100 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center"
                      >
                        {isFetchingDetails === loc.id ? <Loader2 size={18} className="animate-spin" /> : <Edit2 size={18} />}
                      </button>
                      <button onClick={() => setDeleteId(loc.id)} className="p-2.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredLocations.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-gray-400">
                    <p className="text-lg">No locations found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-50"
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
