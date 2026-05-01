import Image from "next/image";
import { Home, ArrowLeft, ArrowRight } from "lucide-react";

// Static image imports — bundled at build time, zero HTTP requests on Vercel
import imgMain       from "@/public/assists/PropertyDetails/mainImg.png";
import imgGallery1   from "@/public/assists/PropertyDetails/img1.png";
import imgGallery2   from "@/public/assists/PropertyDetails/img2.png";
import imgGallery3   from "@/public/assists/PropertyDetails/img3.png";
import imgGallery4   from "@/public/assists/PropertyDetails/img4.png";
import icoLocation   from "@/public/assists/PropertyDetails/location.png";
import icoBed        from "@/public/assists/PropertyDetails/lucide_bed.png";
import icoBath       from "@/public/assists/PropertyDetails/cil_bath.png";
import icoCar        from "@/public/assists/PropertyDetails/ion_car-sport-outline.png";
import icoSize       from "@/public/assists/PropertyDetails/fluent_slide-size-24-regular.png";
import icoCalendar   from "@/public/assists/PropertyDetails/uil_calender.png";
import icoHome       from "@/public/assists/PropertyDetails/home-2.png";
import icoCheck      from "@/public/assists/PropertyDetails/weui_done2-outlined.png";
import icoStar       from "@/public/assists/PropertyDetails/Star1.png";
import imgProfile    from "@/public/assists/PropertyDetails/profile.png";
import icoSend       from "@/public/assists/PropertyDetails/send.png";
import icoGroupQuote from "@/public/assists/PropertyDetails/Group.png";

type Props = {
  params: Promise<{ slug: string }>;
};

// Required for Vercel static rendering of dynamic routes
export async function generateStaticParams() {
  return [
    { slug: 'modern-sea-view-apartment' },
    { slug: 'luxury-villa-with-pool-access' },
  ];
}

