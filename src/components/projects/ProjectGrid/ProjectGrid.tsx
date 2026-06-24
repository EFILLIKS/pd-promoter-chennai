"use client";

import React, { useState } from "react";
import { ProjectCard } from "@/components/ui/ProjectCard";

import { useData } from "@/context/DataContext";

export const ProjectGrid: React.FC = () => {
  const { projects } = useData();
  const [filter, setFilter] = useState("All");
  
  const categories = ["All", "Available", "Delivered"];

  const filteredProjects = filter === "All" 
    ? projects
    : projects.filter(p => p.status === filter);

  return (
    <div className="w-full flex flex-col gap-12">
      {/* Category filters */}
      <div className="flex items-center justify-center flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-[24px] py-[12px] rounded-full text-[14px] font-sans font-medium border transition-all duration-300 cursor-pointer ${
              filter === category
                ? "bg-[#1A1F2A] border-[#1A1F2A] text-white shadow-md"
                : "bg-white border-[#E2E8F0] text-[#64748B] hover:text-[#1A1F2A] hover:bg-[#F8FAFC] hover:border-[#CBD5E1]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid of ProjectCards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] md:gap-[32px] w-full">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            bhk={project.bhk}
            location={project.location}
            status={project.status}
            imageSrc={project.imageSrc}
          />
        ))}
      </div>
    </div>
  );
};
