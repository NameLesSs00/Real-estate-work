import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ChevronRight } from 'lucide-react';

const PROJECT_DATA = {
  title: 'Makadi Heights Residences',
  location: 'Red Sea Living, Hurghada',
  priceStart: '10,000,00',
  currency: 'EGP',
  image: '/assists/project/image.png',
  shortDescription:
    'A Thoughtfully Designed Coastal Community Blending Modern Architecture With Resort-Style Living In One Of The Most Desirable Destinations On The Red Sea.',
  description: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.

Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.`,
  stats: [
    { icon: '/assists/project/building-4.png', label: 'Total Units', value: '23 Exclusive Residences' },
    { icon: '/assists/project/buildings-2.png', label: 'Building Floors', value: '3 Low-Rise Design' },
    { icon: '/assists/project/calendar.png', label: 'Delivery Date', value: '01 • 04 • 2027' },
    { icon: '/assists/project/story.png', label: 'Status', value: 'Under Development' },
    { icon: '/assists/project/size.png', label: 'Spaces', value: '92 M² – 470 M²' },
  ],
};

export function generateStaticParams() {
  return [
    { slug: 'makadi-heights-residences-1' },
    { slug: 'makadi-heights-residences-2' },
    { slug: 'makadi-heights-residences-3' },
    { slug: 'makadi-heights-residences-4' },
    { slug: 'makadi-heights-residences-5' },
    { slug: 'makadi-heights-residences-6' },
  ];
}

export default function ProjectDetailsPage() {
  const project = PROJECT_DATA;

  return (
    <div className="min-h-screen bg-white pt-36 pb-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col gap-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[14px] text-[#888] font-poppins">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
          </svg>
          <Link href="/projects" className="hover:text-[#1B2134] transition-colors">Projects</Link>
          <ChevronRight size={13} className="text-[#bbb]" />
          <Link href="/projects" className="hover:text-[#1B2134] transition-colors">Projects list</Link>
          <ChevronRight size={13} className="text-[#bbb]" />
          <span className="text-[#1B2134] font-semibold">Project Details</span>
        </nav>

        {/* ── Top Section: Image (left) + Form (right) ── */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Left: Image + info */}
          <div className="flex flex-col gap-5 flex-1">
            {/* Image */}
            <div className="relative w-full aspect-[4/3] rounded-[20px] overflow-hidden shadow-md">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-[18px] md:text-[22px] text-[#D59E52] font-poppins">Price &nbsp;Start From</span>
              <span className="text-[22px] md:text-[28px] font-bold text-[#D59E52] font-poppins">
                {project.priceStart} {project.currency}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-[22px] md:text-[28px] font-bold text-[#1B2134] font-poppins">
              {project.title}
            </h1>

            {/* Location */}
            <div className="flex items-center gap-2 text-[14px] text-[#888] font-poppins -mt-3">
              <MapPin size={15} className="text-[#C7B7A1] flex-shrink-0" />
              <span>{project.location}</span>
            </div>

            {/* Short Description */}
            <p className="text-[14px] md:text-[15px] text-[#555] leading-relaxed font-poppins">
              {project.shortDescription}
            </p>
          </div>

          {/* Right: Get in Touch Form */}
          <div className="w-full lg:w-[480px] flex-shrink-0">
            <div className="bg-[#F8F5F080] border border-[#F0EDE8] rounded-[20px] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
              <h2 className="text-[20px] font-bold text-[#1B2134] font-poppins text-center mb-6">
                Get in Touch
              </h2>
              <form className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[#1B2134] font-poppins">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full border border-[#E5E2DE] rounded-[10px] px-4 py-3 text-[14px] font-poppins placeholder:text-[#BDBDBD] outline-none focus:border-[#1B2134] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[#1B2134] font-poppins">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full border border-[#E5E2DE] rounded-[10px] px-4 py-3 text-[14px] font-poppins placeholder:text-[#BDBDBD] outline-none focus:border-[#1B2134] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[#1B2134] font-poppins">Email</label>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full border border-[#E5E2DE] rounded-[10px] px-4 py-3 text-[14px] font-poppins placeholder:text-[#BDBDBD] outline-none focus:border-[#1B2134] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[#1B2134] font-poppins">Message</label>
                  <textarea
                    placeholder="Message"
                    rows={4}
                    className="w-full border border-[#E5E2DE] rounded-[10px] px-4 py-3 text-[14px] font-poppins placeholder:text-[#BDBDBD] outline-none focus:border-[#1B2134] transition-colors resize-none"
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-0.5 w-4 h-4 accent-[#1B2134] cursor-pointer flex-shrink-0"
                  />
                  <label htmlFor="terms" className="text-[13px] text-[#666] font-poppins leading-snug cursor-pointer">
                    I agree with{' '}
                    <span className="text-[#1B2134] underline underline-offset-2">Terms of Use</span>
                    {' '}and{' '}
                    <span className="text-[#1B2134] underline underline-offset-2">Privacy Policy</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1B2134] text-white rounded-full py-4 text-[15px] font-semibold font-poppins flex items-center justify-center gap-3 hover:bg-[#252d46] transition-all mt-1"
                >
                  Book a Visit
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ── Stats Row — full width ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
          {project.stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#F8F8F9] border border-[#F0EDE8] rounded-[16px] p-5 flex flex-col items-center text-center gap-2 shadow-sm flex-1"
            >
              <div className="relative w-8 h-8">
                <Image src={stat.icon} alt={stat.label} fill className="object-contain opacity-50" />
              </div>
              <p className="text-[12px] text-[#AAA] font-poppins">{stat.label}</p>
              <p className="text-[13px] font-semibold text-[#1B2134] font-poppins leading-tight">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ── Description — full width ── */}
        <div className="bg-[#F8F5F080] border border-[#F0EDE8] rounded-[20px] p-8 shadow-sm w-full">
          <h2 className="text-[20px] font-bold text-[#1B2134] font-poppins mb-4">Description</h2>
          <hr className="border-[#F0EDE8] mb-6" />
          <div className="flex flex-col gap-4">
            {project.description.split('\n\n').map((para, i) => (
              <p key={i} className="text-[14px] md:text-[15px] text-[#666] leading-relaxed font-poppins">
                {para}
              </p>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
