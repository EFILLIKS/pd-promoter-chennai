"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { Icon } from "@iconify/react";
import { AnimatedHeading } from "@/components/ui/HeadingText";
import { FadeInBlock } from "@/components/ui/Paratext";
import { ExpandableButton } from "@/components/ui/ExpandableButton";
import { useData } from "@/context/DataContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useLenis } from "lenis/react";

export const Footer = () => {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const { settings } = useData();
  const lenis = useLenis();
  const sectionRef = useRef<HTMLElement>(null);
  const isLayerInView = useInView(sectionRef, {
    once: true,
    margin: "-20% 0px -20% 0px",
  });

  const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    if (pathname === "/") {
      e.preventDefault();
      lenis?.scrollTo(target, {
        duration: 1.2,
      });
    }
  };

  return (
    // The entire wrapper is set to the dark footer color.
    <footer ref={sectionRef} className="relative w-full bg-[#0B1117] flex flex-col overflow-hidden">
      
      {/* =========================================
          1. THE IMAGE & GRADIENT TRANSITION STAGE
          ========================================= */}
      <div className="relative w-full min-h-[800px] flex flex-col items-center justify-start pt-[120px] md:pt-[160px] px-[24px]">
        
        {/* Background Image Layer */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img 
            src="/assets/footer-placeholder.jpg" // ⚡ Replace with your architecture image
            alt="Luxury Villa Sunset" 
            className="w-full h-full object-cover object-top"
          />
          {/* ⚡ THE PERFECT GRADIENT 
              Starts with a slight dark wash so white text is readable.
              Transitions to 80% opacity dark navy near the bottom.
              Hits 100% solid #0B1117 at the absolute bottom edge to seamlessly blend into the footer.
          */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1117]/30 via-[#0B1117]/70 via-60% to-[#0B1117]" />
        </div>

        {/* CTA Content Layer */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-[800px] w-full">
          <AnimatedHeading 
            text="DISCOVER HOMES DESIGNED FOR YOUR LIFESTYLE"
            className="justify-center text-[36px] md:text-[48px] lg:text-[56px] font-serif text-white uppercase leading-[1.15] tracking-tight mb-[24px]"
            isTriggered={isLayerInView}
            staggerDelay={0.05}
          />
          
          <FadeInBlock isTriggered={isLayerInView} delay={0.4} className="max-w-[600px] mb-[40px]">
            <p className="text-white/80 font-sans text-[16px] md:text-[18px] leading-[1.6]">
              Explore properties, compare options, and move forward with confidence - everything you need in one place.
            </p>
          </FadeInBlock>

          <FadeInBlock isTriggered={isLayerInView} delay={0.6}>
            <Link href="/#contact" onClick={(e) => handleScrollClick(e, '#contact')}>
              <ExpandableButton 
                label="Get in Touch" 
                // Using Iconify for the message bubble icon
                icon={<Icon icon="lucide:message-circle" width="20" height="20" />} 
                // Overriding base button colors to match your light button/dark icon design if needed
                className="bg-white !text-[#0B1117] shadow-2xl cursor-pointer"
              />
            </Link>
          </FadeInBlock>
        </div>

        {/* The Massive Watermark 
            Positioned absolutely at the bottom of the image stage to sit behind the footer links 
        */}
        <div className="absolute bottom-[-5%] left-0 w-full flex justify-center pointer-events-none z-0 overflow-hidden">
          <div className="text-[30px] md:text-[120px] font-serif text-white/[0.03] uppercase tracking-widest leading-none select-none whitespace-nowrap">
            PD Construction
          </div>
        </div>
      </div>

      {/* =========================================
          2. THE FOOTER LINKS & DETAILS STAGE
          ========================================= */}
      {/* 
        This section sits on the solid #0B1117 background. 
        Because the gradient above ended in solid #0B1117, the seam is completely invisible.
      */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-[24px] md:px-[64px] mt-[80px] pb-[40px] flex flex-col gap-[80px]">
        
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[48px] md:gap-[24px]">
          
          {/* Brand Column (Spans 5) */}
          <div className="md:col-span-5 flex flex-col gap-[24px]">
            {/* Logo */}
            <div className="flex items-center gap-[12px] text-white">
              <img src="/assets/logowhite.png" alt="PD Logo" className="w-[32px] h-[32px] object-contain" />
              <span className="font-serif text-[24px] tracking-wide">{settings.companyName}</span>
            </div>
            
            <p className="text-[#C6CDDB]/60 text-[15px] leading-[1.6] max-w-[320px]">
              Find, explore, and choose your next home with a simple and modern experience.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-[20px] mt-[8px]">
              <a 
                href={settings.twitter || "#"} 
                target={settings.twitter && settings.twitter !== "#" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="text-[#C6CDDB]/60 hover:text-white transition-colors"
              >
                <Icon icon="ri:twitter-x-line" width="20" height="20" />
              </a>
              <a 
                href={settings.facebook || "#"} 
                target={settings.facebook && settings.facebook !== "#" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="text-[#C6CDDB]/60 hover:text-white transition-colors"
              >
                <Icon icon="mdi:facebook" width="22" height="22" />
              </a>
              <a 
                href={settings.instagram || "#"} 
                target={settings.instagram && settings.instagram !== "#" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="text-[#C6CDDB]/60 hover:text-white transition-colors"
              >
                <Icon icon="mdi:instagram" width="22" height="22" />
              </a>
            </div>
          </div>

          {/* Spacer Column for Desktop */}
          <div className="hidden md:block md:col-span-2"></div>

          {/* Links Column (Spans 2) */}
          <div className="md:col-span-2 flex flex-col gap-[16px]">
            <Link href="/#properties" onClick={(e) => handleScrollClick(e, '#properties')} className="text-[#C6CDDB]/80 hover:text-white transition-colors text-[15px]">Properties</Link>
            <Link href="/#services" onClick={(e) => handleScrollClick(e, '#services')} className="text-[#C6CDDB]/80 hover:text-white transition-colors text-[15px]">Services</Link>
            <Link href="/#about" onClick={(e) => handleScrollClick(e, '#about')} className="text-[#C6CDDB]/80 hover:text-white transition-colors text-[15px]">About</Link>
            <Link href="/#contact" onClick={(e) => handleScrollClick(e, '#contact')} className="text-[#C6CDDB]/80 hover:text-white transition-colors text-[15px]">Contact Us</Link>
          </div>

          {/* Contact Details Column (Spans 3) */}
          <div className="md:col-span-3 flex flex-col gap-[20px]">
            <a href={`mailto:${settings.email}`} className="flex items-start gap-[12px] text-[#C6CDDB]/80 hover:text-white transition-colors group">
              <div className="bg-white/5 p-[8px] rounded-full group-hover:bg-white/10 transition-colors">
                <Icon icon="mdi:email-outline" width="18" height="18" />
              </div>
              <span className="text-[15px] pt-[6px]">{settings.email}</span>
            </a>
            
            <a href={`tel:${settings.phone}`} className="flex items-start gap-[12px] text-[#C6CDDB]/80 hover:text-white transition-colors group">
              <div className="bg-white/5 p-[8px] rounded-full group-hover:bg-white/10 transition-colors">
                <Icon icon="mdi:phone-outline" width="18" height="18" />
              </div>
              <span className="text-[15px] pt-[6px]">{settings.phone}</span>
            </a>
            
            <div className="flex items-start gap-[12px] text-[#C6CDDB]/80">
              <div className="bg-white/5 p-[8px] rounded-full mt-[4px]">
                <Icon icon="mdi:map-marker-outline" width="18" height="18" />
              </div>
              <span className="text-[14px] leading-[1.6] whitespace-pre-line">
                {settings.address}
              </span>
            </div>
          </div>

        </div>

        {/* --- 3. BOTTOM COPYRIGHT BAR --- */}
        <div className="w-full border-t border-white/[0.08] pt-[32px] flex flex-col md:flex-row justify-between items-center gap-[16px]">
          <p className="text-[#C6CDDB]/50 text-[14px]">
            Copyright@2026
          </p>
          <p className="text-[#C6CDDB]/50 text-[14px]">
            Crafted by{" "}
            <a
              href="https://efilliks.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-white transition-colors"
            >
              Efilliks
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
};