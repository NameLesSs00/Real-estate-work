import Image from "next/image";
import { Home, MapPin, BedDouble, Bath, Utensils, Maximize2, Layers, ChevronRight } from "lucide-react";
import { getUnitById, resolveProjectImageUrl } from "@/lib/api/projects";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import CopyLinkButton from "@/components/CopyLinkButton";
import LeadForm from "./components/LeadForm";

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

  const unitId = parseInt(slug.split("-")[0], 10);
  if (isNaN(unitId)) notFound();

  let unitData;
  try {
    unitData = await getUnitById(unitId, locale);
  } catch {
    notFound();
  }

  const mainImage =
    (unitData.imageUrls?.[0] ? resolveProjectImageUrl(unitData.imageUrls[0]) : null) ??
    `${BASE}/mainImg.png`;
  const thumbnails = (unitData.imageUrls?.slice(1, 5) ?? [])
    .map((url) => resolveProjectImageUrl(url))
    .filter((u): u is string => u !== null);

  const overviewStats = [
    { label: t.projectDetails.propertyType || "Property Type", value: unitData.propertyType || "Unit",         icon: <Home        size={16} className="text-gray-500" /> },
    { label: t.projectDetails.bedrooms || "Bedrooms",      value: unitData.noBedRoom  || 0,                icon: <BedDouble   size={16} className="text-gray-500" /> },
    { label: t.projectDetails.bathrooms || "Bathrooms",     value: unitData.noBathRoom || 0,                icon: <Bath        size={16} className="text-gray-500" /> },
    { label: t.projectDetails.kitchens || "Kitchens",      value: unitData.noKitchen  || 0,                icon: <Utensils    size={16} className="text-gray-500" /> },
    { label: t.projectDetails.areaSize || "Area Size",     value: `${unitData.area || 0} M²`,           icon: <Maximize2   size={16} className="text-gray-500" /> },
    { label: t.projectDetails.floor || "Floor",         value: unitData.floorNumber || 0,               icon: <Layers      size={16} className="text-gray-500" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8F8F8] pt-36 pb-20">
      <div className="w-full max-w-7xl xl:max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 text-[13px] text-gray-400 mb-5 font-poppins">
          <Home size={14} className="text-gray-400" />
          <Link href="/" className="hover:text-gray-700 transition-colors">{t.header.home || "Home"}</Link>
          <ChevronRight size={13} />
          <span>{unitData.propertyType || "Property"}</span>
          <ChevronRight size={13} />
          <span className="text-gray-700 font-semibold">{t.projectDetails.title || "Property Details"}</span>
        </nav>

        {/* Title + Location */}
        <h1 className="text-[28px] font-bold text-gray-900 mb-1 font-poppins">
          {unitData.name || "Untitled Property"}
        </h1>
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-1.5 text-[13px] text-gray-500 font-poppins">
            <MapPin size={14} className="text-gray-400 flex-shrink-0" />
            <span>{unitData.floorName || t.projectDetails.noLocation || "Location not available"}</span>
          </div>
          <CopyLinkButton />
        </div>

        {/* ── Main Two-Column Section ── */}
        <div className="flex flex-col lg:flex-row gap-5 items-start mb-5">

          {/* LEFT: Images (65%) */}
          <div className="flex-1 flex flex-col gap-3">
            {/* Main Image */}
            <div className="relative w-full aspect-[4/3] rounded-[12px] overflow-hidden bg-gray-200">
              <Image
                src={mainImage}
                alt={unitData.name || "Property Image"}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Thumbnails */}
            {thumbnails.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {thumbnails.map((thumb, i) => (
                  <div
                    key={i}
                    className="relative w-full aspect-[4/3] rounded-[10px] overflow-hidden cursor-pointer bg-gray-200"
                  >
                    <Image src={thumb} alt={`Thumbnail ${i + 1}`} fill className="object-cover hover:opacity-90 transition-opacity" />
                  </div>
                ))}
              </div>
            )}
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
            {unitData.description || t.projectDetails.noDescription || "No description provided."}
          </p>
        </div>

        {/* ── Features & Services ── */}
        {((unitData.facilities?.length ?? 0) > 0 || (unitData.services?.length ?? 0) > 0) && (
          <div className="bg-white border border-[#ECECEC] rounded-[14px] p-6 shadow-sm mb-5">
            <h2 className="text-[17px] font-bold text-gray-900 mb-3 pb-3 border-b border-[#F0F0F0] font-poppins">
              {t.projectDetails.featuresServices || "Features & Services"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
              {unitData.facilities?.map((f: any, i: number) => {
                const name = typeof f.name === 'string' ? f.name : (f.name?.[locale] || f.name?.en || 'Unknown');
                return (
                  <div key={`f-${i}`} className="flex items-center gap-2.5 text-gray-700">
                    <Image src={icoCheck} alt="check" width={14} height={14} className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-[13px] font-poppins">{name}</span>
                  </div>
                );
              })}
              {unitData.services?.map((s: any, i: number) => {
                const name = typeof s.name === 'string' ? s.name : (s.name?.[locale] || s.name?.en || 'Unknown');
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
