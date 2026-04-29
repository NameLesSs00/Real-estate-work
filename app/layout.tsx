import type { Metadata } from "next";
import { Poppins, Work_Sans, Radley } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

const radley = Radley({
  variable: "--font-radley",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Modern Real Estate",
  description: "Find your dream home with our premium real estate services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${workSans.variable} ${radley.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-poppins">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
