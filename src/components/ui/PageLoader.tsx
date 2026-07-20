"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/context/DataContext";
import Image from "next/image";

export const PageLoader: React.FC = () => {
  const { isNavigating } = useData();

  return (
    <AnimatePresence mode="wait">
      {isNavigating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/60 backdrop-blur-xl pointer-events-auto"
        >
          {/* Subtle radiating glow */}
          <div className="absolute w-[300px] h-[300px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

          {/* Container */}
          <div className="flex flex-col items-center gap-6 z-10">
            {/* Logo container with rotation and scaling */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                y: [0, -8, 0]
              }}
              transition={{
                scale: { duration: 0.5, ease: "easeOut" },
                opacity: { duration: 0.5 },
                y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
              }}
              className="relative w-24 h-24 flex items-center justify-center bg-white/5 rounded-full p-4 border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.05)]"
            >
              <Image
                src="/assets/Logoblue.png"
                alt="PD Construction Logo"
                width={64}
                height={64}
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Premium, clean text spinner */}
            <div className="flex flex-col items-center gap-2">
              <span className="font-serif text-sm tracking-[0.25em] text-white uppercase text-center font-light leading-none">
                PD Construction
              </span>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] uppercase tracking-[0.3em] font-sans text-sky-400 font-semibold animate-pulse">
                  Loading Masterpiece
                </span>
                <span className="flex gap-1">
                  <span className="w-1 h-1 rounded-full bg-sky-400 animate-bounce delay-100" />
                  <span className="w-1 h-1 rounded-full bg-sky-400 animate-bounce delay-200" />
                  <span className="w-1 h-1 rounded-full bg-sky-400 animate-bounce delay-300" />
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
