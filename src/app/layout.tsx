import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DataProvider } from "@/context/DataContext";
import { LenisProvider } from "@/components/layout/LenisProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pdconstruction.in"),
  title: {
    default: "PD Construction | Premium Villas & Property Development in Chennai",
    template: "%s | PD Construction",
  },
  description: "PD Construction develops premium villas and residential properties in Chennai with modern architecture and exceptional craftsmanship.",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "PD Construction | Premium Villas & Property Development in Chennai",
    description: "PD Construction develops premium villas and residential properties in Chennai with modern architecture and exceptional craftsmanship.",
    url: "https://pdconstruction.in",
    siteName: "PD Construction",
    images: [
      {
        url: "/assets/Property1.png",
        width: 1200,
        height: 630,
        alt: "PD Construction Premium Villas",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PD Construction | Premium Villas & Property Development in Chennai",
    description: "PD Construction develops premium villas and residential properties in Chennai with modern architecture and exceptional craftsmanship.",
    images: ["/assets/Property1.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://pdconstruction.in/#organization",
        "name": "PD Construction",
        "url": "https://pdconstruction.in",
        "logo": "https://pdconstruction.in/assets/Logoblue.png",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-88255-28284",
          "contactType": "sales",
          "email": "pdconstruction91@gmail.com",
          "areaServed": "IN",
          "availableLanguage": "en"
        }
      },
      {
        "@type": ["LocalBusiness", "RealEstateAgent"],
        "@id": "https://pdconstruction.in/#localbusiness",
        "name": "PD Construction",
        "image": "https://pdconstruction.in/assets/Property1.png",
        "url": "https://pdconstruction.in",
        "telephone": "+918825528284",
        "email": "pdconstruction91@gmail.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "No.159, 14th Street, Sri Krishna Nagar, Maduravoyal",
          "addressLocality": "Chennai",
          "addressRegion": "Tamil Nadu",
          "postalCode": "600095",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "13.0645",
          "longitude": "80.1654"
        },
        "priceRange": "$$$",
        "areaServed": {
          "@type": "AdministrativeArea",
          "name": "Chennai"
        }
      }
    ]
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#030303] text-[#f5f5f7]">
        <DataProvider>
          <LenisProvider>
            <Header />
            <main className="flex-grow flex flex-col justify-start">
              {children}
            </main>
            <Footer />
          </LenisProvider>
        </DataProvider>
      </body>
    </html>
  );
}
