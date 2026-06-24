"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { AnimatedHeading } from "@/components/ui/HeadingText";
import { FadeInBlock } from "@/components/ui/Paratext";
import { ExpandableButton } from "@/components/ui/ExpandableButton";
import { FolderRoot } from "lucide-react";
import Link from "next/link";

// ⚡ CONFIGURATION: Adjust the scale of each image independently (e.g. 1.3 = 30% larger, 1.0 = normal size)
const HOME1_SCALE = 1.45; // Sizing for the white foreground x-ray image (Home1)
const HOME2_SCALE = 1.3; // Sizing for the colorful background image (Home2) 

export const HeroSection = () => {
  // 1. Image Container Reference for precise mouse coordinate mapping
  const containerRef = useRef<HTMLDivElement>(null);

  // 2. High-Performance Motion Values (Bypasses React re-renders)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const maskRadius = useMotionValue(0); // Starts at 0 (invisible spotlight)

  // 3. Fluid Physics for the spotlight movement and expansion
  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const smoothRadius = useSpring(maskRadius, { damping: 30, stiffness: 200 });

  // 4. The Mathematical Mask Template
  // transparent punches the hole. black retains the image.
  // The transition between transparent and black creates the "blurred layer" effect.
  const maskImage = useMotionTemplate`radial-gradient(${smoothRadius}px circle at ${smoothX}px ${smoothY}px, transparent 0%, rgba(0,0,0,0.3) 60%, black 100%)`;

  // 5. Interaction Handlers
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Compensate for the scale factor (HOME1_SCALE) relative to the scale origin (bottom center)
    const width = rect.width;
    const height = rect.height;

    const dx = x - width / 2;
    const dy = y - height;

    mouseX.set(width / 2 + dx / HOME1_SCALE);
    mouseY.set(height + dy / HOME1_SCALE);
  };

  return (
    <section className="relative min-h-screen bg-[#C6CDDB] overflow-hidden flex flex-col items-center pt-24 md:pt-32">

      {/* --- AMBIENT CLOUDS (Layer 1) --- */}
      {/* These float gently using repeating y-axis animations. pointer-events-none ensures they don't block the mouse. */}
      <motion.img
        src="/assets/Cloud1.png"
        alt="Ambient Cloud Left"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[-5%] w-1/3 max-w-lg opacity-40 mix-blend-overlay pointer-events-none z-0"
      />
      <motion.img
        src="/assets/Cloud1.png"
        alt="Ambient Cloud Right"
        animate={{ y: [0, 25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[10%] right-[-10%] w-1/2 max-w-xl opacity-30 mix-blend-overlay pointer-events-none z-0"
      />

      {/* --- TYPOGRAPHY & UI (Layer 5) --- */}
      <div className="relative z-50 flex flex-col items-center text-center px-6 max-w-4xl mx-auto w-full">
        <AnimatedHeading
          text="LUXURY REIMAGINED FOR MODERN LIVING."
          className="justify-center text-4xl md:text-5xl lg:text-7xl font-serif text-[#1A1F2A] tracking-tight leading-[1.1]"
          staggerDelay={0.04}
        />

        <FadeInBlock delay={0.3} className="max-w-xl mb-10">
          <p className="text-[#4A5568] font-sans text-base md:text-lg leading-relaxed font-medium">
            Experience luxury villas in Chennai designed for those who value elegance, privacy, and timeless architecture. PD Construction is your premier choice for villa construction in Chennai.
          </p>
        </FadeInBlock>

        <FadeInBlock delay={0.5}>
          <Link href="/projects">
            <ExpandableButton
              label="View Projects"
              icon={<FolderRoot strokeWidth={2} size={20} />}
            />
          </Link>
        </FadeInBlock>
      </div>

      {/* --- ARCHITECTURAL X-RAY STAGE (Layers 2 & 3) --- */}
      {/* ⚡ FIXED SIZE & POSITION: mt-auto pushes container down. 
        max-w is locked at 800px (scaling to 900px on big displays) to prevent the house from blowing up.
        pb-4 ensures the house sits within the clouds rather than sliding underneath.
      */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[800px] lg:max-w-[900px] mx-auto mt-auto pb-4 cursor-crosshair z-10 flex flex-col justify-end"
        onPointerMove={handlePointerMove}
        onPointerEnter={() => maskRadius.set(160)} // Expands to 160px radius
        onPointerLeave={() => maskRadius.set(0)}   // Smoothly collapses
      >
        {/* ⚡ STRICT CONTAINMENT WRAPPER 
            This div mathematically creates a dependency. Home 2 declares the physical height, Home 1 strictly matches it.
        */}
        <div className="relative w-full">

          {/* Layer 2: HOME 2 (The Behind/Colorful Image) */}
          {/* This remains block layout. We apply HOME2_SCALE here to adjust sizing. */}
          <motion.img
            src="/assets/Home2.png"
            alt="Modern Villa Colorful"
            className="w-full h-auto object-contain block"
            style={{ scale: HOME2_SCALE, transformOrigin: "bottom" }}
          />

          {/* Layer 3: HOME 1 (The Front/Monochrome Image) */}
          {/* Absolutely positioned inset-0 to perfectly match Home 2's size and aspect ratio. 
              We apply HOME1_SCALE here to adjust its sizing independently.
          */}
          <motion.img
            src="/assets/Home1.png"
            alt="Modern Villa White"
            className="hidden md:block absolute inset-0 w-full h-full object-contain pointer-events-none"
            style={{
              WebkitMaskImage: maskImage,
              maskImage: maskImage,
              scale: HOME1_SCALE,
              transformOrigin: "bottom"
            }}
          />
        </div>
      </div>

      {/* --- FOREGROUND CLOUDS (Layer 4) --- */}
      {/* Creates the volumetric depth of field over the bottom of the house */}
      <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none">
        <img
          src="/assets/Cloud2.png"
          alt="Foreground Mist"
          className="w-full h-auto object-contain"
        />
      </div>

    </section>
  );
};