"use client";

import { motion } from "framer-motion";

export interface AnimatedHeadingProps {
  /** The text string to be animated word-by-word */
  text: string;
  /** Tailwind classes for typography styling (font family, size, color) */
  className?: string;
  /** The delay between each word's animation starting (default: 0.05s) */
  staggerDelay?: number;
  /** The duration of the individual word rise (default: 0.8s) */
  duration?: number;
  /** Manual animation trigger state */
  isTriggered?: boolean;
  /** The HTML tag to render (default: "h1") */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div";
}

export const AnimatedHeading = ({
  text,
  className = "",
  staggerDelay = 0.06,
  duration = 0.8,
  isTriggered,
  as = "h1",
}: AnimatedHeadingProps) => {
  // Split the text into an array of words
  const words = text.split(" ");

  // The parent container manages the intersection observer and stagger timing
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  // The child controls the physical rise and blur removal
  const wordVariants = {
    hidden: {
      y: "110%", // Pushed completely below the mask
      opacity: 0,
      filter: "blur(8px)", 
    },
    visible: {
      y: "0%",
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: duration,
        // Premium editorial easing: rapid initial movement, slow and buttery settle
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number], 
      },
    },
  };

  const MotionTag = (motion as any)[as];

  return (
    <MotionTag
      variants={containerVariants}
      initial="hidden"
      animate={isTriggered !== undefined ? (isTriggered ? "visible" : "hidden") : undefined}
      whileInView={isTriggered === undefined ? "visible" : undefined}
      viewport={{ once: true, amount: 0.1 }}
      className={`flex flex-wrap ${className}`}
    >
      {words.map((word, index) => (
        <span
          key={index}
          // The 'em' based right margin perfectly scales the space between words based on font-size
          className="inline-block mr-[0.25em] last:mr-0"
        >
          {/* THE INVISIBLE FLOOR MASK
            pb-[0.15em] is mathematically critical here. It prevents descenders (g, y, p, q) 
            from being chopped off by the overflow-hidden mask.
          */}
          <span className="inline-block overflow-hidden pb-[0.15em]">
            <motion.span 
              variants={wordVariants} 
              className="inline-block origin-bottom"
            >
              {word}
            </motion.span>
          </span>
        </span>
      ))}
    </MotionTag>
  );
};