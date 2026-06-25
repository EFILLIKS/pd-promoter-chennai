import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Image from "next/image";

const MotionImage = motion.create(Image);

export interface ProjectCardProps {
  /** The name of the project */
  title: string;
  /** Number of bedrooms (e.g., "4 BHK") */
  bhk: string;
  /** Geographic location */
  location: string;
  /** The source URL for the background image */
  imageSrc: string;
  /** Status badge text (default: "Available") */
  status?: string;
  /** Optional Tailwind overrides for the wrapper */
  className?: string;
  /** Project brochure data */
  brochure?: { fileUrl: string; publicId: string; fileType: string } | null;
}

export const ProjectCard = ({
  title,
  bhk,
  location,
  imageSrc,
  status = "Available",
  className = "",
  brochure,
}: ProjectCardProps) => {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  return (
    <Link href={`/project/${slug}`} className="block w-full">
      <motion.div
        whileHover="hover"
        className={`relative overflow-hidden rounded-[24px] w-full aspect-[3/4] md:aspect-[4/3] cursor-pointer group ${className}`}
      >
      {/* --- 1. BACKGROUND IMAGE --- */}
      {/* Subtle, luxurious scale effect on hover */}
      <MotionImage
        src={imageSrc}
        alt={`Luxury ${bhk} Villa in ${location} by PD Construction`}
        fill
        className="object-cover z-0"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        variants={{
          hover: { scale: 1.04 },
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        loading="lazy"
      />

      {/* --- 2. PROGRESSIVE BLUR & GRADIENT MASK --- */}
      {/* The Blur Layer: Fades out from bottom to top using mask-image */}
      <div 
        className="absolute inset-x-0 bottom-0 h-[45%] z-10 pointer-events-none backdrop-blur-md"
        style={{
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)",
          maskImage: "linear-gradient(to top, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)",
        }}
      />
      {/* The Dark Wash: Provides contrast so the white text pops flawlessly */}
      <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-[#0B1117]/90 via-[#0B1117]/30 to-transparent z-10 pointer-events-none" />


      {/* --- 3. STATUS BADGE (TOP RIGHT) --- */}
      <div className="absolute top-[24px] right-[24px] z-20 flex items-center gap-[8px] bg-white px-[16px] py-[10px] rounded-full shadow-lg">
        {/* Placeholder for your PD Logo - replace icon string if needed */}
        <img src="/assets/Logoblue.png" alt="PD Logo" className="w-[20px] h-[20px] object-contain" />
        <span className="text-[#1A1F2A] font-sans font-medium text-[15px] leading-none pt-[2px]">
          {status}
        </span>
      </div>


      {/* --- 4. CONTENT BLOCK (BOTTOM LEFT) --- */}
      <div className="absolute bottom-0 left-0 w-full p-[32px] z-20 flex justify-between items-end gap-4">
        
        <div className="flex flex-col gap-[16px]">
          {/* Title */}
          <motion.h3
            variants={{ hover: { y: -4 } }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="font-serif text-[32px] md:text-[36px] text-white uppercase tracking-wide leading-none drop-shadow-sm"
          >
            {title}
          </motion.h3>

          {/* Property Details Row */}
          <motion.div
            variants={{ hover: { y: -4 } }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
            className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-[16px] text-white/95 font-sans text-[16px]"
          >
            
            {/* BHK Info */}
            <div className="flex items-center gap-[10px]">
              <Icon icon="lucide:bed-double" width="22" height="22" strokeWidth="1.5" />
              <span className="font-medium tracking-wide pt-[2px]">{bhk}</span>
            </div>

            {/* Strict Vertical Divider */}
            <div className="hidden md:block w-[2px] h-[22px] bg-white/40" />

            {/* Location Info */}
            <div className="flex items-center gap-[8px]">
              <Icon icon="lucide:map-pin" width="22" height="22" strokeWidth="1.5" />
              <span className="font-medium tracking-wide pt-[2px]">{location}</span>
            </div>

          </motion.div>
        </div>

        {/* Brochure Download Button */}
        {brochure && brochure.fileUrl && (
          <motion.button
            variants={{ hover: { scale: 1.05 } }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(brochure.fileUrl, "_blank");
            }}
            className="flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 backdrop-blur-md transition-all shadow-lg shrink-0"
            title="Download Brochure"
          >
            <Icon icon="lucide:download" width="20" height="20" />
          </motion.button>
        )}
      </div>

    </motion.div>
  </Link>
  );
};