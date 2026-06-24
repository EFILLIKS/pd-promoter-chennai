"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export interface FadeInBlockProps {
  /** The text or elements to be faded in */
  children: ReactNode;
  /** Tailwind classes for styling the text/container */
  className?: string;
  /** Optional delay if you want to stagger it after a heading (default: 0) */
  delay?: number;
  /** Duration of the fade (default: 0.8s) */
  duration?: number;
  /** Optional external trigger from a parent section layer */
  isTriggered?: boolean | null; 
}

export const FadeInBlock = ({
  children,
  className = "",
  delay = 0,
  duration = 0.8,
  isTriggered = null,
}: FadeInBlockProps) => {
  // Premium editorial easing: rapid start, buttery smooth settle into position
  const variants = {
    hidden: { 
      opacity: 0, 
      y: 32, // Starts 32px (2rem) below its final position
      filter: "blur(4px)" // Slight progressive blur for depth
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number], 
      },
    },
  };

  // ⚡ MODE 1: Controlled by a parent layer (like our EditorialSection)
  if (isTriggered !== null) {
    return (
      <motion.div
        variants={variants}
        initial="hidden"
        animate={isTriggered ? "visible" : "hidden"}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  // ⚡ MODE 2: Independent. Triggers itself when 20% of it enters the viewport.
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};