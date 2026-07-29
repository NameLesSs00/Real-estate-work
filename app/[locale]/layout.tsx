import type { Metadata } from "next";
import { Poppins, Work_Sans, Radley, Allura, Inter } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://winners-realty.com"),
  title: {
    default: "Winners Realty | Premium Real Estate in Egypt",
    template: "%s | Winners Realty",
  },
  description: "Find your dream home with Winners Realty. We offer a curated selection of premium properties, luxury villas, and exclusive apartments in Egypt's most sought-after locations.",
  keywords: ["Winners Realty", "Winners Real Estate", "Real Estate Egypt", "Property in Egypt", "Luxury Homes Egypt", "Buy Villas Egypt", "Apartments for Sale", "Premium Real Estate"],
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
    title: "Winners Realty | Premium Real Estate",
    description: "Find your dream home with our premium real estate services. Redefining luxury living in Egypt.",
    url: "https://winners-realty.com",
    siteName: "Winners Realty",
    images: [
      {
        url: "/assists/defaultImage.png",
        width: 1200,
        height: 630,
        alt: "Winners Realty Showcase",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Winners Realty | Premium Real Estate",
    description: "Discover exclusive properties in top locations.",
    images: ["/assists/header/headerLogo.png"],
  },
  icons: {
    icon: "/favicon.ico",
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
      className={`${poppins.variable} ${workSans.variable} ${inter.variable} ${radley.variable} ${allura.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-poppins">
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
