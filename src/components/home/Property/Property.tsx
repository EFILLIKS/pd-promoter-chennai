"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { Icon } from "@iconify/react";
import { AnimatedHeading } from "@/components/ui/HeadingText";
import { FadeInBlock } from "@/components/ui/Paratext";
import { ExpandableButton } from "@/components/ui/ExpandableButton";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { useData } from "@/context/DataContext";
import Link from "next/link";

export const PropertyListings = () => {
  const { projects } = useData();
  const featuredProjects = projects.filter((p) => p.showOnHomepage);
  const sectionRef = useRef<HTMLElement>(null);
  const isLayerInView = useInView(sectionRef, {
    once: true,
    margin: "-15% 0px -15% 0px",
  });

  return (
    <section ref={sectionRef} className="w-full bg-white py-[80px] md:py-[120px]">
      <div className="max-w-[1600px] mx-auto px-[24px] md:px-[64px] flex flex-col">

        {/* --- 1. HEADER ROW --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end w-full mb-[64px] gap-[40px]">

          {/* Left Side: Eyebrow & Heading */}
          <div className="flex flex-col gap-[16px] max-w-[700px]">
            <FadeInBlock isTriggered={isLayerInView} delay={0.1}>
              <div className="flex items-center gap-[8px] text-[#64748B] font-medium text-[14px] tracking-widest uppercase">
                <span className="w-[4px] h-[4px] rounded-full bg-[#64748B]"></span>
                Property Listings
              </div>
            </FadeInBlock>

            <AnimatedHeading
              text="DISCOVER HOMES THAT FIT YOUR LIFESTYLES"
              // Using text-white/90 for a premium, slightly softened contrast on the dark background
              className="text-[36px] md:text-[48px] lg:text-[56px] font-serif text-[#0B1117] leading-[1.1] uppercase tracking-tight"
              isTriggered={isLayerInView}
              staggerDelay={0.04}
              as="h2"
            />
          </div>

          {/* Right Side: Paragraph & Button */}
          <div className="max-w-[420px] flex flex-col gap-[24px]">
            <FadeInBlock isTriggered={isLayerInView} delay={0.4}>
              <p className="text-[#64748B] font-sans text-[16px] md:text-[18px] leading-[1.6]">
                Explore thoughtfully designed homes that combine comfort, convenience, and desirable locations.
              </p>
            </FadeInBlock>

            <FadeInBlock isTriggered={isLayerInView} delay={0.5}>
              <Link href="/projects">
                <ExpandableButton
                  label="Explore All"
                  // Adjusting the button background to pop slightly off the pitch-black section background
                  className="bg-[#1A1F2A]"
                  icon={<Icon icon="lucide:layout-grid" width="20" height="20" />}
                />
              </Link>
            </FadeInBlock>
          </div>
        </div>

        {/* --- 2. PROJECT GRID --- */}
        {/* 2-column layout on desktop, 1-column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] md:gap-[32px] w-full">
          {featuredProjects.map((project, index) => (
            <FadeInBlock
              key={project.id}
              isTriggered={isLayerInView}
              // Stagger the card reveals slightly after the text
              delay={0.6 + index * 0.1}
              className="w-full"
            >
              <ProjectCard
                title={project.title}
                bhk={project.bhk}
                location={project.location}
                status={project.status}
                imageSrc={project.imageSrc}
              />
            </FadeInBlock>
          ))}
        </div>

      </div>
    </section>
  );
};