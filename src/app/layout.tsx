import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DataProvider } from "@/context/DataContext";
import { LenisProvider } from "@/components/layout/LenisProvider";
import { PageLoader } from "@/components/ui/PageLoader";

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
  metadataBase: new URL("https://www.pdpromoters.com"),
  title: {
    default: "PD Construction | Premium Villas & Property Development in Chennai",
    template: "%s | PD Construction",
  },
  description: "PD Construction develops premium villas and residential properties in Chennai with modern architecture and exceptional craftsmanship.",
  alternates: {
    canonical: "./",
  },
  icons: {
    icon: [
      { url: "/assets/Logoblue.png", media: "(prefers-color-scheme: light)", type: "image/png" },
      { url: "/assets/logowhite.png", media: "(prefers-color-scheme: dark)", type: "image/png" },
    ],
    apple: [
      { url: "/assets/Logoblue.png", media: "(prefers-color-scheme: light)", type: "image/png" },
      { url: "/assets/logowhite.png", media: "(prefers-color-scheme: dark)", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "PD Construction | Premium Villas & Property Development in Chennai",
    description: "PD Construction develops premium villas and residential properties in Chennai with modern architecture and exceptional craftsmanship.",
    url: "https://www.pdpromoters.com",
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
        "@id": "https://www.pdpromoters.com/#organization",
        "name": "PD Construction",
        "url": "https://www.pdpromoters.com",
        "logo": "https://www.pdpromoters.com/assets/Logoblue.png",
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
        "@id": "https://www.pdpromoters.com/#localbusiness",
        "name": "PD Construction",
        "image": "https://www.pdpromoters.com/assets/Property1.png",
        "url": "https://www.pdpromoters.com",
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
        <!-- Google Tag Manager -->
        <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-5T3H62PX');</script>
        <!-- End Google Tag Manager -->
      </head>
      <body className="min-h-full flex flex-col bg-[#030303] text-[#f5f5f7]">
        <!-- Google Tag Manager (noscript) -->
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5T3H62PX"
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        <!-- End Google Tag Manager (noscript) -->
        <DataProvider>
          <PageLoader />
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
