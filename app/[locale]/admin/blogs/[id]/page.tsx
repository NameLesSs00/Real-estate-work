'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { getBlogById, updateBlog, uploadBlogImage, uploadSectionImage, BlogItem, getBlogImageUrl } from '@/lib/api/blogs';
import Toast from '@/components/admin/Toast';

interface SectionDraft {
  id: number; // 0 for new, existing ID for update
  sectionNumber: number;
  tittle: string;
  content: string;
  imageUrl?: string;
  imageFile?: File | null;
  clientId: string; // purely for React keys before saving
}

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  
  const [blog, setBlog] = useState<BlogItem | null>(null);
  const [title, setTitle] = useState('');
  const [mainImageUrl, setMainImageUrl] = useState('');
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [sections, setSections] = useState<SectionDraft[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  const mainImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (!params.id) return;
        const data = await getBlogById(Number(params.id));
        setBlog(data);
        setTitle(data.title);
        setMainImageUrl(data.imageUrl || '');
        
        setSections(data.sections.map(s => ({
          id: s.id,
          sectionNumber: s.sectionNumber,
          tittle: s.tittle,
          content: s.content,
          imageUrl: s.imageUrl,
          imageFile: null,
          clientId: s.id.toString()
        })));
      } catch (error) {
        console.error('Failed to fetch blog', error);
        showToast('Blog not found or error loading.', 'error');
        setTimeout(() => router.push('/admin/blogs'), 1500);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
  }, [params.id, router]);

  const handleAddSection = () => {
    setSections([
      ...sections,
      {
        id: 0, // 0 means new section for the backend
        sectionNumber: sections.length + 1,
        tittle: '',
        content: '',
        imageFile: null,
        clientId: Date.now().toString()
      }
    ]);
  };

  const handleUpdateSection = (clientId: string, field: keyof SectionDraft, value: string | File | null) => {
    setSections(sections.map(s => s.clientId === clientId ? { ...s, [field]: value } : s));
  };

  const handleRemoveSection = (clientId: string) => {
    const updatedSections = sections.filter(s => s.clientId !== clientId).map((s, index) => ({
      ...s,
      sectionNumber: index + 1
    }));
    setSections(updatedSections);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !blog) return showToast('Title is required', 'error');

    try {
      setIsSubmitting(true);

      // 1. Update Blog (without images)
      await updateBlog({
        id: blog.id,
        title,
        sections: sections.map(s => ({
          id: s.id,
          sectionNumber: s.sectionNumber,
          tittle: s.tittle,
          content: s.content
        }))
      });

      // 2. Upload Main Image (if changed)
      if (mainImageFile) {
        await uploadBlogImage(blog.id, mainImageFile);
      }

      // 3. Upload Section Images
      const sectionsWithNewImages = sections.filter(s => s.imageFile != null);
      if (sectionsWithNewImages.length > 0) {
        // Fetch updated blog to get newly assigned section IDs (for id:0 sections)
        const updatedBlog = await getBlogById(blog.id);
        
        for (const sDraft of sectionsWithNewImages) {
          // Find matching section from server by sectionNumber
          const serverSection = updatedBlog.sections.find(s => s.sectionNumber === sDraft.sectionNumber);
          if (serverSection && sDraft.imageFile) {
            await uploadSectionImage(blog.id, serverSection.id, sDraft.imageFile);
          }
        }
      }

      showToast('Blog updated successfully!');
      setTimeout(() => router.push('/admin/blogs'), 1500);
    } catch (error) {
      console.error('Failed to update blog:', error);
      const message = error instanceof Error ? error.message : 'Failed to update blog. Please try again.';
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <div className="w-8 h-8 border-4 border-[#000000] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* ... previous JSX content ... */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-radley mb-2">Edit Blog</h1>
          <p className="text-gray-500 font-poppins text-sm">Update your existing article</p>
        </div>
        <button 
          onClick={() => router.push('/admin/blogs')}
          className="text-gray-500 hover:text-gray-900 font-medium transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ... form content ... */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Basic Information</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Blog Title *</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter the title of the blog"
                className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#000000] focus:ring-1 focus:ring-[#000000] outline-none transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Main Image</label>
              {mainImageUrl && !mainImageFile && (
                <div className="mb-4 relative w-48 h-32 rounded-lg overflow-hidden border border-gray-200">
                  <Image src={getBlogImageUrl(mainImageUrl)} alt="Current main image" fill className="object-cover" unoptimized />
                </div>
              )}
              <input 
                type="file"
                accept="image/*"
                ref={mainImageInputRef}
                onChange={(e) => setMainImageFile(e.target.files?.[0] || null)}
                className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#000000] focus:ring-1 focus:ring-[#000000] outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#E3F2FD] file:text-[#000000] hover:file:bg-[#EAE5DF]"
              />
              <p className="text-xs text-gray-500 mt-2">Upload a new image to replace the current one.</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900">Blog Sections</h2>
            <button 
              type="button"
              onClick={handleAddSection}
              className="text-[#42A5F5] font-medium hover:text-[#b09e86] transition-colors flex items-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Section
            </button>
          </div>

          <div className="space-y-8">
            {sections.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No sections added yet. Add a section to build your blog content.
              </div>
            ) : (
              sections.map((section) => (
                <div key={section.clientId} className="p-6 border border-gray-100 rounded-xl bg-gray-50 relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#000000] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                    {section.sectionNumber}
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleRemoveSection(section.clientId)}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-white text-red-500 border border-gray-100 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-600 shadow-md transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Section Title</label>
                      <input 
                        type="text" 
                        value={section.tittle}
                        onChange={(e) => handleUpdateSection(section.clientId, 'tittle', e.target.value)}
                        placeholder="e.g., Introduction"
                        className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-[#000000]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Content *</label>
                      <textarea 
                        value={section.content}
                        onChange={(e) => handleUpdateSection(section.clientId, 'content', e.target.value)}
                        placeholder="Write your section content here..."
                        rows={4}
                        className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-[#000000] resize-y"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Section Image</label>
                      {section.imageUrl && !section.imageFile && (
                        <div className="mb-3 relative w-32 h-20 rounded-md overflow-hidden border border-gray-200">
                          <Image src={getBlogImageUrl(section.imageUrl)} alt="Current section image" fill className="object-cover" unoptimized />
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleUpdateSection(section.clientId, 'imageFile', e.target.files?.[0] || null)}
                        className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-[#000000] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#E3F2FD] file:text-[#000000] hover:file:bg-[#EAE5DF]"
                      />
                      <p className="text-xs text-gray-500 mt-1">Upload to replace existing image.</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button 
            type="button"
            onClick={() => router.push('/admin/blogs')}
            disabled={isSubmitting}
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="bg-[#000000] text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-md disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            Save Changes
          </button>
        </div>
      </form>

      <Toast 
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}
