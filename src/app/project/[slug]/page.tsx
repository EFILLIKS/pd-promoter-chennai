import React from "react";
import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ResetPageLoader } from "@/components/ui/ResetPageLoader";
import { getOptimizedCloudinaryUrl, normalizeGallery } from "@/utils/cloudinary";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { DynamicProjectMap } from "@/components/projects/DynamicProjectMap";
import { unstable_noStore as noStore } from "next/cache";

// Fallback projects in case Supabase is empty
const DEFAULT_PROJECTS = [
  {
    id: 1,
    title: "VILLA BREEZE",
    bhk: "4 BHK",
    location: "Valasaravakkam",
    status: "Available",
    imageSrc: "/assets/About2.png",
    locationData: { address: "Valasaravakkam, Chennai" },
  },
  {
    id: 2,
    title: "THE GRID RESIDENCE",
    bhk: "4 BHK",
    location: "Ambur",
    status: "Delivered",
    imageSrc: "/assets/Property2.png",
    locationData: { address: "Ambur, Tamil Nadu" },
  },
  {
    id: 3,
    title: "SERENITY GROVE",
    bhk: "3 BHK",
    location: "Kolathur",
    status: "Available",
    imageSrc: "/assets/Property3.png",
    locationData: { address: "Kolathur, Chennai" },
  },
  {
    id: 4,
    title: "MAJESTIC CREST",
    bhk: "4 BHK",
    location: "Valasaravakkam",
    status: "Available",
    imageSrc: "/assets/Property4.png",
    locationData: { address: "Maduravoyal, Chennai" },
  },
];

export const dynamic = "force-dynamic";

// Safe helper to parse location data
const parseLocation = (location: any) => {
  if (!location) return { address: "", place: "", latitude: "", longitude: "" };
  if (typeof location === "object") {
    return {
      address: location.address || "",
      place: location.place || "",
      latitude: location.latitude || "",
      longitude: location.longitude || ""
    };
  }
  if (typeof location === "string") {
    try {
      const trimmed = location.trim();
      if (trimmed.startsWith("{")) {
        const parsed = JSON.parse(trimmed);
        return {
          address: parsed.address || "",
          place: parsed.place || "",
          latitude: parsed.latitude || "",
          longitude: parsed.longitude || ""
        };
      }
    } catch (e) {}
  }
  return { address: location, place: location, latitude: "", longitude: "" };
};

async function getProject(slug: string) {
  noStore();
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: dbProjects } = await supabase.from("projects").select("*");

      if (dbProjects && dbProjects.length > 0) {
        const found = dbProjects.find(
          (p) =>
            p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") === slug
        );
        if (found) {
          const locObj = parseLocation(found.location);
          
          const galleryData = normalizeGallery(found.projectGallery || found.gallery);

          let brochureData = found.brochure;
          if (typeof brochureData === "string") {
            try {
              brochureData = JSON.parse(brochureData);
            } catch (e) {
              brochureData = null;
            }
          }

          return {
            ...found,
            location: locObj.place || locObj.address,
            locationData: locObj,
            projectGallery: galleryData,
            brochure: brochureData && typeof brochureData === "object" ? brochureData : null,
          };
        }
      }
    }
  } catch (e) {
    console.error("Error loading project from Supabase:", e);
  }

  // Fallback to local defaults if DB query fails or table is empty
  const found = DEFAULT_PROJECTS.find(
    (p) =>
      p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") === slug
  );
  if (found) {
    return {
      ...found,
      locationData: found.locationData || { address: found.location, place: found.location, latitude: "", longitude: "" },
      projectGallery: []
    };
  }
  return null;
}

