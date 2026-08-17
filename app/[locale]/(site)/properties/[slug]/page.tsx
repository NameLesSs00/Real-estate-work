/* eslint-disable @typescript-eslint/no-explicit-any */

export const dynamic = "force-dynamic";
import { Home, MapPin, BedDouble, Bath, Utensils, Maximize2, Layers, ChevronRight, Check, Banknote, CreditCard, Calendar } from "lucide-react";
import { getUnitById, resolveProjectImageUrl } from "@/lib/api/projects";
import { getServices } from "@/lib/api/services";
import { getFacilities } from "@/lib/api/facilities";
import Link from "next/link";
import { notFound } from "next/navigation";
import CopyLinkButton from "@/components/CopyLinkButton";
import LeadForm from "./components/LeadForm";
import ImageGallery from "@/components/ImageGallery";
import UnitReviews from "./components/UnitReviews";

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


type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export default async function PropertyDetailsPage({ params }: Props) {
  const { slug, locale } = await params;
  const t = await getTranslations(locale);

  const isExplicitlyOutside = slug.startsWith("out-");
  // Handle out-ID-name or ID-name
  const baseSlug = isExplicitlyOutside ? slug.replace("out-", "") : slug;
  const idString = baseSlug.split("-")[0];
  const unitId = parseInt(idString, 10);

  if (isNaN(unitId)) notFound();

  let unitData: any;
  let isOutside = false;
  let allServices: any[] = [];
  let allFacilities: any[] = [];

  try {
    const [servicesData, facilitiesData] = await Promise.all([
      getServices(),
      getFacilities()
    ]);
    allServices = servicesData;
    allFacilities = facilitiesData;
  } catch (err) {
    console.error("Failed to fetch auxiliary data:", err);
  }

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
  const unitView = isOutside ? "" : (extractString(d.view) || extractString(d.View) || "");
  const unitBuyRent = extractString(d.type) || extractString(d.Type) || "";
  const propertyType = extractString(d.propertyType) || extractString(d.PropertyType) || "Property";
  const unitMarkerId = extractString(d.markerId) || extractString(d.MarkerId) || "";
  const projName = extractString(d.projectName) || extractString(d.ProjectName) || "";
  const locName = extractString(d.location?.name) ||
    extractString(d.locationName) ||
    extractString(d.LocationName) ||
    "";

  const propertyLocation = isOutside 
    ? [extractString(d.city || d.City), extractString(d.country || d.Country), extractString(d.street || d.Street)].filter(Boolean).join(' - ')
    : (locName || propertyFloorName || "");

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
  
  const paymentPlans = (d.paymentPlans || d.PaymentPlans || d.paymentPlan || d.PaymentPlan || []) as any[];

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
    <div className="min-h-screen bg-[#F8F8F8] pt-32 md:pt-36 pb-20">
      <div className="w-full max-w-7xl xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 text-[13px] text-gray-400 mb-5 font-poppins">
          <Home size={14} className="text-gray-400" />
          <Link href={`/${locale}`} className="hover:text-gray-700 transition-colors">{t.header.home || "Home"}</Link>
          <ChevronRight size={13} />
          <span>{propertyType}</span>
          <ChevronRight size={13} />
          <span className="text-gray-700 font-semibold">{t.projectDetails.title || "Property Details"}</span>
        </nav>

        {/* Title + Location */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            {projName && <p className="text-[#E8A33E] font-bold text-[14px] mb-1 uppercase tracking-wider">{projName}</p>}
            <h1 className="text-[24px] sm:text-[32px] font-bold text-gray-900 mb-2 font-poppins leading-tight break-words">
              {propertyName}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-[13px] text-gray-500 font-poppins">
              {propertyLocation && propertyLocation.length >= 3 && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                  <span>{propertyLocation}</span>
                </div>
              )}
              {(unitTypeName || unitStatusName || unitBuyRent) && (
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  <div className="flex items-center gap-2">
                    {unitBuyRent && <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase">{unitBuyRent}</span>}
                    {unitTypeName && <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase">{unitTypeName}</span>}
                    {unitStatusName && <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase">{unitStatusName}</span>}
                    {unitView && <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase">View: {unitView}</span>}
                    {unitMarkerId && <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase">ID: {unitMarkerId}</span>}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-start sm:items-center gap-3 sm:gap-4">
            <div className="text-left sm:text-right">
              <p className="text-[12px] text-gray-400 font-medium uppercase tracking-wider">{t.projectDetails.price || "Price"}</p>
              <p className="text-[22px] sm:text-[28px] font-bold text-[#000000] leading-none">{propertyCurrency} {propertyPrice.toLocaleString()}</p>
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
        <div className="bg-white border border-[#F0EDE8] rounded-[24px] p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-[20px] font-bold text-[#000000] font-poppins">{t.projectDetails.overview || "Overview"}</h2>
            <div className="h-px flex-1 bg-gray-100"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-8">
            {overviewStats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-3 group-hover:bg-[#000000] group-hover:text-white transition-all">
                  {stat.icon}
                </div>
                <span className="text-[16px] font-bold text-[#000000] font-poppins mb-1">{stat.value}</span>
                <span className="text-[12px] text-gray-400 font-poppins uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Features & Services ── */}
        {!isOutside && (() => {
          const combinedIds = Array.from(new Set([
            ...(d.services || d.Services || []),
            ...(d.facilities || d.Facilities || [])
          ]));
          if (combinedIds.length === 0) return null;

          return (
            <div className="bg-white border border-[#F0EDE8] rounded-[24px] p-6 sm:p-8 shadow-sm mb-8">
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-[20px] font-bold text-[#000000] font-poppins">
                  {t.projectDetails.featuresServices || "Features & Services"}
                </h2>
                <div className="h-px flex-1 bg-gray-100"></div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {combinedIds.map((id: any, i: number) => {
                  const numericId = Number(id);
                  const foundService = allServices.find(s => s.id === numericId);
                  const foundFacility = allFacilities.find(f => f.id === numericId);
                  const nameObj = foundService?.name || foundFacility?.name;
                  
                  let localizedName = "";
                  if (typeof nameObj === 'string') {
                    localizedName = nameObj;
                  } else if (nameObj) {
                    localizedName = nameObj[locale] || nameObj.en || nameObj.de || nameObj.pl || `Item ${numericId}`;
                  } else {
                    localizedName = `Feature ${numericId}`;
                  }

                  return (
                    <div key={i} className="flex items-center gap-4 group p-3 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                      <div className="w-8 h-8 rounded-full bg-[#000000]/5 flex items-center justify-center text-[#000000] group-hover:bg-[#000000] group-hover:text-white transition-all">
                        <Check size={16} strokeWidth={3} />
                      </div>
                      <span className="text-[14px] md:text-[15px] font-medium text-[#666] group-hover:text-[#000000] transition-colors">
                        {localizedName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* ── Description ── */}
        <div className="bg-[#F8F5F0] border border-[#F0EDE8] rounded-[24px] p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-[20px] font-bold text-[#000000] font-poppins">
              {t.projectDetails.description || "Description"}
            </h2>
            <div className="h-px flex-1 bg-[#E5E2DE]"></div>
          </div>
          <div className="flex flex-col gap-4">
            {propertyDescription
              ? propertyDescription.split('\n\n').map((para, i) => (
                  <p key={i} className="text-[15px] text-[#666] leading-relaxed font-poppins">
                    {para}
                  </p>
                ))
              : <p className="text-[14px] text-gray-400 italic font-poppins">{t.projectDetails.noDescription || "No description provided."}</p>
            }
          </div>
        </div>
        
        {/* ── Payment Plans ── */}
        {paymentPlans.length > 0 && (
          <div className="bg-white border border-[#F0EDE8] rounded-[24px] p-6 sm:p-8 shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-[20px] font-bold text-[#000000] font-poppins">
                {t.projectDetails.paymentPlans || "Payment Plans"}
              </h2>
              <div className="h-px flex-1 bg-gray-100"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paymentPlans.map((plan, i) => {
                const typeStr = (plan.paymentType || plan.PaymentType || "").toString().toLowerCase();
                const isCash = typeStr === 'cash';
                const commission = plan.commissionRate || plan.CommissionRate || 0;
                
                return (
                  <div key={i} className="flex flex-col p-6 rounded-2xl bg-[#F8F9FA] border border-gray-100 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-[#000000] text-white">
                          {isCash ? <Banknote size={18} /> : <CreditCard size={18} />}
                        </div>
                        <span className="font-bold text-[#000000]">
                          {isCash ? (t.projectDetails.cash || "Cash") : (t.projectDetails.installment || "Installment")}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {isCash && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">{t.projectDetails.price || "Price"}</span>
                          <span className="font-bold text-[#000000]">{propertyCurrency} {propertyPrice.toLocaleString()}</span>
                        </div>
                      )}
                      {commission > 0 ? (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">{t.projectDetails.commission || "Commission"}</span>
                          <span className="font-semibold text-[#000000]">{commission}%</span>
                        </div>
                      ) : null}
                      {!isCash && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">{t.projectDetails.months || "Months"}</span>
                            <div className="flex items-center gap-1.5 font-semibold text-[#000000]">
                              <Calendar size={14} className="text-gray-400" />
                              {plan.installmentMothes || plan.InstallmentMothes || plan.installmentMonths || plan.InstallmentMonths || 0}
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">{t.projectDetails.downPayment || "Down Payment"}</span>
                            <span className="font-semibold text-[#000000]">{plan.installmentDownPayment || plan.InstallmentDownPayment || 0}%</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <UnitReviews unitId={unitId} />

      </div>
    </div>
  );
}
