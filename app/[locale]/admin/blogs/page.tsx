'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogs, deleteBlog, BlogItem, getBlogImageUrl } from '@/lib/api/blogs';
import Toast from '@/components/admin/Toast';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  // Confirm Dialog state
  const [confirm, setConfirm] = useState<{ isOpen: boolean; id: number | null; isDeleting: boolean }>({
    isOpen: false,
    id: null,
    isDeleting: false
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  const fetchBlogs = React.useCallback(async (pageNumber: number) => {
    try {
      setIsLoading(true);
      const data = await getBlogs(pageNumber, 20); // Fetch 20 per page for admin
      setBlogs(data?.items || []);
      setTotalPages(data?.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch blogs', error);
      showToast('Failed to load blogs', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs(page);
  }, [page, fetchBlogs]);

  const handleDelete = async () => {
    if (!confirm.id) return;
    
    try {
      setConfirm(prev => ({ ...prev, isDeleting: true }));
      await deleteBlog(confirm.id);
      showToast('Blog deleted successfully');
      fetchBlogs(page);
    } catch (error) {
      console.error('Failed to delete blog', error);
      showToast('Could not delete the blog. Please try again.', 'error');
    } finally {
      setConfirm({ isOpen: false, id: null, isDeleting: false });
    }
  };

  if (isLoading && blogs.length === 0) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-radley mb-2">Blogs</h1>
          <p className="text-gray-500 font-poppins text-sm">Manage your blog articles</p>
        </div>
        <Link 
          href="/admin/blogs/create" 
          className="bg-brand-primary text-white px-6 py-3 rounded-xl font-poppins font-medium hover:bg-gray-800 transition-colors"
        >
          Create New Blog
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {blogs.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No blogs found</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first blog article.</p>
            <Link 
              href="/admin/blogs/create"
              className="text-brand-secondary font-medium hover:underline"
            >
              Create your first blog
            </Link>
          </div>
        ) : (
          <>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm font-poppins border-b border-gray-100">
                  <th className="py-4 px-6 font-medium">Image</th>
                  <th className="py-4 px-6 font-medium">Title</th>
                  <th className="py-4 px-6 font-medium">Sections</th>
                  <th className="py-4 px-6 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        {blog.imageUrl ? (
                          <Image 
                            src={getBlogImageUrl(blog.imageUrl)} 
                            alt={blog.title} 
                            fill 
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <span className="text-xs text-gray-400">No Image</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-900 font-poppins">
                      {blog.title}
                    </td>
                    <td className="py-4 px-6 text-gray-500 font-poppins text-sm">
                      {blog.sections?.length || 0} Sections
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          href={`/admin/blogs/${blog.id}`}
                          className="p-2 text-gray-400 hover:text-brand-secondary transition-colors"
                          title="Edit"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </Link>
                        <button 
                          onClick={() => setConfirm({ isOpen: true, id: blog.id, isDeleting: false })}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
          </>
        )}
      </div>

      <Toast 
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />

      <ConfirmDialog 
        isOpen={confirm.isOpen}
        title="Delete Blog"
        message="Are you sure you want to delete this blog? This action cannot be undone."
        confirmLabel="Delete Blog"
        cancelLabel="Cancel"
        isLoading={confirm.isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirm({ isOpen: false, id: null, isDeleting: false })}
      />
    </div>
  );
}
