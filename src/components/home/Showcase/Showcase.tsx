"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { AnimatedHeading } from "@/components/ui/HeadingText";
import { FadeInBlock } from "@/components/ui/Paratext";
import { MediaReveal } from "@/components/ui/MediaReveal";

export const Showcase = () => {
  // 1. Scroll container to manage the expansion progress
  const containerRef = useRef<HTMLDivElement>(null);
  const [clipPath, setClipPath] = useState("inset(30% 35% 30% 35% round 24px)");
  
  // Detects when the section enters the viewport to choreograph the entry transitions
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      const totalScrollDistance = rect.height - viewportHeight;
      if (totalScrollDistance <= 0) return;

      const currentScroll = -rect.top;
      let progress = currentScroll / totalScrollDistance;
      progress = Math.max(0, Math.min(1, progress));

      if (rect.bottom <= viewportHeight) {
        // 2. Below the section (Testimonial section) -> Always maintain max size
        setClipPath("inset(0% 0% 0% 0% round 0px)");
      } else if (rect.top >= 0) {
        // 1. Above the section -> Always maintain initial size
        setClipPath("inset(30% 35% 30% 35% round 24px)");
      } else {
        // 3. Inside the section -> Interpolate smoothly based on scroll progress
        // Trigger expansion between 10% and 90% scroll progress
        const p = Math.max(0, Math.min(1, (progress - 0.1) / 0.8));
        
        const insetTopBottom = 30 - p * 30;
        const insetLeftRight = 35 - p * 35;
        const round = 24 - p * 24;
        
        setClipPath(`inset(${insetTopBottom}% ${insetLeftRight}% ${insetTopBottom}% ${insetLeftRight}% round ${round}px)`);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll(); // Initialize size based on initial position
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);
  
  const videoUrl = "/assets/PD.mp4";

  return (
    <section ref={containerRef} className="relative bg-[#FFFFFF] md:h-[220vh]">
      
      {/* --- 1. NATURAL SCROLLING HEADER ROW --- */}
      <div className="w-full px-[24px] md:px-[64px] pt-[80px] pb-[40px] flex flex-col md:flex-row justify-between items-start md:items-end gap-[24px] z-10 relative">
        <div className="max-w-[700px]">
          <div className="flex items-center gap-[8px] text-[#64748B] font-medium text-[14px] tracking-widest uppercase mb-[16px]">
            <span className="w-[4px] h-[4px] rounded-full bg-[#64748B]"></span>
            Highlighted Home
          </div>
          <AnimatedHeading 
            text="MODERN HOMES, DESIGNED TO LIVE BETTER"
            className="text-[36px] md:text-[30px] lg:text-[45px] font-serif text-[#1A1F2A] leading-[1.1] uppercase tracking-tight"
            as="h2"
          />
        </div>
        <div className="max-w-[380px]">
          <FadeInBlock delay={0.2}>
            <p className="text-[#64748B] font-sans text-[16px] md:text-[18px] leading-[1.6]">
              Explore how modern homes are designed to feel clean, open, and functional.
            </p>
          </FadeInBlock>
        </div>
      </div>

      {/* --- 2. STICKY STAGE (Desktop Only) --- */}
      <div className="hidden md:block sticky top-0 h-screen w-full overflow-hidden">
        
        {/* Absolute Background Marquee Text Centered */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full z-10 overflow-hidden whitespace-nowrap pointer-events-none">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              ease: "linear",
              duration: 35,
              repeat: Infinity,
            }}
            className="flex w-max"
          >
            <span className="text-[120px] lg:text-[160px] font-sans text-[#1A1F2A]/5 tracking-tight select-none uppercase pr-12">
              Luxury Villas • Custom Design • Premium Construction • Timely Delivery • Architectural Excellence • Bespoke Villas • Quality Craftsmanship • Modern Living •&nbsp;
            </span>
            <span className="text-[120px] lg:text-[160px] font-sans text-[#1A1F2A]/5 tracking-tight select-none uppercase pr-12">
              Luxury Villas • Custom Design • Premium Construction • Timely Delivery • Architectural Excellence • Bespoke Villas • Quality Craftsmanship • Modern Living •&nbsp;
            </span>
          </motion.div>
        </div>

        {/* Expanding Video Layer */}
        <motion.div
          style={{ clipPath }}
          className="absolute inset-0 z-20 overflow-hidden shadow-2xl"
        >
          <MediaReveal
            isVideo={true}
            src={videoUrl}
            direction="up"
            isTriggered={isInView}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* --- 3. MOBILE LAYOUT (Standard Flow, Inline Video) --- */}
      <div className="md:hidden flex flex-col px-[24px] pb-[80px] gap-[24px]">
        <div className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden shadow-lg">
          <MediaReveal 
            isVideo={true} 
            src={videoUrl} 
            direction="up" 
            isTriggered={isInView} 
            className="w-full h-full" 
          />
        </div>
      </div>

    </section>
  );
};