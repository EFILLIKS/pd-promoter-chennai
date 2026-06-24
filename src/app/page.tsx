import React from "react";
import type { Metadata } from "next";
import { HeroSection } from "@/components/home/Hero";
import { AboutSection } from "@/components/home/About";
import { ServicesSection } from "@/components/home/ServiceSection";
import { PropertyListings } from "@/components/home/Property";
import { JourneySection } from "@/components/home/Process";
import { Showcase } from "@/components/home/Showcase";
import { ReviewsSection } from "@/components/home/Testimonial";
import { FaqSection } from "@/components/home/Faq/Faq";
import { ContactSection } from "@/components/home/Contact";

export const metadata: Metadata = {
  title: "PD Construction | Premium Villas & Property Development in Chennai",
  description: "PD Construction develops premium villas and residential properties in Chennai with modern architecture and exceptional craftsmanship. Top property developers in Chennai.",
  alternates: {
    canonical: "https://pdconstruction.in",
  },
  openGraph: {
    title: "PD Construction | Premium Villas & Property Development in Chennai",
    description: "PD Construction develops premium villas and residential properties in Chennai with modern architecture and exceptional craftsmanship. Top property developers in Chennai.",
    url: "https://pdconstruction.in",
  },
};

export default function HomePage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Where do you build luxury villas in Chennai?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "PD Construction develops premium residential developments and luxury villas across key prime locations in Chennai, including Valasaravakkam, Kolathur, Maduravoyal, and surrounding areas."
        }
      },
      {
        "@type": "Question",
        "name": "What makes you a top property developer in Chennai?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "As leading property developers in Chennai, we stand out due to our modern architectural designs, exceptional engineering, high-grade construction materials, and a transparent commitment to quality and timely delivery."
        }
      },
      {
        "@type": "Question",
        "name": "How do you handle villa construction in Chennai?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our villa construction process in Chennai is comprehensive. It spans initial architectural conceptualization, structural planning, building permissions, premium interior design layouts, and custom handovers tailored specifically to your lifestyle requirements."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide customized residential construction in Chennai?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, residential construction in Chennai by PD Construction is fully customized. We work closely with our clients from initial design concepts to select custom BHK configurations, luxury finishes, and architectural options."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <PropertyListings />
      <JourneySection />
      <Showcase />
      <ReviewsSection />
      <FaqSection />
      <ContactSection /> 
    </>
  );
}
