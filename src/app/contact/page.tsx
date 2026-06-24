import React from "react";
import type { Metadata } from "next";
import { ContactSection } from "@/components/home/Contact";

export const metadata: Metadata = {
  title: "Contact Us | Get in Touch for Premium Villas",
  description: "Connect with our construction specialists. Get inquiries, site visits, and consultation details for premium properties in Chennai.",
  alternates: {
    canonical: "https://pdconstruction.in/contact",
  },
  openGraph: {
    title: "Contact Us | Get in Touch for Premium Villas | PD Construction",
    description: "Connect with our construction specialists. Get inquiries, site visits, and consultation details for premium properties in Chennai.",
    url: "https://pdconstruction.in/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="pt-[100px] bg-white min-h-screen">
      <ContactSection />
    </div>
  );
}
