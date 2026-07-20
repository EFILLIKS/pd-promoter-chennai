"use client";

import React from "react";
import dynamicImport from "next/dynamic";

const ProjectMap = dynamicImport(
  () => import("@/components/ui/ProjectMap").then((mod) => mod.ProjectMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-slate-100 animate-pulse rounded-[24px]" /> }
);

interface ProjectMapProps {
  address: string;
  latitude?: string | number;
  longitude?: string | number;
}

export const DynamicProjectMap: React.FC<ProjectMapProps> = (props) => {
  return <ProjectMap {...props} />;
};
