import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { UnitDetail } from '@/lib/api/projects';

const InfoCard = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="bg-[#F9F6F2] rounded-2xl px-6 py-5">
    <p className="text-[13px] text-gray-500 font-medium mb-1">{label}</p>
    <p className="text-[#16273B] text-[18px] font-bold">{value}</p>
  </div>
);

interface UnitInfoProps {
  unit: UnitDetail;
}

export default function UnitInfo({ unit }: UnitInfoProps) {
  return (
    <>
      {/* Name + Status badges */}
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-[26px] font-bold text-[#16273B]">
          {typeof unit.Name === 'string' ? unit.Name : (unit.Name?.en || (typeof unit.name === 'string' ? unit.name : unit.name?.en) || 'Untitled')}
        </h3>
        {unit.IsFeatured && (
          <span className="inline-flex px-4 py-1.5 rounded-full bg-[#FEF9C3] text-[#A16207] text-[13px] font-bold">⭐ Featured</span>
        )}
        {unit.IsActive || unit.isActive ? (
          <span className="inline-flex px-4 py-1.5 rounded-full bg-[#DCFCE7] text-[#166534] text-[13px] font-bold">Active</span>
        ) : (
          <span className="inline-flex px-4 py-1.5 rounded-full bg-[#FEE2E2] text-[#991B1B] text-[13px] font-bold">Sold</span>
        )}
        <Link 
          href={`/properties/${unit.Id || unit.id}`}
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF3FF] text-[#1447E6] text-[13px] font-bold hover:bg-[#D6E6FF] transition-all cursor-pointer shadow-sm border border-[#D6E6FF]"
        >
          <ExternalLink size={14} />
          View as Client
        </Link>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-4">
        <InfoCard 
          label="Price" 
          value={`${unit.CurrencyCode || unit.currencyCode || 'EGP'} ${(unit.Price ?? unit.price ?? 0).toLocaleString()}`} 
        />
        <InfoCard label="Property Type" value={unit.PropertyType || unit.propertyType || '—'} />
        <InfoCard label="Listing Status" value={unit.Type || unit.type || '—'} />
        <InfoCard label="Project" value={unit.ProjectName || unit.projectName || '—'} />
        <InfoCard label="Location" value={unit.LocationName || unit.locationName || '—'} />
      </div>

      {/* Description */}
      {(unit.Description || unit.description) && (
        <div className="bg-[#F9F6F2] rounded-2xl px-6 py-5">
          <p className="text-[13px] text-gray-500 font-medium mb-2">Description</p>
          <p className="text-[#16273B] text-[15px] leading-relaxed">
            {typeof unit.Description === 'object' ? (unit.Description.en || unit.Description.de || unit.Description.pl) : 
             (typeof unit.description === 'object' ? (unit.description.en || unit.description.de || unit.description.pl) : (unit.Description || unit.description))}
          </p>
        </div>
      )}

      {/* Services */}
      <div className="grid grid-cols-1 gap-4">
        {(unit.Services || unit.services) && (unit.Services || unit.services)!.length > 0 && (
          <div className="bg-[#F9F6F2] rounded-2xl px-6 py-5">
            <p className="text-[13px] text-gray-500 font-medium mb-3">Services</p>
            <div className="flex flex-wrap gap-2">
              {(unit.Services || unit.services)!.map((s, i) => {
                const name = typeof s.name === 'string' ? s.name : (s.name?.en || s.name?.de || s.name?.pl || 'Unknown');
                return (
                  <span key={i} className="px-3 py-1 bg-white rounded-full text-[13px] text-[#16273B] font-medium border border-gray-200">{name}</span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="text-[12px] text-gray-400 flex gap-6 mt-4">
        <span>Created by <strong className="text-gray-500">{unit.createdBy || 'Admin'}</strong></span>
        {unit.updatedBy && (
          <span>Updated by <strong className="text-gray-500">{unit.updatedBy}</strong></span>
        )}
      </div>
    </>
  );
}
