import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center pt-20 pb-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assists/hero/backgoundImage.png"
          alt="Luxury Building"
          fill
          className="object-cover"
          priority
        />
        <div 
          className="absolute inset-0 mix-blend-screen" 
          style={{ background: 'linear-gradient(180deg, rgba(217, 217, 217, 0) 0%, rgba(115, 115, 115, 0.7) 100%)' }}
        ></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-6 text-center mb-20">
        <h1 className="text-[50px] md:text-[80px] font-work-sans font-bold text-white leading-[1.1] tracking-[-1.4px] max-w-5xl mx-auto">
          Discover Your Next <br /> Investment Property
        </h1>
      </div>

      {/* Search Filter Card */}
      <div className="relative z-10 w-[calc(100%-48px)] max-w-[1280px] bg-[#F8F5F0] rounded-[30px] shadow-2xl p-8 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Top Row */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-brand-primary opacity-60">Search by area, compound, or developer</label>
            <div className="relative flex items-center bg-white rounded-lg px-4 py-3 border border-brand-divider">
              <input 
                type="text" 
                placeholder="Search by area, compound, or developer" 
                className="w-full bg-transparent outline-none text-brand-primary"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-brand-primary opacity-60">Price</label>
            <select className="bg-white rounded-lg px-4 py-3 border border-brand-divider text-brand-primary outline-none appearance-none">
              <option>All price</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-brand-primary opacity-60">Location</label>
            <select className="bg-white rounded-lg px-4 py-3 border border-brand-divider text-brand-primary outline-none appearance-none">
              <option>All Locations</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-6 items-end">
          {/* Bottom Row */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-brand-primary opacity-60">Delivery Date</label>
            <input type="text" placeholder="MM/DD/YYYY" className="bg-white rounded-lg px-4 py-3 border border-brand-divider text-brand-primary outline-none" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-brand-primary opacity-60">Bed&Bath</label>
            <select className="bg-white rounded-lg px-4 py-3 border border-brand-divider text-brand-primary outline-none appearance-none">
              <option>Bed&bath</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-brand-primary opacity-60">Unit Type</label>
            <select className="bg-white rounded-lg px-4 py-3 border border-brand-divider text-brand-primary outline-none appearance-none">
              <option>All categories</option>
            </select>
          </div>

          <button className="flex items-center justify-center gap-3 bg-[#1B2134] text-white rounded-full py-4 px-10 font-poppins font-medium text-[20px] transition-all hover:bg-opacity-90">
            Search
            <Image src="/assists/hero/search-normal.png" alt="Search" width={24} height={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
