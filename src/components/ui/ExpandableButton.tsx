"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export interface ExpandableButtonProps {
  label?: string;
  children?: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const strictTransition = {
  duration: 0.4,
  ease: "easeInOut" as const,
};

export const ExpandableButton = ({
  label,
  children,
  icon,
  onClick,
  className = "",
  variant = "primary",
  type = "button",
  disabled = false,
}: ExpandableButtonProps) => {
  const displayText = children || label;
  const isSecondary = variant === "secondary";

  return (
    <motion.button
      type={type}
      disabled={disabled}
      initial="idle"
      whileHover={disabled ? "idle" : "hover"}
      whileTap={disabled ? "idle" : "tap"}
      onClick={onClick}
      variants={{
        tap: { scale: 0.97 },
      }}
      className={`
        relative flex items-center h-16 min-w-[220px] p-2 
        rounded-[20px] overflow-hidden 
        border border-white/[0.04] shadow-xl
        transition-opacity duration-300
        ${isSecondary ? "bg-white/10 text-white" : "bg-[#0B1117] text-[#C6CDDB]"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      {/* ⚡ THE FIX: INNER TRACK */}
      <div className="relative w-full h-full flex items-center">
        
        {/* 1. Expanding Icon Container */}
        {icon && (
          <motion.div
            variants={{
              idle: { width: "3rem" }, // 48px base width
              hover: { width: "100%" }, // Perfectly stops at the padding boundary
            }}
            transition={strictTransition}
            // Anchored to the left of the inner track
            className="absolute left-0 top-0 bottom-0 bg-[#C6CDDB] rounded-[12px] flex items-center justify-center z-10 overflow-hidden"
          >
            {/* Icon stays perfectly centered via flexbox, no extra scaling/rotation */}
            <motion.div className="text-[#0B1117] flex items-center justify-center w-full h-full">
              {icon}
            </motion.div>
          </motion.div>
        )}

        {/* 2. Text Container */}
        <motion.div
          variants={icon ? {
            idle: { 
              opacity: 1, 
              x: 0,
              filter: "blur(0px)" 
            },
            hover: { 
              opacity: 0, 
              x: 15, 
              filter: "blur(4px)" 
            },
          } : undefined}
          transition={strictTransition}
          className={`
            font-medium text-[1.05rem] tracking-wide whitespace-nowrap relative z-0
            ${icon ? "ml-[4rem]" : "w-full text-center"}
          `}
        >
          {displayText}
        </motion.div>

      </div>
    </motion.button>
  );
};