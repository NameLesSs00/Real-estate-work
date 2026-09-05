'use client';

import React, { useMemo, useState } from 'react';
import { Check, Search, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  DEFAULT_ICON_NAME,
  FACILITY_SERVICE_ICON_CATEGORIES,
  FACILITY_SERVICE_ICON_OPTIONS,
  getFacilityServiceIcon,
} from '@/lib/icons/facilityServiceIcons';

export type IconPickerOption = {
  name: string;
  label: string;
  category: string;
};

interface IconPickerProps {
  value: string | null;
  onChange: (icon: string | null) => void;
  label?: string;
  compact?: boolean;
  options?: IconPickerOption[];
  categories?: string[];
  getIcon?: (iconName?: string | null) => LucideIcon;
  defaultIconName?: string;
  title?: string;
  searchPlaceholder?: string;
}

export default function IconPicker({
  value,
  onChange,
  label = 'Icon',
  compact = false,
  options = FACILITY_SERVICE_ICON_OPTIONS,
  categories = FACILITY_SERVICE_ICON_CATEGORIES,
  getIcon = getFacilityServiceIcon,
  defaultIconName = DEFAULT_ICON_NAME,
  title = 'Choose Icon',
  searchPlaceholder = 'Search security, pool, parking...',
}: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const SelectedIcon = getIcon(value);
  const DefaultIcon = getIcon(null);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return options;

    return options.filter((option) => (
      option.name.toLowerCase().includes(normalizedQuery) ||
      option.label.toLowerCase().includes(normalizedQuery) ||
      option.category.toLowerCase().includes(normalizedQuery)
    ));
  }, [options, query]);

  const selectedLabel = options.find((option) => option.name === value)?.label ?? 'Default';

  return (
    <div className="space-y-2">
      {!compact && (
        <label className="ml-1 text-[14px] font-bold text-brand-primary">{label}</label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border border-gray-100 bg-admin-bg px-4 py-3 text-left outline-none transition-all hover:border-brand-primary/20 focus:ring-2 focus:ring-brand-primary/10 ${
          compact ? 'min-w-[190px] bg-white px-3 py-2 text-sm' : ''
        }`}
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-primary shadow-sm ring-1 ring-gray-100">
            <SelectedIcon size={20} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-bold text-brand-primary">{selectedLabel}</span>
            <span className="block truncate text-[11px] font-semibold text-gray-400">
              {value ? value : defaultIconName}
            </span>
          </span>
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-primary/40 px-4 py-8 backdrop-blur-sm">
          <div className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-6 py-5">
              <div>
                <h2 className="text-[20px] font-bold text-brand-primary">{title}</h2>
                <p className="mt-1 text-[13px] font-medium text-gray-400">Saved as a simple icon name.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 transition-all hover:bg-gray-50 hover:text-brand-primary"
                aria-label="Close icon picker"
              >
                <X size={20} />
              </button>
            </div>

            <div className="border-b border-gray-100 p-5">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full rounded-2xl border border-gray-100 bg-admin-bg py-3 pl-12 pr-4 text-[14px] font-medium text-brand-primary outline-none transition-all focus:border-brand-primary/20 focus:ring-4 focus:ring-brand-primary/5"
                />
              </div>
            </div>

            <div className="overflow-y-auto px-5 py-5">
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  setIsOpen(false);
                }}
                className={`mb-5 flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all ${
                  value === null
                    ? 'border-brand-primary bg-brand-primary-soft text-brand-primary'
                    : 'border-gray-100 bg-admin-bg text-brand-primary hover:border-brand-primary/20'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-primary shadow-sm">
                    <DefaultIcon size={20} />
                  </span>
                  <span>
                    <span className="block text-[14px] font-bold">Default Icon</span>
                    <span className="block text-[12px] font-semibold text-gray-400">{defaultIconName}</span>
                  </span>
                </span>
                {value === null && <Check size={18} />}
              </button>

              <div className="space-y-6">
                {categories.map((category) => {
                  const categoryOptions = filteredOptions.filter((option) => option.category === category);
                  if (categoryOptions.length === 0) return null;

                  return (
                    <section key={category}>
                      <h3 className="mb-3 text-[12px] font-black uppercase tracking-wider text-brand-secondary">
                        {category}
                      </h3>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {categoryOptions.map((option) => {
                          const OptionIcon = getIcon(option.name);
                          const isSelected = value === option.name;

                          return (
                            <button
                              key={option.name}
                              type="button"
                              onClick={() => {
                                onChange(option.name);
                                setIsOpen(false);
                              }}
                              className={`flex min-h-[74px] items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                                isSelected
                                  ? 'border-brand-primary bg-brand-primary-soft text-brand-primary shadow-sm'
                                  : 'border-gray-100 bg-white text-brand-primary hover:border-brand-primary/20 hover:bg-admin-bg'
                              }`}
                            >
                              <span className="flex min-w-0 items-center gap-3">
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-admin-bg text-brand-primary">
                                  <OptionIcon size={21} />
                                </span>
                                <span className="min-w-0">
                                  <span className="block truncate text-[13px] font-bold">{option.label}</span>
                                  <span className="block truncate text-[11px] font-semibold text-gray-400">{option.name}</span>
                                </span>
                              </span>
                              {isSelected && <Check size={18} className="shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
