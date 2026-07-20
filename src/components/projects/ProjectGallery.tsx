"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { getOptimizedCloudinaryUrl } from "@/utils/cloudinary";
import { useData } from "@/context/DataContext";

interface GalleryItem {
  imageUrl: string;
  publicId: string;
}

interface ProjectGalleryProps {
  mainImage: string;
  gallery: GalleryItem[] | null | undefined;
  projectTitle: string;
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({
  mainImage,
  gallery,
  projectTitle,
}) => {
  const { projects } = useData();

  // Find project in client-side context for live-updated projectGallery (resolves offline server fetch constraints)
  const matchedProject = projects.find(
    (p) => p.title.toLowerCase().trim() === projectTitle.toLowerCase().trim()
  );
  const activeGallery = matchedProject ? matchedProject.projectGallery || [] : gallery || [];

  // Combine main image + gallery items
  const allImages = [
    { imageUrl: mainImage, publicId: "main" },
    ...activeGallery,
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Swipe gesture detection refs
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Handle active change
  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setLightboxOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, activeIndex]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const difference = touchStartX.current - touchEndX.current;
    const swipeThreshold = 50; // Minimum swipe distance in px

    if (difference > swipeThreshold) {
      // Swiped left -> Next Image
      handleNext();
    } else if (difference < -swipeThreshold) {
      // Swiped right -> Previous Image
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Mouse Swipe Handlers for Desktop fallback
  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!touchStartX.current) return;
    const difference = touchStartX.current - e.clientX;
    const swipeThreshold = 50;

    if (difference > swipeThreshold) {
      handleNext();
    } else if (difference < -swipeThreshold) {
      handlePrev();
    }

    touchStartX.current = null;
  };

  const activeImage = allImages[activeIndex];

  return (
    <div className="w-full flex flex-col gap-6 mb-12">
      {/* 1. Feature Display Viewport */}
      <div 
        className="w-full aspect-[16/9] rounded-[24px] overflow-hidden bg-neutral-100 shadow-sm relative group cursor-zoom-in"
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={getOptimizedCloudinaryUrl(activeImage.imageUrl, 1200)}
          alt={`${projectTitle} - View ${activeIndex + 1}`}
          fill
          priority={activeIndex === 0}
          className="object-cover transition-transform duration-700 group-hover:scale-102"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
        
        {/* Subtle overlay hover hint */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <div className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 shadow-lg">
            <Icon icon="lucide:maximize-2" width="14" height="14" />
            Fullscreen Gallery
          </div>
        </div>

        {/* Counter */}
        <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-semibold tracking-wider font-sans">
          {activeIndex + 1} / {allImages.length}
        </div>
      </div>

      {/* 2. Responsive Thumbnail Grid */}
      {allImages.length > 1 ? (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
          {allImages.map((img, index) => (
            <button
              key={img.publicId || index}
              onClick={() => setActiveIndex(index)}
              className={`aspect-square rounded-xl overflow-hidden relative bg-neutral-100 transition-all duration-300 ${
                index === activeIndex
                  ? "ring-2 ring-[#0B1117] ring-offset-2 scale-[0.98]"
                  : "opacity-60 hover:opacity-100 hover:scale-[1.02]"
              }`}
            >
              <Image
                src={getOptimizedCloudinaryUrl(img.imageUrl, 150)}
                alt={`${projectTitle} Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="150px"
              />
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-xs font-sans uppercase tracking-widest text-[#64748B] border border-dashed border-[#E2E8F0] rounded-[20px] bg-[#F8FAFC] select-none">
          No Gallery Images Available
        </div>
      )}

      {/* 3. Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-xl select-none"
            onClick={(e) => {
              if (e.target === e.currentTarget) setLightboxOpen(false);
            }}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />

            {/* Header / Info bar */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
              <div className="text-white font-sans text-sm font-medium tracking-wide">
                <span className="text-gray-400 mr-2">GALLERY /</span>
                <span className="uppercase text-sky-400">{projectTitle}</span>
              </div>
              
              <div className="flex items-center gap-4 pointer-events-auto">
                <span className="text-gray-400 text-xs font-semibold font-sans bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                  {activeIndex + 1} of {allImages.length}
                </span>
                <button
                  onClick={() => setLightboxOpen(false)}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105 border border-white/10"
                  title="Close (Esc)"
                >
                  <Icon icon="lucide:x" width="20" height="20" />
                </button>
              </div>
            </div>

            {/* Main Image Slider View */}
            <div 
              className="relative w-full max-w-[90vw] md:max-w-[80vw] h-[75vh] flex items-center justify-center z-10 touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
            >
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={getOptimizedCloudinaryUrl(activeImage.imageUrl, 1600)}
                    alt={`${projectTitle} - Large View`}
                    fill
                    className="object-contain pointer-events-none"
                    sizes="80vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            {allImages.length > 1 && (
              <>
                {/* Left Arrow */}
                <button
                  onClick={handlePrev}
                  className="absolute left-6 w-14 h-14 bg-white/5 hover:bg-white/10 active:scale-95 text-white rounded-full flex items-center justify-center transition-all cursor-pointer border border-white/10 hover:border-white/25 shadow-[0_4px_30px_rgba(0,0,0,0.5)] z-20"
                  title="Previous"
                >
                  <Icon icon="lucide:chevron-left" width="28" height="28" />
                </button>
                
                {/* Right Arrow */}
                <button
                  onClick={handleNext}
                  className="absolute right-6 w-14 h-14 bg-white/5 hover:bg-white/10 active:scale-95 text-white rounded-full flex items-center justify-center transition-all cursor-pointer border border-white/10 hover:border-white/25 shadow-[0_4px_30px_rgba(0,0,0,0.5)] z-20"
                  title="Next"
                >
                  <Icon icon="lucide:chevron-right" width="28" height="28" />
                </button>
              </>
            )}

            {/* Bottom Keyboard Hint (desktop only) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block text-gray-500 text-[11px] font-sans tracking-widest uppercase bg-black/40 border border-white/5 px-4 py-1.5 rounded-full">
              Use ← / → keys to navigate • Esc to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
