"use client";

import React, { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import "lenis/dist/lenis.css";

const LenisHashHandler = () => {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash;
      // Delay slightly to allow the page to mount and lay out elements correctly
      const timeoutId = setTimeout(() => {
        const element = document.querySelector(hash) as HTMLElement | null;
        if (element) {
          lenis?.scrollTo(element, {
            duration: 1.2,
            immediate: false,
          });
        }
      }, 350);
      return () => clearTimeout(timeoutId);
    }
  }, [pathname, lenis]);

  return null;
};

export const LenisProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // Disable smooth scrolling on the admin pages to ensure admin forms/grids are unaffected
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Professional smooth scroll ease
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
        infinite: false,
      }}
    >
      <LenisHashHandler />
      {children}
    </ReactLenis>
  );
};
