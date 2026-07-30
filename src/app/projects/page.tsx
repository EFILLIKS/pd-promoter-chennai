import React from "react";
import type { Metadata } from "next";
import { ProjectsSection } from "@/components/projects/ProjectsSection";

export const metadata: Metadata = {
  title: "Our Works & Selected Portfolio",
  description: "Browse selected architectural masterpieces by PD Construction. Premium villas, residential developments, and luxury homes built in Chennai.",
  alternates: {
    canonical: "https://www.pdpromoters.com/projects",
  },
  openGraph: {
    title: "Our Works & Selected Portfolio | PD Construction",
    description: "Browse selected architectural masterpieces by PD Construction. Premium villas, residential developments, and luxury homes built in Chennai.",
    url: "https://www.pdpromoters.com/projects",
  },
};

export default function ProjectsPage() {
  return <ProjectsSection />;
}
