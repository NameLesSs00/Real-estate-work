import type { Metadata } from "next";
import { Poppins, Work_Sans, Radley, Allura, Inter, Dancing_Script } from "next/font/google";
import "../globals.css";
import { LanguageProvider } from "@/lib/contexts/LanguageContext";
import TokenRefresher from "@/lib/auth/TokenRefresher";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const radley = Radley({
  variable: "--font-radley",
  subsets: ["latin"],
  weight: ["400"],
});

const allura = Allura({
  variable: "--font-allura",
  subsets: ["latin"],
  weight: ["400"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://luxe-estate.com"),
  title: {
    default: "Luxe Estate | Premium Real Estate in Egypt",
    template: "%s | Luxe Estate",
  },
  description: "Find your dream home with Luxe Estate. We offer a curated selection of premium properties, luxury villas, and exclusive apartments in Egypt's most sought-after locations.",
  keywords: ["Luxe Estate", "Luxe Real Estate", "Real Estate Egypt", "Property in Egypt", "Luxury Homes Egypt", "Buy Villas Egypt", "Apartments for Sale", "Premium Real Estate"],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Luxe Estate | Premium Real Estate",
    description: "Find your dream home with our premium real estate services. Redefining luxury living in Egypt.",
    url: "https://luxe-estate.com",
    siteName: "Luxe Estate",
    images: [
      {
        url: "/assists/defaultImage.png",
        width: 1200,
        height: 630,
        alt: "Luxe Estate Showcase",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxe Estate | Premium Real Estate",
    description: "Discover exclusive properties in top locations.",
    images: ["/assists/header/headerLogo.png"],
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html
      lang={locale}
      className={`${poppins.variable} ${workSans.variable} ${inter.variable} ${radley.variable} ${allura.variable} ${dancingScript.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-poppins bg-[#fbf9f6]">
        <LanguageProvider>
          <TokenRefresher />
          <main className="flex-grow">
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
