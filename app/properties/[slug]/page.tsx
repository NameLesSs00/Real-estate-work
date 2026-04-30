import Image from "next/image";

// Icons and Images
import locationIcon from "@/public/assists/PropertyDetails/location.png";
import mainImg from "@/public/assists/PropertyDetails/mainImg.png";
import img1 from "@/public/assists/PropertyDetails/img1.png";
import img2 from "@/public/assists/PropertyDetails/img2.png";
import img3 from "@/public/assists/PropertyDetails/img3.png";
import img4 from "@/public/assists/PropertyDetails/img4.png";

import bedIcon from "@/public/assists/PropertyDetails/lucide_bed.png";
import bathIcon from "@/public/assists/PropertyDetails/cil_bath.png";
import carIcon from "@/public/assists/PropertyDetails/ion_car-sport-outline.png";
import sizeIcon from "@/public/assists/PropertyDetails/fluent_slide-size-24-regular.png";
import calendarIcon from "@/public/assists/PropertyDetails/uil_calender.png";
import homeIcon from "@/public/assists/PropertyDetails/home-2.png";
import checkIcon from "@/public/assists/PropertyDetails/weui_done2-outlined.png";
import starIcon from "@/public/assists/PropertyDetails/Star 1.png";
import profileImg from "@/public/assists/PropertyDetails/profile.png";
import sendIcon from "@/public/assists/PropertyDetails/send.png";
import arrowLeft from "@/public/assists/PropertyDetails/famicons_arrow-back-outline.png";
import arrowRight from "@/public/assists/PropertyDetails/famicons_arrow-back-outline (1).png";

import { Home } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

// Mock data that would normally come from an API endpoint
const getPropertyData = async (_slug: string) => {
  return {
    id: "HZ28",
    title: "Modern Sea View Apartment",
    location: "El Gouna, Hurghada, Red Sea Governorate, Egypt",
    breadcrumbs: ["Home", "Apartment", "Property Details"],
    images: {
      main: mainImg,
      thumbnails: [img1, img2, img3, img4],
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
        avatar: profileImg,
        text: "Searches for multiplexes, property comparisons, and the loan estimator. Works great. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dores.",
      }
    }
  };
};

