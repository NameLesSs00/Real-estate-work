'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, X, Edit2, Trash2, Loader2, 
  Search, CheckCircle2 
} from 'lucide-react';
import { getFacilities, getFacilityById, createFacility, updateFacility, deleteFacility, Facility } from '@/lib/api/facilities';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Add Facility state
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState({ en: '', de: '', pl: '' });

  // Edit Facility state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState({ en: '', de: '', pl: '' });
  const [isFetchingDetails, setIsFetchingDetails] = useState<number | null>(null);

  // Delete state
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchFacilities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFacilities();
      setFacilities(data);
    } catch {
      notify('error', 'Failed to load facilities.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  const notify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.en) return;
    setLoading(true);
    try {
      await createFacility(newName);
      notify('success', 'Facility added successfully!');
      setNewName({ en: '', de: '', pl: '' });
      setShowAdd(false);
      fetchFacilities();
    } catch {
      notify('error', 'Failed to add facility.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number) => {
    setLoading(true);
    try {
      await updateFacility(id, editingName);
      notify('success', 'Facility updated successfully!');
      setEditingId(null);
      fetchFacilities();
    } catch {
      notify('error', 'Failed to update facility.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = async (facility: Facility) => {
    setEditingId(facility.id);
    
    // Fallback based on list data
    const nameObjRaw = typeof facility.name === 'object' ? facility.name : { en: facility.name, de: facility.name, pl: facility.name };
    const nameObj = nameObjRaw as Record<string, string>;
    setEditingName({
      en: nameObj.en || nameObj.En || '',
      de: nameObj.de || nameObj.De || '',
      pl: nameObj.pl || nameObj.Pl || ''
    });

    try {
      setIsFetchingDetails(facility.id);
      
      // Fetch full details for all languages
      const [enRes, deRes, plRes] = await Promise.all([
        getFacilityById(facility.id, 'en'),
        getFacilityById(facility.id, 'de'),
        getFacilityById(facility.id, 'pl')
      ]);

      const enName = enRes.name as Record<string, string>;
      const deName = deRes.name as Record<string, string>;
      const plName = plRes.name as Record<string, string>;

      setEditingName({
        en: typeof enRes.name === 'string' ? enRes.name : enName?.en || enName?.En || '',
        de: typeof deRes.name === 'string' ? deRes.name : deName?.de || deName?.De || '',
        pl: typeof plRes.name === 'string' ? plRes.name : plName?.pl || plName?.Pl || ''
      });
    } catch (e) {
      console.error('Failed to fetch full facility details:', e);
    } finally {
      setIsFetchingDetails(null);
    }
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;
    setIsDeleting(true);
    try {
      await deleteFacility(deleteId);
      notify('success', 'Facility deleted successfully!');
      fetchFacilities();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to delete facility.';
      notify('error', msg);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const filteredFacilities = facilities.filter(f => {
    const name = typeof f.name === 'object' ? Object.values(f.name).join(' ') : String(f.name);
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getDisplayName = (f: Facility) => {
    if (typeof f.name === 'object' && f.name !== null) {
      const nameObj = f.name as Record<string, string>;
      return nameObj.en || nameObj.de || nameObj.pl || 'Unknown';
    }
    return f.name;
  };

  return (
    <div className="p-8 md:p-12 min-h-screen font-inter bg-[#F8F9FA]">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-[36px] font-bold text-[#16273B] mb-2">Facilities</h1>
            <p className="text-[#64748B] text-lg">Manage project and unit amenities.</p>
          </div>
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="bg-[#16273B] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-[#1e324d] transition-all shadow-lg active:scale-95"
          >
            {showAdd ? <X size={20} /> : <Plus size={20} />}
            {showAdd ? 'Cancel' : 'Add New Facility'}
          </button>
        </div>

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-8 p-4 rounded-2xl flex items-center gap-3 shadow-sm border ${
                notification.type === 'success' 
                  ? 'bg-green-50 border-green-100 text-green-700' 
                  : 'bg-red-50 border-red-100 text-red-700'
              }`}
            >
              <CheckCircle2 size={20} />
              <span className="font-semibold">{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Form */}
        <AnimatePresence>
          {showAdd && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-10"
            >
              <form onSubmit={handleAdd} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-[#16273B] ml-1">English Name</label>
                    <input 
                      type="text" 
                      value={newName.en}
                      onChange={(e) => setNewName({...newName, en: e.target.value})}
                      placeholder="e.g. Swimming Pool"
                      className="w-full bg-[#F8F9FA] border border-gray-100 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#16273B]/10 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-[#16273B] ml-1">German Name</label>
                    <input 
                      type="text" 
                      value={newName.de}
                      onChange={(e) => setNewName({...newName, de: e.target.value})}
                      placeholder="e.g. Schwimmbad"
                      className="w-full bg-[#F8F9FA] border border-gray-100 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#16273B]/10 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-[#16273B] ml-1">Polish Name</label>
                    <input 
                      type="text" 
                      value={newName.pl}
                      onChange={(e) => setNewName({...newName, pl: e.target.value})}
                      placeholder="e.g. Basen"
                      className="w-full bg-[#F8F9FA] border border-gray-100 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#16273B]/10 transition-all"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button 
                    disabled={loading}
                    className="bg-[#16273B] text-white px-10 py-4 rounded-xl font-bold shadow-md hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading && <Loader2 className="animate-spin" size={20} />}
                    Create Facility
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search facilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-[16px] outline-none focus:ring-4 focus:ring-[#16273B]/5 shadow-sm transition-all"
          />
        </div>

        {/* List */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr className="text-[#16273B] text-[14px] font-bold uppercase tracking-wider">
                <th className="px-8 py-6 w-24">ID</th>
                <th className="px-8 py-6">Name</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredFacilities.map((facility) => (
                <tr key={facility.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-8 py-6 font-mono text-sm text-gray-400">#{facility.id}</td>
                  <td className="px-8 py-6">
                    {editingId === facility.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input 
                          value={editingName.en}
                          onChange={e => setEditingName({...editingName, en: e.target.value})}
                          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#16273B]/10"
                          placeholder="EN"
                        />
                        <input 
                          value={editingName.de}
                          onChange={e => setEditingName({...editingName, de: e.target.value})}
                          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#16273B]/10"
                          placeholder="DE"
                        />
                        <input 
                          value={editingName.pl}
                          onChange={e => setEditingName({...editingName, pl: e.target.value})}
                          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#16273B]/10"
                          placeholder="PL"
                        />
                      </div>
                    ) : (
                      <span className="font-bold text-[#16273B] text-[16px]">{getDisplayName(facility)}</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {editingId === facility.id ? (
                        <>
                          <button onClick={() => handleUpdate(facility.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-all"><CheckCircle2 size={20} /></button>
                          <button onClick={() => setEditingId(null)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-all"><X size={20} /></button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleEditClick(facility)}
                            disabled={isFetchingDetails === facility.id}
                            className="p-2.5 text-[#16273B]/70 hover:text-[#16273B] hover:bg-gray-100 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center"
                          >
                            {isFetchingDetails === facility.id ? <Loader2 size={18} className="animate-spin" /> : <Edit2 size={18} />}
                          </button>
                          <button onClick={() => setDeleteId(facility.id)} className="p-2.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredFacilities.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center text-gray-400">
                    <p className="text-lg">No facilities found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <ConfirmDialog
          isOpen={deleteId !== null}
          title="Delete Facility"
          message="Are you sure you want to delete this facility? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
}
