"use client";

import React, { useRef } from "react";
import { useInView } from "framer-motion";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { AnimatedHeading } from "@/components/ui/HeadingText";
import { FadeInBlock } from "@/components/ui/Paratext";

export const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isLayerInView = useInView(sectionRef, {
    once: true,
    margin: "-10% 0px -10% 0px",
  });

  return (
    <section ref={sectionRef} className="relative w-full bg-white pt-[160px] pb-[80px] md:pb-[120px] min-h-screen overflow-hidden flex flex-col justify-start">
      <div className="max-w-[1600px] mx-auto px-[24px] md:px-[64px] w-full flex flex-col">
        
        {/* --- HEADER BLOCK --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end w-full mb-[64px]">
          {/* Eyebrow & Heading */}
          <div className="flex flex-col gap-[16px] max-w-[700px]">
            <FadeInBlock isTriggered={isLayerInView} delay={0.1}>
              <div className="flex items-center gap-[8px] text-[#64748B] font-medium text-[14px] tracking-widest uppercase">
                <span className="w-[4px] h-[4px] rounded-full bg-[#64748B]"></span>
                Our Portfolio
              </div>
            </FadeInBlock>
            
            <AnimatedHeading
              text="SELECTED ARCHITECTURAL MASTERPIECES"
              className="text-[30px] md:text-[38px] lg:text-[46px] font-serif text-[#0B1117] leading-[1.1] uppercase tracking-tight"
              isTriggered={isLayerInView}
              staggerDelay={0.04}
              as="h1"
            />
          </div>

          {/* Right Side Description */}
          <div className="max-w-[420px]">
            <FadeInBlock isTriggered={isLayerInView} delay={0.4}>
              <p className="text-[#64748B] font-sans text-[16px] md:text-[18px] leading-[1.6]">
                Explore our range of premium developments, built with exceptional engineering, luxury detail, and top-tier materials.
              </p>
            </FadeInBlock>
          </div>
        </div>

        {/* --- GRID & FILTER BLOCK --- */}
        <ProjectGrid />
      </div>
    </section>
  );
};
