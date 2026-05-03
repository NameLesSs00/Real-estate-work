'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ChevronRight, Loader2 } from 'lucide-react';
import { getProjectById, resolveProjectImageUrl, Project } from '@/lib/api/projects';
import { getDeveloperById, resolveImageUrl } from '@/lib/api/developers';

const DEFAULT_IMAGE  = '/assists/defalutImage.jpg';
const DEFAULT_LOGO   = '/assists/defalutLogo.png';

import ImageGallery from '@/components/ImageGallery';

// ─── Static stats cards ───────────────────────────────────────────────────────
const STATS = [
  { icon: '/assists/project/building-4.png', label: 'Total Units',     value: 'Exclusive Residences' },
  { icon: '/assists/project/buildings-2.png', label: 'Building Floors', value: 'Low-Rise Design'        },
  { icon: '/assists/project/calendar.png',    label: 'Delivery Date',   value: 'Coming Soon'            },
  { icon: '/assists/project/story.png',       label: 'Status',          value: 'Under Development'      },
  { icon: '/assists/project/size.png',        label: 'Spaces',          value: 'Various Sizes'          },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const projectId = Number(slug);

  const [project,     setProject]     = useState<Project | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);

  const load = useCallback(async () => {
    if (isNaN(projectId)) {
      setError('Invalid project ID.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getProjectById(projectId);
      setProject(data);

      if (data.developerId) {
        try {
          await getDeveloperById(data.developerId);
        } catch {
          // silently fall back
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load project.');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { load(); }, [load]);

  // Build resolved image URLs
  const images: string[] = (project?.imageUrls ?? [])
    .map((url) => resolveProjectImageUrl(url) ?? DEFAULT_IMAGE)
    .filter(Boolean);

  if (images.length === 0) images.push(DEFAULT_IMAGE);

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-36">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <Loader2 size={40} className="animate-spin" />
          <p className="text-[16px] font-poppins">Loading project…</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error || !project) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-36 gap-4">
        <p className="text-red-500 text-[16px] font-poppins">{error ?? 'Project not found.'}</p>
        <Link
          href="/projects"
          className="bg-[#1B2134] text-white px-8 py-3 rounded-full text-[15px] hover:bg-[#252d46] transition-all"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white pt-36 pb-24 font-poppins">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col gap-10">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[14px] text-[#888]">
            <Link href="/projects" className="hover:text-[#1B2134] transition-colors">Projects</Link>
            <ChevronRight size={13} className="text-[#bbb]" />
            <span className="text-[#1B2134] font-semibold">{project.name}</span>
          </nav>

          {/* ── Top: Gallery (left) + Form (right) ── */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Left: Gallery + Meta */}
            <div className="flex flex-col gap-8 flex-1 min-w-0">

              <ImageGallery images={images} projectName={project.name} />

              {/* Project Meta */}
              <div className="flex flex-col gap-3">
                <h1 className="text-[28px] md:text-[36px] font-bold text-[#1B2134] leading-tight">
                  {project.name}
                </h1>

                <div className="flex items-center gap-2 text-[15px] text-[#888]">
                  <MapPin size={18} className="text-[#C7B7A1] flex-shrink-0" />
                  <span>{project.locationName || 'Location not listed'}</span>
                </div>
              </div>
            </div>

            {/* Right: Get in Touch Form (static) */}
            <div className="w-full lg:w-[420px] flex-shrink-0">
              <div className="bg-[#F8F5F080] border border-[#F0EDE8] rounded-[20px] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.06)] sticky top-28">
                <h2 className="text-[20px] font-bold text-[#1B2134] text-center mb-6">
                  Get in Touch
                </h2>
                <form className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-[#1B2134]">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full border border-[#E5E2DE] rounded-[10px] px-4 py-3 text-[14px] placeholder:text-[#BDBDBD] outline-none focus:border-[#1B2134] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-[#1B2134]">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full border border-[#E5E2DE] rounded-[10px] px-4 py-3 text-[14px] placeholder:text-[#BDBDBD] outline-none focus:border-[#1B2134] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-[#1B2134]">Email</label>
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full border border-[#E5E2DE] rounded-[10px] px-4 py-3 text-[14px] placeholder:text-[#BDBDBD] outline-none focus:border-[#1B2134] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-[#1B2134]">Message</label>
                    <textarea
                      placeholder="Message"
                      rows={4}
                      className="w-full border border-[#E5E2DE] rounded-[10px] px-4 py-3 text-[14px] placeholder:text-[#BDBDBD] outline-none focus:border-[#1B2134] transition-colors resize-none"
                    />
                  </div>
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-0.5 w-4 h-4 accent-[#1B2134] cursor-pointer flex-shrink-0"
                    />
                    <label htmlFor="terms" className="text-[13px] text-[#666] leading-snug cursor-pointer">
                      I agree with{' '}
                      <span className="text-[#1B2134] underline underline-offset-2">Terms of Use</span>
                      {' '}and{' '}
                      <span className="text-[#1B2134] underline underline-offset-2">Privacy Policy</span>
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#1B2134] text-white rounded-full py-4 text-[15px] font-semibold flex items-center justify-center gap-3 hover:bg-[#252d46] transition-all mt-1"
                  >
                    Book a Visit
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* ── Static Stats Row ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-[#F8F8F9] border border-[#F0EDE8] rounded-[16px] p-5 flex flex-col items-center text-center gap-2 shadow-sm"
              >
                <div className="relative w-8 h-8">
                  <Image src={stat.icon} alt={stat.label} fill className="object-contain opacity-50" />
                </div>
                <p className="text-[12px] text-[#AAA]">{stat.label}</p>
                <p className="text-[13px] font-semibold text-[#1B2134] leading-tight">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* ── Description ── */}
          <div className="bg-[#F8F5F0] border border-[#F0EDE8] rounded-[20px] p-8 shadow-sm w-full">
            <h2 className="text-[20px] font-bold text-[#1B2134] mb-4">Description</h2>
            <hr className="border-[#F0EDE8] mb-6" />
            <div className="flex flex-col gap-4">
              {project.description
                ? project.description.split('\n\n').map((para, i) => (
                    <p key={i} className="text-[14px] md:text-[15px] text-[#666] leading-relaxed">
                      {para}
                    </p>
                  ))
                : <p className="text-[14px] text-[#AAA] italic">No description available.</p>
              }
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
