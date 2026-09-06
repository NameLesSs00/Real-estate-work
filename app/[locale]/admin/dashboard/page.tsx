/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProjects, resolveProjectImageUrl, type Project } from '@/lib/api/projects';
import { getDevelopers } from '@/lib/api/developers';
import { getRequests } from '@/lib/api/requests';
import { getLatestDeals } from '@/lib/api/deals';
import { API_DOMAIN } from '@/lib/api/config';
import { getUnitOutsides, type UnitOutside } from '@/lib/api/unitOutsides';

interface StatCard {
  title: string;
  value: string;
  loading: boolean;
  icon: string;
  bg: string;
  textCol: string;
  subText: string;
  iconBg: string;
}

interface RecentResaleUnit {
  id: number;
  name: string;
  locationName: string;
  eurPrice: number;
  listingType: string;
  isActive: boolean;
  isSoldOutside: boolean;
  imageUrl: string;
}

interface RecentProject {
  id: number;
  name: string;
  developerName: string;
  locationName: string;
  eurPriceRange: string;
  imageUrl: string;
  isFeature: boolean;
}

function getLocalizedText(value: UnitOutside['name']): string {
  if (typeof value === 'string') return value;
  return value.en || value.de || value.it || 'Untitled Unit';
}

function getEuroPrice(unit: UnitOutside): number {
  return unit.prices.find((price) => price.currency?.toUpperCase() === 'EUR')?.price ?? 0;
}

function getPrimaryImage(unit: UnitOutside): string {
  const image = unit.images.find((item) => item.isPrimary) ?? unit.images[0];
  if (!image?.imageUrl) return '/assists/defaultImage.png';
  if (image.imageUrl.startsWith('http')) return image.imageUrl;
  return `${API_DOMAIN}${image.imageUrl.startsWith('/') ? '' : '/'}${image.imageUrl}`;
}

function getProjectEuroRange(project: Project): string {
  const eurPrice = project.prices?.find((price) => price.currency?.toUpperCase() === 'EUR');
  if (!eurPrice) return 'EUR 0';
  return `EUR ${eurPrice.minimumPrice.toLocaleString()} - ${eurPrice.maximumPrice.toLocaleString()}`;
}

function getProjectImage(project: Project): string {
  return resolveProjectImageUrl(project.imageUrls?.[0]) || '/assists/defaultImage.png';
}