export default async function PropertyDetailsPage({ params }: Props) {
  const { slug } = await params;
  const data = await getPropertyData(slug);

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Home className="w-4 h-4 mr-2" />
        {data.breadcrumbs.map((crumb, index) => (
          <span key={index} className="flex items-center">
            {index > 0 && <span className="mx-2">{'>'}</span>}
            <span className={index === data.breadcrumbs.length - 1 ? "text-brand-primary font-medium" : ""}>
              {crumb}
            </span>
          </span>
        ))}
      </div>

      {/* Title & Location */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-semibold text-brand-primary mb-3">
          {data.title}
        </h1>
        <div className="flex items-center text-gray-500">
          <Image src={locationIcon} alt="Location" className="w-5 h-5 mr-2" />
          <span>{data.location}</span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-sm">
              <Image 
                src={data.images.main} 
                alt={data.title} 
                fill 
                className="object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {data.images.thumbnails.map((thumb, index) => (
                <div key={index} className="relative w-full aspect-video rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition shadow-sm">
                  <Image src={thumb} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Overview Section */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
              <h2 className="text-2xl font-semibold text-brand-primary">Overview</h2>
              <div className="text-gray-500 font-medium">
                Property ID: <span className="text-brand-primary">{data.id}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="flex flex-col items-center text-center">
                <Image src={homeIcon} alt="Type" className="w-8 h-8 mb-3" />
                <span className="font-semibold text-brand-primary text-lg mb-1">{data.overview.type}</span>
                <span className="text-gray-400 text-sm">Property Type</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Image src={bedIcon} alt="Bedrooms" className="w-8 h-8 mb-3" />
                <span className="font-semibold text-brand-primary text-lg mb-1">{data.overview.bedrooms}</span>
                <span className="text-gray-400 text-sm">Bedrooms</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Image src={bathIcon} alt="Bathrooms" className="w-8 h-8 mb-3" />
                <span className="font-semibold text-brand-primary text-lg mb-1">{data.overview.bathrooms}</span>
                <span className="text-gray-400 text-sm">Bathrooms</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Image src={carIcon} alt="Garage" className="w-8 h-8 mb-3" />
                <span className="font-semibold text-brand-primary text-lg mb-1">{data.overview.garage}</span>
                <span className="text-gray-400 text-sm">Garage</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Image src={sizeIcon} alt="Area Size" className="w-8 h-8 mb-3" />
                <span className="font-semibold text-brand-primary text-lg mb-1">{data.overview.area}</span>
                <span className="text-gray-400 text-sm">Area Size</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Image src={calendarIcon} alt="Year Built" className="w-8 h-8 mb-3" />
                <span className="font-semibold text-brand-primary text-lg mb-1">{data.overview.year}</span>
                <span className="text-gray-400 text-sm">Year Built</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-brand-primary mb-6 border-b border-gray-100 pb-6">Description</h2>
            <div className="text-gray-500 leading-relaxed space-y-4">
              {data.description.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-brand-primary mb-6 border-b border-gray-100 pb-6">Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
              {data.features.map((feature, index) => (
                <div key={index} className="flex items-center text-gray-700">
                  <Image src={checkIcon} alt="Check" className="w-5 h-5 mr-3" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Rating Summary */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm flex-1 w-full flex items-center gap-8">
                <div className="text-center flex-shrink-0">
                  <div className="flex items-end justify-center mb-1">
                    <span className="text-6xl font-semibold text-brand-primary mr-2">{data.reviews.rating}</span>
                    <Image src={starIcon} alt="Star" className="w-10 h-10 mb-1" />
                  </div>
                  <div className="bg-brand-primary text-white text-sm px-4 py-1.5 rounded-full inline-block font-medium">
                    {data.reviews.total} reviews
                  </div>
                </div>
                <div className="flex-grow space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center text-sm font-medium text-gray-500">
                      <span className="w-3">{star}</span>
                      <Image src={starIcon} alt="Star" className="w-3 h-3 mx-2" />
                      <div className="flex-grow h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-400 rounded-full" 
                          style={{ width: `${data.reviews.distribution[star as keyof typeof data.reviews.distribution]}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Carousel Buttons & Carousel Card */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <button className="w-14 h-14 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0 hover:bg-brand-secondary transition">
                  <Image src={arrowLeft} alt="Previous" className="w-6 h-6 invert" />
                </button>
                <div className="bg-[#fcfbf9] rounded-[2rem] p-8 shadow-sm flex-grow max-w-md relative">
                  <div className="absolute top-8 right-8 text-6xl text-brand-primary opacity-20 font-serif leading-none">&quot;</div>
                  <div className="flex items-center gap-4 mb-4">
                    <Image src={data.reviews.featured.avatar} alt={data.reviews.featured.name} className="w-14 h-14 rounded-full" />
                    <div>
                      <h4 className="font-semibold text-brand-primary">{data.reviews.featured.name}</h4>
                      <p className="text-xs text-gray-500">{data.reviews.featured.role}</p>
                      <div className="flex items-center mt-1">
                        <Image src={starIcon} alt="Star" className="w-3.5 h-3.5 mr-1" />
                        <span className="text-sm font-semibold">{data.reviews.featured.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed relative z-10">
                    {data.reviews.featured.text}
                  </p>
                </div>
                <button className="w-14 h-14 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0 hover:bg-brand-secondary transition">
                  <Image src={arrowRight} alt="Next" className="w-6 h-6 invert rotate-180" />
                </button>
              </div>
            </div>

            {/* Add Review Form */}
            <div className="bg-transparent mt-12">
              <h2 className="text-2xl font-semibold text-brand-primary mb-2">Add Review</h2>
              <p className="text-gray-500 mb-6 text-sm">Your email address will not be published. Required fields are marked <span className="text-red-500">*</span></p>
              
              <div className="mb-6">
                <p className="text-brand-primary font-medium mb-3">Review</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Image key={star} src={starIcon} alt="Star" className="w-5 h-5 opacity-30 grayscale cursor-pointer hover:grayscale-0 hover:opacity-100 transition" />
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-brand-primary font-medium mb-3">Comment</label>
                <textarea 
                  className="w-full bg-white border border-gray-200 rounded-2xl p-5 h-32 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition resize-none placeholder-gray-400"
                  placeholder="Text..."
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button className="px-8 py-3.5 border border-brand-primary text-brand-primary font-medium rounded-full hover:bg-brand-primary hover:text-white transition">
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm sticky top-8">
            <h3 className="text-2xl font-semibold text-brand-primary text-center mb-8">Get in Touch</h3>
            
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition placeholder-gray-400 text-sm"
                  placeholder="Full Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input 
                  type="tel" 
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition placeholder-gray-400 text-sm"
                  placeholder="Phone Number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input 
                  type="email" 
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition placeholder-gray-400 text-sm"
                  placeholder="Email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea 
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 h-32 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition resize-none placeholder-gray-400 text-sm"
                  placeholder="Message"
                ></textarea>
              </div>

              <button 
                type="button"
                className="w-full bg-brand-primary text-white font-medium py-4 rounded-full flex items-center justify-center hover:bg-brand-secondary transition shadow-md"
              >
                <span>Book a Visit</span>
                <Image src={sendIcon} alt="Send" className="w-4 h-4 ml-2" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
