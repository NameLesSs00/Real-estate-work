'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Users, ChevronLeft, ChevronRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { updatePassword, addAdmin, AddAdminPayload, UpdatePasswordPayload } from '@/lib/api/auth';
import { getAdmins, updateAdmin, PaginatedAdmins, UpdateAdminPayload } from '@/lib/api/admins';

type Tab = 'profile' | 'security' | 'admins';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Profile State
  const [profileData, setProfileData] = useState<UpdateAdminPayload>({
    userName: '',
    email: '',
    phoneNumber: '',
  });

  // Password State
  const [passwordData, setPasswordData] = useState<UpdatePasswordPayload>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Admin List State
  const [adminsData, setAdminsData] = useState<PaginatedAdmins | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState<AddAdminPayload>({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });


  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  const fetchAdmins = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const data = await getAdmins(page);
      setAdminsData(data);
      setCurrentPage(page);

      // Pre-fill profile data by finding the current user in the list
      const currentEmail = localStorage.getItem('adminEmail');
      if (currentEmail && data.items) {
        const currentUser = data.items.find(a => a.email === currentEmail);
        if (currentUser) {
          setProfileData({
            userName: currentUser.username,
            email: currentUser.email,
            phoneNumber: currentUser.phoneNumber || '',
          });
        } else {
          // If no match by email, still fill with something if possible or keep existing
          console.log("No matching admin found for email:", currentEmail);
        }
      } else if (!currentEmail && data.items && data.items.length > 0) {
        // Fallback: If we don't have a stored email, we'll use the first one 
        // as a placeholder until the user logs in again to sync.
        const first = data.items[0];
        setProfileData(prev => ({
          ...prev,
          userName: prev.userName || first.username,
          email: prev.email || first.email,
          phoneNumber: prev.phoneNumber || first.phoneNumber || ''
        }));
      }
    } catch (err: unknown) {
      showNotification('error', err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    // Initial fetch to get the current user's details and the team list
    fetchAdmins(1);
  }, [fetchAdmins]);



  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateAdmin(profileData);
      showNotification('success', 'Profile updated successfully.');
      // Update local storage to reflect changes
      localStorage.setItem('adminEmail', profileData.email);
      localStorage.setItem('adminName', profileData.userName);
    } catch (err: unknown) {
      showNotification('error', err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('error', 'New passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await updatePassword(passwordData);
      showNotification('success', 'Password updated successfully.');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: unknown) {
      showNotification('error', err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addAdmin(newAdmin);
      showNotification('success', 'New administrator added successfully.');
      setNewAdmin({ firstName: '', lastName: '', email: '', password: '' });
      setShowAddAdmin(false);
      fetchAdmins(1);
    } catch (err: unknown) {
      showNotification('error', err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#FDFCFB] p-4 md:p-8 pt-10">
      <div className="max-w-[1000px] mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-[#1B2134] font-radley mb-2">Settings</h1>
          <p className="text-[#666] font-poppins">Manage your profile, security, and team members.</p>
        </div>

        {/* Notification Box */}
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
              {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="font-medium text-[15px]">{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-[#F0EBE3] p-1.5 rounded-2xl w-fit">
          {[
            { id: 'profile', label: 'My Profile', icon: User },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'admins', label: 'Admin Management', icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[15px] font-semibold transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-[#1B2134] text-white shadow-md' 
                  : 'text-[#1B2134] hover:bg-white/50'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-[32px] border border-[#F0EDE8] shadow-sm p-8 md:p-10"
        >
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold text-[#1B2134] mb-6 font-radley">Personal Information</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-[#1B2134] ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={profileData.userName}
                      onChange={(e) => setProfileData({...profileData, userName: e.target.value})}
                      placeholder="Your Name"
                      className="w-full bg-[#F8F5F0] border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#1B2134]/10 transition-all font-medium text-[#1B2134]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-[#1B2134] ml-1">Email Address</label>
                    <input 
                      type="email" 
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      placeholder="email@example.com"
                      className="w-full bg-[#F8F5F0] border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#1B2134]/10 transition-all font-medium text-[#1B2134]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-[#1B2134] ml-1">Phone Number</label>
                    <input 
                      type="tel" 
                      value={profileData.phoneNumber}
                      onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})}
                      placeholder="+20 123 456 7890"
                      className="w-full bg-[#F8F5F0] border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#1B2134]/10 transition-all font-medium text-[#1B2134]"
                      required
                    />
                  </div>
                </div>
                <button 
                  disabled={loading}
                  className="bg-[#1B2134] text-white px-10 py-4 rounded-full font-bold text-[16px] shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                >
                  {loading && <Loader2 className="animate-spin" size={20} />}
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold text-[#1B2134] mb-6 font-radley">Security Settings</h2>
              <form onSubmit={handlePasswordUpdate} className="space-y-6">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-[#1B2134] ml-1">Current Password</label>
                    <input 
                      type="password" 
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                      className="w-full bg-[#F8F5F0] border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#1B2134]/10 transition-all font-medium text-[#1B2134]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-[#1B2134] ml-1">New Password</label>
                    <input 
                      type="password" 
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="w-full bg-[#F8F5F0] border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#1B2134]/10 transition-all font-medium text-[#1B2134]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-[#1B2134] ml-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="w-full bg-[#F8F5F0] border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#1B2134]/10 transition-all font-medium text-[#1B2134]"
                      required
                    />
                  </div>
                </div>
                <button 
                  disabled={loading}
                  className="bg-[#1B2134] text-white px-10 py-4 rounded-full font-bold text-[16px] shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                >
                  {loading && <Loader2 className="animate-spin" size={20} />}
                  Update Password
                </button>
              </form>
            </div>
          )}

          {/* Admins Tab */}
          {activeTab === 'admins' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#1B2134] font-radley">Team Management</h2>
                <button 
                  onClick={() => setShowAddAdmin(!showAddAdmin)}
                  className="bg-[#1B2134] text-white px-6 py-2.5 rounded-full font-semibold text-[14px] shadow-md hover:scale-105 transition-all"
                >
                  {showAddAdmin ? 'Cancel' : 'Add New Admin'}
                </button>
              </div>

              {/* Add Admin Form */}
              <AnimatePresence>
                {showAddAdmin && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-[#F8F5F0] p-8 rounded-[24px] mb-8">
                      <h3 className="font-bold text-[#1B2134] mb-6">New Administrator</h3>
                      <form onSubmit={handleAddAdmin} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[13px] font-bold text-[#1B2134] ml-1">First Name</label>
                          <input 
                            type="text" 
                            value={newAdmin.firstName}
                            onChange={(e) => setNewAdmin({...newAdmin, firstName: e.target.value})}
                            className="w-full bg-white border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#1B2134]/10"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[13px] font-bold text-[#1B2134] ml-1">Last Name</label>
                          <input 
                            type="text" 
                            value={newAdmin.lastName}
                            onChange={(e) => setNewAdmin({...newAdmin, lastName: e.target.value})}
                            className="w-full bg-white border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#1B2134]/10"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[13px] font-bold text-[#1B2134] ml-1">Email</label>
                          <input 
                            type="email" 
                            value={newAdmin.email}
                            onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                            className="w-full bg-white border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#1B2134]/10"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[13px] font-bold text-[#1B2134] ml-1">Password</label>
                          <input 
                            type="password" 
                            value={newAdmin.password}
                            onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                            className="w-full bg-white border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#1B2134]/10"
                            required
                          />
                        </div>
                        <div className="md:col-span-2 pt-2">
                          <button 
                            disabled={loading}
                            className="bg-[#1B2134] text-white px-8 py-3 rounded-full font-bold text-[15px] shadow-md hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
                          >
                            {loading && <Loader2 className="animate-spin" size={18} />}
                            Create Account
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Admin Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#F0EDE8] text-[#1B2134]/50 text-[13px] font-bold uppercase tracking-wider">
                      <th className="px-4 py-4">Username</th>
                      <th className="px-4 py-4">Email</th>
                      <th className="px-4 py-4">Created At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EDE8]">
                    {adminsData?.items?.map((admin) => (
                      <tr key={admin.id} className="text-[#1B2134] hover:bg-[#FDFCFB] transition-colors">
                        <td className="px-4 py-5 font-semibold">{admin.username}</td>
                        <td className="px-4 py-5 font-medium">{admin.email}</td>
                        <td className="px-4 py-5 text-[#666]">{new Date(admin.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {adminsData && (!adminsData.items || adminsData.items.length === 0) && (
                      <tr>
                        <td colSpan={3} className="px-4 py-10 text-center text-[#1B2134]/40 font-medium">
                          No administrators found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {adminsData && adminsData.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-6">
                  <button 
                    disabled={!adminsData.hasPreviousPage || loading}
                    onClick={() => fetchAdmins(currentPage - 1)}
                    className="p-2 rounded-full border border-[#F0EDE8] text-[#1B2134] disabled:opacity-30 hover:bg-[#F8F5F0] transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="font-semibold text-[15px] text-[#1B2134]">
                    Page {adminsData.pageNumber} of {adminsData.totalPages}
                  </span>
                  <button 
                    disabled={!adminsData.hasNextPage || loading}
                    onClick={() => fetchAdmins(currentPage + 1)}
                    className="p-2 rounded-full border border-[#F0EDE8] text-[#1B2134] disabled:opacity-30 hover:bg-[#F8F5F0] transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