export default function DashboardPage() {
  const [totalUnits, setTotalUnits] = useState<number | null>(null);
  const [totalProjects, setTotalProjects] = useState<number | null>(null);
  const [totalDevelopers, setTotalDevelopers] = useState<number | null>(null);
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [recentUnits, setRecentUnits] = useState<RecentResaleUnit[]>([]);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [recentDeals, setRecentDeals] = useState<{ id: number; unit: { unitName: string; price: number; currencyCode?: string; projectName: string }; dealType: string; createdAt: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [unitsData, projectsData, devsData, requestsData, dealsData] = await Promise.allSettled([
          getUnitOutsides({ PageNumber: 1, PageSize: 5, Currency: 'EUR', SortBy: 'CreatedAt', SortDirection: 'desc' }),
          getProjects(1, 5, undefined, { sortBy: 'CreatedAt', sortDirection: 'desc', currency: 'EUR' }),
          getDevelopers(1),
          getRequests(1, 5, 0), // status 0 = pending
          getLatestDeals(1, 5),
        ]);

        if (unitsData.status === 'fulfilled') {
          setTotalUnits(unitsData.value.totalCount);
          setRecentUnits(
            unitsData.value.items.map(u => ({
              id: u.id,
              name: getLocalizedText(u.name),
              locationName: [u.city, u.country].filter(Boolean).join(', ') || '---',
              eurPrice: getEuroPrice(u),
              listingType: u.type || 'Buy',
              isActive: u.isActive,
              isSoldOutside: u.isSoldOutside,
              imageUrl: getPrimaryImage(u),
            }))
          );
        }
        if (projectsData.status === 'fulfilled') {
          setTotalProjects(projectsData.value.totalCount);
          setRecentProjects(
            projectsData.value.items.map((project) => ({
              id: project.id,
              name: project.name || 'Untitled Project',
              developerName: project.developerName || 'No developer',
              locationName: project.locationName || '---',
              eurPriceRange: getProjectEuroRange(project),
              imageUrl: getProjectImage(project),
              isFeature: Boolean(project.isFeature),
            }))
          );
        }
        if (devsData.status === 'fulfilled') setTotalDevelopers(devsData.value.totalCount);
        if (requestsData.status === 'fulfilled') {
          setPendingCount(requestsData.value.totalCount);
        }
        if (dealsData.status === 'fulfilled') {
          setRecentDeals(dealsData.value.items.filter(d => d.dealType?.toLowerCase() !== 'rent').map(d => ({
            id: d.id,
            unit: {
              ...d.unit,
              currencyCode: (d.unit as any).currencyCode
            },
            dealType: d.dealType,
            createdAt: d.createdAt,
          })));
        }
      } catch (err) {
        console.error('[Dashboard] load error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const stats: StatCard[] = [
    {
      title: 'Resale Units',
      value: loading ? '...' : String(totalUnits ?? '—'),
      loading,
      icon: '/admin/dashbaord/units.png',
      bg: 'bg-white border border-gray-100',
      textCol: 'text-brand-primary',
      subText: 'text-gray-500',
      iconBg: 'bg-brand-secondary-soft',
    },
    {
      title: 'Active Projects',
      value: loading ? '...' : String(totalProjects ?? '—'),
      loading,
      icon: '/admin/dashbaord/activeProject.png',
      bg: 'bg-white border border-gray-100',
      textCol: 'text-brand-primary',
      subText: 'text-gray-500',
      iconBg: 'bg-brand-secondary-soft',
    },
    {
      title: 'Developers',
      value: loading ? '...' : String(totalDevelopers ?? '—'),
      loading,
      icon: '/admin/dashbaord/developers.png',
      bg: 'bg-white border border-gray-100',
      textCol: 'text-brand-primary',
      subText: 'text-gray-500',
      iconBg: 'bg-brand-secondary-soft',
    },
    {
      title: 'Pending Requests',
      value: loading ? '...' : String(pendingCount ?? '—'),
      loading,
      icon: '/admin/dashbaord/revenue.png',
      bg: 'bg-white border border-gray-100',
      textCol: 'text-brand-primary',
      subText: 'text-gray-500',
      iconBg: 'bg-brand-secondary-soft',
    },
  ];

  return (
    <div className="p-8 md:p-10 min-h-screen font-inter" style={{ backgroundColor: 'rgb(247 245 243 / 0.50)' }}>
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[32px] font-bold text-brand-primary mb-2">Dashboard Overview</h1>
          <p className="text-admin-muted text-lg">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <div key={idx} className={`${stat.bg} p-6 rounded-[24px] shadow-sm flex flex-col justify-between h-[160px]`}>
              <div className={`${stat.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center`}>
                <Image src={stat.icon} alt={stat.title} width={24} height={24} className="object-contain" />
              </div>
              <div className="mt-4">
                <h3 className={`${stat.subText} text-[15px] font-medium mb-1`}>{stat.title}</h3>
                <p className={`${stat.textCol} text-[32px] font-bold leading-none`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          {/* Recent Resale Units */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[22px] font-bold text-brand-primary">Recent Resale Units</h3>
              <Link href="/admin/units" className="text-[14px] text-admin-muted hover:text-brand-primary font-medium transition-colors">View all →</Link>
            </div>
            <div className="p-4 rounded-[32px] space-y-3" style={{ backgroundColor: 'rgb(247 245 243 / 0.50)' }}>
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-[20px] p-5 animate-pulse h-[88px]" />
                ))
              ) : recentUnits.length === 0 ? (
                <p className="text-center text-gray-400 py-12 text-sm">No units found.</p>
              ) : recentUnits.map((unit) => (
                <div key={unit.id} className="bg-white rounded-[20px] p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="relative w-[90px] h-[65px] rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <Image
                        src={unit.imageUrl}
                        alt={unit.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-brand-primary line-clamp-1">{unit.name}</h4>
                      <p className="text-[13px] text-gray-500 mt-0.5">{unit.locationName}</p>
                    </div>
                  </div>
                  <div className="text-right pr-1">
                    <p className="text-[16px] font-bold text-brand-primary">EUR {unit.eurPrice.toLocaleString()}</p>
                    <div className="mt-1 flex flex-wrap items-center justify-end gap-2">
                      <span className="rounded-full bg-brand-secondary-soft px-2.5 py-1 text-[11px] font-bold text-brand-primary">
                        {unit.listingType}
                      </span>
                      <span className={`text-[12px] font-semibold ${unit.isSoldOutside ? 'text-red-400' : unit.isActive ? 'text-green-500' : 'text-gray-400'}`}>
                        {unit.isSoldOutside ? 'Sold' : unit.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Projects */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[22px] font-bold text-brand-primary">Recent Projects</h3>
              <Link href="/admin/projects" className="text-[14px] text-admin-muted hover:text-brand-primary font-medium transition-colors">View all →</Link>
            </div>
            <div className="p-4 rounded-[32px] space-y-3" style={{ backgroundColor: 'rgb(247 245 243 / 0.50)' }}>
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-[20px] p-5 animate-pulse h-[88px]" />
                ))
              ) : recentProjects.length === 0 ? (
                <p className="text-center text-gray-400 py-12 text-sm">No projects found.</p>
              ) : recentProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-[20px] p-4 flex items-center justify-between gap-4 shadow-sm">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="relative h-[65px] w-[90px] shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      <Image
                        src={project.imageUrl}
                        alt={project.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="line-clamp-1 text-[15px] font-bold text-brand-primary">{project.name}</h4>
                      <p className="mt-0.5 line-clamp-1 text-[13px] text-gray-500">{project.locationName}</p>
                      <p className="mt-0.5 line-clamp-1 text-[12px] font-semibold text-gray-400">{project.developerName}</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[14px] font-bold text-brand-primary">{project.eurPriceRange}</p>
                    {project.isFeature && (
                      <span className="mt-1 inline-flex rounded-full bg-brand-secondary-soft px-2.5 py-1 text-[11px] font-bold text-brand-primary">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Deals */}
        {recentDeals.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[22px] font-bold text-brand-primary">Recent Deals</h3>
            </div>
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50 text-[14px] font-bold text-admin-muted">
                    <th className="py-4 px-6">Unit</th>
                    <th className="py-4 px-6">Project</th>
                    <th className="py-4 px-6">Type</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentDeals.map((deal) => (
                    <tr key={deal.id} className="text-[14px] text-brand-primary hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-semibold">{deal.unit?.unitName}</td>
                      <td className="py-4 px-6 text-gray-500">{deal.unit?.projectName}</td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-brand-secondary-soft rounded-full text-xs font-semibold">{deal.dealType}</span>
                      </td>
                      <td className="py-4 px-6 font-bold">{deal.unit?.currencyCode || 'EGP'} {deal.unit?.price?.toLocaleString()}</td>
                      <td className="py-4 px-6 text-gray-400">{new Date(deal.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
