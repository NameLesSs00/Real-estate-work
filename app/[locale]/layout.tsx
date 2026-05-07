import type { Metadata } from "next";
import { Poppins, Work_Sans, Radley, Allura, Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
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
  metadataBase: new URL("https://thegate-estates.com"),
  title: {
    default: "The Gate Estates | Premium Real Estate in Egypt",
    template: "%s | The Gate Estates",
  },
  description: "Find your dream home with our premium real estate services. We offer a curated selection of properties in the most exclusive locations, redefining luxury living.",
  keywords: ["Real Estate", "Egypt", "Property", "Luxury Homes", "Villas", "Apartments", "The Gate Estates"],
  openGraph: {
    title: "The Gate Estates",
    description: "Find your dream home with our premium real estate services. Redefining luxury living.",
    url: "https://thegateestates.com",
    siteName: "The Gate Estates",
    images: [
      {
        url: "/assists/header/headerLogo.png",
        width: 800,
        height: 600,
        alt: "The Gate Estates Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Gate Estates | Premium Real Estate",
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
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </LanguageProvider>
      </body>
    </html>
  );
}