// Generate dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const title = `${project.title} | ${project.bhk} Villa in ${project.location} | PD Construction`;
  const description = `Explore ${project.title}, a premium ${project.bhk} villa project located in ${project.location}, developed by PD Construction.`;
  const canonicalUrl = `https://www.pdpromoters.com/project/${slug}`;

  return {
    title,
    description,
    keywords: [
      project.title,
      `${project.title} Chennai`,
      `${project.title} ${project.location}`,
      `Villa in ${project.location}`,
      `${project.bhk} Villa in ${project.location}`,
      `Villa Construction ${project.location}`,
      `Luxury Villa Chennai`,
      `PD Construction ${project.title}`,
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      images: [
        {
          url: project.imageSrc,
          width: 1200,
          height: 630,
          alt: `Luxury ${project.bhk} Villa in ${project.location} by PD Construction`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [project.imageSrc],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const baseUrl = "https://www.pdpromoters.com";
  const canonicalUrl = `${baseUrl}/project/${slug}`;

  // Breadcrumb schema
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Works",
        "item": `${baseUrl}/projects`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": project.title,
        "item": canonicalUrl
      }
    ]
  };

  // RealEstateListing / Residence schema
  const realEstateJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": `${project.title} | Premium ${project.bhk} Villa in ${project.location}`,
    "description": `Explore ${project.title}, a premium ${project.bhk} villa project located in ${project.location} by PD Construction.`,
    "url": canonicalUrl,
    "image": project.imageSrc.startsWith("/") ? `${baseUrl}${project.imageSrc}` : project.imageSrc,
    "about": {
      "@type": "SingleFamilyResidence",
      "name": project.title,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": project.location,
        "addressRegion": "Chennai, Tamil Nadu",
        "addressCountry": "IN"
      },
      "numberOfRooms": project.bhk
    }
  };

  return (
    <div className="bg-[#FFFFFF] min-h-screen pt-[160px] pb-[80px] md:pb-[120px] text-[#1A1F2A]">
      <ResetPageLoader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateJsonLd) }}
      />
      <div className="max-w-[1200px] mx-auto px-[24px] md:px-[64px] flex flex-col">
        
        {/* --- BREADCRUMBS --- */}
        <nav className="flex items-center gap-2 text-sm text-[#64748B] mb-8 font-sans">
          <Link href="/" className="hover:text-[#0B1117] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/projects" className="hover:text-[#0B1117] transition-colors">Works</Link>
          <span>/</span>
          <span className="text-[#0B1117] font-medium">{project.title}</span>
        </nav>

        {/* --- TITLE & SPECIFICATIONS --- */}
        <header className="flex flex-col gap-6 mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#0B1117] tracking-tight uppercase leading-[1.1]">
            {project.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm md:text-base border-y border-[#E2E8F0] py-6 font-sans">
            <div className="flex items-center gap-2">
              <span className="text-[#64748B] font-medium">BHK Configuration:</span>
              <span className="text-[#0B1117] font-semibold">{project.bhk}</span>
            </div>
            <div className="w-[1px] h-6 bg-[#E2E8F0] hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-[#64748B] font-medium">Location:</span>
              <span className="text-[#0B1117] font-semibold">{project.location}</span>
            </div>
            <div className="w-[1px] h-6 bg-[#E2E8F0] hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-[#64748B] font-medium">Status:</span>
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                project.status === "Available" 
                  ? "bg-green-100 text-green-800" 
                  : project.status === "Booked" 
                    ? "bg-yellow-100 text-yellow-800" 
                    : "bg-blue-100 text-blue-800"
              }`}>
                {project.status || "Available"}
              </span>
            </div>
          </div>
        </header>

        {/* --- PROJECT GALLERY & LIGHTBOX --- */}
        <ProjectGallery 
          mainImage={project.imageSrc} 
          gallery={project.projectGallery} 
          projectTitle={project.title} 
        />

        {/* --- PROJECT OVERVIEW & DETAILS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 font-sans mb-16">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <h2 className="text-2xl font-serif text-[#0B1117] uppercase tracking-wide">Project Overview</h2>
            {project.projectOverview ? (
              project.projectOverview
                .split("\n\n")
                .filter((para: string) => para.trim().length > 0)
                .map((paragraph: string, idx: number) => (
                  <p key={idx} className="text-[#4A5568] text-base md:text-lg leading-relaxed">
                    {paragraph.trim()}
                  </p>
                ))
            ) : (
              <>
                <p className="text-[#4A5568] text-base md:text-lg leading-relaxed">
                  Explore {project.title}, located in the heart of {project.location}. Designed to offer a seamless blend of luxury, privacy, and contemporary functionality, this {project.bhk} development sets a new benchmark for residential properties in the region.
                </p>
                <p className="text-[#4A5568] text-base md:text-lg leading-relaxed">
                  PD Construction ensures every masterpiece is engineered with premium-grade construction materials, elegant custom finishes, and thoughtful architectural layouts to enhance natural light and airflow for modern living.
                </p>
              </>
            )}
          </div>
          
          <div className="lg:col-span-4 bg-[#F8FAFC] border border-[#E2E8F0] p-8 rounded-[24px] flex flex-col justify-between h-fit gap-6 shadow-sm">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-serif text-[#0B1117] uppercase tracking-wide">Interested in this property?</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Connect with our residential development managers to check availability, pricing options, and to schedule private site visits.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <Link 
                href="/contact"
                className="w-full py-4 bg-[#0B1117] text-white hover:bg-[#1A1F2A] transition-colors rounded-xl font-semibold text-center text-sm"
              >
                Get in Touch
              </Link>
              {project.brochure && project.brochure.fileUrl && (
                <a 
                  href={project.brochure.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 border border-[#0B1117] text-[#0B1117] hover:bg-[#0B1117] hover:text-white transition-all rounded-xl font-semibold text-center text-sm flex items-center justify-center gap-2"
                >
                  Download Brochure
                </a>
              )}
            </div>
          </div>
        </div>

        {/* --- PROJECT LOCATION SECTION --- */}
        {project.locationData && project.locationData.address && (
          <div className="flex flex-col gap-6 mb-16 font-sans">
            <h2 className="text-2xl font-serif text-[#0B1117] uppercase tracking-wide">Project Location</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Map Column */}
              <div className="lg:col-span-8 h-[350px] md:h-[450px]">
                <DynamicProjectMap 
                  address={project.locationData.address}
                  latitude={project.locationData.latitude}
                  longitude={project.locationData.longitude}
                />
              </div>
              
              {/* Address details & directions column */}
              <div className="lg:col-span-4 bg-[#F8FAFC] border border-[#E2E8F0] p-8 rounded-[24px] flex flex-col justify-between gap-6 shadow-sm">
                <div className="flex flex-col gap-4">
                  <span className="text-xs font-semibold text-[#64748B] tracking-wider uppercase">Site Address</span>
                  <p className="text-base text-[#0B1117] leading-relaxed font-medium">
                    {project.locationData.address}
                  </p>
                  {project.locationData.latitude && project.locationData.longitude && (
                    <p className="text-xs text-[#64748B]">
                      Coordinates: {project.locationData.latitude}, {project.locationData.longitude}
                    </p>
                  )}
                </div>
                
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    project.locationData.address || `${project.locationData.latitude},${project.locationData.longitude}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-[#0B1117] text-white hover:bg-[#1A1F2A] transition-colors rounded-xl font-semibold text-center text-sm flex items-center justify-center gap-2"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

