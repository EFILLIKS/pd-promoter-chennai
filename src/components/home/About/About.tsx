"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { AnimatedHeading } from "@/components/ui/HeadingText";
import { FadeInBlock } from "@/components/ui/Paratext";
import { MediaReveal } from "@/components/ui/MediaReveal"; 

export const AboutSection = () => {
  // Create a master layer trigger to choreograph the entire section's reveal
  const sectionRef = useRef<HTMLElement>(null);
  const isLayerInView = useInView(sectionRef, {
    once: true,
    margin: "-15% 0px -15% 0px" 
  });

  return (
    // Max-w ensures the layout doesn't break on 4k monitors. 
    // py-32 and px-6 give it that breathing room seen in the wireframe.
    <section id="about" ref={sectionRef} className="bg-white relative py-24 md:py-32 px-6 lg:px-12 w-full">
      
      {/* ⚡ Premium Responsive Flex Layout */}
      <div className="flex flex-col lg:flex-row gap-0 lg:gap-0 sm:gap-10 justify-between items-stretch">

        {/* --- LEFT COLUMN (58% width on desktop) --- */}
        <div className="w-full lg:w-[58%] flex flex-col justify-between">
          
          {/* Top Text Block */}
          <div className="flex flex-col gap-6 max-w-2xl">
            
            {/* Eyebrow */}
            <FadeInBlock isTriggered={isLayerInView} delay={0.1}>
              <div className="flex items-center gap-2 text-[#64748B] font-medium text-sm tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#64748B]"></span>
                About Us
              </div>
            </FadeInBlock>

            {/* Main Heading */}
            <AnimatedHeading
              text="BUILT WITH PRECISION. CRAFTED WITH VISION."
              className="text-xl md:text-5xl xl:text-[50px] font-serif text-[#1A1F2A] tracking-tight leading-[1.1] uppercase"
              isTriggered={isLayerInView}
              staggerDelay={0.06}
              as="h2"
            />

            {/* Primary Paragraph */}
            <FadeInBlock isTriggered={isLayerInView} delay={0.4}>
              <p className="text-[#4B5B63] font-sans text-lg md:text-xl leading-relaxed">
                PD Construction creates premium villa communities that blend modern architecture, refined materials, and exceptional craftsmanship.
              </p>
            </FadeInBlock>
          </div>

          {/* Bottom Left Image 
              - mt-12/mt-24 pushes it down to create the stagger
              - aspect-[4/3] enforces the wide landscape crop
              - lg:pr-10 ensures the image doesn't crash into the right column
          */}
          <div className="mt-12 w-full lg:pr-10">
            <MediaReveal
              src="/assets/About1.png" // Replace with your asset
              direction="up"
              delay={0.5}
              isTriggered={isLayerInView}
              className="w-full aspect-[4/3] rounded-[20px]"
            />
          </div>

        </div>


        {/* --- RIGHT COLUMN (42% width on desktop) --- */}
        <div className="w-full lg:w-[42%] flex flex-col justify-between mt-8 lg:mt-0 gap-4 lg:gap-0 sm:mt-4">
          
          {/* Top Right Image 
              - aspect-[3/4] enforces the tall portrait crop
              - Pinned to the top of the grid to contrast the left column
          */}
          <div className="w-full">
            <MediaReveal
              src="/assets/About2.png" // Replace with your asset
              direction="up"
              delay={0.3} // Opens slightly earlier than the left image
              isTriggered={isLayerInView}
              className="w-full aspect-[3/4] xl:aspect-[4/5] rounded-[20px]"
            />
          </div>

          {/* Bottom Text Block */}
          <FadeInBlock isTriggered={isLayerInView} delay={0.6}>
            <p className="text-[#4B5B63] font-sans text-base md:text-lg leading-relaxed">
              Every project is thoughtfully designed to elevate everyday living, blending modern comfort, exceptional functionality, and timeless beauty that endures for generations.
            </p>
          </FadeInBlock>

        </div>

      </div>
    </section>
  );
};