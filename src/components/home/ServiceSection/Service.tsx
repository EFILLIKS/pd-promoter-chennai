"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// Sample Data Structure
const SERVICES_DATA = [
  {
    id: "01",
    eyebrow: "BUILD A HOME",
    title: "Bring Your Dream\nHome to Life",
    // Replace with your actual asset paths
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "02",
    eyebrow: "BUY A HOME",
    title: "Find the Perfect\nProperty for You",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "03",
    eyebrow: "DESIGN YOUR HOME",
    title: "Beautiful Interiors\nTailored to Your Style",
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop",
  },
];

export const ServicesSection = () => {
  // Track which card is active on desktop (defaults to the first one)
  const [activeIndex, setActiveIndex] = useState(0);

  // Smooth editorial easing curve
  const smoothEase = [0.22, 1, 0.36, 1] as [number, number, number, number];

  return (
    <section id="services" className="w-full px-[24px] md:px-[48px] lg:px-[64px] py-[80px] max-w-[1600px] mx-auto bg-[#ffffff]">
      
      {/* --- 1. HEADER ROW --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-[40px] gap-[24px]">
        
        {/* Left Side: Eyebrow & Heading */}
        <div className="flex flex-col gap-[16px] max-w-[700px]">
          <div className="flex items-center gap-[8px] text-[#64748B] font-medium text-[14px] tracking-wide uppercase">
            <span className="w-[4px] h-[4px] rounded-full bg-[#64748B]"></span>
            Services
          </div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="text-[36px] md:text-[48px] lg:text-[56px] font-serif text-[#1A1F2A] leading-[1.1] uppercase"
          >
            Everything You Need<br />For Your Home
          </motion.h2>
        </div>

        {/* Right Side: Paragraph */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
          className="text-[#64748B] text-[16px] md:text-[18px] max-w-[420px] leading-[1.6]"
        >
          Built to simplify your home search with clear insights, better options, and confident decisions.
        </motion.p>
      </div>

      {/* --- 2. INTERACTIVE ACCORDION CARDS --- */}
      {/* Mobile: flex-col (stacked), gap 16px. 
        Desktop: flex-row, fixed height of 500px to maintain aspect ratios. 
      */}
      <div className="flex flex-col lg:flex-row gap-[16px] lg:h-[500px] w-full">
        {SERVICES_DATA.map((service, index) => {
          const isActiveDesktop = activeIndex === index;

          return (
            <motion.div
              key={service.id}
              // Hover interaction (Desktop only)
              onMouseEnter={() => setActiveIndex(index)}
              // Framer Motion Layout handling:
              // flex: 2 (expands) when active, flex: 1 (shrinks) when inactive.
              // On mobile, flex properties are ignored because it's flex-col.
              layout
              animate={{ 
                flex: isActiveDesktop ? 2.5 : 1 
              }}
              transition={{ duration: 0.6, ease: smoothEase }}
              className={`
                relative overflow-hidden rounded-[24px] cursor-pointer
                flex flex-col justify-between p-[32px] min-h-[350px] lg:min-h-full
                transition-colors duration-500
                /* ⚡ MOBILE: Always dark. DESKTOP: Dark if active, light if inactive */
                bg-[#0B1117] lg:${isActiveDesktop ? "bg-[#0B1117]" : "bg-[#F6F6F6]"}
              `}
            >
              
              {/* --- BACKGROUND IMAGE (Active / Mobile Only) --- */}
              <div 
                className={`
                  absolute inset-0 z-0 transition-opacity duration-500
                  /* ⚡ MOBILE: Always visible. DESKTOP: Visible only if active */
                  opacity-100 lg:${isActiveDesktop ? "opacity-100" : "opacity-0"}
                `}
              >
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                {/* Dark gradient overlay so text remains readable */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/90"></div>
              </div>

              {/* --- CARD CONTENT (Z-Index ensures it sits above image) --- */}
              
              {/* Top Right Number */}
              <div className="relative z-10 flex justify-end w-full">
                <motion.span 
                  layout="position"
                  className={`
                    text-[56px] md:text-[72px] font-serif leading-none transition-colors duration-500
                    /* Mobile: white/80. Desktop: matches state */
                    text-white/90 lg:${isActiveDesktop ? "text-white/90" : "text-[#1A1F2A]/30"}
                  `}
                >
                  {service.id}
                </motion.span>
              </div>

              {/* Bottom Text Content */}
              <motion.div layout="position" className="relative z-10 flex flex-col gap-[8px]">
                <p 
                  className={`
                    text-[12px] font-semibold tracking-[0.15em] uppercase transition-colors duration-500
                    text-white/70 lg:${isActiveDesktop ? "text-white/70" : "text-[#64748B]"}
                  `}
                >
                  {service.eyebrow}
                </p>
                <h3 
                  className={`
                    text-[24px] md:text-[28px] font-sans leading-[1.2] whitespace-pre-line transition-colors duration-500
                    text-white lg:${isActiveDesktop ? "text-white" : "text-[#0B1117]"}
                  `}
                >
                  {service.title}
                </h3>
              </motion.div>

            </motion.div>
          );
        })}
      </div>

    </section>
  );
};