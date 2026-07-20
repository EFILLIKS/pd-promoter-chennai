"use client";

import { useEffect } from "react";
import { useData } from "@/context/DataContext";

export const ResetPageLoader = () => {
  const { setIsNavigating } = useData();

  useEffect(() => {
    // Reset the navigation loader asynchronously to prevent state updates before mounting completes
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [setIsNavigating]);

  return null;
};
