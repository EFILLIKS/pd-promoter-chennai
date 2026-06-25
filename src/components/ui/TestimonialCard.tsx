"use client";

import React from "react";

export interface TestimonialCardProps {
  content: string;
  name: string;
  designation?: string;
  /** Custom background class for the big glow circle */
  glowBig?: string;
  /** Custom background class for the small glow circle */
  glowSmall?: string;
  /** Class name override for the card wrapper */
  className?: string;
  /** Client image details */
  image?: { imageUrl: string; publicId: string } | null;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  content,
  name,
  designation,
  glowBig = "bg-[#7DD3FC]",
  glowSmall = "bg-[#38BDF8]",
  className = "",
  image,
}) => {
  return (
    <div
      className={`relative flex flex-col justify-between w-[320px] md:w-[400px] h-[450px] bg-[#F9F9FB] rounded-[24px] p-[40px] overflow-hidden shrink-0 ${className}`}
    >
      {/* Card Content (z-10 keeps it above the glowing orbs) */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Review Text */}
        <p className="text-[#4A5568] font-sans text-[18px] md:text-[20px] leading-[1.6] tracking-tight">
          {content}
        </p>

        {/* Author Block */}
        <div className="flex items-center gap-4 mt-[32px]">
          {image && image.imageUrl ? (
            <img 
              src={image.imageUrl} 
              alt={name} 
              className="w-12 h-12 rounded-full object-cover border border-[#E2E8F0] shadow-sm shrink-0" 
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#0B1117] text-white flex items-center justify-center font-serif text-sm font-semibold tracking-wider shrink-0 shadow-sm uppercase">
              {name.split(" ").filter(Boolean).map(n => n[0]).join("").substring(0, 2) || "U"}
            </div>
          )}
          <div className="flex flex-col gap-[4px]">
            <h4 className="font-serif text-[14px] md:text-[16px] uppercase tracking-widest text-[#1A1F2A]">
              {name}
            </h4>
            {designation && (
              <p className="font-sans text-[12px] text-[#64748B] tracking-wide">
                {designation}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* --- THE AURA GLOW EFFECT --- */}
      {/* Big Circle (Bottom Right) */}
      <div
        className={`absolute bottom-[-20%] right-[-10%] w-[250px] h-[250px] rounded-full blur-[70px] opacity-60 z-0 transition-colors duration-500 ${glowBig}`}
      />

      {/* Small Circle (Bottom Left) */}
      <div
        className={`absolute bottom-[-5%] left-[5%] w-[150px] h-[150px] rounded-full blur-[60px] opacity-70 z-0 transition-colors duration-500 ${glowSmall}`}
      />
    </div>
  );
};
