/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
export const dynamic = "force-dynamic";
import { Home, MapPin, BedDouble, Bath, Utensils, Maximize2, Layers, ChevronRight } from "lucide-react";
import { getUnitById, resolveProjectImageUrl } from "@/lib/api/projects";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import CopyLinkButton from "@/components/CopyLinkButton";
import LeadForm from "./components/LeadForm";
import ImageGallery from "@/components/ImageGallery";

async function getTranslations(locale: string) {
  try {
    const data = await import(`@/public/locales/${locale}.json`);
    return data.default;
  } catch {
    const data = await import(`@/public/locales/en.json`);
    return data.default;
  }
}

const BASE = "/assists/PropertyDetails";
const icoCheck = `${BASE}/weui_done2-outlined.png`;

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PropertyDetailsPage({ params }: Props) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const t = await getTranslations(locale);

  const isExplicitlyOutside = slug.startsWith("out-");
  const idString = isExplicitlyOutside ? slug.replace("out-", "").split("-")[0] : slug.split("-")[0];
  const unitId = parseInt(idString, 10);

  if (isNaN(unitId)) notFound();

  let unitData: any;
  let isOutside = false;

  if (isExplicitlyOutside) {
    try {
      const { getUnitOutsideById } = await import("@/lib/api/unitOutsides");
      unitData = await getUnitOutsideById(unitId, locale);
      isOutside = true;
    } catch {
      notFound();
    }
  } else {
    try {
      unitData = await getUnitById(unitId, locale);
    } catch {
      try {
        const { getUnitOutsideById } = await import("@/lib/api/unitOutsides");
        unitData = await getUnitOutsideById(unitId, locale);
        isOutside = true;
      } catch {
        notFound();
      }
    }
  }

  // Unified data extractor mapped directly to the backend JSON format
  const extractString = (val: any): string => {
    if (!val) return "";
    if (typeof val === 'string' && val.trim() !== '') return val;
    if (typeof val === 'object') {
      const locStr = val[locale] || val.en || val.de || val.pl;
      if (typeof locStr === 'string' && locStr.trim() !== '') return locStr;
    }
    return "";
  };

  const d = unitData?.data || unitData || {};

  const propertyName = extractString(d.name) || extractString(d.Name) || "Untitled Property";
  const propertyDescription = extractString(d.description) || extractString(d.Description) || "";
  const propertyPrice = d.price || d.Price || 0;
  const propertyCurrency = d.currencyCode || d.CurrencyCode || "USD";
  const propertyArea = d.area || d.Area || 0;
  const propertyBedrooms = d.noBedRoom || d.NoBedRoom || 0;
  const propertyBathrooms = d.noBathRoom || d.NoBathRoom || 0;
  const propertyKitchens = d.noKitchen || d.NoKitchen || 0;
  const propertyFloorName = extractString(d.floorName) || extractString(d.FloorName) || "";
  const propertyFloorNum = d.floorNumber || d.FloorNumber || 0;
  const unitTypeName = extractString(d.unitType) || extractString(d.UnitType) || "";
  const unitStatusName = extractString(d.unitStatus) || extractString(d.UnitStatus) || "";
  const propertyType = extractString(d.propertyType) || extractString(d.PropertyType) || "Property";
  const projName = extractString(d.projectName) || extractString(d.ProjectName) || "";
  const locName = extractString(d.location?.name) ||
    extractString(d.locationName) ||
    extractString(d.LocationName) ||
    "";

  const propertyLocation = locName ||
    (isOutside ? [d.city || d.cityName, d.district || d.districtName, d.country || d.countryName].filter(Boolean).join(' - ') : "") ||
    propertyFloorName || "";

  const unitImages = (d.imageUrls?.length ? d.imageUrls : null) ||
    (d.ImageUrls?.length ? d.ImageUrls : null) ||
    (d.images || d.Images || [])?.map((img: any) => {
      if (typeof img === 'string') return img;
      return img?.imageUrl || img?.ImageUrl || img?.url || img?.Url || "";
    }).filter(Boolean) ||
    [];

  const allResolvedImages = (unitImages || [])
    .map((url: any) => {
      const path = typeof url === 'string' ? url : (url?.imageUrl || url?.ImageUrl || url?.url || url?.Url);
      return resolveProjectImageUrl(path);
    })
    .filter(Boolean) as string[];

  if (allResolvedImages.length === 0) {
    allResolvedImages.push(`${BASE}/mainImg.png`);
  }

  const overviewStats = [
    { label: t.projectDetails.propertyType || "Property Type", value: propertyType, icon: <Home size={16} className="text-gray-500" /> },
    { label: t.projectDetails.bedrooms || "Bedrooms", value: propertyBedrooms, icon: <BedDouble size={16} className="text-gray-500" /> },
    { label: t.projectDetails.bathrooms || "Bathrooms", value: propertyBathrooms, icon: <Bath size={16} className="text-gray-500" /> },
    { label: t.projectDetails.kitchens || "Kitchens", value: propertyKitchens, icon: <Utensils size={16} className="text-gray-500" /> },
    { label: t.projectDetails.areaSize || "Area Size", value: propertyArea ? `${propertyArea} M²` : null, icon: <Maximize2 size={16} className="text-gray-500" /> },
    { label: t.projectDetails.floor || "Floor", value: propertyFloorNum, icon: <Layers size={16} className="text-gray-500" /> },
  ].filter(stat => stat.value !== null && stat.value !== undefined && stat.value !== 0 && stat.value !== "");

  return (
    <div className="min-h-screen bg-[#F8F8F8] pt-36 pb-20">
      <div className="w-full max-w-7xl xl:max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 text-[13px] text-gray-400 mb-5 font-poppins">
          <Home size={14} className="text-gray-400" />
          <Link href="/" className="hover:text-gray-700 transition-colors">{t.header.home || "Home"}</Link>
          <ChevronRight size={13} />
          <span>{propertyType}</span>
          <ChevronRight size={13} />
          <span className="text-gray-700 font-semibold">{t.projectDetails.title || "Property Details"}</span>
        </nav>

        {/* Title + Location */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            {projName && <p className="text-[#E8A33E] font-bold text-[14px] mb-1 uppercase tracking-wider">{projName}</p>}
            <h1 className="text-[32px] font-bold text-gray-900 mb-2 font-poppins leading-tight">
              {propertyName}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-[13px] text-gray-500 font-poppins">
              {propertyLocation && propertyLocation.length >= 3 && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                  <span>{propertyLocation}</span>
                </div>
              )}
              {(unitTypeName || unitStatusName) && (
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  <div className="flex items-center gap-2">
                    {unitTypeName && <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase">{unitTypeName}</span>}
                    {unitStatusName && <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase">{unitStatusName}</span>}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[12px] text-gray-400 font-medium uppercase tracking-wider">{t.projectDetails.price || "Price"}</p>
              <p className="text-[28px] font-bold text-[#16273B] leading-none">{propertyCurrency} {propertyPrice.toLocaleString()}</p>
            </div>
            <CopyLinkButton />
          </div>
        </div>

        {/* ── Main Two-Column Section ── */}
        <div className="flex flex-col lg:flex-row gap-5 items-start mb-5">

          {/* LEFT: Images (65%) */}
          <div className="flex-1 min-w-0">
            <ImageGallery images={allResolvedImages} projectName={propertyName} />
          </div>

          {/* RIGHT: Get in Touch Form */}
          <div className="w-full lg:w-[400px] xl:w-[450px] flex-shrink-0">
            <LeadForm unitId={unitId} />
          </div>
        </div>

        {/* ── Overview Card (full width) ── */}
        <div className="bg-white border border-[#ECECEC] rounded-[14px] p-6 shadow-sm mb-5">
          <div className="mb-4 pb-4 border-b border-[#F0F0F0]">
            <h2 className="text-[17px] font-bold text-gray-900 font-poppins">{t.projectDetails.overview || "Overview"}</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-y-5 divide-x divide-[#F0F0F0]">
            {overviewStats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center px-3">
                <div className="flex items-center gap-1.5 mb-1">
                  {stat.icon}
                  <span className="text-[15px] font-bold text-gray-900 font-poppins">{stat.value}</span>
                </div>
                <span className="text-[12px] text-gray-400 font-poppins">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Description ── */}
        <div className="bg-white border border-[#ECECEC] rounded-[14px] p-6 shadow-sm mb-5">
          <h2 className="text-[17px] font-bold text-gray-900 mb-3 pb-3 border-b border-[#F0F0F0] font-poppins">
            {t.projectDetails.description || "Description"}
          </h2>
          <p className="text-[14px] text-gray-600 leading-relaxed font-poppins whitespace-pre-wrap">
            {propertyDescription || t.projectDetails.noDescription || "No description provided."}
          </p>
        </div>

        {/* ── Features & Services ── */}
        {((d.Facilities?.length ?? 0) > 0 || (d.Services?.length ?? 0) > 0 || (d.facilities?.length ?? 0) > 0 || (d.services?.length ?? 0) > 0) && (
          <div className="bg-white border border-[#ECECEC] rounded-[14px] p-6 shadow-sm mb-5">
            <h2 className="text-[17px] font-bold text-gray-900 mb-3 pb-3 border-b border-[#F0F0F0] font-poppins">
              {t.projectDetails.featuresServices || "Features & Services"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
              {(d.facilities || d.Facilities || [])?.map((f: any, i: number) => {
                const name = (typeof f === 'string' ? f : (typeof f.name === 'string' ? f.name : (f.name?.[locale] || f.name?.en || 'Unknown'))) as string;
                return (
                  <div key={`f-${i}`} className="flex items-center gap-2.5 text-gray-700">
                    <Image src={icoCheck} alt="check" width={14} height={14} className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-[13px] font-poppins">{name}</span>
                  </div>
                );
              })}
              {(d.services || d.Services || [])?.map((s: any, i: number) => {
                const name = (typeof s === 'string' ? s : (typeof s.name === 'string' ? s.name : (s.name?.[locale] || s.name?.en || 'Unknown'))) as string;
                return (
                  <div key={`s-${i}`} className="flex items-center gap-2.5 text-gray-700">
                    <Image src={icoCheck} alt="check" width={14} height={14} className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-[13px] font-poppins">{name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Reviews Placeholder ── */}
        <div className="bg-white border border-[#ECECEC] rounded-[14px] p-6 shadow-sm">
          <h2 className="text-[17px] font-bold text-gray-900 mb-3 pb-3 border-b border-[#F0F0F0] font-poppins">
            {t.projectDetails.reviews || "Reviews"}
          </h2>
          <p className="text-[13px] text-gray-400 italic font-poppins text-center py-6">
            {t.projectDetails.commentsLater || "Comment section will be added later"}
          </p>
        </div>

      </div>
    </div>
  );
}