// Mock data that would normally come from an API endpoint
const getPropertyData = async () => {
  return {
    id: "HZ28",
    title: "Modern Sea View Apartment",
    location: "El Gouna, Hurghada, Red Sea Governorate, Egypt",
    breadcrumbs: ["Home", "Apartment", "Property Details"],
    images: {
      main: imgMain,
      thumbnails: [imgGallery1, imgGallery2, imgGallery3, imgGallery4],
    },
    overview: {
      type: "Apartment",
      bedrooms: 3,
      bathrooms: 2, // design says Bedrooms again with a bath icon, we'll fix it to bathrooms
      garage: 1,
      area: "1789 Sq Ft",
      year: 2016,
    },
    description: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.
Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.`,
    features: [
      "Air conditioning", "Laundry", "Sauna",
      "Dryer", "Sauna", "Sauna",
      "swimming pool", "Garage", "Sauna",
      "WiFi"
    ],
    reviews: {
      rating: 4.5,
      total: 653,
      distribution: {
        5: 80,
        4: 60,
        3: 40,
        2: 20,
        1: 10,
      },
      featured: {
        name: "Cameron Williamson",
        role: "Designer",
        rating: 4.75,
        avatar: imgProfile,
        text: "Searches for multiplexes, property comparisons, and the loan estimator. Works great. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dores.",
      }
    }
  };
};

export default async function PropertyDetailsPage({ params }: Props) {
  await params;
  const data = await getPropertyData();

  return (
    <div className="container mx-auto px-4 pt-32 pb-16 lg:pb-24 max-w-7xl">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-8">
        <Home className="w-4 h-4 mr-2" />
        {data.breadcrumbs.map((crumb, index) => (
          <span key={index} className="flex items-center">
            {index > 0 && <span className="mx-2 font-light text-gray-300">{'>'}</span>}
            <span className={index === data.breadcrumbs.length - 1 ? "text-brand-primary font-medium" : "hover:text-brand-primary transition-colors"}>
              {crumb}
            </span>
          </span>
        ))}
      </div>

      {/* Title & Location */}
      <div className="mb-10">
        <h1 className="text-4xl lg:text-5xl font-semibold text-brand-primary mb-4 tracking-tight">
          {data.title}
        </h1>
        <div className="flex items-center text-gray-500 text-lg">
          <Image src={icoLocation} alt="Location" width={20} height={20} className="w-5 h-5 mr-3 opacity-70" />
          <span>{data.location}</span>
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
                src={data.images.main} 
                alt={data.title} 
                fill 
                className="object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-6">
              {data.images.thumbnails.map((thumb, index) => (
                <div key={index} className="relative w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden cursor-pointer hover:ring-2 hover:ring-brand-primary transition-all shadow-sm">
                  <Image src={thumb} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Overview Section */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-50">
            <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-8">
              <h2 className="text-2xl font-semibold text-brand-primary">Overview</h2>
              <div className="text-gray-400 font-medium">
                Property ID: <span className="text-brand-primary">{data.id}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              <div className="flex flex-col items-center text-center group">
                <div className="p-1 rounded-xl group-hover:bg-gray-50 transition-colors mb-4">
                  <Image src={icoHome} alt="Type" width={32} height={32} className="w-8 h-8" />
                </div>
                <span className="font-semibold text-brand-primary text-xl mb-1">{data.overview.type}</span>
                <span className="text-gray-400 text-sm">Property Type</span>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="p-1 rounded-xl group-hover:bg-gray-50 transition-colors mb-4">
                  <Image src={icoBed} alt="Bedrooms" width={32} height={32} className="w-8 h-8" />
                </div>
                <span className="font-semibold text-brand-primary text-xl mb-1">{data.overview.bedrooms}</span>
                <span className="text-gray-400 text-sm">Bedrooms</span>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="p-1 rounded-xl group-hover:bg-gray-50 transition-colors mb-4">
                  <Image src={icoBath} alt="Bathrooms" width={32} height={32} className="w-8 h-8" />
                </div>
                <span className="font-semibold text-brand-primary text-xl mb-1">{data.overview.bathrooms}</span>
                <span className="text-gray-400 text-sm">Bathrooms</span>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="p-1 rounded-xl group-hover:bg-gray-50 transition-colors mb-4">
                  <Image src={icoCar} alt="Garage" width={32} height={32} className="w-8 h-8" />
                </div>
                <span className="font-semibold text-brand-primary text-xl mb-1">{data.overview.garage}</span>
                <span className="text-gray-400 text-sm">Garage</span>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="p-1 rounded-xl group-hover:bg-gray-50 transition-colors mb-4">
                  <Image src={icoSize} alt="Area Size" width={32} height={32} className="w-8 h-8" />
                </div>
                <span className="font-semibold text-brand-primary text-xl mb-1">{data.overview.area}</span>
                <span className="text-gray-400 text-sm">Area Size</span>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="p-1 rounded-xl group-hover:bg-gray-50 transition-colors mb-4">
                  <Image src={icoCalendar} alt="Year Built" width={32} height={32} className="w-8 h-8" />
                </div>
                <span className="font-semibold text-brand-primary text-xl mb-1">{data.overview.year}</span>
                <span className="text-gray-400 text-sm">Year Built</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-50">
            <h2 className="text-2xl font-semibold text-brand-primary mb-8 border-b border-gray-100 pb-8">Description</h2>
            <div className="text-gray-500 leading-relaxed text-lg space-y-6">
              {data.description.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-50">
            <h2 className="text-2xl font-semibold text-brand-primary mb-8 border-b border-gray-100 pb-8">Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-10">
              {data.features.map((feature, index) => (
                <div key={index} className="flex items-center text-gray-700 group">
                  <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center mr-4 group-hover:bg-brand-primary transition-colors">
                    <Image src={icoCheck} alt="Check" width={14} height={14} className="w-3.5 h-3.5 group-hover:invert" />
                  </div>
                  <span className="text-lg">{feature}</span>
                </div>
              ))}
            </div>
          </div>
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
