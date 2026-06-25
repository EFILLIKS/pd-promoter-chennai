"use client";

import { motion } from "framer-motion";
import { AnimatedHeading } from "@/components/ui/HeadingText";
import { FadeInBlock } from "@/components/ui/Paratext";
import { TestimonialCard } from "@/components/ui/TestimonialCard";

import { useData } from "@/context/DataContext";

const GLOW_PRESETS = [
  { big: "bg-[#7DD3FC]", small: "bg-[#38BDF8]" }, // Light Blue & Cyan
  { big: "bg-[#FEF08A]", small: "bg-[#D9F99D]" }, // Soft Yellow & Lime
  { big: "bg-[#FDBA74]", small: "bg-[#FB923C]" }, // Soft Orange & Deep Orange
  { big: "bg-[#F9A8D4]", small: "bg-[#F472B6]" }, // Soft Pink & Deep Pink
];

export const ReviewsSection = () => {
  const { testimonials } = useData();
  const tickerItems = [...testimonials, ...testimonials];

  return (
    <section className="w-full py-[80px] md:py-[120px] bg-[#FFFFFF] overflow-hidden flex flex-col">
      
      {/* --- 1. PINNED HEADER ROW --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end w-full px-[24px] md:px-[64px] max-w-[1600px] mx-auto mb-[64px]">
        
        {/* Left Side: Eyebrow & Heading */}
        <div className="flex flex-col gap-[16px] max-w-[700px]">
          <FadeInBlock delay={0.1}>
            <div className="flex items-center gap-[8px] text-[#64748B] font-medium text-[14px] tracking-widest uppercase">
              <span className="w-[4px] h-[4px] rounded-full bg-[#64748B]"></span>
              Client Reviews
            </div>
          </FadeInBlock>
          
          <AnimatedHeading
            text="WHAT PEOPLE SAY ABOUT THEIR HOME SEARCH"
            className="text-[36px] md:text-[35px] lg:text-[45px] font-serif text-[#1A1F2A] leading-[1.1] uppercase tracking-tight"
            staggerDelay={0.04}
            as="h2"
          />
        </div>

        {/* Right Side: Paragraph */}
        <div className="max-w-[420px] mt-[24px] lg:mt-0">
          <FadeInBlock delay={0.4}>
            <p className="text-[#64748B] font-sans text-[16px] md:text-[18px] leading-[1.6]">
              Hear from homeowners who explored their options and found the perfect place with confidence.
            </p>
          </FadeInBlock>
        </div>
      </div>

      {/* --- 2. INFINITE SCROLL TICKER --- */}
      <div className="relative w-full flex overflow-hidden">
        
        {/* Hardware accelerated translation. 
            Moves from 0% to -50% (exactly one full set of the duplicated array) 
        */}
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 35, // Adjust this to speed up or slow down the ticker
            ease: "linear",
            repeat: Infinity,
          }}
          // w-max forces the flex container to stretch to the exact width of its contents
          className="flex gap-[24px] w-max px-[24px] md:px-[64px] hover:[animation-play-state:paused]"
        >
          {tickerItems.map((review, index) => {
            const glowPreset = GLOW_PRESETS[index % GLOW_PRESETS.length];
            return (
              <TestimonialCard
                key={`${review.id}-${index}`}
                content={review.content}
                name={review.name}
                designation={review.designation}
                glowBig={review.glowBig || glowPreset.big}
                glowSmall={review.glowSmall || glowPreset.small}
                image={review.image}
              />
            );
          })}
        </motion.div>
      </div>

    </section>
  );
};