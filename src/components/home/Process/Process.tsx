"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AnimatedHeading } from "@/components/ui/HeadingText";
import { FadeInBlock } from "@/components/ui/Paratext";
import { MediaReveal } from "@/components/ui/MediaReveal";

// Sample Data Structure for the 5 Process Cards
const JOURNEY_STEPS = [
  {
    id: "01",
    title: "STRATEGIC LAND\nSELECTION",
    description: "Every exceptional home begins with the right foundation. We carefully identify and acquire land in promising locations, ensuring strong future value, accessibility, and long-term potential.",
    image: "/assets/Process1.png",
  },
  {
    id: "02",
    title: "ARCHITECTURAL\nVISIONING",
    description: "Our design team translates your lifestyle into spatial reality. We focus on natural light, fluid transitions, and sustainable materials to craft a home that breathes with its environment.",
    image: "/assets/Process2.png",
  },
  {
    id: "03",
    title: "PRECISION\nENGINEERING",
    description: "Structural integrity meets aesthetic perfection. We utilize advanced construction methodologies and rigorous quality control to ensure your home is built to endure for generations.",
    image: "/assets/Process3.png",
  },
  {
    id: "04",
    title: "INTERIOR\nREFINEMENT",
    description: "The soul of the home lies in its details. From bespoke cabinetry to curated stone selections, our interior architects tailor every finish to reflect your personal aesthetic.",
    image: "/assets/Process4.png",
  },
  {
    id: "05",
    title: "SEAMLESS\nHANDOVER",
    description: "A flawless transition to ownership. We conduct exhaustive final inspections, provide comprehensive system orientations, and present you with the keys to your completed vision.",
    image: "/assets/Process5.png",
  },
];

export const JourneySection = () => {
  // 1. Reference the extremely tall wrapper to track scroll progress
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    const updateScrollWidth = () => {
      if (trackRef.current) {
        const widthDifference = trackRef.current.scrollWidth - window.innerWidth;
        setScrollWidth(widthDifference > 0 ? widthDifference : 0);
      }
    };

    updateScrollWidth();
    const timer = setTimeout(updateScrollWidth, 100);

    window.addEventListener("resize", updateScrollWidth);
    return () => {
      window.removeEventListener("resize", updateScrollWidth);
      clearTimeout(timer);
    };
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // Start tracking when top of section hits top of viewport
    // Stop tracking when bottom of section hits bottom of viewport
    offset: ["start start", "end end"] 
  });

  // 2. The Mathematical Horizontal Transform
  // Interpolates dynamically in pixels for a butter-smooth scroll
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollWidth]);

  return (
    <section ref={sectionRef} className="relative h-[400vh] bg-[#FFFFFF]">
      {/* ⚡ The 400vh wrapper dictates how long the user must scroll to finish the horizontal track */}
      
      {/* ⚡ The Sticky Stage (Locks everything to the viewport) */}
      <div className="sticky top-0 h-screen w-full flex flex-col overflow-hidden">
        
        {/* --- 1. PINNED HEADER ROW --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end w-full px-[24px] md:px-[64px] pt-[80px] pb-[40px] shrink-0">
          
          {/* Left Side: Eyebrow & Heading */}
          <div className="flex flex-col gap-[16px] max-w-[800px]">
            <FadeInBlock delay={0.1}>
              <div className="flex items-center gap-[8px] text-[#64748B] font-medium text-[14px] tracking-wide uppercase">
                <span className="w-[4px] h-[4px] rounded-full bg-[#64748B]"></span>
                Development Journey
              </div>
            </FadeInBlock>
            
            <AnimatedHeading
              text="FROM VISION TO OWNERSHIP, CRAFTED FOR YOUR LIFESTYLE"
              className="text-[32px] md:text-[30px] lg:text-[40px] font-serif text-[#1A1F2A] leading-[1.1] uppercase tracking-tight"
              staggerDelay={0.04}
              as="h2"
            />
          </div>

          {/* Right Side: Paragraph */}
          <div className="max-w-[420px]">
            <FadeInBlock delay={0.4}>
              <p className="text-[#64748B] font-sans text-[12px] md:text-[16px] ">
                At PD Construction, every home begins with a carefully considered vision and ends with a seamless handover.
              </p>
            </FadeInBlock>
          </div>
        </div>

        {/* --- 2. HORIZONTAL SCROLL TRACK --- */}
        {/* Flex-grow allows this to take up the rest of the screen height under the header */}
        <div className="relative flex-grow flex items-center">
          <motion.div 
            ref={trackRef}
            style={{ x }} 
            className="flex gap-[32px] px-[24px] md:px-[64px] h-full items-center w-max pb-[40px]"
          >
            {JOURNEY_STEPS.map((step, index) => (
              
              /* --- INDIVIDUAL CARD (Strict Dimensions) --- */
              /* w-[85vw] on mobile, w-[75vw] on desktop. Shrink-0 prevents flexbox crushing. */
              <div 
                key={step.id} 
                className="w-[90vw] md:w-[75vw] max-w-[1200px] shrink-0 grid grid-cols-1 lg:grid-cols-12 grid-rows-2 lg:grid-rows-1 gap-[16px] lg:gap-[24px] h-[52vh] md:h-[58vh] max-h-[550px] min-h-[380px]"
              >
                
                {/* Card Left: The Image Reveal (7 columns) */}
                <div className="lg:col-span-7 h-full w-full relative overflow-hidden rounded-[24px]">
                  <MediaReveal 
                    src={step.image}
                    direction="left"
                    isTriggered={null} 
                    className="w-full h-full object-cover shadow-sm"
                  />
                </div>

                {/* Card Right: The Content Block (5 columns) */}
                <div className="lg:col-span-5 h-full w-full bg-[#F6F6F6] rounded-[24px] p-[20px] md:p-[36px] lg:p-[20px] flex flex-col justify-end relative overflow-hidden shadow-sm">
                  
                  {/* Background Watermark Number (hidden on small heights/mobile to save space) */}
                  <div className=" absolute top-[24px] md:top-[32px] right-[24px] md:right-[40px] pointer-events-none">
                    <span className="text-[60px] md:text-[100px] lg:text-[120px] font-serif text-[#1A1F2A]/10 leading-none tracking-tighter">
                      {step.id}
                    </span>
                  </div>

                  {/* Text Content */}
                  <div className="flex flex-col gap-[12px] md:gap-[24px] relative z-10">
                    <h3 className="font-serif text-[20px] sm:text-[14px] md:text-[20px] lg:text-[30px] uppercase text-[#1A1F2A] leading-[1.1] whitespace-pre-line tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-[#64748B] font-sans text-[10px] md:text-[12px] lg:text-[14px] leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                </div>

              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
};