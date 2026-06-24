"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

export type RevealDirection = "up" | "down" | "left" | "right";

export interface MediaRevealProps {
  /** The source URL of the image or video */
  src: string;
  /** Accessibility text */
  alt?: string;
  /** The direction the mask opens towards */
  direction?: RevealDirection;
  /** Tailwind classes for aspect ratio, width, height, and positioning */
  className?: string;
  /** Optional delay for staggering multiple images */
  delay?: number;
  /** Extended duration for a slow, premium settle (default: 1.2s) */
  duration?: number;
  /** Optional trigger from a parent scroll layer (syncs with headings) */
  isTriggered?: boolean | null;
  /** Set to true if passing a video URL instead of an image */
  isVideo?: boolean;
  /** Optional priority loading for LCP images */
  priority?: boolean;
}

export const MediaReveal = ({
  src,
  alt = "Media content",
  direction = "up",
  className = "",
  delay = 0,
  duration = 1.2,
  isTriggered = null,
  isVideo = false,
  priority = false,
}: MediaRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Fallback to self-triggering if no parent layer trigger is provided
  const isInView = useInView(containerRef, { 
    once: true, 
    margin: "-15% 0px -15% 0px" 
  });
  
  const activeTrigger = isTriggered !== null ? isTriggered : isInView;

  // Premium easing curve: Fast unmask, incredibly slow and buttery settle
  const premiumEase = [0.16, 1, 0.3, 1] as [number, number, number, number];

  // Mathematical clipPath boundaries for absolute non-warping reveals
  const maskVariants = {
    hidden: {
      clipPath: 
        direction === "up" ? "inset(100% 0% 0% 0%)" :
        direction === "down" ? "inset(0% 0% 100% 0%)" :
        direction === "left" ? "inset(0% 0% 0% 100%)" :
        "inset(0% 100% 0% 0%)", // right
    },
    visible: {
      clipPath: "inset(0% 0% 0% 0%)",
      transition: { duration, delay, ease: premiumEase },
    },
  };

  // The inner scale gives it that heavy, physical "unveiling" feel
  const imageVariants = {
    hidden: { 
      scale: 1.15,
      filter: "blur(4px)",
    },
    visible: { 
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: duration + 0.2, delay, ease: premiumEase },
    },
  };

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <motion.div
        variants={maskVariants}
        initial="hidden"
        animate={activeTrigger ? "visible" : "hidden"}
        className="w-full h-full origin-center"
      >
        <motion.div
          variants={imageVariants}
          className="w-full h-full"
        >
          {isVideo ? (
            <video
              src={src}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={priority}
              loading={priority ? undefined : "lazy"}
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};