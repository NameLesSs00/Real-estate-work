import Image from "next/image";
import { Home, ArrowLeft, ArrowRight } from "lucide-react";
import { getUnitById, resolveProjectImageUrl } from "@/lib/api/projects";
import Link from "next/link";
import { notFound } from "next/navigation";

// Public folder assets
const BASE            = "/assists/PropertyDetails";
const icoLocation     = `${BASE}/location.png`;
const icoBed          = `${BASE}/lucide_bed.png`;
const icoBath         = `${BASE}/cil_bath.png`;
const icoCar          = `${BASE}/ion_car-sport-outline.png`;
const icoSize         = `${BASE}/fluent_slide-size-24-regular.png`;
const icoCalendar     = `${BASE}/uil_calender.png`;
const icoHome         = `${BASE}/home-2.png`;
const icoCheck        = `${BASE}/weui_done2-outlined.png`;
const icoStar         = `${BASE}/Star1.png`;
const icoSend         = `${BASE}/send.png`;
const icoGroupQuote   = `${BASE}/Group.png`;

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PropertyDetailsPage({ params }: Props) {
  const { slug } = await params;
  
  // Extract ID from slug format: "123-modern-sea-view"
  const unitId = parseInt(slug.split('-')[0], 10);
  
  if (isNaN(unitId)) {
    notFound();
  }

  let unitData;
  try {
    unitData = await getUnitById(unitId);
  } catch (error) {
    console.error("Failed to fetch property details:", error);
    notFound();
  }

  const breadcrumbs = ["Home", unitData.propertyType || "Property", "Property Details"];
  const mainImage = unitData.imageUrls?.[0] ? resolveProjectImageUrl(unitData.imageUrls[0]) : `${BASE}/mainImg.png`;
  const thumbnails = unitData.imageUrls?.slice(1, 5).map(url => resolveProjectImageUrl(url)) || [];

  return (
    <div className="container mx-auto px-4 pt-32 pb-16 lg:pb-24 max-w-7xl">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-8">
        <Home className="w-4 h-4 mr-2" />
        {breadcrumbs.map((crumb, index) => (
          <span key={index} className="flex items-center">
            {index > 0 && <span className="mx-2 font-light text-gray-300">{'>'}</span>}
            {index === 0 ? (
              <Link href="/" className="hover:text-brand-primary transition-colors">{crumb}</Link>
            ) : (
              <span className={index === breadcrumbs.length - 1 ? "text-brand-primary font-medium" : "hover:text-brand-primary transition-colors"}>
                {crumb}
              </span>
            )}
          </span>
        ))}
      </div>

      {/* Title & Location */}
      <div className="mb-10">
        <h1 className="text-4xl lg:text-5xl font-semibold text-brand-primary mb-4 tracking-tight">
          {unitData.name || "Untitled Property"}
        </h1>
        <div className="flex items-center text-gray-500 text-lg">
          <Image src={icoLocation} alt="Location" width={20} height={20} className="w-5 h-5 mr-3 opacity-70" />
          <span>{unitData.floorName || "Location details not available"}</span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="relative w-full aspect-[16/9] rounded-[2.5rem] overflow-hidden shadow-sm">
              <Image 
                src={mainImage} 
                alt={unitData.name || "Property Image"} 
                fill 
                className="object-cover"
                priority
              />
            </div>
            {thumbnails.length > 0 && (
              <div className="grid grid-cols-4 gap-6">
                {thumbnails.map((thumb, index) => (
                  <div key={index} className="relative w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden cursor-pointer hover:ring-2 hover:ring-brand-primary transition-all shadow-sm">
                    <Image src={thumb} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Overview Section */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-50">
            <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-8">
              <h2 className="text-2xl font-semibold text-brand-primary">Overview</h2>
              <div className="text-gray-400 font-medium">
                Property ID: <span className="text-brand-primary">#{unitData.id}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              <div className="flex flex-col items-center text-center group">
                <div className="p-1 rounded-xl group-hover:bg-gray-50 transition-colors mb-4">
                  <Image src={icoHome} alt="Type" width={32} height={32} className="w-8 h-8" />
                </div>
                <span className="font-semibold text-brand-primary text-xl mb-1">{unitData.propertyType || "Unit"}</span>
                <span className="text-gray-400 text-sm">Property Type</span>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="p-1 rounded-xl group-hover:bg-gray-50 transition-colors mb-4">
                  <Image src={icoBed} alt="Bedrooms" width={32} height={32} className="w-8 h-8" />
                </div>
                <span className="font-semibold text-brand-primary text-xl mb-1">{unitData.noBedRoom || 0}</span>
                <span className="text-gray-400 text-sm">Bedrooms</span>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="p-1 rounded-xl group-hover:bg-gray-50 transition-colors mb-4">
                  <Image src={icoBath} alt="Bathrooms" width={32} height={32} className="w-8 h-8" />
                </div>
                <span className="font-semibold text-brand-primary text-xl mb-1">{unitData.noBathRoom || 0}</span>
                <span className="text-gray-400 text-sm">Bathrooms</span>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="p-1 rounded-xl group-hover:bg-gray-50 transition-colors mb-4">
                  <Image src={icoCar} alt="Kitchens" width={32} height={32} className="w-8 h-8" />
                </div>
                <span className="font-semibold text-brand-primary text-xl mb-1">{unitData.noKitchen || 0}</span>
                <span className="text-gray-400 text-sm">Kitchens</span>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="p-1 rounded-xl group-hover:bg-gray-50 transition-colors mb-4">
                  <Image src={icoSize} alt="Area Size" width={32} height={32} className="w-8 h-8" />
                </div>
                <span className="font-semibold text-brand-primary text-xl mb-1">{unitData.area || 0}</span>
                <span className="text-gray-400 text-sm">Area Size</span>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="p-1 rounded-xl group-hover:bg-gray-50 transition-colors mb-4">
                  <Image src={icoCalendar} alt="Floor" width={32} height={32} className="w-8 h-8" />
                </div>
                <span className="font-semibold text-brand-primary text-xl mb-1">{unitData.floorNumber || 0}</span>
                <span className="text-gray-400 text-sm">Floor</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-50">
            <h2 className="text-2xl font-semibold text-brand-primary mb-8 border-b border-gray-100 pb-8">Description</h2>
            <div className="text-gray-500 leading-relaxed text-lg space-y-6 whitespace-pre-wrap">
              {unitData.description || "No description provided."}
            </div>
          </div>

          {/* Features Section */}
          {((unitData.facilities && unitData.facilities.length > 0) || (unitData.services && unitData.services.length > 0)) && (
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-50">
              <h2 className="text-2xl font-semibold text-brand-primary mb-8 border-b border-gray-100 pb-8">Features & Services</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-10">
                {unitData.facilities?.map((feature, index) => (
                  <div key={`f-${index}`} className="flex items-center text-gray-700 group">
                    <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center mr-4 group-hover:bg-brand-primary transition-colors">
                      <Image src={icoCheck} alt="Check" width={14} height={14} className="w-3.5 h-3.5 group-hover:invert" />
                    </div>
                    <span className="text-lg">{feature.name || "Facility"}</span>
                  </div>
                ))}
                {unitData.services?.map((service, index) => (
                  <div key={`s-${index}`} className="flex items-center text-gray-700 group">
                    <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center mr-4 group-hover:bg-brand-primary transition-colors">
                      <Image src={icoCheck} alt="Check" width={14} height={14} className="w-3.5 h-3.5 group-hover:invert" />
                    </div>
                    <span className="text-lg">{service.name || "Service"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-lg border border-gray-50 sticky top-32">
            <h3 className="text-3xl font-semibold text-brand-primary text-center mb-10">Get in Touch</h3>
            
            <form className="space-y-8">
              <div>
                <label className="block text-md font-semibold text-brand-primary mb-3 ml-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all placeholder-gray-300 text-md shadow-inner"
                  placeholder="Full Name"
                />
              </div>

              <div>
                <label className="block text-md font-semibold text-brand-primary mb-3 ml-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input 
                  type="tel" 
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all placeholder-gray-300 text-md shadow-inner"
                  placeholder="Phone Number"
                />
              </div>

              <div>
                <label className="block text-md font-semibold text-brand-primary mb-3 ml-1">
                  Email
                </label>
                <input 
                  type="email" 
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all placeholder-gray-300 text-md shadow-inner"
                  placeholder="Email"
                />
              </div>

              <div>
                <label className="block text-md font-semibold text-brand-primary mb-3 ml-1">
                  Message
                </label>
                <textarea 
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 h-40 focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all resize-none placeholder-gray-300 text-md shadow-inner"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button 
                type="button"
                className="w-full bg-brand-primary text-white font-bold py-5 rounded-full flex items-center justify-center hover:bg-brand-secondary hover:scale-[1.02] transition-all shadow-xl active:scale-95 group"
              >
                <span className="text-lg">Book a Visit</span>
                <div className="bg-white/20 p-1.5 rounded-full ml-3 group-hover:translate-x-1 transition-transform">
                  <Image src={icoSend} alt="Send" width={16} height={16} className="w-4 h-4 invert" />
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Full Width Bottom Section */}
      <div className="mt-16 space-y-16">
        {/* Reviews Section */}
        <div className="space-y-12">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch w-full">
            {/* Rating Summary Card */}
            <div className="xl:col-span-4 bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-sm border border-gray-50 flex flex-col sm:flex-row items-center w-full">
              <div className="flex-1 flex flex-col items-center justify-center sm:border-r border-gray-100 sm:pr-8 mb-8 sm:mb-0">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-7xl lg:text-8xl font-bold text-brand-primary tracking-tighter">4.5</span>
                  <Image src={icoStar} alt="Star" width={48} height={48} className="w-12 h-12" />
                </div>
                <button className="bg-[#1B2134] text-white px-8 py-3 rounded-2xl text-sm font-bold shadow-xl hover:bg-brand-secondary transition-all">
                  653 reviews
                </button>
              </div>
              <div className="flex-[1.2] w-full sm:pl-8 flex flex-col justify-center gap-4">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-3 text-sm font-bold text-gray-400">
                    <span className="w-3 text-right">{star}</span>
                    <Image src={icoStar} alt="Star" width={16} height={16} className="w-4 h-4 opacity-40" />
                    <div className="flex-grow h-2 bg-gray-50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#FFB800] rounded-full" 
                        style={{ width: `${data.reviews.distribution[star as keyof typeof data.reviews.distribution]}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Carousel Area */}
            <div className="xl:col-span-8 flex flex-col sm:flex-row items-center gap-6 w-full">
              {/* Navigation Arrow 1 - Left */}
              <button className="w-14 h-14 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0 hover:bg-brand-secondary transition-all shadow-xl hover:scale-110 active:scale-95 group">
                <ArrowLeft className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" />
              </button>

              {/* Featured Review Card */}
              <div className="bg-[#FCFBF9] rounded-[2.5rem] p-8 lg:p-12 shadow-sm border border-[#F2EFE9] flex-1 w-full relative flex flex-col h-full justify-center">
                <div className="absolute top-10 right-10 w-12 h-12 opacity-80">
                  <Image src={icoGroupQuote} alt="Quote" width={48} height={48} className="w-full h-full object-contain" />
                </div>
                
                <div className="flex items-center gap-6 mb-8 relative z-10">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-md">
                    <Image src={data.reviews.featured.avatar} alt={data.reviews.featured.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-primary text-2xl mb-1">{data.reviews.featured.name}</h4>
                    <p className="text-lg text-gray-400 mb-2">{data.reviews.featured.role}</p>
                    <div className="flex items-center gap-2">
                      <Image src={icoStar} alt="Star" width={24} height={24} className="w-6 h-6" />
                      <span className="text-2xl font-bold text-brand-primary">4.75</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-grow relative z-10">
                  <p className="text-gray-600 text-lg lg:text-xl leading-[1.7] font-medium max-w-3xl">
                    {data.reviews.featured.text}
                  </p>
                </div>
              </div>

              {/* Navigation Arrow 2 - Right */}
              <button className="w-14 h-14 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0 hover:bg-brand-secondary transition-all shadow-xl hover:scale-110 active:scale-95 group">
                <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Add Review Form */}
        <div className="bg-transparent max-w-full">
          <h2 className="text-2xl font-bold text-brand-primary mb-2">Add Review</h2>
          <p className="text-gray-600 mb-8 text-md">Your email address will not be published. Required fields are marked <span className="text-red-500">*</span></p>
          
          <div className="mb-6">
            <p className="text-brand-primary font-bold text-lg mb-2">Review</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className="p-1 cursor-pointer">
                  <Image src={icoStar} alt="Star" width={20} height={20} className="w-5 h-5 opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-brand-primary font-bold text-lg mb-3">
              Comment
            </label>
            <textarea 
              className="w-full bg-white border border-gray-300 rounded-lg p-4 h-32 focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all resize-none placeholder-gray-400 text-md"
              placeholder="Text..."
            ></textarea>
          </div>

          <div className="flex justify-start">
            <button className="px-10 py-3 border border-brand-primary text-brand-primary font-semibold rounded-full hover:bg-brand-primary hover:text-white transition-colors">
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
